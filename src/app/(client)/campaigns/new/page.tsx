'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Eye, Code, Send, Calendar, Monitor, Smartphone } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function NewCampaignPage() {
  const router = useRouter()
  const [subject, setSubject] = useState('')
  const [previewText, setPreviewText] = useState('')
  const [contentHtml, setContentHtml] = useState('')
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop')

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
    <div className="min-h-screen bg-white">
      <Header title="Create Campaign" />

      <div className="px-6 py-6 space-y-6">
        {/* Back Button */}
        <Button
          asChild
          variant="ghost"
          className="text-black/50 hover:text-black hover:bg-black/5 -ml-2"
        >
          <Link href="/campaigns">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Campaigns
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Editor */}
          <div className="space-y-6">
            {/* Subject & Preview */}
            <div className="border border-[#E0E0E0] rounded p-6 space-y-4">
              <h3 className="font-semibold text-black">Campaign Details</h3>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-black font-medium">
                  Subject Line
                </Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter your email subject..."
                  className="bg-white border-[#E0E0E0] text-black placeholder:text-black/40 focus:border-[#083E33] focus:ring-[#083E33]/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preview" className="text-black font-medium">
                  Preview Text
                </Label>
                <Input
                  id="preview"
                  value={previewText}
                  onChange={(e) => setPreviewText(e.target.value)}
                  placeholder="Text shown in inbox preview..."
                  className="bg-white border-[#E0E0E0] text-black placeholder:text-black/40 focus:border-[#083E33] focus:ring-[#083E33]/20"
                />
                <p className="text-xs text-black/50">
                  This appears next to your subject line in the inbox
                </p>
              </div>
            </div>

            {/* HTML Editor */}
            <div className="border border-[#E0E0E0] rounded p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Code className="h-5 w-5 text-black/60" />
                <h3 className="font-semibold text-black">Email Content</h3>
              </div>

              <Textarea
                value={contentHtml}
                onChange={(e) => setContentHtml(e.target.value)}
                placeholder="Paste your HTML email content here..."
                className="min-h-[400px] font-mono text-sm bg-[#FAFAFA] border-[#E0E0E0] text-black placeholder:text-black/40 focus:border-[#083E33] focus:ring-[#083E33]/20"
              />
              <p className="text-xs text-black/50">
                Tip: Use {'{{first_name}}'} to personalize with contact&apos;s name
              </p>
            </div>
          </div>

          {/* Right Column - Preview & Actions */}
          <div className="space-y-6">
            {/* Preview */}
            <div className="border border-[#E0E0E0] rounded overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-[#FAFAFA] border-b border-[#E0E0E0]">
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-black/60" />
                  <h3 className="font-semibold text-black">Preview</h3>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setPreviewMode('desktop')}
                    className={cn(
                      'p-2 rounded transition-smooth',
                      previewMode === 'desktop'
                        ? 'bg-black text-white'
                        : 'text-black/40 hover:text-black hover:bg-black/5'
                    )}
                  >
                    <Monitor className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setPreviewMode('mobile')}
                    className={cn(
                      'p-2 rounded transition-smooth',
                      previewMode === 'mobile'
                        ? 'bg-black text-white'
                        : 'text-black/40 hover:text-black hover:bg-black/5'
                    )}
                  >
                    <Smartphone className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="p-4 bg-[#F5F5F5] min-h-[450px] flex items-start justify-center">
                <div
                  className={cn(
                    'bg-white rounded shadow-sm overflow-hidden transition-all',
                    previewMode === 'desktop' ? 'w-full' : 'w-[375px]'
                  )}
                >
                  {contentHtml ? (
                    <iframe
                      srcDoc={contentHtml}
                      className="w-full h-[420px] border-0"
                      title="Email Preview"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-[420px] text-black/30">
                      <div className="text-center">
                        <Code className="h-10 w-10 mx-auto mb-2 opacity-50" />
                        <p>Paste HTML to see preview</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="border border-[#E0E0E0] rounded p-6 space-y-3">
              <h3 className="font-semibold text-black mb-4">Actions</h3>

              <Button
                onClick={handleSaveDraft}
                variant="outline"
                className="w-full border-[#E0E0E0] text-black hover:bg-black/5 font-medium transition-smooth"
              >
                Save as Draft
              </Button>

              <Button
                onClick={handleSchedule}
                variant="outline"
                className="w-full border-[#E0E0E0] text-black hover:bg-black/5 font-medium transition-smooth"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </Button>

              <Button
                onClick={handleSendNow}
                className="w-full bg-[#083E33] hover:bg-[#062d25] text-white font-medium transition-smooth"
                disabled={!subject || !contentHtml}
              >
                <Send className="h-4 w-4 mr-2" />
                Send Now
              </Button>

              {(!subject || !contentHtml) && (
                <p className="text-xs text-black/50 text-center">
                  Add subject and content to send
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
