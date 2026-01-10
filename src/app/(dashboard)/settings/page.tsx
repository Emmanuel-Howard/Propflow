'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Palette, Building, Bell, Globe, Upload } from 'lucide-react'

export default function SettingsPage() {
  const [primaryColor, setPrimaryColor] = useState('#1e3a5f')
  const [secondaryColor, setSecondaryColor] = useState('#d4af37')

  return (
    <div className="min-h-screen">
      <Header title="Settings" />

      <div className="p-6">
        <Tabs defaultValue="brand" className="space-y-6">
          <TabsList className="bg-slate-900 border-slate-800">
            <TabsTrigger
              value="brand"
              className="data-[state=active]:bg-slate-800"
            >
              <Palette className="h-4 w-4 mr-2" />
              Brand
            </TabsTrigger>
            <TabsTrigger
              value="company"
              className="data-[state=active]:bg-slate-800"
            >
              <Building className="h-4 w-4 mr-2" />
              Company
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-slate-800"
            >
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="data-[state=active]:bg-slate-800"
            >
              <Globe className="h-4 w-4 mr-2" />
              Preferences
            </TabsTrigger>
          </TabsList>

          {/* Brand Settings */}
          <TabsContent value="brand">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Brand Settings</CardTitle>
                <CardDescription className="text-slate-400">
                  Customize how your emails look to recipients
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Logo Upload */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Company Logo</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 bg-slate-800 rounded-lg flex items-center justify-center border border-dashed border-slate-700">
                      <Upload className="h-8 w-8 text-slate-500" />
                    </div>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="border-slate-700 text-slate-300 hover:bg-slate-800"
                      >
                        Upload Logo
                      </Button>
                      <p className="text-xs text-slate-500">
                        PNG, JPG up to 2MB. Recommended: 200x200px
                      </p>
                    </div>
                  </div>
                </div>

                <Separator className="bg-slate-800" />

                {/* Colors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Primary Color</Label>
                    <div className="flex gap-2">
                      <div
                        className="w-10 h-10 rounded-lg border border-slate-700 cursor-pointer"
                        style={{ backgroundColor: primaryColor }}
                      />
                      <Input
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Accent Color</Label>
                    <div className="flex gap-2">
                      <div
                        className="w-10 h-10 rounded-lg border border-slate-700 cursor-pointer"
                        style={{ backgroundColor: secondaryColor }}
                      />
                      <Input
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-[#1e3a5f] hover:bg-[#2a4a6f] text-white">
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Company Settings */}
          <TabsContent value="company">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Company Information</CardTitle>
                <CardDescription className="text-slate-400">
                  This information appears in your email footers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Company Name</Label>
                    <Input
                      placeholder="Your Company Name"
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Website</Label>
                    <Input
                      placeholder="https://yourwebsite.com"
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Phone</Label>
                    <Input
                      placeholder="(555) 123-4567"
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Reply-to Email</Label>
                    <Input
                      placeholder="contact@yourcompany.com"
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Company Address</Label>
                  <Input
                    placeholder="123 Main St, City, State 12345"
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">From Name</Label>
                  <Input
                    placeholder="John Smith - Real Estate"
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  />
                  <p className="text-xs text-slate-500">
                    This is the name recipients will see in their inbox
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-[#1e3a5f] hover:bg-[#2a4a6f] text-white">
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Notification Preferences</CardTitle>
                <CardDescription className="text-slate-400">
                  Choose how you want to be notified
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">Email Notifications</p>
                      <p className="text-sm text-slate-400">
                        Receive updates about your campaigns via email
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <Separator className="bg-slate-800" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">Campaign Reports</p>
                      <p className="text-sm text-slate-400">
                        Get weekly summary reports of campaign performance
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator className="bg-slate-800" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">New Subscriber Alerts</p>
                      <p className="text-sm text-slate-400">
                        Be notified when new contacts subscribe
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <Separator className="bg-slate-800" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">Bounce Alerts</p>
                      <p className="text-sm text-slate-400">
                        Get notified when emails bounce
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences */}
          <TabsContent value="preferences">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Content Preferences</CardTitle>
                <CardDescription className="text-slate-400">
                  Configure your content and delivery settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-slate-300">Timezone</Label>
                  <Select defaultValue="america_new_york">
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="america_new_york">
                        Eastern Time (ET)
                      </SelectItem>
                      <SelectItem value="america_chicago">
                        Central Time (CT)
                      </SelectItem>
                      <SelectItem value="america_denver">
                        Mountain Time (MT)
                      </SelectItem>
                      <SelectItem value="america_los_angeles">
                        Pacific Time (PT)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="bg-slate-800" />

                <div>
                  <Label className="text-slate-300 mb-4 block">
                    Content Types
                  </Label>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-white">Newsletters</p>
                        <p className="text-sm text-slate-400">
                          Regular market updates and news
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-white">Tips & Insights</p>
                        <p className="text-sm text-slate-400">
                          Educational content for clients
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-white">Promotions</p>
                        <p className="text-sm text-slate-400">
                          Special offers and announcements
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-[#1e3a5f] hover:bg-[#2a4a6f] text-white">
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
