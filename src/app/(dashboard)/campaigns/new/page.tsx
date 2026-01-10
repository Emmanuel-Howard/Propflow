'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Eye, Code, Send, Calendar } from 'lucide-react'
import Link from 'next/link'

export default function NewCampaignPage() {
  const router = useRouter()
  const [subject, setSubject] = useState('')
  const [previewText, setPreviewText] = useState('')
  const [contentHtml, setContentHtml] = useState('')

  const handleSaveDraft = () => {
    // TODO: Save draft
    console.log('Saving draft...')
  }

  const handleSchedule = () => {
    // TODO: Open schedule dialog
    console.log('Opening schedule dialog...')
  }

  const handleSendNow = () => {
    // TODO: Send campaign
    console.log('Sending campaign...')
  }

  return (
    <div className="min-h-screen">
      <Header title="Create Campaign" />

      <div className="p-6 space-y-6">
        {/* Back Button */}
        <Button
          asChild
          variant="ghost"
          className="text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <Link href="/campaigns">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Campaigns
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Editor */}
          <div className="space-y-6">
            {/* Subject & Preview */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Campaign Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-slate-300">
                    Subject Line
                  </Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter your email subject..."
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preview" className="text-slate-300">
                    Preview Text
                  </Label>
                  <Input
                    id="preview"
                    value={previewText}
                    onChange={(e) => setPreviewText(e.target.value)}
                    placeholder="Text shown in inbox preview..."
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>
              </CardContent>
            </Card>

            {/* HTML Editor */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Email Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={contentHtml}
                  onChange={(e) => setContentHtml(e.target.value)}
                  placeholder="Paste your HTML email content here..."
                  className="min-h-[400px] font-mono text-sm bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Tip: Use {'{{first_name}}'} to personalize with contact's name
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="desktop" className="w-full">
                  <TabsList className="bg-slate-800 border-slate-700">
                    <TabsTrigger
                      value="desktop"
                      className="data-[state=active]:bg-slate-700"
                    >
                      Desktop
                    </TabsTrigger>
                    <TabsTrigger
                      value="mobile"
                      className="data-[state=active]:bg-slate-700"
                    >
                      Mobile
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="desktop" className="mt-4">
                    <div className="bg-white rounded-lg overflow-hidden min-h-[400px]">
                      {contentHtml ? (
                        <iframe
                          srcDoc={contentHtml}
                          className="w-full h-[400px] border-0"
                          title="Email Preview"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-[400px] text-slate-400">
                          <p>Paste HTML to see preview</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="mobile" className="mt-4">
                    <div className="flex justify-center">
                      <div className="w-[375px] bg-white rounded-lg overflow-hidden min-h-[400px]">
                        {contentHtml ? (
                          <iframe
                            srcDoc={contentHtml}
                            className="w-full h-[400px] border-0"
                            title="Email Preview Mobile"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-[400px] text-slate-400">
                            <p>Paste HTML to see preview</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="pt-6 space-y-3">
                <Button
                  onClick={handleSaveDraft}
                  variant="outline"
                  className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  Save as Draft
                </Button>
                <Button
                  onClick={handleSchedule}
                  variant="outline"
                  className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
                <Button
                  onClick={handleSendNow}
                  className="w-full bg-[#1e3a5f] hover:bg-[#2a4a6f] text-white"
                  disabled={!subject || !contentHtml}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
