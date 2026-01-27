import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database, FilterCriteria, FilterCondition } from '@/types/database'

type ContactsQuery = ReturnType<SupabaseClient<Database>['from']>

/**
 * Builds a single filter condition string for Supabase .or() or .and()
 */
function buildConditionString(condition: FilterCondition): string {
  const { field, operator, value } = condition

  switch (operator) {
    case 'equals':
      if (field === 'tags') {
        // For tags array, check if it contains the value
        return `tags.cs.{${value}}`
      }
      return `${field}.eq.${value}`

    case 'not_equals':
      if (field === 'tags') {
        // For tags, check if it does NOT contain the value
        return `tags.not.cs.{${value}}`
      }
      return `${field}.neq.${value}`

    case 'contains':
      if (field === 'tags') {
        // For tags array, use contains
        return `tags.cs.{${value}}`
      }
      // For string fields, use ilike for partial match
      return `${field}.ilike.%${value}%`

    case 'in':
      // Value should be an array
      const values = Array.isArray(value) ? value : [value]
      if (field === 'tags') {
        // For tags, check if tags overlap with the provided values
        return `tags.ov.{${values.join(',')}}`
      }
      return `${field}.in.(${values.join(',')})`

    case 'before':
      // For date fields
      return `${field}.lt.${value}`

    case 'after':
      // For date fields
      return `${field}.gt.${value}`

    default:
      return `${field}.eq.${value}`
  }
}

/**
 * Applies filter criteria to a Supabase query
 * Returns the modified query
 */
export function applyFilterCriteria<T extends { or: (filter: string) => T; filter: (column: string, operator: string, value: unknown) => T }>(
  query: T,
  criteria: FilterCriteria
): T {
  if (!criteria.conditions || criteria.conditions.length === 0) {
    return query
  }

  // Build individual condition strings
  const conditionStrings = criteria.conditions.map(buildConditionString)

  if (criteria.operator === 'OR') {
    // Join all conditions with OR
    return query.or(conditionStrings.join(','))
  } else {
    // For AND, we need to apply each condition separately
    // Supabase chains filters with AND by default
    let result = query
    for (const condition of criteria.conditions) {
      result = applyIndividualCondition(result, condition)
    }
    return result
  }
}

/**
 * Apply a single condition directly to the query
 */
function applyIndividualCondition<T extends { filter: (column: string, operator: string, value: unknown) => T }>(
  query: T,
  condition: FilterCondition
): T {
  const { field, operator, value } = condition

  switch (operator) {
    case 'equals':
      if (field === 'tags') {
        return query.filter('tags', 'cs', `{${value}}`)
      }
      return query.filter(field, 'eq', value)

    case 'not_equals':
      if (field === 'tags') {
        return query.filter('tags', 'not.cs', `{${value}}`)
      }
      return query.filter(field, 'neq', value)

    case 'contains':
      if (field === 'tags') {
        return query.filter('tags', 'cs', `{${value}}`)
      }
      return query.filter(field, 'ilike', `%${value}%`)

    case 'in':
      const values = Array.isArray(value) ? value : [value]
      if (field === 'tags') {
        return query.filter('tags', 'ov', `{${values.join(',')}}`)
      }
      return query.filter(field, 'in', `(${values.join(',')})`)

    case 'before':
      return query.filter(field, 'lt', value)

    case 'after':
      return query.filter(field, 'gt', value)

    default:
      return query.filter(field, 'eq', value)
  }
}

/**
 * Validate filter criteria structure
 */
export function validateFilterCriteria(criteria: unknown): criteria is FilterCriteria {
  if (!criteria || typeof criteria !== 'object') {
    return false
  }

  const c = criteria as Record<string, unknown>

  if (c.operator !== 'AND' && c.operator !== 'OR') {
    return false
  }

  if (!Array.isArray(c.conditions)) {
    return false
  }

  const validFields = ['status', 'tags', 'source', 'created_at']
  const validOperators = ['equals', 'not_equals', 'contains', 'in', 'before', 'after']

  for (const condition of c.conditions) {
    if (!condition || typeof condition !== 'object') {
      return false
    }
    const cond = condition as Record<string, unknown>
    if (!cond.id || typeof cond.id !== 'string') {
      return false
    }
    if (!validFields.includes(cond.field as string)) {
      return false
    }
    if (!validOperators.includes(cond.operator as string)) {
      return false
    }
    if (cond.value === undefined || cond.value === null) {
      return false
    }
  }

  return true
}

/**
 * Get a human-readable description of filter criteria
 */
export function describeFilterCriteria(criteria: FilterCriteria): string {
  if (!criteria.conditions || criteria.conditions.length === 0) {
    return 'No filters'
  }

  const descriptions = criteria.conditions.map((condition) => {
    const fieldLabel = getFieldLabel(condition.field)
    const operatorLabel = getOperatorLabel(condition.operator)
    const valueLabel = Array.isArray(condition.value)
      ? condition.value.join(', ')
      : condition.value

    return `${fieldLabel} ${operatorLabel} "${valueLabel}"`
  })

  return descriptions.join(` ${criteria.operator} `)
}

function getFieldLabel(field: string): string {
  const labels: Record<string, string> = {
    status: 'Status',
    tags: 'Tags',
    source: 'Source',
    created_at: 'Created date',
  }
  return labels[field] || field
}

function getOperatorLabel(operator: string): string {
  const labels: Record<string, string> = {
    equals: 'is',
    not_equals: 'is not',
    contains: 'contains',
    in: 'is one of',
    before: 'is before',
    after: 'is after',
  }
  return labels[operator] || operator
}
