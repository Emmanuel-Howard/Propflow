'use client'

import { useState, useEffect } from 'react'
import { Loader2, List, Users, ChevronDown, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import type { ContactList, FilterCriteria } from '@/types/database'

interface ContactListWithCount extends ContactList {
  contact_count: number
}

interface ContactListPickerProps {
  clientId: string
  value?: string
  onChange: (listId: string, contactCount: number) => void
}

export function ContactListPicker({ clientId, value, onChange }: ContactListPickerProps) {
  const [open, setOpen] = useState(false)
  const [lists, setLists] = useState<ContactListWithCount[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedList, setSelectedList] = useState<ContactListWithCount | null>(null)

  useEffect(() => {
    if (clientId) {
      fetchLists()
    }
  }, [clientId])

  // Set selected list from value
  useEffect(() => {
    if (value && lists.length > 0) {
      const list = lists.find((l) => l.id === value)
      if (list) {
        setSelectedList(list)
      }
    }
  }, [value, lists])

  async function fetchLists() {
    try {
      setLoading(true)
      const response = await fetch(`/api/contact-lists?client_id=${clientId}`)
      if (response.ok) {
        const data = await response.json()
        setLists(data.lists || [])
      }
    } catch (error) {
      console.error('Error fetching contact lists:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleSelect(list: ContactListWithCount) {
    setSelectedList(list)
    onChange(list.id, list.contact_count)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-white border-[#E0E0E0] text-left font-normal"
        >
          {selectedList ? (
            <div className="flex items-center gap-2">
              <List className="h-4 w-4 text-black/40" />
              <span className="truncate">{selectedList.name}</span>
              <span className="text-xs text-black/50 ml-auto">
                {selectedList.contact_count.toLocaleString()} contacts
              </span>
            </div>
          ) : (
            <span className="text-black/50">Select a list...</span>
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <div className="max-h-60 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-black/40" />
            </div>
          ) : lists.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-black/40">
              <List className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">No lists available</p>
              <p className="text-xs mt-1">Create a list first in the Contacts page</p>
            </div>
          ) : (
            <div className="py-1">
              {lists.map((list) => (
                <button
                  key={list.id}
                  type="button"
                  onClick={() => handleSelect(list)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 hover:bg-black/5 transition-colors text-left',
                    selectedList?.id === list.id && 'bg-[#083E33]/5'
                  )}
                >
                  <div
                    className={cn(
                      'flex items-center justify-center w-5 h-5 rounded-full border',
                      selectedList?.id === list.id
                        ? 'bg-[#083E33] border-[#083E33]'
                        : 'border-[#E0E0E0]'
                    )}
                  >
                    {selectedList?.id === list.id && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-black truncate">
                      {list.name}
                    </p>
                    {list.description && (
                      <p className="text-xs text-black/50 truncate">
                        {list.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-black/50">
                    <Users className="h-3.5 w-3.5" />
                    {list.contact_count.toLocaleString()}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
