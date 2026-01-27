'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { FilterConditionRow } from './filter-condition-row'
import type { FilterCriteria, FilterCondition } from '@/types/database'

interface FilterBuilderProps {
  value: FilterCriteria
  onChange: (value: FilterCriteria) => void
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

function createDefaultCondition(): FilterCondition {
  return {
    id: generateId(),
    field: 'status',
    operator: 'equals',
    value: 'active',
  }
}

export function FilterBuilder({ value, onChange }: FilterBuilderProps) {
  function handleOperatorChange(operator: 'AND' | 'OR') {
    onChange({
      ...value,
      operator,
    })
  }

  function handleConditionChange(index: number, condition: FilterCondition) {
    const newConditions = [...value.conditions]
    newConditions[index] = condition
    onChange({
      ...value,
      conditions: newConditions,
    })
  }

  function handleRemoveCondition(index: number) {
    if (value.conditions.length <= 1) return
    const newConditions = value.conditions.filter((_, i) => i !== index)
    onChange({
      ...value,
      conditions: newConditions,
    })
  }

  function handleAddCondition() {
    onChange({
      ...value,
      conditions: [...value.conditions, createDefaultCondition()],
    })
  }

  return (
    <div className="space-y-4">
      {/* Operator selection */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-black/70">Match contacts that meet</Label>
        <RadioGroup
          value={value.operator}
          onValueChange={(val) => handleOperatorChange(val as 'AND' | 'OR')}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="AND" id="operator-and" />
            <Label htmlFor="operator-and" className="cursor-pointer font-normal">
              All conditions (AND)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="OR" id="operator-or" />
            <Label htmlFor="operator-or" className="cursor-pointer font-normal">
              Any condition (OR)
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Conditions list */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-black/70">Conditions</Label>
        <div className="space-y-2 p-4 bg-[#FAFAFA] rounded-lg border border-[#E0E0E0]">
          {value.conditions.map((condition, index) => (
            <div key={condition.id}>
              {index > 0 && (
                <div className="flex items-center gap-2 my-2">
                  <div className="flex-1 h-px bg-[#E0E0E0]" />
                  <span className="text-xs font-medium text-black/40 uppercase">
                    {value.operator}
                  </span>
                  <div className="flex-1 h-px bg-[#E0E0E0]" />
                </div>
              )}
              <FilterConditionRow
                condition={condition}
                onChange={(c) => handleConditionChange(index, c)}
                onRemove={() => handleRemoveCondition(index)}
                isOnly={value.conditions.length === 1}
              />
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddCondition}
            className="mt-3 border-dashed border-[#E0E0E0] text-black/60 hover:text-black hover:bg-white"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add condition
          </Button>
        </div>
      </div>
    </div>
  )
}

export { createDefaultCondition, generateId }
