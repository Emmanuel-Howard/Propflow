'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  ChevronDown,
  Building2,
  Check,
  Loader2,
  LayoutTemplate,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useClient } from '@/contexts/client-context'

const navigation = [
  { name: 'Overview', href: '/overview', icon: LayoutDashboard },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Campaigns', href: '/admin-campaigns', icon: FileText },
  { name: 'Templates', href: '/templates', icon: LayoutTemplate },
  { name: 'Settings', href: '/admin-settings', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { selectedClient, setSelectedClient, clients, loading } = useClient()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-[#083E33]">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center px-6 border-b border-white/10">
          <Link href="/overview" className="flex items-center">
            <span className="text-xl font-semibold text-white tracking-tight">
              Propflow
            </span>
            <span className="ml-2 text-xs font-medium text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded">
              Admin
            </span>
          </Link>
        </div>

        {/* Client Switcher */}
        <div className="px-3 py-4 border-b border-white/10">
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full">
              <div className="flex items-center justify-between px-3 py-2.5 bg-white/5 hover:bg-white/10 rounded transition-smooth cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center">
                    <Building2 className="h-4 w-4 text-white/70" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-white truncate max-w-[140px]">
                      {selectedClient ? selectedClient.name : 'Select Client'}
                    </p>
                    <p className="text-xs text-white/50">
                      {selectedClient ? 'Viewing as client' : 'Admin view'}
                    </p>
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-white/50" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-[232px] bg-white border-[#E0E0E0]"
            >
              <DropdownMenuLabel className="text-black/50 text-xs uppercase tracking-wider font-medium">
                Switch Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#E0E0E0]" />

              {/* Admin View Option */}
              <DropdownMenuItem
                onClick={() => setSelectedClient(null)}
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-[#083E33] rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-white">P</span>
                  </div>
                  <span className="text-black font-medium">Admin Dashboard</span>
                </div>
                {!selectedClient && <Check className="h-4 w-4 text-[#083E33]" />}
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-[#E0E0E0]" />
              <DropdownMenuLabel className="text-black/50 text-xs uppercase tracking-wider font-medium">
                Client Accounts
              </DropdownMenuLabel>

              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin text-black/30" />
                </div>
              ) : clients.length > 0 ? (
                clients.map((client) => (
                  <DropdownMenuItem
                    key={client.id}
                    onClick={() => setSelectedClient(client)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-[#F0F0F0] rounded flex items-center justify-center">
                        <span className="text-xs font-medium text-black/60">
                          {client.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-black font-medium text-sm">{client.name}</p>
                        <p className="text-black/50 text-xs">{client.email}</p>
                      </div>
                    </div>
                    {selectedClient?.id === client.id && (
                      <Check className="h-4 w-4 text-[#083E33]" />
                    )}
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="py-3 px-2 text-center text-sm text-black/50">
                  No clients yet
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-smooth rounded',
                      isActive
                        ? 'text-[#D4AF37] bg-white/10'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10">
          <p className="text-xs text-white/30">Propflow Admin v1.0</p>
        </div>
      </div>
    </aside>
  )
}
