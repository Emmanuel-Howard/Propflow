'use client'

import { UserButton } from '@clerk/nextjs'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  title?: string
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 h-20 bg-white border-b border-neutral-200">
      <div className="flex h-full items-center justify-between px-8">
        <div>
          {title && (
            <h1 className="text-2xl font-heading text-black tracking-tight">
              {title}
            </h1>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-neutral-500 hover:text-black hover:bg-neutral-100"
          >
            <Bell className="h-5 w-5" />
          </Button>

          <UserButton
            appearance={{
              elements: {
                avatarBox: 'w-9 h-9',
                userButtonPopoverCard: 'bg-white border border-neutral-200 shadow-lg',
                userButtonPopoverActionButton: 'text-neutral-700 hover:text-black hover:bg-neutral-50',
                userButtonPopoverActionButtonText: 'text-neutral-700',
                userButtonPopoverFooter: 'hidden',
              },
            }}
          />
        </div>
      </div>
    </header>
  )
}
