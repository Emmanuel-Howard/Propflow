'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Monitor, Smartphone } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Template } from '@/types/database'

interface TemplatePreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  template: Template | null
}

export function TemplatePreviewDialog({
  open,
  onOpenChange,
  template,
}: TemplatePreviewDialogProps) {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop')

  if (!template) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle>{template.name}</DialogTitle>
            <div className="flex items-center gap-1 bg-[#FAFAFA] rounded p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDevice('desktop')}
                className={cn(
                  'h-8 px-3',
                  device === 'desktop' && 'bg-white shadow-sm'
                )}
              >
                <Monitor className="h-4 w-4 mr-2" />
                Desktop
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDevice('mobile')}
                className={cn(
                  'h-8 px-3',
                  device === 'mobile' && 'bg-white shadow-sm'
                )}
              >
                <Smartphone className="h-4 w-4 mr-2" />
                Mobile
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 bg-[#F5F5F5] rounded overflow-hidden flex items-center justify-center p-4">
          <div
            className={cn(
              'bg-white shadow-lg transition-all duration-300 h-full overflow-auto',
              device === 'desktop' ? 'w-full max-w-[700px]' : 'w-[375px]'
            )}
          >
            <iframe
              srcDoc={template.content_html}
              title="Template preview"
              className="w-full h-full border-0"
              sandbox="allow-same-origin"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
