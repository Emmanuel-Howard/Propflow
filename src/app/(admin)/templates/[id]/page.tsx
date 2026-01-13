'use client'

import { useState, useCallback, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
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
import { ArrowLeft, Loader2, Save, Eye, Monitor, Smartphone } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { Template } from '@/types/database'

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

const categories = [
  { value: 'newsletter', label: 'Newsletter' },
  { value: 'listings', label: 'Listings' },
  { value: 'promotional', label: 'Promotional' },
  { value: 'alert', label: 'Alert' },
  { value: 'transactional', label: 'Transactional' },
]

interface EditTemplatePageProps {
  params: Promise<{ id: string }>
}

export default function EditTemplatePage({ params }: EditTemplatePageProps) {
  const { id } = use(params)
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [template, setTemplate] = useState<Template | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('newsletter')
  const [contentHtml, setContentHtml] = useState('')
  const [saving, setSaving] = useState(false)
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop')
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    fetchTemplate()
  }, [id])

  async function fetchTemplate() {
    try {
      const response = await fetch(`/api/admin/templates/${id}`)
      if (response.ok) {
        const data = await response.json()
        setTemplate(data)
        setName(data.name)
        setDescription(data.description || '')
        setCategory(data.category)
        setContentHtml(data.content_html)
      } else if (response.status === 404) {
        toast.error('Template not found')
        router.push('/templates')
      } else {
        toast.error('Failed to load template')
      }
    } catch (error) {
      console.error('Error fetching template:', error)
      toast.error('Failed to load template')
    } finally {
      setLoading(false)
    }
  }

  const handleContentChange = useCallback((html: string) => {
    setContentHtml(html)
  }, [])

  async function saveTemplate() {
    if (!name.trim()) {
      toast.error('Please enter a template name')
      return
    }

    if (!contentHtml.trim()) {
      toast.error('Please add template content')
      return
    }

    setSaving(true)
    try {
      const response = await fetch(`/api/admin/templates/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          content_html: contentHtml,
          category,
        }),
      })

      if (response.ok) {
        toast.success('Template updated')
        router.push('/templates')
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to update template')
      }
    } catch (error) {
      console.error('Error updating template:', error)
      toast.error('Failed to update template')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header title="Edit Template" />
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-black/30" />
        </div>
      </div>
    )
  }

  if (!template) {
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      <Header title="Edit Template" />

      <div className="px-6 py-6 space-y-6">
        {/* Back Button */}
        <Button
          asChild
          variant="ghost"
          className="text-black/50 hover:text-black hover:bg-black/5 -ml-2"
        >
          <Link href="/templates">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Templates
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Template Details */}
          <div className="lg:col-span-1 space-y-6">
            <div className="border border-[#E0E0E0] rounded p-6 space-y-4">
              <h3 className="font-semibold text-black">Template Details</h3>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-black font-medium">
                  Name *
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Monthly Newsletter"
                  className="bg-white border-[#E0E0E0] text-black placeholder:text-black/40 focus:border-[#083E33] focus:ring-[#083E33]/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-black font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of this template..."
                  className="bg-white border-[#E0E0E0] text-black placeholder:text-black/40 focus:border-[#083E33] focus:ring-[#083E33]/20 min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-black font-medium">
                  Category
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-white border-[#E0E0E0]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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

              <Button
                onClick={saveTemplate}
                className="w-full bg-[#083E33] hover:bg-[#062d25] text-white font-medium"
                disabled={saving || !name.trim() || !contentHtml.trim()}
              >
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Save Changes
              </Button>

              {!name.trim() && (
                <p className="text-xs text-black/50 text-center">
                  Enter a template name to save
                </p>
              )}
            </div>
          </div>

          {/* Right Column - Editor */}
          <div className="lg:col-span-3">
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
                        title="Template Preview"
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
            ) : (
              /* GrapesJS Editor */
              <div className="border border-[#E0E0E0] rounded overflow-hidden h-[700px]">
                <TemplateEditor
                  initialContent={template.content_html}
                  onChange={handleContentChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
