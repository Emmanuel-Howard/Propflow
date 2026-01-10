'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Upload, BarChart3 } from 'lucide-react'

export function QuickActions() {
  return (
    <div>
      <h3 className="text-label font-semibold text-black mb-4">Quick Actions</h3>
      <div className="space-y-2">
        <Button
          asChild
          className="w-full justify-start bg-white border border-[#E0E0E0] text-black hover:bg-black/5 hover:shadow-sm font-medium transition-smooth"
        >
          <Link href="/campaigns/new">
            <Plus className="h-4 w-4 mr-3" />
            Create Campaign
          </Link>
        </Button>

        <Button
          asChild
          variant="ghost"
          className="w-full justify-start text-black/70 hover:text-black hover:bg-black/5 font-medium transition-smooth"
        >
          <Link href="/contacts">
            <Upload className="h-4 w-4 mr-3" />
            Import Contacts
          </Link>
        </Button>

        <Button
          asChild
          variant="ghost"
          className="w-full justify-start text-black/70 hover:text-black hover:bg-black/5 font-medium transition-smooth"
        >
          <Link href="/analytics">
            <BarChart3 className="h-4 w-4 mr-3" />
            View Analytics
          </Link>
        </Button>
      </div>
    </div>
  )
}
