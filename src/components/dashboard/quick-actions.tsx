'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Upload, BarChart3 } from 'lucide-react'

export function QuickActions() {
  return (
    <Card className="bg-white border border-neutral-200 h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-heading text-black">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          asChild
          className="w-full justify-start bg-[#083E33] hover:bg-[#062d25] text-white font-medium"
        >
          <Link href="/campaigns/new">
            <Plus className="h-4 w-4 mr-3" />
            Create Campaign
          </Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className="w-full justify-start border-neutral-200 text-black hover:bg-neutral-50 font-medium"
        >
          <Link href="/contacts">
            <Upload className="h-4 w-4 mr-3" />
            Import Contacts
          </Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className="w-full justify-start border-neutral-200 text-black hover:bg-neutral-50 font-medium"
        >
          <Link href="/analytics">
            <BarChart3 className="h-4 w-4 mr-3" />
            View Analytics
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
