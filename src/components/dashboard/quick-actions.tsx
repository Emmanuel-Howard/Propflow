'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Upload, BarChart3, Sparkles } from 'lucide-react'

export function QuickActions() {
  return (
    <Card className="bg-white border border-gray-100 shadow-card h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-heading font-semibold text-[#083E33] flex items-center gap-2">
          <div className="p-1.5 bg-[#D4AF37]/10 rounded-lg">
            <Sparkles className="h-4 w-4 text-[#D4AF37]" />
          </div>
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          asChild
          className="w-full justify-start bg-gradient-to-r from-[#083E33] to-[#0a5244] hover:from-[#062d25] hover:to-[#083E33] text-white font-medium shadow-sm transition-all duration-200"
        >
          <Link href="/campaigns/new">
            <Plus className="h-4 w-4 mr-3" />
            Create Campaign
          </Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className="w-full justify-start border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-[#083E33] hover:border-[#083E33]/20 font-medium transition-all duration-200"
        >
          <Link href="/contacts">
            <Upload className="h-4 w-4 mr-3" />
            Import Contacts
          </Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className="w-full justify-start border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-[#083E33] hover:border-[#083E33]/20 font-medium transition-all duration-200"
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
