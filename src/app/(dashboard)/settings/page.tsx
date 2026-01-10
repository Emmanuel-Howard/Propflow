'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Palette, Building, Bell, Globe, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { id: 'brand', label: 'Brand', icon: Palette },
  { id: 'company', label: 'Company', icon: Building },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'preferences', label: 'Preferences', icon: Globe },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('brand')
  const [primaryColor, setPrimaryColor] = useState('#083E33')
  const [accentColor, setAccentColor] = useState('#D4AF37')

  return (
    <div className="min-h-screen bg-white">
      <Header title="Settings" />

      <div className="px-6 py-6">
        {/* Tab Navigation */}
        <div className="flex gap-1 border-b border-[#E0E0E0] mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium transition-smooth border-b-2 -mb-px',
                  isActive
                    ? 'border-[#083E33] text-black'
                    : 'border-transparent text-black/50 hover:text-black/70'
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Brand Settings */}
        {activeTab === 'brand' && (
          <div className="max-w-2xl space-y-8">
            <div>
              <h3 className="text-h3 text-black">Brand Settings</h3>
              <p className="text-muted-sm mt-1">
                Customize how your emails look to recipients
              </p>
            </div>

            {/* Logo Upload */}
            <div className="space-y-3">
              <Label className="text-black font-medium">Company Logo</Label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-[#FAFAFA] rounded flex items-center justify-center border border-dashed border-[#E0E0E0]">
                  <Upload className="h-8 w-8 text-black/30" />
                </div>
                <div className="space-y-2">
                  <Button className="bg-white border border-[#E0E0E0] text-black hover:bg-black/5 hover:shadow-sm font-medium transition-smooth">
                    Upload Logo
                  </Button>
                  <p className="text-xs text-black/50">
                    PNG, JPG up to 2MB. Recommended: 200x200px
                  </p>
                </div>
              </div>
            </div>

            <div className="h-px bg-[#E0E0E0]" />

            {/* Colors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-black font-medium">Primary Color</Label>
                <div className="flex gap-2">
                  <div
                    className="w-10 h-10 rounded border border-[#E0E0E0] cursor-pointer flex-shrink-0"
                    style={{ backgroundColor: primaryColor }}
                  />
                  <Input
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="bg-white border-[#E0E0E0] text-black focus:border-[#083E33] focus:ring-[#083E33]/20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-black font-medium">Accent Color</Label>
                <div className="flex gap-2">
                  <div
                    className="w-10 h-10 rounded border border-[#E0E0E0] cursor-pointer flex-shrink-0"
                    style={{ backgroundColor: accentColor }}
                  />
                  <Input
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="bg-white border-[#E0E0E0] text-black focus:border-[#083E33] focus:ring-[#083E33]/20"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button className="bg-white border border-[#E0E0E0] text-black hover:bg-black/5 hover:shadow-sm font-medium transition-smooth">
                Save Changes
              </Button>
            </div>
          </div>
        )}

        {/* Company Settings */}
        {activeTab === 'company' && (
          <div className="max-w-2xl space-y-8">
            <div>
              <h3 className="text-h3 text-black">Company Information</h3>
              <p className="text-muted-sm mt-1">
                This information appears in your email footers
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-black font-medium">Company Name</Label>
                <Input
                  placeholder="Your Company Name"
                  className="bg-white border-[#E0E0E0] text-black placeholder:text-black/40 focus:border-[#083E33] focus:ring-[#083E33]/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-black font-medium">Website</Label>
                <Input
                  placeholder="https://yourwebsite.com"
                  className="bg-white border-[#E0E0E0] text-black placeholder:text-black/40 focus:border-[#083E33] focus:ring-[#083E33]/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-black font-medium">Phone</Label>
                <Input
                  placeholder="(555) 123-4567"
                  className="bg-white border-[#E0E0E0] text-black placeholder:text-black/40 focus:border-[#083E33] focus:ring-[#083E33]/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-black font-medium">Reply-to Email</Label>
                <Input
                  placeholder="contact@yourcompany.com"
                  className="bg-white border-[#E0E0E0] text-black placeholder:text-black/40 focus:border-[#083E33] focus:ring-[#083E33]/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-black font-medium">Company Address</Label>
              <Input
                placeholder="123 Main St, City, State 12345"
                className="bg-white border-[#E0E0E0] text-black placeholder:text-black/40 focus:border-[#083E33] focus:ring-[#083E33]/20"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-black font-medium">From Name</Label>
              <Input
                placeholder="John Smith - Real Estate"
                className="bg-white border-[#E0E0E0] text-black placeholder:text-black/40 focus:border-[#083E33] focus:ring-[#083E33]/20"
              />
              <p className="text-xs text-black/50">
                This is the name recipients will see in their inbox
              </p>
            </div>

            <div className="flex justify-end pt-4">
              <Button className="bg-white border border-[#E0E0E0] text-black hover:bg-black/5 hover:shadow-sm font-medium transition-smooth">
                Save Changes
              </Button>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <div className="max-w-2xl space-y-8">
            <div>
              <h3 className="text-h3 text-black">Notification Preferences</h3>
              <p className="text-muted-sm mt-1">
                Choose how you want to be notified
              </p>
            </div>

            <div className="space-y-0 border border-[#E0E0E0] rounded overflow-hidden">
              <div className="flex items-center justify-between p-4 bg-white">
                <div>
                  <p className="font-medium text-black">Email Notifications</p>
                  <p className="text-sm text-black/50">
                    Receive updates about your campaigns via email
                  </p>
                </div>
                <Switch />
              </div>
              <div className="h-px bg-[#E0E0E0]" />
              <div className="flex items-center justify-between p-4 bg-white">
                <div>
                  <p className="font-medium text-black">Campaign Reports</p>
                  <p className="text-sm text-black/50">
                    Get weekly summary reports of campaign performance
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="h-px bg-[#E0E0E0]" />
              <div className="flex items-center justify-between p-4 bg-white">
                <div>
                  <p className="font-medium text-black">New Subscriber Alerts</p>
                  <p className="text-sm text-black/50">
                    Be notified when new contacts subscribe
                  </p>
                </div>
                <Switch />
              </div>
              <div className="h-px bg-[#E0E0E0]" />
              <div className="flex items-center justify-between p-4 bg-white">
                <div>
                  <p className="font-medium text-black">Bounce Alerts</p>
                  <p className="text-sm text-black/50">
                    Get notified when emails bounce
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        )}

        {/* Preferences */}
        {activeTab === 'preferences' && (
          <div className="max-w-2xl space-y-8">
            <div>
              <h3 className="text-h3 text-black">Content Preferences</h3>
              <p className="text-muted-sm mt-1">
                Configure your content and delivery settings
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-black font-medium">Timezone</Label>
              <Select defaultValue="america_new_york">
                <SelectTrigger className="bg-white border-[#E0E0E0] text-black focus:border-[#083E33] focus:ring-[#083E33]/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-[#E0E0E0]">
                  <SelectItem value="america_new_york" className="text-black">
                    Eastern Time (ET)
                  </SelectItem>
                  <SelectItem value="america_chicago" className="text-black">
                    Central Time (CT)
                  </SelectItem>
                  <SelectItem value="america_denver" className="text-black">
                    Mountain Time (MT)
                  </SelectItem>
                  <SelectItem value="america_los_angeles" className="text-black">
                    Pacific Time (PT)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="h-px bg-[#E0E0E0]" />

            <div>
              <Label className="text-black font-medium mb-4 block">
                Content Types
              </Label>
              <div className="space-y-0 border border-[#E0E0E0] rounded overflow-hidden">
                <div className="flex items-center justify-between p-4 bg-white">
                  <div>
                    <p className="font-medium text-black">Newsletters</p>
                    <p className="text-sm text-black/50">
                      Regular market updates and news
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="h-px bg-[#E0E0E0]" />
                <div className="flex items-center justify-between p-4 bg-white">
                  <div>
                    <p className="font-medium text-black">Tips & Insights</p>
                    <p className="text-sm text-black/50">
                      Educational content for clients
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="h-px bg-[#E0E0E0]" />
                <div className="flex items-center justify-between p-4 bg-white">
                  <div>
                    <p className="font-medium text-black">Promotions</p>
                    <p className="text-sm text-black/50">
                      Special offers and announcements
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button className="bg-white border border-[#E0E0E0] text-black hover:bg-black/5 hover:shadow-sm font-medium transition-smooth">
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
