'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Upload,
  Plus,
  Search,
  Users,
  TrendingUp,
  UserPlus,
  UserMinus,
} from 'lucide-react'
import { format } from 'date-fns'

// Mock data
const contacts = [
  {
    id: '1',
    email: 'john.doe@email.com',
    firstName: 'John',
    lastName: 'Doe',
    status: 'active',
    createdAt: new Date('2024-01-10'),
  },
  {
    id: '2',
    email: 'jane.smith@email.com',
    firstName: 'Jane',
    lastName: 'Smith',
    status: 'active',
    createdAt: new Date('2024-01-08'),
  },
  {
    id: '3',
    email: 'bob.wilson@email.com',
    firstName: 'Bob',
    lastName: 'Wilson',
    status: 'unsubscribed',
    createdAt: new Date('2023-12-15'),
  },
  {
    id: '4',
    email: 'alice.johnson@email.com',
    firstName: 'Alice',
    lastName: 'Johnson',
    status: 'active',
    createdAt: new Date('2024-01-05'),
  },
  {
    id: '5',
    email: 'charlie.brown@email.com',
    firstName: 'Charlie',
    lastName: 'Brown',
    status: 'bounced',
    createdAt: new Date('2023-11-20'),
  },
]

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-emerald-500/10 text-emerald-400' },
  unsubscribed: {
    label: 'Unsubscribed',
    className: 'bg-slate-500/10 text-slate-400',
  },
  bounced: { label: 'Bounced', className: 'bg-red-500/10 text-red-400' },
}

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

  const stats = [
    {
      title: 'Total Contacts',
      value: '2,847',
      icon: Users,
      change: '+12%',
    },
    {
      title: 'Active',
      value: '2,784',
      icon: UserPlus,
      change: '+8%',
    },
    {
      title: 'New This Month',
      value: '156',
      icon: TrendingUp,
      change: '+24%',
    },
    {
      title: 'Unsubscribed',
      value: '63',
      icon: UserMinus,
      change: '-2%',
    },
  ]

  return (
    <div className="min-h-screen">
      <Header title="Contacts" />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title} className="bg-slate-900 border-slate-800">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-800 rounded-lg">
                      <Icon className="h-4 w-4 text-[#d4af37]" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">{stat.title}</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-xl font-bold text-white">
                          {stat.value}
                        </p>
                        <span className="text-xs text-emerald-400">
                          {stat.change}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-900 border-slate-800 text-white placeholder:text-slate-500"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import CSV
            </Button>
            <Button className="bg-[#1e3a5f] hover:bg-[#2a4a6f] text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </div>
        </div>

        {/* Contacts Table */}
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedIds.length === contacts.length}
                      onCheckedChange={toggleSelectAll}
                      className="border-slate-600"
                    />
                  </TableHead>
                  <TableHead className="text-slate-400">Email</TableHead>
                  <TableHead className="text-slate-400">Name</TableHead>
                  <TableHead className="text-slate-400">Status</TableHead>
                  <TableHead className="text-slate-400">Added</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((contact) => {
                  const status = statusConfig[contact.status]
                  return (
                    <TableRow
                      key={contact.id}
                      className="border-slate-800 hover:bg-slate-800/50"
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(contact.id)}
                          onCheckedChange={() => toggleSelect(contact.id)}
                          className="border-slate-600"
                        />
                      </TableCell>
                      <TableCell className="text-white font-medium">
                        {contact.email}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {contact.firstName} {contact.lastName}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`${status.className} border-0`}
                        >
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-400">
                        {format(contact.createdAt, 'MMM d, yyyy')}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination placeholder */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-slate-400">
            Showing 1-5 of 2,847 contacts
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled
              className="border-slate-700 text-slate-500"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
