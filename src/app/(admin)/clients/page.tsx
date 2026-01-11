'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Plus,
  Search,
  MoreHorizontal,
  Mail,
  Users as UsersIcon,
  ExternalLink,
  Loader2,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

interface Client {
  id: string
  name: string
  email: string
  phone: string | null
  company_name: string | null
  status: 'active' | 'inactive' | 'suspended'
  contacts_count: number
  campaigns_sent: number
  last_campaign: string | null
  avg_open_rate: number
  created_at: string
}

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: 'Active', className: 'text-green-600 bg-green-50' },
  inactive: { label: 'Inactive', className: 'text-black/40 bg-black/5' },
  suspended: { label: 'Suspended', className: 'text-red-600 bg-red-50' },
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [creating, setCreating] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company_name: '',
  })

  useEffect(() => {
    fetchClients()
  }, [])

  async function fetchClients() {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/clients')
      if (!response.ok) {
        throw new Error('Failed to fetch clients')
      }
      const data = await response.json()
      setClients(data)
    } catch (err) {
      console.error('Error fetching clients:', err)
      setError('Failed to load clients')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateClient(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)

    try {
      const response = await fetch('/api/admin/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to create client')
      }

      // Refresh the list
      await fetchClients()
      setShowAddDialog(false)
      setFormData({ name: '', email: '', phone: '', company_name: '' })
    } catch (err) {
      console.error('Error creating client:', err)
      setError('Failed to create client')
    } finally {
      setCreating(false)
    }
  }

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header title="Clients" />
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-black/30" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header title="Clients" />

      <div className="px-6 py-6 space-y-6">
        {error && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded text-amber-800 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)}>
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
            <Input
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-[#E0E0E0] text-black placeholder:text-black/40 focus:border-[#083E33] focus:ring-[#083E33]/20"
            />
          </div>
          <Button
            onClick={() => setShowAddDialog(true)}
            className="bg-white border border-[#E0E0E0] text-black hover:bg-black/5 hover:shadow-sm font-medium transition-smooth"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </div>

        {/* Clients Table */}
        {filteredClients.length > 0 ? (
          <div className="border border-[#E0E0E0] rounded overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-[#FAFAFA]">
                  <th className="px-4 py-3 text-left text-sm font-medium text-black/60">
                    Client
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-black/60">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-black/60">
                    Contacts
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-black/60">
                    Campaigns
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-black/60">
                    Open Rate
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-black/60">
                    Last Campaign
                  </th>
                  <th className="px-4 py-3 w-12"></th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => {
                  const status = statusConfig[client.status]
                  return (
                    <tr
                      key={client.id}
                      className="border-t border-[#E0E0E0] hover:bg-black/[0.01] transition-smooth"
                    >
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-black">{client.name}</p>
                          <p className="text-sm text-black/50">{client.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={cn(
                            'text-xs font-medium px-2 py-1 rounded',
                            status.className
                          )}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <UsersIcon className="h-3.5 w-3.5 text-black/30" />
                          <span className="text-black tabular-nums">
                            {client.contacts_count.toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-black/30" />
                          <span className="text-black tabular-nums">
                            {client.campaigns_sent}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="text-black tabular-nums font-medium">
                          {client.avg_open_rate}%
                        </span>
                      </td>
                      <td className="px-4 py-4 text-black/60">
                        {formatDate(client.last_campaign)}
                      </td>
                      <td className="px-4 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-black/40 hover:text-black hover:bg-black/5"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-white border-[#E0E0E0]"
                          >
                            <DropdownMenuItem className="cursor-pointer">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View Dashboard
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              Edit Client
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-[#E0E0E0]" />
                            <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                              Deactivate
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="border border-[#E0E0E0] rounded p-12 text-center">
            <UsersIcon className="h-12 w-12 text-black/20 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-black">No clients yet</h3>
            <p className="text-sm text-black/50 mt-1 mb-4">
              Add your first client to get started
            </p>
            <Button
              onClick={() => setShowAddDialog(true)}
              className="bg-[#083E33] hover:bg-[#062d25] text-white font-medium"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Client
            </Button>
          </div>
        )}

        {/* Pagination */}
        {filteredClients.length > 0 && (
          <div className="flex justify-between items-center">
            <p className="text-sm text-black/50">
              Showing {filteredClients.length} of {clients.length} clients
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled
                className="border-[#E0E0E0] text-black/30"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-[#E0E0E0] text-black hover:bg-black/5 transition-smooth"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Add Client Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="bg-white border-[#E0E0E0] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-black">Add New Client</DialogTitle>
            <DialogDescription className="text-black/60">
              Create a new client account to manage their email campaigns.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateClient} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-black font-medium">Name *</Label>
              <Input
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Client name"
                className="bg-white border-[#E0E0E0] text-black placeholder:text-black/40 focus:border-[#083E33] focus:ring-[#083E33]/20"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-black font-medium">Email *</Label>
              <Input
                required
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="client@example.com"
                className="bg-white border-[#E0E0E0] text-black placeholder:text-black/40 focus:border-[#083E33] focus:ring-[#083E33]/20"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-black font-medium">Phone</Label>
              <Input
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="(555) 123-4567"
                className="bg-white border-[#E0E0E0] text-black placeholder:text-black/40 focus:border-[#083E33] focus:ring-[#083E33]/20"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-black font-medium">Company Name</Label>
              <Input
                value={formData.company_name}
                onChange={(e) =>
                  setFormData({ ...formData, company_name: e.target.value })
                }
                placeholder="Company Inc."
                className="bg-white border-[#E0E0E0] text-black placeholder:text-black/40 focus:border-[#083E33] focus:ring-[#083E33]/20"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddDialog(false)}
                className="border-[#E0E0E0] text-black hover:bg-black/5"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={creating}
                className="bg-[#083E33] hover:bg-[#062d25] text-white font-medium"
              >
                {creating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Add Client'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
