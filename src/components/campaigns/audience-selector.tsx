'use client'

import { useState, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ContactPicker } from './contact-picker'
import { ContactListPicker } from '@/components/contact-lists/contact-list-picker'
import { Users, List, UserCheck } from 'lucide-react'
import type { AudienceType } from '@/types/database'

interface AudienceValue {
  type: AudienceType
  listId?: string
  contactIds: string[]
  listContactCount?: number
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
      // Reset listId when switching away from list
      listId: type === 'list' ? value.listId : undefined,
      listContactCount: type === 'list' ? value.listContactCount : undefined,
    })
  }

  function handleContactsChange(contactIds: string[]) {
    onChange({
      ...value,
      contactIds,
    })
  }

  function handleListChange(listId: string, contactCount: number) {
    onChange({
      ...value,
      listId,
      listContactCount: contactCount,
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

        {/* Custom List option */}
        <div className="flex items-start space-x-3">
          <RadioGroupItem value="list" id="audience-list" className="mt-0.5" />
          <Label
            htmlFor="audience-list"
            className="flex-1 cursor-pointer font-normal"
          >
            <div className="flex items-center gap-2">
              <List className="h-4 w-4 text-black/60" />
              <span className="font-medium text-black">Custom List</span>
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

      {/* List picker when list is selected */}
      {value.type === 'list' && clientId && (
        <div className="ml-7 pt-2">
          <ContactListPicker
            clientId={clientId}
            value={value.listId}
            onChange={handleListChange}
          />
          {value.listId && value.listContactCount !== undefined && (
            <p className="text-xs text-black/50 mt-2">
              Campaign will be sent to {value.listContactCount.toLocaleString()} contact{value.listContactCount !== 1 ? 's' : ''} in this list
            </p>
          )}
        </div>
      )}

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
