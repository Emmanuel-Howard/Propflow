'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { ArrowLeft, Eye, Code, Send, Calendar, Monitor, Smartphone, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface Client {
  id: string
  name: string
  email: string
}

export default function AdminNewCampaignPage() {
  const router = useRouter()

  const [clients, setClients] = useState<Client[]>([])
  const [selectedClientId, setSelectedClientId] = useState('')
  const [subject, setSubject] = useState('')
  const [previewText, setPreviewText] = useState('')
  const [contentHtml, setContentHtml] = useState('')
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop')
  const [saving, setSaving] = useState(false)
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false)
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('09:00')
  const [loadingClients, setLoadingClients] = useState(true)

  useEffect(() => {
    fetchClients()
  }, [])

  async function fetchClients() {
    try {
      const response = await fetch('/api/admin/clients')
      if (response.ok) {
        const data = await response.json()
        setClients(data)
      }
    } catch (error) {
      console.error('Error fetching clients:', error)
      toast.error('Failed to load clients')
    } finally {
      setLoadingClients(false)
    }
  }

  async function saveCampaign(status: 'draft' | 'approved' | 'scheduled', scheduledAt?: string) {
    if (!selectedClientId) {
      toast.error('Please select a client')
      return
    }

    if (!subject.trim()) {
      toast.error('Please enter a subject line')
      return
    }

    if (!contentHtml.trim()) {
      toast.error('Please add email content')
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: selectedClientId,
          subject: subject.trim(),
          preview_text: previewText.trim() || null,
          content_html: contentHtml,
          status,
          scheduled_at: scheduledAt || null,
        }),
      })

      if (response.ok) {
        const statusMessages = {
          draft: 'Campaign saved as draft',
          approved: 'Campaign created and approved',
          scheduled: 'Campaign scheduled successfully',
        }
        toast.success(statusMessages[status])
        router.push('/admin-campaigns')
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to save campaign')
      }
    } catch (error) {
      console.error('Error saving campaign:', error)
      toast.error('Failed to save campaign')
    } finally {
      setSaving(false)
    }
  }

  function handleSaveDraft() {
    saveCampaign('draft')
  }

  function handleSchedule() {
    if (!scheduledDate) {
      toast.error('Please select a date')
      return
    }

    const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`).toISOString()
    setScheduleDialogOpen(false)
    saveCampaign('scheduled', scheduledAt)
  }

  function handleApproveAndSave() {
    saveCampaign('approved')
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
          <Link href="/admin-campaigns">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Campaigns
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Editor */}
          <div className="space-y-6">
            {/* Client Selection */}
            <div className="border border-[#E0E0E0] rounded p-6 space-y-4">
              <h3 className="font-semibold text-black">Select Client</h3>

              <div className="space-y-2">
                <Label htmlFor="client" className="text-black font-medium">
                  Client Account
                </Label>
                {loadingClients ? (
                  <div className="flex items-center gap-2 text-black/50">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading clients...
                  </div>
                ) : (
                  <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                    <SelectTrigger className="bg-white border-[#E0E0E0]">
                      <SelectValue placeholder="Select a client..." />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <p className="text-xs text-black/50">
                  This campaign will be created for the selected client
                </p>
              </div>
            </div>

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
                disabled={saving || !selectedClientId}
              >
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Save as Draft
              </Button>

              <Button
                onClick={() => setScheduleDialogOpen(true)}
                variant="outline"
                className="w-full border-[#E0E0E0] text-black hover:bg-black/5 font-medium transition-smooth"
                disabled={!subject || !contentHtml || !selectedClientId}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </Button>

              <Button
                onClick={handleApproveAndSave}
                className="w-full bg-[#083E33] hover:bg-[#062d25] text-white font-medium transition-smooth"
                disabled={!subject || !contentHtml || saving || !selectedClientId}
              >
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                Approve & Save
              </Button>

              {(!subject || !contentHtml || !selectedClientId) && (
                <p className="text-xs text-black/50 text-center">
                  Select a client and add subject & content
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Dialog */}
      <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Campaign</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="schedule-date">Date</Label>
              <Input
                id="schedule-date"
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                min={format(new Date(), 'yyyy-MM-dd')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="schedule-time">Time</Label>
              <Input
                id="schedule-time"
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSchedule} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
