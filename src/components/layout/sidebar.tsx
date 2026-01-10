'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Mail,
  BarChart3,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Campaigns', href: '/campaigns', icon: Mail },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Contacts', href: '/contacts', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-gradient-to-b from-[#083E33] to-[#062d25] border-r border-[#0a4d3f] transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-white/10">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#D4AF37] rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
              <span className="text-[#083E33] font-heading font-bold text-xl">P</span>
            </div>
            {!collapsed && (
              <span className="text-xl font-heading font-semibold text-white tracking-tight">
                Propflow
              </span>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="text-white/60 hover:text-white hover:bg-white/10"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-[#D4AF37] text-[#083E33] shadow-md'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                )}
              >
                <item.icon className={cn(
                  'h-5 w-5 flex-shrink-0',
                  isActive ? 'text-[#083E33]' : ''
                )} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          {!collapsed && (
            <div className="text-xs text-white/40 font-accent">
              <p>Propflow v1.0</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
