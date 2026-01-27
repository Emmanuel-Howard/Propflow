'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Plus,
  Search,
  Loader2,
  MoreHorizontal,
  Pencil,
  Trash2,
  List,
  Users,
} from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { ContactListFormDialog } from './contact-list-form-dialog'
import { describeFilterCriteria } from '@/lib/filter-utils'
import type { ContactList, FilterCriteria } from '@/types/database'

interface ContactListsTabProps {
  clientId: string
}

interface ContactListWithCount extends ContactList {
  contact_count: number
}

export function ContactListsTab({ clientId }: ContactListsTabProps) {
  const [lists, setLists] = useState<ContactListWithCount[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingList, setEditingList] = useState<ContactList | null>(null)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch lists
  useEffect(() => {
    if (clientId) {
      fetchLists()
    }
  }, [clientId, debouncedSearch])

  async function fetchLists() {
    try {
      setLoading(true)
      const params = new URLSearchParams({ client_id: clientId })
      if (debouncedSearch) params.set('search', debouncedSearch)

      const response = await fetch(`/api/contact-lists?${params}`)
      if (response.ok) {
        const data = await response.json()
        setLists(data.lists || [])
      } else {
        toast.error('Failed to load lists')
      }
    } catch (error) {
      console.error('Error fetching lists:', error)
      toast.error('Failed to load lists')
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteList(id: string, name: string) {
    if (!confirm(`Delete list "${name}"? This cannot be undone.`)) return

    try {
      const response = await fetch(`/api/contact-lists/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('List deleted')
        fetchLists()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to delete list')
      }
    } catch (error) {
      console.error('Error deleting list:', error)
      toast.error('Failed to delete list')
    }
  }

  function openEditDialog(list: ContactList) {
    setEditingList(list)
    setDialogOpen(true)
  }

  function closeDialog() {
    setDialogOpen(false)
    setEditingList(null)
  }

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
          <Input
            placeholder="Search lists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-[#E0E0E0] text-black placeholder:text-black/40 focus:border-[#083E33] focus:ring-[#083E33]/20"
          />
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="bg-white border border-[#E0E0E0] text-black hover:bg-black/5 hover:shadow-sm font-medium transition-smooth"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create List
        </Button>
      </div>

      {/* Lists Table */}
      <div className="border border-[#E0E0E0] rounded overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-black/40" />
          </div>
        ) : lists.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-black/40">
            <List className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-lg font-medium text-black/60">No lists yet</p>
            <p className="text-sm mt-1 mb-4">
              Create your first contact list to segment your audience
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create List
            </Button>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-[#FAFAFA]">
                <th className="px-4 py-3 text-left text-sm font-medium text-black/60">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-black/60">
                  Filters
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-black/60">
                  Contacts
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-black/60">
                  Created
                </th>
                <th className="w-12 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {lists.map((list) => {
                const criteria = list.filter_criteria as unknown as FilterCriteria
                const filterDescription = criteria
                  ? describeFilterCriteria(criteria)
                  : 'No filters'

                return (
                  <tr
                    key={list.id}
                    className="border-t border-[#E0E0E0] hover:bg-black/[0.01] transition-smooth"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-black">{list.name}</p>
                        {list.description && (
                          <p className="text-xs text-black/50 mt-0.5 line-clamp-1">
                            {list.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-black/70 line-clamp-2">
                        {filterDescription}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-black/40" />
                        <span className="text-black font-medium">
                          {list.contact_count.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-black/60">
                      {format(new Date(list.created_at), 'MMM d, yyyy')}
                    </td>
                    <td className="px-4 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 text-black/40 hover:text-black"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(list)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteList(list.id, list.name)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <ContactListFormDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) closeDialog()
          else setDialogOpen(true)
        }}
        clientId={clientId}
        list={editingList}
        onSuccess={fetchLists}
      />
    </div>
  )
}
