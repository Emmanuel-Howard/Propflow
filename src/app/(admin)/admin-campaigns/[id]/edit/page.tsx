'use client'

import { useState, useCallback, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { ArrowLeft, Loader2, Save, Eye, Monitor, Smartphone, Calendar, FileText, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { AudienceSelector } from '@/components/campaigns/audience-selector'
import { TemplatePickerModal } from '@/components/campaigns/template-picker-modal'
import type { Campaign, Template, AudienceType } from '@/types/database'

// Dynamic import to avoid SSR issues with GrapesJS
const TemplateEditor = dynamic(
  () => import('@/components/templates/template-editor').then(mod => mod.TemplateEditor),
  {
    ssr: false,
    loading: () => (
      <div className="h-full flex items-center justify-center bg-[#FAFAFA]">
        <Loader2 className="h-8 w-8 animate-spin text-black/30" />
      </div>
    ),
  }
)

interface Client {
  id: string
  name: string
  email: string
}

interface EditCampaignPageProps {
  params: Promise<{ id: string }>
}

export default function EditCampaignPage({ params }: EditCampaignPageProps) {
  const { id } = use(params)
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [selectedClientId, setSelectedClientId] = useState('')
  const [subject, setSubject] = useState('')
  const [previewText, setPreviewText] = useState('')
  const [contentHtml, setContentHtml] = useState('')
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop')
  const [showPreview, setShowPreview] = useState(false)
  const [saving, setSaving] = useState(false)
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false)
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('09:00')
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [editorKey, setEditorKey] = useState(0)

  const [audience, setAudience] = useState<{
    type: AudienceType
    listId?: string
    contactIds: string[]
  }>({
    type: 'all',
    contactIds: [],
  })

  useEffect(() => {
    fetchCampaign()
    fetchClients()
  }, [id])

  async function fetchCampaign() {
    try {
      const response = await fetch(`/api/campaigns/${id}`)
      if (response.ok) {
        const data = await response.json()
        setCampaign(data)
        setSelectedClientId(data.client_id)
        setSubject(data.subject)
        setPreviewText(data.preview_text || '')
        setContentHtml(data.content_html)
        setAudience({
          type: data.audience_type || 'all',
          listId: data.audience_list_id || undefined,
          contactIds: data.audience_contact_ids || [],
        })
        if (data.scheduled_at) {
          const date = new Date(data.scheduled_at)
          setScheduledDate(format(date, 'yyyy-MM-dd'))
          setScheduledTime(format(date, 'HH:mm'))
        }
      } else if (response.status === 404) {
        toast.error('Campaign not found')
        router.push('/admin-campaigns')
      } else {
        toast.error('Failed to load campaign')
      }
    } catch (error) {
      console.error('Error fetching campaign:', error)
      toast.error('Failed to load campaign')
    } finally {
      setLoading(false)
    }
  }

  async function fetchClients() {
    try {
      const response = await fetch('/api/admin/clients')
      if (response.ok) {
        const data = await response.json()
        setClients(data)
      }
    } catch (error) {
      console.error('Error fetching clients:', error)
    }
  }

  const handleContentChange = useCallback((html: string) => {
    setContentHtml(html)
  }, [])

  function handleTemplateSelect(template: Template) {
    setSelectedTemplate(template)
    setContentHtml(template.content_html)
    setEditorKey(prev => prev + 1)
    toast.success(`Loaded template: ${template.name}`)
  }

  async function saveCampaign(status?: string, scheduledAt?: string) {
    if (!subject.trim()) {
      toast.error('Please enter a subject line')
      return
    }

    if (!contentHtml.trim()) {
      toast.error('Please add email content')
      return
    }

    if (audience.type === 'custom' && audience.contactIds.length === 0) {
      toast.error('Please select at least one contact')
      return
    }

    setSaving(true)
    try {
      const updateData: Record<string, unknown> = {
        subject: subject.trim(),
        preview_text: previewText.trim() || null,
        content_html: contentHtml,
        template_id: selectedTemplate?.id || campaign?.template_id || null,
        audience_type: audience.type,
        audience_list_id: audience.listId || null,
        audience_contact_ids: audience.contactIds,
      }

      if (status) {
        updateData.status = status
      }
      if (scheduledAt) {
        updateData.scheduled_at = scheduledAt
      }

      const response = await fetch(`/api/campaigns/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      })

      if (response.ok) {
        toast.success('Campaign updated')
        router.push('/admin-campaigns')
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to update campaign')
      }
    } catch (error) {
      console.error('Error updating campaign:', error)
      toast.error('Failed to update campaign')
    } finally {
      setSaving(false)
    }
  }

  function handleSave() {
    saveCampaign()
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

  function handleApprove() {
    saveCampaign('approved')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header title="Edit Campaign" />
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-black/30" />
        </div>
      </div>
    )
  }

  if (!campaign) {
    return null
  }

  const isFormValid = subject.trim() && contentHtml.trim()
  const canEdit = !['sent', 'sending'].includes(campaign.status)

  return (
    <div className="min-h-screen bg-white">
      <Header title="Edit Campaign" />

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

        {!canEdit && (
          <div className="bg-amber-50 border border-amber-200 rounded p-4 text-amber-800">
            This campaign has been sent and cannot be edited.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Campaign Settings */}
          <div className="lg:col-span-1 space-y-6">
            {/* Client (read-only) */}
            <div className="border border-[#E0E0E0] rounded p-6 space-y-4">
              <h3 className="font-semibold text-black">Client</h3>
              <p className="text-black/70">
                {clients.find(c => c.id === selectedClientId)?.name || 'Loading...'}
              </p>
            </div>

            {/* Campaign Details */}
            <div className="border border-[#E0E0E0] rounded p-6 space-y-4">
              <h3 className="font-semibold text-black">Campaign Details</h3>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-black font-medium">
                  Subject Line *
                </Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter your email subject..."
                  disabled={!canEdit}
                  className="bg-white border-[#E0E0E0] text-black placeholder:text-black/40 focus:border-[#083E33] focus:ring-[#083E33]/20 disabled:opacity-50"
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
                  disabled={!canEdit}
                  className="bg-white border-[#E0E0E0] text-black placeholder:text-black/40 focus:border-[#083E33] focus:ring-[#083E33]/20 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Audience Selection */}
            <div className="border border-[#E0E0E0] rounded p-6 space-y-4">
              <h3 className="font-semibold text-black">Audience</h3>
              {canEdit ? (
                <AudienceSelector
                  clientId={selectedClientId}
                  value={audience}
                  onChange={setAudience}
                />
              ) : (
                <p className="text-black/70">
                  {audience.type === 'all' && 'Everyone'}
                  {audience.type === 'custom' && `${audience.contactIds.length} contacts selected`}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="border border-[#E0E0E0] rounded p-6 space-y-3">
              <h3 className="font-semibold text-black mb-4">Actions</h3>

              <Button
                onClick={() => setShowPreview(!showPreview)}
                variant="outline"
                className="w-full border-[#E0E0E0] text-black hover:bg-black/5 font-medium"
              >
                <Eye className="h-4 w-4 mr-2" />
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </Button>

              {canEdit && (
                <>
                  <Button
                    onClick={handleSave}
                    variant="outline"
                    className="w-full border-[#E0E0E0] text-black hover:bg-black/5 font-medium"
                    disabled={saving || !isFormValid}
                  >
                    {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Changes
                  </Button>

                  <Button
                    onClick={() => setScheduleDialogOpen(true)}
                    variant="outline"
                    className="w-full border-[#E0E0E0] text-black hover:bg-black/5 font-medium"
                    disabled={!isFormValid}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule
                  </Button>

                  <Button
                    onClick={handleApprove}
                    className="w-full bg-[#083E33] hover:bg-[#062d25] text-white font-medium"
                    disabled={!isFormValid || saving}
                  >
                    {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Approve & Save
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Right Column - Editor */}
          <div className="lg:col-span-3 space-y-4">
            {/* Template Selection Buttons */}
            {canEdit && (
              <div className="flex gap-3">
                <Button
                  onClick={() => setTemplatePickerOpen(true)}
                  variant="outline"
                  className="border-[#E0E0E0] text-black hover:bg-black/5"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Load Different Template
                </Button>
              </div>
            )}

            {showPreview ? (
              /* Preview Panel */
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
                        'p-2 rounded transition-all',
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
                        'p-2 rounded transition-all',
                        previewMode === 'mobile'
                          ? 'bg-black text-white'
                          : 'text-black/40 hover:text-black hover:bg-black/5'
                      )}
                    >
                      <Smartphone className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-[#F5F5F5] min-h-[600px] flex items-start justify-center">
                  <div
                    className={cn(
                      'bg-white rounded shadow-sm overflow-hidden transition-all',
                      previewMode === 'desktop' ? 'w-full max-w-[700px]' : 'w-[375px]'
                    )}
                  >
                    {contentHtml ? (
                      <iframe
                        srcDoc={contentHtml}
                        className="w-full h-[560px] border-0"
                        title="Email Preview"
                        sandbox="allow-same-origin"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-[560px] text-black/30">
                        <div className="text-center">
                          <Eye className="h-10 w-10 mx-auto mb-2 opacity-50" />
                          <p>Add content to see preview</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : canEdit ? (
              /* GrapesJS Editor */
              <div className="border border-[#E0E0E0] rounded overflow-hidden h-[700px]">
                <TemplateEditor
                  key={editorKey}
                  initialContent={campaign.content_html}
                  onChange={handleContentChange}
                />
              </div>
            ) : (
              /* Read-only view for sent campaigns */
              <div className="border border-[#E0E0E0] rounded overflow-hidden">
                <div className="p-4 bg-[#F5F5F5] min-h-[600px] flex items-start justify-center">
                  <div className="bg-white rounded shadow-sm overflow-hidden w-full max-w-[700px]">
                    <iframe
                      srcDoc={contentHtml}
                      className="w-full h-[560px] border-0"
                      title="Email Content"
                      sandbox="allow-same-origin"
                    />
                  </div>
                </div>
              </div>
            )}
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

      {/* Template Picker Modal */}
      <TemplatePickerModal
        open={templatePickerOpen}
        onOpenChange={setTemplatePickerOpen}
        onSelect={handleTemplateSelect}
      />
    </div>
  )
}
