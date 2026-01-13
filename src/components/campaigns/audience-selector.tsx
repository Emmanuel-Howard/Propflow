'use client'

import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ContactPicker } from './contact-picker'
import { Users, List, UserCheck } from 'lucide-react'
import type { AudienceType } from '@/types/database'

interface AudienceValue {
  type: AudienceType
  listId?: string
  contactIds: string[]
}

interface AudienceSelectorProps {
  clientId: string
  value: AudienceValue
  onChange: (value: AudienceValue) => void
}

export function AudienceSelector({ clientId, value, onChange }: AudienceSelectorProps) {
  function handleTypeChange(type: AudienceType) {
    onChange({
      ...value,
      type,
      // Reset contactIds when switching away from custom
      contactIds: type === 'custom' ? value.contactIds : [],
    })
  }

  function handleContactsChange(contactIds: string[]) {
    onChange({
      ...value,
      contactIds,
    })
  }

  return (
    <div className="space-y-4">
      <RadioGroup
        value={value.type}
        onValueChange={(val) => handleTypeChange(val as AudienceType)}
        className="space-y-3"
      >
        {/* Everyone option */}
        <div className="flex items-start space-x-3">
          <RadioGroupItem value="all" id="audience-all" className="mt-0.5" />
          <Label
            htmlFor="audience-all"
            className="flex-1 cursor-pointer font-normal"
          >
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-black/60" />
              <span className="font-medium text-black">Everyone</span>
            </div>
            <p className="text-xs text-black/50 mt-1">
              Send to all active contacts for this client
            </p>
          </Label>
        </div>

        {/* Custom List option (coming soon) */}
        <div className="flex items-start space-x-3 opacity-50">
          <RadioGroupItem value="list" id="audience-list" disabled className="mt-0.5" />
          <Label
            htmlFor="audience-list"
            className="flex-1 cursor-not-allowed font-normal"
          >
            <div className="flex items-center gap-2">
              <List className="h-4 w-4 text-black/60" />
              <span className="font-medium text-black">Custom List</span>
              <span className="text-xs bg-black/10 text-black/50 px-2 py-0.5 rounded">
                Coming soon
              </span>
            </div>
            <p className="text-xs text-black/50 mt-1">
              Send to a saved contact segment
            </p>
          </Label>
        </div>

        {/* Specific Contacts option */}
        <div className="flex items-start space-x-3">
          <RadioGroupItem value="custom" id="audience-custom" className="mt-0.5" />
          <Label
            htmlFor="audience-custom"
            className="flex-1 cursor-pointer font-normal"
          >
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-black/60" />
              <span className="font-medium text-black">Specific Contacts</span>
            </div>
            <p className="text-xs text-black/50 mt-1">
              Choose individual contacts to send to
            </p>
          </Label>
        </div>
      </RadioGroup>

      {/* Contact picker when custom is selected */}
      {value.type === 'custom' && clientId && (
        <div className="ml-7 pt-2">
          <ContactPicker
            clientId={clientId}
            selectedIds={value.contactIds}
            onChange={handleContactsChange}
          />
        </div>
      )}

      {/* Summary for "Everyone" option */}
      {value.type === 'all' && (
        <p className="text-xs text-black/50 ml-7">
          Campaign will be sent to all active contacts
        </p>
      )}
    </div>
  )
}
