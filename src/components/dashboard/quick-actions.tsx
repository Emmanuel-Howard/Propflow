'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Upload, BarChart3 } from 'lucide-react'

export function QuickActions() {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          asChild
          className="w-full justify-start bg-[#1e3a5f] hover:bg-[#2a4a6f] text-white"
        >
          <Link href="/campaigns/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className="w-full justify-start border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          <Link href="/contacts">
            <Upload className="h-4 w-4 mr-2" />
            Import Contacts
          </Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className="w-full justify-start border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          <Link href="/analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            View Analytics
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
