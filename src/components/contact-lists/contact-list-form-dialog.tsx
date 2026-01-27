'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Loader2, Users, Eye } from 'lucide-react'
import { FilterBuilder, createDefaultCondition } from './filter-builder'
import { toast } from 'sonner'
import type { ContactList, FilterCriteria, Contact } from '@/types/database'

interface ContactListFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientId: string
  list?: ContactList | null
  onSuccess: () => void
}

interface PreviewData {
  contacts: Contact[]
  total: number
}

export function ContactListFormDialog({
  open,
  onOpenChange,
  clientId,
  list,
  onSuccess,
}: ContactListFormDialogProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>({
    operator: 'AND',
    conditions: [createDefaultCondition()],
  })
  const [saving, setSaving] = useState(false)
  const [preview, setPreview] = useState<PreviewData | null>(null)
  const [loadingPreview, setLoadingPreview] = useState(false)

  const isEditing = !!list

  // Reset form when dialog opens/closes or list changes
  useEffect(() => {
    if (open) {
      if (list) {
        setName(list.name)
        setDescription(list.description || '')
        const criteria = list.filter_criteria as unknown as FilterCriteria
        if (criteria && criteria.conditions && criteria.conditions.length > 0) {
          setFilterCriteria(criteria)
        } else {
          setFilterCriteria({
            operator: 'AND',
            conditions: [createDefaultCondition()],
          })
        }
      } else {
        setName('')
        setDescription('')
        setFilterCriteria({
          operator: 'AND',
          conditions: [createDefaultCondition()],
        })
      }
      setPreview(null)
    }
  }, [open, list])

  async function handlePreview() {
    setLoadingPreview(true)
    try {
      // Create a temporary list ID for preview or use existing
      if (isEditing && list) {
        // For existing lists, we can preview with the current list ID
        const response = await fetch(`/api/contact-lists/${list.id}/preview?limit=5`)
        if (response.ok) {
          const data = await response.json()
          setPreview(data)
        } else {
          toast.error('Failed to load preview')
        }
      } else {
        // For new lists, we need to create temporarily or use a different approach
        // We'll create the list first, get preview, then optionally delete if not saving
        // For now, let's show estimated count by querying contacts directly
        const response = await fetch('/api/contact-lists', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client_id: clientId,
            name: name || 'Preview List',
            description,
            filter_criteria: filterCriteria,
          }),
        })

        if (response.ok) {
          const tempList = await response.json()
          // Now get preview
          const previewResponse = await fetch(`/api/contact-lists/${tempList.id}/preview?limit=5`)
          if (previewResponse.ok) {
            const data = await previewResponse.json()
            setPreview(data)
          }
          // Delete the temporary list if this is a new list
          if (!isEditing) {
            await fetch(`/api/contact-lists/${tempList.id}`, { method: 'DELETE' })
          }
        } else {
          toast.error('Failed to generate preview')
        }
      }
    } catch (error) {
      console.error('Error generating preview:', error)
      toast.error('Failed to generate preview')
    } finally {
      setLoadingPreview(false)
    }
  }

  async function handleSave() {
    if (!name.trim()) {
      toast.error('Name is required')
      return
    }

    setSaving(true)
    try {
      const url = isEditing ? `/api/contact-lists/${list.id}` : '/api/contact-lists'
      const method = isEditing ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: clientId,
          name,
          description: description || null,
          filter_criteria: filterCriteria,
        }),
      })

      if (response.ok) {
        toast.success(isEditing ? 'List updated' : 'List created')
        onOpenChange(false)
        onSuccess()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to save list')
      }
    } catch (error) {
      console.error('Error saving list:', error)
      toast.error('Failed to save list')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit List' : 'Create New List'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., VIP Customers"
                className="bg-white border-[#E0E0E0]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description for this list"
                rows={2}
                className="bg-white border-[#E0E0E0] resize-none"
              />
            </div>
          </div>

          {/* Filter Builder */}
          <FilterBuilder value={filterCriteria} onChange={setFilterCriteria} />

          {/* Preview Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-black/70">Preview</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePreview}
                disabled={loadingPreview}
                className="border-[#E0E0E0] text-black/70 hover:bg-black/5"
              >
                {loadingPreview ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <Eye className="h-4 w-4 mr-1" />
                )}
                Preview Matches
              </Button>
            </div>

            {preview && (
              <div className="p-4 bg-[#FAFAFA] rounded-lg border border-[#E0E0E0]">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-4 w-4 text-[#083E33]" />
                  <span className="text-sm font-medium text-black">
                    {preview.total.toLocaleString()} matching contact{preview.total !== 1 ? 's' : ''}
                  </span>
                </div>

                {preview.contacts.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs text-black/50 mb-2">Sample matches:</p>
                    {preview.contacts.map((contact) => (
                      <div
                        key={contact.id}
                        className="flex items-center justify-between py-1.5 px-2 bg-white rounded border border-[#E0E0E0]"
                      >
                        <span className="text-sm text-black">{contact.email}</span>
                        <span className="text-xs text-black/50">
                          {contact.first_name || contact.last_name
                            ? `${contact.first_name || ''} ${contact.last_name || ''}`.trim()
                            : ''}
                        </span>
                      </div>
                    ))}
                    {preview.total > preview.contacts.length && (
                      <p className="text-xs text-black/40 mt-2">
                        and {preview.total - preview.contacts.length} more...
                      </p>
                    )}
                  </div>
                )}

                {preview.contacts.length === 0 && (
                  <p className="text-sm text-black/50">
                    No contacts match these criteria yet.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-[#E0E0E0]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !name.trim()}
            className="bg-[#083E33] hover:bg-[#062b24] text-white"
          >
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isEditing ? 'Save Changes' : 'Create List'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
