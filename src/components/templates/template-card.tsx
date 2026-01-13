'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { FileText, MoreHorizontal, Eye, Pencil, Copy, Trash2 } from 'lucide-react'
import type { Template } from '@/types/database'

const categoryColors: Record<string, string> = {
  newsletter: 'bg-blue-100 text-blue-700',
  listings: 'bg-green-100 text-green-700',
  promotional: 'bg-purple-100 text-purple-700',
  alert: 'bg-red-100 text-red-700',
  transactional: 'bg-amber-100 text-amber-700',
}

interface TemplateCardProps {
  template: Template & { usage_count: number }
  onPreview: (template: Template) => void
  onEdit: (templateId: string) => void
  onDuplicate: (templateId: string) => void
  onDelete: (template: Template & { usage_count: number }) => void
}

export function TemplateCard({
  template,
  onPreview,
  onEdit,
  onDuplicate,
  onDelete,
}: TemplateCardProps) {
  const categoryColor = categoryColors[template.category] || 'bg-gray-100 text-gray-700'

  return (
    <div className="border border-[#E0E0E0] rounded hover:border-black/20 transition-all duration-200 group bg-white">
      {/* Preview Area */}
      <div className="h-40 bg-[#FAFAFA] flex items-center justify-center overflow-hidden relative">
        {template.preview_image_url ? (
          <img
            src={template.preview_image_url}
            alt={template.name}
            className="w-full h-full object-cover"
          />
        ) : template.content_html ? (
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
          <FileText className="h-12 w-12 text-black/20" />
        )}
      </div>

      {/* Info Section */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-black truncate">{template.name}</h3>
            {template.description && (
              <p className="text-sm text-black/50 mt-1 line-clamp-2">
                {template.description}
              </p>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white border-[#E0E0E0]">
              <DropdownMenuItem onClick={() => onPreview(template)}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(template.id)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate(template.id)}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#E0E0E0]" />
              <DropdownMenuItem
                onClick={() => onDelete(template)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#E0E0E0]">
          <span
            className={`text-xs font-medium px-2 py-1 rounded capitalize ${categoryColor}`}
          >
            {template.category}
          </span>
          <span className="text-xs text-black/40">
            Used {template.usage_count} time{template.usage_count === 1 ? '' : 's'}
          </span>
        </div>
      </div>
    </div>
  )
}
