'use client'

import { UserButton } from '@clerk/nextjs'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  title?: string
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-900/95 backdrop-blur border-b border-slate-800">
      <div className="flex h-full items-center justify-between px-6">
        <div>
          {title && (
            <h1 className="text-xl font-semibold text-white">{title}</h1>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <Bell className="h-5 w-5" />
          </Button>

          <UserButton
            appearance={{
              elements: {
                avatarBox: 'w-8 h-8',
                userButtonPopoverCard: 'bg-slate-800 border border-slate-700',
                userButtonPopoverActionButton: 'text-slate-300 hover:text-white hover:bg-slate-700',
                userButtonPopoverActionButtonText: 'text-slate-300',
                userButtonPopoverFooter: 'hidden',
              },
            }}
          />
        </div>
      </div>
    </header>
  )
}
