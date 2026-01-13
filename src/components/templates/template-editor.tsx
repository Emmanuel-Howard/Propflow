'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import type { Editor } from 'grapesjs'

interface TemplateEditorProps {
  initialContent?: string
  onChange?: (html: string) => void
  onReady?: (editor: Editor) => void
}

export function TemplateEditor({ initialContent, onChange, onReady }: TemplateEditorProps) {
  const editorRef = useRef<Editor | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const initializedRef = useRef(false)
  const [isLoading, setIsLoading] = useState(true)

  const initEditor = useCallback(async () => {
    if (initializedRef.current || !containerRef.current) return
    initializedRef.current = true

    try {
      // Dynamic imports for GrapesJS (client-side only)
      const grapesjs = (await import('grapesjs')).default
      // @ts-expect-error - CSS import doesn't have type declarations
      await import('grapesjs/dist/css/grapes.min.css')
      const newsletterPreset = (await import('grapesjs-preset-newsletter')).default

      const editor = grapesjs.init({
        container: containerRef.current,
        height: '100%',
        width: 'auto',
        fromElement: false,
        plugins: [newsletterPreset],
        pluginsOpts: {
          [newsletterPreset as unknown as string]: {
            modalTitleImport: 'Import template',
            modalTitleExport: 'Export template',
            importPlaceholder: '<table class="main-body">...</table>',
            cellStyle: {
              'font-size': '14px',
              'font-family': 'Inter, Arial, sans-serif',
            },
          },
        },
        storageManager: false,
        deviceManager: {
          devices: [
            { name: 'Desktop', width: '' },
            { name: 'Tablet', width: '768px' },
            { name: 'Mobile', width: '375px' },
          ],
        },
        canvas: {
          styles: [
            'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap',
          ],
        },
        // Keep default panels from newsletter preset
        assetManager: {
          embedAsBase64: true,
          upload: false,
        },
      })

      // Set initial content if provided
      if (initialContent) {
        editor.setComponents(initialContent)
      }

      // Listen for changes
      editor.on('update', () => {
        const html = editor.getHtml()
        const css = editor.getCss()
        const fullHtml = css ? `<style>${css}</style>${html}` : html
        onChange?.(fullHtml)
      })

      // Also trigger on component changes
      editor.on('component:add', () => {
        const html = editor.getHtml()
        const css = editor.getCss()
        const fullHtml = css ? `<style>${css}</style>${html}` : html
        onChange?.(fullHtml)
      })

      editor.on('component:remove', () => {
        const html = editor.getHtml()
        const css = editor.getCss()
        const fullHtml = css ? `<style>${css}</style>${html}` : html
        onChange?.(fullHtml)
      })

      editorRef.current = editor
      setIsLoading(false)
      onReady?.(editor)
    } catch (error) {
      console.error('Failed to initialize GrapesJS:', error)
      setIsLoading(false)
    }
  }, [initialContent, onChange, onReady])

  useEffect(() => {
    initEditor()

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy()
        editorRef.current = null
        initializedRef.current = false
      }
    }
  }, [initEditor])

  return (
    <div className="template-editor h-full relative">
      <style jsx global>{`
        /* GrapesJS base styling */
        .template-editor .gjs-one-bg {
          background-color: #FAFAFA;
        }
        .template-editor .gjs-two-color {
          color: #000000;
        }
        .template-editor .gjs-three-bg {
          background-color: #083E33;
        }
        .template-editor .gjs-four-color,
        .template-editor .gjs-four-color-h:hover {
          color: #083E33;
        }

        /* Panels */
        .template-editor .gjs-pn-panels {
          background-color: #FAFAFA;
        }
        .template-editor .gjs-pn-views-container {
          background-color: #FFFFFF;
          border-left: 1px solid #E0E0E0;
          padding: 0;
        }
        .template-editor .gjs-pn-views {
          border-bottom: 1px solid #E0E0E0;
        }

        /* Blocks */
        .template-editor .gjs-blocks-c {
          padding: 8px;
        }
        .template-editor .gjs-block {
          border-radius: 6px;
          border: 1px solid #E0E0E0;
          background-color: #FFFFFF;
          padding: 8px;
          margin: 4px;
          min-height: 60px;
          transition: all 0.15s ease;
        }
        .template-editor .gjs-block:hover {
          border-color: #083E33;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .template-editor .gjs-block-label {
          font-size: 11px;
          color: #666;
        }

        /* Buttons */
        .template-editor .gjs-btn-prim {
          background-color: #083E33;
          border-radius: 4px;
          color: white;
        }
        .template-editor .gjs-btn-prim:hover {
          background-color: #062d25;
        }

        /* Canvas */
        .template-editor .gjs-frame-wrapper {
          background-color: #F5F5F5;
        }
        .template-editor .gjs-cv-canvas {
          background-color: #F5F5F5;
          top: 0;
          width: 100%;
          height: 100%;
        }

        /* Panel buttons */
        .template-editor .gjs-pn-btn {
          border-radius: 4px;
          margin: 2px;
        }
        .template-editor .gjs-pn-btn.gjs-pn-active {
          background-color: #083E33;
          color: white;
        }

        /* Style manager */
        .template-editor .gjs-sm-sector-title {
          background-color: #FAFAFA;
          border-bottom: 1px solid #E0E0E0;
          padding: 8px 12px;
          font-weight: 500;
        }
        .template-editor .gjs-sm-properties {
          padding: 8px;
        }

        /* Layers */
        .template-editor .gjs-clm-tags {
          background-color: #FAFAFA;
          padding: 8px;
        }

        /* Fields */
        .template-editor .gjs-field {
          background-color: white;
          border: 1px solid #E0E0E0;
          border-radius: 4px;
        }
        .template-editor .gjs-field:focus-within {
          border-color: #083E33;
        }

        /* Toolbar */
        .template-editor .gjs-toolbar {
          background-color: #083E33;
          border-radius: 4px;
        }
        .template-editor .gjs-toolbar-item {
          color: white;
        }

        /* Selected component highlight */
        .template-editor .gjs-selected {
          outline: 2px solid #083E33 !important;
        }

        /* Modal */
        .template-editor .gjs-mdl-dialog {
          border-radius: 8px;
        }
        .template-editor .gjs-mdl-header {
          background-color: #FAFAFA;
          border-bottom: 1px solid #E0E0E0;
        }
      `}</style>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#FAFAFA] z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 border-2 border-[#083E33] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-black/50">Loading editor...</p>
          </div>
        </div>
      )}

      <div ref={containerRef} className="h-full" />
    </div>
  )
}
