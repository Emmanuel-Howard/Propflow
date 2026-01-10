'use client'

import { UserButton } from '@clerk/nextjs'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  title?: string
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-gray-200/60">
      <div className="flex h-full items-center justify-between px-6">
        <div>
          {title && (
            <h1 className="text-2xl font-heading font-semibold text-[#083E33] tracking-tight">
              {title}
            </h1>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-[#083E33] hover:bg-gray-100 transition-colors"
          >
            <Bell className="h-5 w-5" />
          </Button>

          <div className="w-px h-6 bg-gray-200" />

          <UserButton
            appearance={{
              elements: {
                avatarBox: 'w-9 h-9 ring-2 ring-[#083E33]/10',
                userButtonPopoverCard: 'bg-white border border-gray-200 shadow-elevated',
                userButtonPopoverActionButton: 'text-gray-700 hover:text-[#083E33] hover:bg-gray-50',
                userButtonPopoverActionButtonText: 'text-gray-700',
                userButtonPopoverFooter: 'hidden',
              },
            }}
          />
        </div>
      </div>
    </header>
  )
}
