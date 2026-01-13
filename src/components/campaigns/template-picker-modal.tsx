'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, FileText, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Template } from '@/types/database'

const categoryColors: Record<string, string> = {
  newsletter: 'bg-blue-100 text-blue-700',
  listings: 'bg-green-100 text-green-700',
  promotional: 'bg-purple-100 text-purple-700',
  alert: 'bg-red-100 text-red-700',
  transactional: 'bg-amber-100 text-amber-700',
}

const categories = [
  { value: 'all', label: 'All Templates' },
  { value: 'newsletter', label: 'Newsletter' },
  { value: 'listings', label: 'Listings' },
  { value: 'promotional', label: 'Promotional' },
  { value: 'alert', label: 'Alert' },
  { value: 'transactional', label: 'Transactional' },
]

interface TemplatePickerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (template: Template) => void
}

export function TemplatePickerModal({
  open,
  onOpenChange,
  onSelect,
}: TemplatePickerModalProps) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    if (open) {
      fetchTemplates()
    }
  }, [open])

  async function fetchTemplates() {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/templates')
      if (response.ok) {
        const data = await response.json()
        setTemplates(data)
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === 'all' || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  function handleSelect(template: Template) {
    onSelect(template)
    onOpenChange(false)
    setSearchQuery('')
    setSelectedCategory('all')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Choose a Template</DialogTitle>
        </DialogHeader>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 py-4 border-b border-[#E0E0E0]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-[#E0E0E0]"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={cn(
                  'px-3 py-1.5 text-sm font-medium rounded whitespace-nowrap transition-all',
                  selectedCategory === category.value
                    ? 'bg-black text-white'
                    : 'bg-[#FAFAFA] text-black/60 hover:bg-black/5 hover:text-black'
                )}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Template Grid */}
        <div className="flex-1 overflow-y-auto py-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-black/40" />
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-black/40">
              <FileText className="h-12 w-12 mb-4 opacity-50" />
              <p>No templates found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => {
                const categoryColor =
                  categoryColors[template.category] || 'bg-gray-100 text-gray-700'
                return (
                  <button
                    key={template.id}
                    onClick={() => handleSelect(template)}
                    className="text-left border border-[#E0E0E0] rounded hover:border-[#083E33] hover:shadow-sm transition-all group"
                  >
                    {/* Preview */}
                    <div className="h-32 bg-[#FAFAFA] flex items-center justify-center overflow-hidden">
                      {template.content_html ? (
                        <div className="w-full h-full overflow-hidden">
                          <iframe
                            srcDoc={template.content_html}
                            title={template.name}
                            className="w-full h-full border-0 pointer-events-none scale-50 origin-top-left"
                            style={{ width: '200%', height: '200%' }}
                            sandbox=""
                          />
                        </div>
                      ) : (
                        <FileText className="h-10 w-10 text-black/20" />
                      )}
                    </div>
                    {/* Info */}
                    <div className="p-3">
                      <h4 className="font-medium text-black text-sm truncate group-hover:text-[#083E33]">
                        {template.name}
                      </h4>
                      <div className="flex items-center justify-between mt-2">
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded capitalize ${categoryColor}`}
                        >
                          {template.category}
                        </span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#E0E0E0] flex justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-[#E0E0E0]"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
