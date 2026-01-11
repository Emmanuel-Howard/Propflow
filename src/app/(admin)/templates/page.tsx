'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Copy,
  Pencil,
  Trash2,
  FileText,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Placeholder data - will be fetched from database
const templates = [
  {
    id: '1',
    name: 'Monthly Market Update',
    description: 'Standard monthly newsletter with market trends and insights',
    category: 'Newsletter',
    lastModified: 'Jan 18, 2024',
    usageCount: 24,
  },
  {
    id: '2',
    name: 'Property Showcase',
    description: 'Feature new listings with images and details',
    category: 'Listings',
    lastModified: 'Jan 15, 2024',
    usageCount: 18,
  },
  {
    id: '3',
    name: 'Holiday Greetings',
    description: 'Seasonal greeting template for major holidays',
    category: 'Promotional',
    lastModified: 'Dec 20, 2023',
    usageCount: 12,
  },
  {
    id: '4',
    name: 'Mortgage Rate Alert',
    description: 'Quick update template for rate changes',
    category: 'Alert',
    lastModified: 'Jan 10, 2024',
    usageCount: 8,
  },
  {
    id: '5',
    name: 'Welcome Email',
    description: 'Onboarding email for new subscribers',
    category: 'Transactional',
    lastModified: 'Jan 5, 2024',
    usageCount: 32,
  },
]

const categories = ['All', 'Newsletter', 'Listings', 'Promotional', 'Alert', 'Transactional']

const categoryColors: Record<string, string> = {
  Newsletter: 'text-blue-600 bg-blue-50',
  Listings: 'text-purple-600 bg-purple-50',
  Promotional: 'text-amber-600 bg-amber-50',
  Alert: 'text-red-600 bg-red-50',
  Transactional: 'text-green-600 bg-green-50',
}

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === 'All' || template.category === activeCategory
    return matchesSearch && matchesCategory
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
          <Button className="bg-white border border-[#E0E0E0] text-black hover:bg-black/5 hover:shadow-sm font-medium transition-smooth">
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded transition-smooth whitespace-nowrap',
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="border border-[#E0E0E0] rounded hover:border-black/20 transition-smooth group"
            >
              {/* Preview Area */}
              <div className="h-40 bg-[#FAFAFA] flex items-center justify-center border-b border-[#E0E0E0]">
                <div className="text-center">
                  <FileText className="h-10 w-10 text-black/20 mx-auto mb-2" />
                  <p className="text-xs text-black/40">Preview</p>
                </div>
              </div>

              {/* Template Info */}
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-black truncate">
                      {template.name}
                    </h3>
                    <p className="text-sm text-black/50 mt-1 line-clamp-2">
                      {template.description}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-black/40 hover:text-black hover:bg-black/5 opacity-0 group-hover:opacity-100 transition-smooth"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-white border-[#E0E0E0]"
                    >
                      <DropdownMenuItem className="cursor-pointer">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-[#E0E0E0]" />
                      <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#E0E0E0]">
                  <span
                    className={cn(
                      'text-xs font-medium px-2 py-1 rounded',
                      categoryColors[template.category]
                    )}
                  >
                    {template.category}
                  </span>
                  <div className="text-xs text-black/40">
                    Used {template.usageCount} times
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-black/20 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-black">No templates found</h3>
            <p className="text-sm text-black/50 mt-1">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
