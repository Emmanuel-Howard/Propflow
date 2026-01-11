'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Upload, Plus, Search } from 'lucide-react'
import { format } from 'date-fns'

const contacts = [
  { id: '1', email: 'john.doe@email.com', firstName: 'John', lastName: 'Doe', status: 'active', createdAt: new Date('2024-01-10') },
  { id: '2', email: 'jane.smith@email.com', firstName: 'Jane', lastName: 'Smith', status: 'active', createdAt: new Date('2024-01-08') },
  { id: '3', email: 'bob.wilson@email.com', firstName: 'Bob', lastName: 'Wilson', status: 'unsubscribed', createdAt: new Date('2023-12-15') },
  { id: '4', email: 'alice.johnson@email.com', firstName: 'Alice', lastName: 'Johnson', status: 'active', createdAt: new Date('2024-01-05') },
  { id: '5', email: 'charlie.brown@email.com', firstName: 'Charlie', lastName: 'Brown', status: 'bounced', createdAt: new Date('2023-11-20') },
]

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: 'Active', className: 'text-green-600' },
  unsubscribed: { label: 'Unsubscribed', className: 'text-black/40' },
  bounced: { label: 'Bounced', className: 'text-red-600' },
}

const stats = [
  { title: 'Total Contacts', value: '2,847', change: '+12%' },
  { title: 'Active', value: '2,784', change: '+8%' },
  { title: 'New This Month', value: '156', change: '+24%' },
  { title: 'Unsubscribed', value: '63', change: '-2%' },
]

export default function ContactsPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')

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

  return (
    <div className="min-h-screen bg-white">
      <Header title="Contacts" />

      <div className="px-6 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pb-6 border-b border-[#E0E0E0]">
          {stats.map((stat) => (
            <div key={stat.title}>
              <p className="text-xs text-black/50 uppercase tracking-wider font-medium">
                {stat.title}
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <p className="text-2xl font-semibold text-black tabular-nums">
                  {stat.value}
                </p>
                <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
            <Input
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-[#E0E0E0] text-black placeholder:text-black/40 focus:border-[#083E33] focus:ring-[#083E33]/20"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-[#E0E0E0] text-black hover:bg-black/5 font-medium transition-smooth"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import CSV
            </Button>
            <Button className="bg-white border border-[#E0E0E0] text-black hover:bg-black/5 hover:shadow-sm font-medium transition-smooth">
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </div>
        </div>

        {/* Contacts Table */}
        <div className="border border-[#E0E0E0] rounded overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#FAFAFA]">
                <th className="w-12 px-4 py-3">
                  <Checkbox
                    checked={selectedIds.length === contacts.length}
                    onCheckedChange={toggleSelectAll}
                    className="border-[#E0E0E0]"
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-black/60">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-black/60">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-black/60">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-black/60">Added</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => {
                const status = statusConfig[contact.status]
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
                      {contact.firstName} {contact.lastName}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-medium ${status.className}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-black/60">
                      {format(contact.createdAt, 'MMM d, yyyy')}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-black/50">
            Showing 1-5 of 2,847 contacts
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
      </div>
    </div>
  )
}
