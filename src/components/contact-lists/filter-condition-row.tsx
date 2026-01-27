'use client'

import { Trash2, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { FilterCondition, FilterField, FilterOperator } from '@/types/database'

interface FilterConditionRowProps {
  condition: FilterCondition
  onChange: (condition: FilterCondition) => void
  onRemove: () => void
  isOnly: boolean
}

const FIELD_OPTIONS: { value: FilterField; label: string }[] = [
  { value: 'status', label: 'Status' },
  { value: 'tags', label: 'Tags' },
  { value: 'source', label: 'Source' },
  { value: 'created_at', label: 'Created Date' },
]

const OPERATOR_OPTIONS: Record<FilterField, { value: FilterOperator; label: string }[]> = {
  status: [
    { value: 'equals', label: 'is' },
    { value: 'not_equals', label: 'is not' },
  ],
  tags: [
    { value: 'contains', label: 'contains' },
    { value: 'in', label: 'is any of' },
  ],
  source: [
    { value: 'equals', label: 'is' },
    { value: 'not_equals', label: 'is not' },
    { value: 'contains', label: 'contains' },
  ],
  created_at: [
    { value: 'before', label: 'is before' },
    { value: 'after', label: 'is after' },
  ],
}

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'unsubscribed', label: 'Unsubscribed' },
  { value: 'bounced', label: 'Bounced' },
  { value: 'complained', label: 'Complained' },
]

const SOURCE_OPTIONS = [
  { value: 'manual', label: 'Manual' },
  { value: 'import', label: 'Import' },
  { value: 'api', label: 'API' },
  { value: 'form', label: 'Form' },
]

export function FilterConditionRow({
  condition,
  onChange,
  onRemove,
  isOnly,
}: FilterConditionRowProps) {
  const operators = OPERATOR_OPTIONS[condition.field] || OPERATOR_OPTIONS.status

  function handleFieldChange(field: FilterField) {
    const newOperators = OPERATOR_OPTIONS[field]
    onChange({
      ...condition,
      field,
      operator: newOperators[0].value,
      value: '',
    })
  }

  function handleOperatorChange(operator: FilterOperator) {
    onChange({
      ...condition,
      operator,
    })
  }

  function handleValueChange(value: string | string[]) {
    onChange({
      ...condition,
      value,
    })
  }

  function renderValueInput() {
    const { field, operator } = condition

    // Status field - dropdown
    if (field === 'status') {
      return (
        <Select
          value={condition.value as string}
          onValueChange={handleValueChange}
        >
          <SelectTrigger className="flex-1 min-w-[120px] bg-white border-[#E0E0E0]">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    }

    // Source field - dropdown for equals/not_equals, text input for contains
    if (field === 'source') {
      if (operator === 'contains') {
        return (
          <Input
            value={condition.value as string}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder="Enter source"
            className="flex-1 min-w-[120px] bg-white border-[#E0E0E0]"
          />
        )
      }
      return (
        <Select
          value={condition.value as string}
          onValueChange={handleValueChange}
        >
          <SelectTrigger className="flex-1 min-w-[120px] bg-white border-[#E0E0E0]">
            <SelectValue placeholder="Select source" />
          </SelectTrigger>
          <SelectContent>
            {SOURCE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    }

    // Tags field - text input
    if (field === 'tags') {
      return (
        <Input
          value={condition.value as string}
          onChange={(e) => handleValueChange(e.target.value)}
          placeholder={operator === 'in' ? 'tag1, tag2, tag3' : 'Enter tag'}
          className="flex-1 min-w-[120px] bg-white border-[#E0E0E0]"
        />
      )
    }

    // Date field - date input
    if (field === 'created_at') {
      return (
        <div className="relative flex-1 min-w-[140px]">
          <Input
            type="date"
            value={condition.value as string}
            onChange={(e) => handleValueChange(e.target.value)}
            className="bg-white border-[#E0E0E0]"
          />
        </div>
      )
    }

    // Default text input
    return (
      <Input
        value={condition.value as string}
        onChange={(e) => handleValueChange(e.target.value)}
        placeholder="Enter value"
        className="flex-1 min-w-[120px] bg-white border-[#E0E0E0]"
      />
    )
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Field selector */}
      <Select
        value={condition.field}
        onValueChange={(val) => handleFieldChange(val as FilterField)}
      >
        <SelectTrigger className="w-[130px] bg-white border-[#E0E0E0]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {FIELD_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Operator selector */}
      <Select
        value={condition.operator}
        onValueChange={(val) => handleOperatorChange(val as FilterOperator)}
      >
        <SelectTrigger className="w-[110px] bg-white border-[#E0E0E0]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {operators.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Value input */}
      {renderValueInput()}

      {/* Remove button */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onRemove}
        disabled={isOnly}
        className="h-9 w-9 p-0 text-black/40 hover:text-red-600 hover:bg-red-50 disabled:opacity-30"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
