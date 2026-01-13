'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TemplateCard } from '@/components/templates/template-card'
import { TemplatePreviewDialog } from '@/components/templates/template-preview-dialog'
import { TemplateDeleteDialog } from '@/components/templates/template-delete-dialog'
import { Plus, Search, FileText, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import Link from 'next/link'
import type { Template } from '@/types/database'

type TemplateWithUsage = Template & { usage_count: number }

const categories = ['All', 'Newsletter', 'Listings', 'Promotional', 'Alert', 'Transactional']

export default function TemplatesPage() {
  const router = useRouter()

  const [templates, setTemplates] = useState<TemplateWithUsage[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  // Dialog states
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null)
  const [deleteTemplate, setDeleteTemplate] = useState<TemplateWithUsage | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchTemplates()
  }, [activeCategory])

  async function fetchTemplates() {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (activeCategory !== 'All') {
        params.set('category', activeCategory.toLowerCase())
      }

      const response = await fetch(`/api/admin/templates?${params}`)
      if (response.ok) {
        const data = await response.json()
        setTemplates(data)
      } else {
        toast.error('Failed to load templates')
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
      toast.error('Failed to load templates')
    } finally {
      setLoading(false)
    }
  }

  async function handleDuplicate(templateId: string) {
    try {
      const response = await fetch('/api/admin/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ duplicate_from: templateId }),
      })

      if (response.ok) {
        toast.success('Template duplicated')
        fetchTemplates()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to duplicate template')
      }
    } catch (error) {
      console.error('Error duplicating template:', error)
      toast.error('Failed to duplicate template')
    }
  }

  async function handleDelete() {
    if (!deleteTemplate) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/templates/${deleteTemplate.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Template deleted')
        setDeleteTemplate(null)
        fetchTemplates()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to delete template')
      }
    } catch (error) {
      console.error('Error deleting template:', error)
      toast.error('Failed to delete template')
    } finally {
      setIsDeleting(false)
    }
  }

  // Client-side search filter
  const filteredTemplates = templates.filter((template) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      template.name.toLowerCase().includes(query) ||
      (template.description?.toLowerCase().includes(query) ?? false)
    )
  })

  return (
    <div className="min-h-screen bg-white">
      <Header title="Templates" />

      <div className="px-6 py-6 space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-[#E0E0E0] text-black placeholder:text-black/40 focus:border-[#083E33] focus:ring-[#083E33]/20"
            />
          </div>
          <Button
            asChild
            className="bg-white border border-[#E0E0E0] text-black hover:bg-black/5 hover:shadow-sm font-medium"
          >
            <Link href="/templates/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Link>
          </Button>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded transition-all whitespace-nowrap',
                activeCategory === category
                  ? 'bg-black text-white'
                  : 'bg-[#FAFAFA] text-black/60 hover:text-black hover:bg-black/5'
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-black/30" />
          </div>
        ) : filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onPreview={(t) => setPreviewTemplate(t)}
                onEdit={(id) => router.push(`/templates/${id}`)}
                onDuplicate={handleDuplicate}
                onDelete={(t) => setDeleteTemplate(t)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-black/20 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-black">No templates found</h3>
            <p className="text-sm text-black/50 mt-1">
              {searchQuery
                ? 'Try adjusting your search criteria'
                : 'Create your first template to get started'}
            </p>
            {!searchQuery && (
              <Button asChild className="mt-4 bg-[#083E33] hover:bg-[#062d25] text-white">
                <Link href="/templates/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Preview Dialog */}
      <TemplatePreviewDialog
        open={!!previewTemplate}
        onOpenChange={(open) => !open && setPreviewTemplate(null)}
        template={previewTemplate}
      />

      {/* Delete Dialog */}
      <TemplateDeleteDialog
        open={!!deleteTemplate}
        onOpenChange={(open) => !open && setDeleteTemplate(null)}
        template={deleteTemplate}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  )
}
