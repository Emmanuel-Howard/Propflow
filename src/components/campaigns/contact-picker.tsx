'use client'

import { useState, useEffect, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Search, Loader2, X, Users } from 'lucide-react'
import { useDebounce } from '@/hooks/use-debounce'

interface Contact {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  display_name: string
}

interface ContactPickerProps {
  clientId: string
  selectedIds: string[]
  onChange: (ids: string[]) => void
}

export function ContactPicker({ clientId, selectedIds, onChange }: ContactPickerProps) {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const debouncedSearch = useDebounce(searchQuery, 300)

  // Fetch contacts when search changes
  useEffect(() => {
    if (clientId) {
      fetchContacts()
    }
  }, [clientId, debouncedSearch])

  // Load initially selected contacts
  useEffect(() => {
    if (selectedIds.length > 0 && selectedContacts.length === 0) {
      loadSelectedContacts()
    }
  }, [selectedIds])

  async function fetchContacts() {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        client_id: clientId,
        limit: '20',
      })
      if (debouncedSearch) {
        params.set('q', debouncedSearch)
      }
      if (selectedIds.length > 0) {
        params.set('exclude', selectedIds.join(','))
      }

      const response = await fetch(`/api/contacts/search?${params}`)
      if (response.ok) {
        const data = await response.json()
        setContacts(data)
      }
    } catch (error) {
      console.error('Error fetching contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  async function loadSelectedContacts() {
    try {
      const response = await fetch(
        `/api/contacts?client_id=${clientId}&limit=100`
      )
      if (response.ok) {
        const data = await response.json()
        const selected = (data.contacts || [])
          .filter((c: { id: string }) => selectedIds.includes(c.id))
          .map((c: { id: string; email: string; first_name: string | null; last_name: string | null }) => ({
            id: c.id,
            email: c.email,
            first_name: c.first_name,
            last_name: c.last_name,
            display_name:
              c.first_name && c.last_name
                ? `${c.first_name} ${c.last_name}`
                : c.first_name || c.last_name || c.email,
          }))
        setSelectedContacts(selected)
      }
    } catch (error) {
      console.error('Error loading selected contacts:', error)
    }
  }

  function handleToggleContact(contact: Contact) {
    const isSelected = selectedIds.includes(contact.id)
    if (isSelected) {
      onChange(selectedIds.filter((id) => id !== contact.id))
      setSelectedContacts(selectedContacts.filter((c) => c.id !== contact.id))
    } else {
      onChange([...selectedIds, contact.id])
      setSelectedContacts([...selectedContacts, contact])
    }
  }

  function handleRemoveContact(contactId: string) {
    onChange(selectedIds.filter((id) => id !== contactId))
    setSelectedContacts(selectedContacts.filter((c) => c.id !== contactId))
  }

  return (
    <div className="space-y-3">
      {/* Selected contacts badges */}
      {selectedContacts.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-[#FAFAFA] rounded border border-[#E0E0E0]">
          {selectedContacts.map((contact) => (
            <Badge
              key={contact.id}
              variant="secondary"
              className="bg-white border border-[#E0E0E0] text-black/70 pr-1"
            >
              {contact.display_name}
              <button
                type="button"
                onClick={() => handleRemoveContact(contact.id)}
                className="ml-1 p-0.5 hover:bg-black/10 rounded"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
        <Input
          placeholder="Search contacts by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-white border-[#E0E0E0] text-sm"
        />
      </div>

      {/* Contact list */}
      <div className="border border-[#E0E0E0] rounded max-h-48 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-black/40" />
          </div>
        ) : contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-black/40">
            <Users className="h-8 w-8 mb-2 opacity-50" />
            <p className="text-sm">
              {searchQuery ? 'No contacts found' : 'All contacts already selected'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#E0E0E0]">
            {contacts.map((contact) => (
              <label
                key={contact.id}
                className="flex items-center gap-3 px-3 py-2 hover:bg-black/[0.02] cursor-pointer"
              >
                <Checkbox
                  checked={selectedIds.includes(contact.id)}
                  onCheckedChange={() => handleToggleContact(contact)}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-black truncate">
                    {contact.display_name}
                  </p>
                  <p className="text-xs text-black/50 truncate">{contact.email}</p>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      <p className="text-xs text-black/50">
        {selectedIds.length} contact{selectedIds.length === 1 ? '' : 's'} selected
      </p>
    </div>
  )
}
