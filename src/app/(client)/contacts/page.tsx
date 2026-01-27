'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Upload,
  Plus,
  Search,
  Loader2,
  MoreHorizontal,
  Pencil,
  Trash2,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  X,
  Users,
  List,
} from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { ContactListsTab } from '@/components/contact-lists/contact-lists-tab'
import type { Contact } from '@/types/database'

interface ContactsResponse {
  contacts: Contact[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  stats: {
    total: number
    active: number
    unsubscribed: number
    newThisMonth: number
  }
}

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: 'Active', className: 'text-green-600' },
  unsubscribed: { label: 'Unsubscribed', className: 'text-black/40' },
  bounced: { label: 'Bounced', className: 'text-red-600' },
  complained: { label: 'Complained', className: 'text-amber-600' },
}

export default function ContactsPage() {
  const searchParams = useSearchParams()
  const clientId = searchParams.get('client_id')

  const [activeTab, setActiveTab] = useState('contacts')
  const [contacts, setContacts] = useState<Contact[]>([])
  const [stats, setStats] = useState({ total: 0, active: 0, unsubscribed: 0, newThisMonth: 0 })
  const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Dialogs
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
  })
  const [saving, setSaving] = useState(false)

  // Upload state
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<{
    success: boolean
    summary: { totalRows: number; imported: number; duplicates: number; skipped: number }
  } | null>(null)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch contacts
  useEffect(() => {
    if (clientId) {
      fetchContacts()
    }
  }, [clientId, pagination.page, debouncedSearch])

  async function fetchContacts() {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        client_id: clientId!,
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      })
      if (debouncedSearch) params.set('search', debouncedSearch)

      const response = await fetch(`/api/contacts?${params}`)
      if (response.ok) {
        const data: ContactsResponse = await response.json()
        setContacts(data.contacts)
        setStats(data.stats)
        setPagination(data.pagination)
      } else {
        toast.error('Failed to load contacts')
      }
    } catch (error) {
      console.error('Error fetching contacts:', error)
      toast.error('Failed to load contacts')
    } finally {
      setLoading(false)
    }
  }

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedIds.length === contacts.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(contacts.map((c) => c.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  // CRUD handlers
  async function handleSaveContact() {
    if (!clientId) return

    if (!formData.email.trim()) {
      toast.error('Email is required')
      return
    }

    setSaving(true)
    try {
      const url = editingContact
        ? `/api/contacts/${editingContact.id}`
        : '/api/contacts'
      const method = editingContact ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: clientId,
          ...formData,
        }),
      })

      if (response.ok) {
        toast.success(editingContact ? 'Contact updated' : 'Contact added')
        setAddDialogOpen(false)
        setEditingContact(null)
        setFormData({ email: '', first_name: '', last_name: '', phone: '' })
        fetchContacts()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to save contact')
      }
    } catch (error) {
      console.error('Error saving contact:', error)
      toast.error('Failed to save contact')
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteContact(id: string) {
    if (!confirm('Are you sure you want to delete this contact?')) return

    try {
      const response = await fetch(`/api/contacts/${id}`, { method: 'DELETE' })
      if (response.ok) {
        toast.success('Contact deleted')
        fetchContacts()
      } else {
        toast.error('Failed to delete contact')
      }
    } catch (error) {
      console.error('Error deleting contact:', error)
      toast.error('Failed to delete contact')
    }
  }

  async function handleBulkDelete() {
    if (selectedIds.length === 0) return
    if (!confirm(`Delete ${selectedIds.length} contacts?`)) return

    try {
      await Promise.all(
        selectedIds.map((id) =>
          fetch(`/api/contacts/${id}`, { method: 'DELETE' })
        )
      )
      toast.success(`${selectedIds.length} contacts deleted`)
      setSelectedIds([])
      fetchContacts()
    } catch (error) {
      console.error('Error deleting contacts:', error)
      toast.error('Failed to delete contacts')
    }
  }

  // File upload
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setUploadFile(acceptedFiles[0])
      setUploadResult(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    maxFiles: 1,
  })

  async function handleUpload() {
    if (!uploadFile || !clientId) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', uploadFile)
      formData.append('client_id', clientId)

      const response = await fetch('/api/contacts/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setUploadResult({ success: true, summary: data.summary })
        fetchContacts()
      } else {
        toast.error(data.error || 'Failed to upload contacts')
      }
    } catch (error) {
      console.error('Error uploading contacts:', error)
      toast.error('Failed to upload contacts')
    } finally {
      setUploading(false)
    }
  }

  function openEditDialog(contact: Contact) {
    setEditingContact(contact)
    setFormData({
      email: contact.email,
      first_name: contact.first_name || '',
      last_name: contact.last_name || '',
      phone: contact.phone || '',
    })
    setAddDialogOpen(true)
  }

  function closeAddDialog() {
    setAddDialogOpen(false)
    setEditingContact(null)
    setFormData({ email: '', first_name: '', last_name: '', phone: '' })
  }

  function closeUploadDialog() {
    setUploadDialogOpen(false)
    setUploadFile(null)
    setUploadResult(null)
  }

  return (
    <div className="min-h-screen bg-white">
      <Header title="Contacts" />

      <div className="px-6 py-6 space-y-6">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-[#FAFAFA] border border-[#E0E0E0]">
            <TabsTrigger
              value="contacts"
              className="data-[state=active]:bg-white data-[state=active]:text-black"
            >
              <Users className="h-4 w-4 mr-2" />
              All Contacts
            </TabsTrigger>
            <TabsTrigger
              value="lists"
              className="data-[state=active]:bg-white data-[state=active]:text-black"
            >
              <List className="h-4 w-4 mr-2" />
              Lists
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contacts" className="mt-6 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pb-6 border-b border-[#E0E0E0]">
              <div>
                <p className="text-xs text-black/50 uppercase tracking-wider font-medium">
                  Total Contacts
                </p>
                <p className="text-2xl font-semibold text-black tabular-nums mt-1">
                  {stats.total.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-black/50 uppercase tracking-wider font-medium">
                  Active
                </p>
                <p className="text-2xl font-semibold text-black tabular-nums mt-1">
                  {stats.active.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-black/50 uppercase tracking-wider font-medium">
                  New This Month
                </p>
                <p className="text-2xl font-semibold text-black tabular-nums mt-1">
                  {stats.newThisMonth.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-black/50 uppercase tracking-wider font-medium">
                  Unsubscribed
                </p>
                <p className="text-2xl font-semibold text-black tabular-nums mt-1">
                  {stats.unsubscribed.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
                  <Input
                    placeholder="Search contacts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white border-[#E0E0E0] text-black placeholder:text-black/40 focus:border-[#083E33] focus:ring-[#083E33]/20"
                  />
                </div>
                {selectedIds.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={handleBulkDelete}
                    className="border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete ({selectedIds.length})
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setUploadDialogOpen(true)}
                  className="border-[#E0E0E0] text-black hover:bg-black/5 font-medium transition-smooth"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import CSV
                </Button>
                <Button
                  onClick={() => setAddDialogOpen(true)}
                  className="bg-white border border-[#E0E0E0] text-black hover:bg-black/5 hover:shadow-sm font-medium transition-smooth"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Contact
                </Button>
              </div>
            </div>

            {/* Contacts Table */}
            <div className="border border-[#E0E0E0] rounded overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-6 w-6 animate-spin text-black/40" />
                </div>
              ) : contacts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-black/40">
                  <Users className="h-12 w-12 mb-4 opacity-50" />
                  <p className="text-lg font-medium text-black/60">No contacts yet</p>
                  <p className="text-sm mt-1 mb-4">
                    Add contacts manually or import from CSV
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setUploadDialogOpen(true)}>
                      <Upload className="h-4 w-4 mr-2" />
                      Import CSV
                    </Button>
                    <Button onClick={() => setAddDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Contact
                    </Button>
                  </div>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#FAFAFA]">
                      <th className="w-12 px-4 py-3">
                        <Checkbox
                          checked={selectedIds.length === contacts.length && contacts.length > 0}
                          onCheckedChange={toggleSelectAll}
                          className="border-[#E0E0E0]"
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-black/60">Email</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-black/60">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-black/60">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-black/60">Added</th>
                      <th className="w-12 px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((contact) => {
                      const status = statusConfig[contact.status] || statusConfig.active
                      return (
                        <tr
                          key={contact.id}
                          className="border-t border-[#E0E0E0] hover:bg-black/[0.01] transition-smooth"
                        >
                          <td className="px-4 py-3">
                            <Checkbox
                              checked={selectedIds.includes(contact.id)}
                              onCheckedChange={() => toggleSelect(contact.id)}
                              className="border-[#E0E0E0]"
                            />
                          </td>
                          <td className="px-4 py-3 font-medium text-black">
                            {contact.email}
                          </td>
                          <td className="px-4 py-3 text-black/70">
                            {contact.first_name || contact.last_name
                              ? `${contact.first_name || ''} ${contact.last_name || ''}`.trim()
                              : '—'}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-sm font-medium ${status.className}`}>
                              {status.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-black/60">
                            {format(new Date(contact.created_at), 'MMM d, yyyy')}
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
                                <DropdownMenuItem onClick={() => openEditDialog(contact)}>
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteContact(contact.id)}
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

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-between items-center">
                <p className="text-sm text-black/50">
                  Showing {((pagination.page - 1) * pagination.limit) + 1}-
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                  {pagination.total.toLocaleString()} contacts
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page === 1}
                    onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                    className="border-[#E0E0E0] text-black hover:bg-black/5 transition-smooth disabled:text-black/30"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                    className="border-[#E0E0E0] text-black hover:bg-black/5 transition-smooth disabled:text-black/30"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="lists" className="mt-6">
            {clientId && <ContactListsTab clientId={clientId} />}
          </TabsContent>
        </Tabs>
      </div>

      {/* Add/Edit Contact Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={closeAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingContact ? 'Edit Contact' : 'Add Contact'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}
                placeholder="john@example.com"
                disabled={!!editingContact}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData((f) => ({ ...f, first_name: e.target.value }))}
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData((f) => ({ ...f, last_name: e.target.value }))}
                  placeholder="Doe"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData((f) => ({ ...f, phone: e.target.value }))}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeAddDialog}>
              Cancel
            </Button>
            <Button onClick={handleSaveContact} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingContact ? 'Save Changes' : 'Add Contact'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CSV Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={closeUploadDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Import Contacts from CSV</DialogTitle>
          </DialogHeader>

          {uploadResult ? (
            <div className="py-6">
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-center mb-4">Import Complete</h3>
              <div className="bg-[#FAFAFA] rounded p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-black/60">Total rows processed</span>
                  <span className="font-medium">{uploadResult.summary.totalRows}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Imported successfully</span>
                  <span className="font-medium">{uploadResult.summary.imported}</span>
                </div>
                {uploadResult.summary.duplicates > 0 && (
                  <div className="flex justify-between text-amber-600">
                    <span>Duplicates skipped</span>
                    <span className="font-medium">{uploadResult.summary.duplicates}</span>
                  </div>
                )}
                {uploadResult.summary.skipped > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Invalid rows skipped</span>
                    <span className="font-medium">{uploadResult.summary.skipped}</span>
                  </div>
                )}
              </div>
              <Button onClick={closeUploadDialog} className="w-full mt-4">
                Done
              </Button>
            </div>
          ) : (
            <>
              <div className="py-4">
                <div
                  {...getRootProps()}
                  className={cn(
                    'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
                    isDragActive
                      ? 'border-[#083E33] bg-[#083E33]/5'
                      : 'border-[#E0E0E0] hover:border-black/30'
                  )}
                >
                  <input {...getInputProps()} />
                  <FileSpreadsheet className="h-10 w-10 mx-auto mb-3 text-black/30" />
                  {uploadFile ? (
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-medium text-black">{uploadFile.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setUploadFile(null)
                        }}
                        className="text-black/40 hover:text-black"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="text-black/60 mb-1">
                        Drag & drop a CSV file here, or click to browse
                      </p>
                      <p className="text-xs text-black/40">
                        Supported columns: email, first_name, last_name, phone, tags
                      </p>
                    </>
                  )}
                </div>

                <div className="mt-4 p-3 bg-[#FAFAFA] rounded text-sm">
                  <p className="font-medium text-black mb-1">CSV Format</p>
                  <p className="text-black/60 text-xs">
                    Your CSV should have headers in the first row. Required: <strong>email</strong>.
                    Optional: first_name, last_name, phone, tags (comma-separated).
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={closeUploadDialog}>
                  Cancel
                </Button>
                <Button onClick={handleUpload} disabled={!uploadFile || uploading}>
                  {uploading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Upload
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
