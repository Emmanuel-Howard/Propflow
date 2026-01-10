'use client'

import { UserButton } from '@clerk/nextjs'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  title?: string
  description?: string
}

export function Header({ title, description }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#E0E0E0]">
      <div className="flex h-16 items-center justify-between px-6">
        <div>
          {title && (
            <h1 className="text-h2 text-black">{title}</h1>
          )}
          {description && (
            <p className="text-muted-sm mt-0.5">{description}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-black/50 hover:text-black hover:bg-black/5 transition-smooth"
          >
            <Bell className="h-5 w-5" />
          </Button>

          <UserButton
            appearance={{
              elements: {
                avatarBox: 'w-8 h-8',
                userButtonPopoverCard: 'bg-white border border-[#E0E0E0] shadow-lg',
                userButtonPopoverActionButton: 'text-black hover:bg-black/5',
                userButtonPopoverActionButtonText: 'text-black',
                userButtonPopoverFooter: 'hidden',
              },
            }}
          />
        </div>
      </div>
    </header>
  )
}
