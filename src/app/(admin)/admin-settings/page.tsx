'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Users,
  Plug,
  CreditCard,
  Bell,
  Shield,
  ChevronRight,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const settingsSections = [
  {
    id: 'team',
    title: 'Team Members',
    description: 'Manage team access and roles',
    icon: Users,
    href: '/admin-settings/team',
  },
  {
    id: 'integrations',
    title: 'Integrations',
    description: 'API keys, email providers, and webhooks',
    icon: Plug,
    href: '/admin-settings/integrations',
  },
  {
    id: 'billing',
    title: 'Billing',
    description: 'Client subscriptions and payment settings',
    icon: CreditCard,
    href: '/admin-settings/billing',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Configure admin alerts and reports',
    icon: Bell,
    href: '/admin-settings/notifications',
  },
  {
    id: 'security',
    title: 'Security',
    description: 'Two-factor authentication and session management',
    icon: Shield,
    href: '/admin-settings/security',
  },
]

export default function AdminSettingsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header title="Admin Settings" />

      <div className="px-6 py-6 space-y-8">
        {/* Settings Navigation */}
        <div className="max-w-2xl">
          <p className="text-black/60 mb-6">
            Manage your Propflow admin account settings, team members, and integrations.
          </p>

          <div className="border border-[#E0E0E0] rounded divide-y divide-[#E0E0E0]">
            {settingsSections.map((section) => {
              const Icon = section.icon
              return (
                <Link
                  key={section.id}
                  href={section.href}
                  className="flex items-center justify-between p-4 hover:bg-black/[0.01] transition-smooth group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-[#FAFAFA] rounded group-hover:bg-[#F0F0F0] transition-smooth">
                      <Icon className="h-5 w-5 text-black/60" />
                    </div>
                    <div>
                      <p className="font-medium text-black">{section.title}</p>
                      <p className="text-sm text-black/50">{section.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-black/30 group-hover:text-black/50 transition-smooth" />
                </Link>
              )
            })}
          </div>
        </div>

        {/* Quick Settings */}
        <div className="max-w-2xl">
          <h3 className="text-lg font-semibold text-black mb-4">Quick Settings</h3>

          <div className="border border-[#E0E0E0] rounded divide-y divide-[#E0E0E0]">
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium text-black">Email Notifications</p>
                <p className="text-sm text-black/50">
                  Receive email alerts for important events
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium text-black">Weekly Reports</p>
                <p className="text-sm text-black/50">
                  Get a summary of all client activity every Monday
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium text-black">Campaign Alerts</p>
                <p className="text-sm text-black/50">
                  Notify when campaigns need approval or have issues
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        {/* Business Info */}
        <div className="max-w-2xl">
          <h3 className="text-lg font-semibold text-black mb-4">Business Information</h3>

          <div className="border border-[#E0E0E0] rounded p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-black font-medium">Business Name</Label>
                <Input
                  defaultValue="Propflow Inc."
                  className="bg-white border-[#E0E0E0] text-black focus:border-[#083E33] focus:ring-[#083E33]/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-black font-medium">Contact Email</Label>
                <Input
                  defaultValue="admin@propflow.com"
                  className="bg-white border-[#E0E0E0] text-black focus:border-[#083E33] focus:ring-[#083E33]/20"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button className="bg-white border border-[#E0E0E0] text-black hover:bg-black/5 hover:shadow-sm font-medium transition-smooth">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
