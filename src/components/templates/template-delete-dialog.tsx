'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Loader2 } from 'lucide-react'
import type { Template } from '@/types/database'

interface TemplateDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  template: (Template & { usage_count?: number }) | null
  onConfirm: () => void
  isDeleting: boolean
}

export function TemplateDeleteDialog({
  open,
  onOpenChange,
  template,
  onConfirm,
  isDeleting,
}: TemplateDeleteDialogProps) {
  if (!template) return null

  const isInUse = (template.usage_count || 0) > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Delete Template
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{template.name}&quot;?
          </DialogDescription>
        </DialogHeader>

        {isInUse && (
          <div className="bg-amber-50 border border-amber-200 rounded p-3 text-sm text-amber-800">
            <p className="font-medium">Warning: Template in use</p>
            <p className="mt-1">
              This template is used by {template.usage_count} campaign
              {template.usage_count === 1 ? '' : 's'}. Deleting it will not
              affect existing campaigns, but it will no longer be available for
              new campaigns.
            </p>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Delete Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
