export * from './database'

// API Response types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface PaginationParams {
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Dashboard metrics
export interface DashboardMetrics {
  openRate: number
  openRateChange: number
  clickRate: number
  clickRateChange: number
  engagementScore: number
  engagementScoreChange: number
  totalContacts: number
  contactsChange: number
}

export interface PerformanceDataPoint {
  date: string
  opens: number
  clicks: number
  sent: number
}

// Campaign form data
export interface CampaignFormData {
  subject: string
  previewText?: string
  contentHtml: string
  templateId?: string
  scheduledAt?: string
}

// Contact form data
export interface ContactFormData {
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  tags?: string[]
}

// Settings form data
export interface BrandSettingsData {
  primaryColor: string
  secondaryColor: string
  logoUrl?: string
}

export interface CompanyInfoData {
  companyName: string
  companyAddress: string
  website: string
  phone: string
  replyToEmail: string
  fromName: string
}

export interface PreferencesData {
  contentPreferences: {
    newsletters: boolean
    tips: boolean
    promotions: boolean
  }
  notificationPreferences: {
    email: boolean
    inApp: boolean
  }
  timezone: string
}

// CSV Upload result
export interface CSVUploadResult {
  added: number
  updated: number
  errors: number
  errorDetails?: string[]
}

// Navigation
export interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string | number
}
