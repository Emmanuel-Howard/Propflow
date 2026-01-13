export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'admin' | 'client'
export type ClientStatus = 'active' | 'inactive' | 'suspended'
export type ContactStatus = 'active' | 'unsubscribed' | 'bounced' | 'complained'
export type CampaignStatus = 'draft' | 'pending_approval' | 'approved' | 'scheduled' | 'sending' | 'sent' | 'failed' | 'cancelled'
export type SendLogStatus = 'queued' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'complained' | 'failed'
export type AudienceType = 'all' | 'list' | 'custom'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          clerk_id: string
          email: string
          first_name: string | null
          last_name: string | null
          role: UserRole
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          clerk_id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          role?: UserRole
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          clerk_id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          role?: UserRole
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          id: string
          user_id: string | null
          name: string
          email: string
          phone: string | null
          company_name: string | null
          company_address: string | null
          website: string | null
          logo_url: string | null
          primary_color: string
          secondary_color: string
          sending_domain: string | null
          reply_to_email: string | null
          from_name: string | null
          content_preferences: Json
          notification_preferences: Json
          timezone: string
          status: ClientStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          email: string
          phone?: string | null
          company_name?: string | null
          company_address?: string | null
          website?: string | null
          logo_url?: string | null
          primary_color?: string
          secondary_color?: string
          sending_domain?: string | null
          reply_to_email?: string | null
          from_name?: string | null
          content_preferences?: Json
          notification_preferences?: Json
          timezone?: string
          status?: ClientStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string
          email?: string
          phone?: string | null
          company_name?: string | null
          company_address?: string | null
          website?: string | null
          logo_url?: string | null
          primary_color?: string
          secondary_color?: string
          sending_domain?: string | null
          reply_to_email?: string | null
          from_name?: string | null
          content_preferences?: Json
          notification_preferences?: Json
          timezone?: string
          status?: ClientStatus
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      templates: {
        Row: {
          id: string
          client_id: string | null
          name: string
          description: string | null
          content_html: string
          preview_image_url: string | null
          category: string
          is_active: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id?: string | null
          name: string
          description?: string | null
          content_html: string
          preview_image_url?: string | null
          category?: string
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string | null
          name?: string
          description?: string | null
          content_html?: string
          preview_image_url?: string | null
          category?: string
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "templates_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          }
        ]
      }
      campaigns: {
        Row: {
          id: string
          client_id: string
          template_id: string | null
          subject: string
          preview_text: string | null
          content_html: string
          scheduled_at: string | null
          sent_at: string | null
          status: CampaignStatus
          approved_at: string | null
          approved_by: string | null
          rejection_reason: string | null
          created_by: string | null
          audience_type: AudienceType
          audience_list_id: string | null
          audience_contact_ids: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          template_id?: string | null
          subject: string
          preview_text?: string | null
          content_html: string
          scheduled_at?: string | null
          sent_at?: string | null
          status?: CampaignStatus
          approved_at?: string | null
          approved_by?: string | null
          rejection_reason?: string | null
          created_by?: string | null
          audience_type?: AudienceType
          audience_list_id?: string | null
          audience_contact_ids?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          template_id?: string | null
          subject?: string
          preview_text?: string | null
          content_html?: string
          scheduled_at?: string | null
          sent_at?: string | null
          status?: CampaignStatus
          approved_at?: string | null
          approved_by?: string | null
          rejection_reason?: string | null
          created_by?: string | null
          audience_type?: AudienceType
          audience_list_id?: string | null
          audience_contact_ids?: string[]
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          }
        ]
      }
      contacts: {
        Row: {
          id: string
          client_id: string
          email: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          tags: string[]
          custom_fields: Json
          status: ContactStatus
          unsubscribed_at: string | null
          source: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          tags?: string[]
          custom_fields?: Json
          status?: ContactStatus
          unsubscribed_at?: string | null
          source?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          tags?: string[]
          custom_fields?: Json
          status?: ContactStatus
          unsubscribed_at?: string | null
          source?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contacts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          }
        ]
      }
      send_logs: {
        Row: {
          id: string
          campaign_id: string
          contact_id: string
          resend_email_id: string | null
          status: SendLogStatus
          queued_at: string
          sent_at: string | null
          delivered_at: string | null
          opened_at: string | null
          clicked_at: string | null
          bounced_at: string | null
          failed_at: string | null
          open_count: number
          click_count: number
          clicked_links: Json
          error_message: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          campaign_id: string
          contact_id: string
          resend_email_id?: string | null
          status?: SendLogStatus
          queued_at?: string
          sent_at?: string | null
          delivered_at?: string | null
          opened_at?: string | null
          clicked_at?: string | null
          bounced_at?: string | null
          failed_at?: string | null
          open_count?: number
          click_count?: number
          clicked_links?: Json
          error_message?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string
          contact_id?: string
          resend_email_id?: string | null
          status?: SendLogStatus
          queued_at?: string
          sent_at?: string | null
          delivered_at?: string | null
          opened_at?: string | null
          clicked_at?: string | null
          bounced_at?: string | null
          failed_at?: string | null
          open_count?: number
          click_count?: number
          clicked_links?: Json
          error_message?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "send_logs_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "send_logs_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          }
        ]
      }
      campaign_analytics: {
        Row: {
          id: string
          campaign_id: string
          total_recipients: number
          total_sent: number
          total_delivered: number
          total_opened: number
          total_clicked: number
          total_bounced: number
          total_complained: number
          total_unsubscribed: number
          delivery_rate: number
          open_rate: number
          click_rate: number
          bounce_rate: number
          last_updated_at: string
        }
        Insert: {
          id?: string
          campaign_id: string
          total_recipients?: number
          total_sent?: number
          total_delivered?: number
          total_opened?: number
          total_clicked?: number
          total_bounced?: number
          total_complained?: number
          total_unsubscribed?: number
          delivery_rate?: number
          open_rate?: number
          click_rate?: number
          bounce_rate?: number
          last_updated_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string
          total_recipients?: number
          total_sent?: number
          total_delivered?: number
          total_opened?: number
          total_clicked?: number
          total_bounced?: number
          total_complained?: number
          total_unsubscribed?: number
          delivery_rate?: number
          open_rate?: number
          click_rate?: number
          bounce_rate?: number
          last_updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_analytics_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: true
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          }
        ]
      }
      monthly_analytics: {
        Row: {
          id: string
          client_id: string
          month: string
          campaigns_sent: number
          total_emails_sent: number
          total_opens: number
          total_clicks: number
          total_bounces: number
          total_unsubscribes: number
          new_contacts: number
          avg_open_rate: number
          avg_click_rate: number
          engagement_score: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          month: string
          campaigns_sent?: number
          total_emails_sent?: number
          total_opens?: number
          total_clicks?: number
          total_bounces?: number
          total_unsubscribes?: number
          new_contacts?: number
          avg_open_rate?: number
          avg_click_rate?: number
          engagement_score?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          month?: string
          campaigns_sent?: number
          total_emails_sent?: number
          total_opens?: number
          total_clicks?: number
          total_bounces?: number
          total_unsubscribes?: number
          new_contacts?: number
          avg_open_rate?: number
          avg_click_rate?: number
          engagement_score?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "monthly_analytics_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          }
        ]
      }
      activity_logs: {
        Row: {
          id: string
          client_id: string | null
          user_id: string | null
          action: string
          entity_type: string | null
          entity_id: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          client_id?: string | null
          user_id?: string | null
          action: string
          entity_type?: string | null
          entity_id?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          client_id?: string | null
          user_id?: string | null
          action?: string
          entity_type?: string | null
          entity_id?: string | null
          metadata?: Json
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      contact_lists: {
        Row: {
          id: string
          client_id: string
          name: string
          description: string | null
          filter_criteria: Json
          contact_count: number
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          name: string
          description?: string | null
          filter_criteria?: Json
          contact_count?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          name?: string
          description?: string | null
          filter_criteria?: Json
          contact_count?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_lists_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Convenience types
export type User = Database['public']['Tables']['users']['Row']
export type Client = Database['public']['Tables']['clients']['Row']
export type Template = Database['public']['Tables']['templates']['Row']
export type Campaign = Database['public']['Tables']['campaigns']['Row']
export type Contact = Database['public']['Tables']['contacts']['Row']
export type SendLog = Database['public']['Tables']['send_logs']['Row']
export type CampaignAnalytics = Database['public']['Tables']['campaign_analytics']['Row']
export type MonthlyAnalytics = Database['public']['Tables']['monthly_analytics']['Row']
export type ActivityLog = Database['public']['Tables']['activity_logs']['Row']

// Insert types
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type ClientInsert = Database['public']['Tables']['clients']['Insert']
export type TemplateInsert = Database['public']['Tables']['templates']['Insert']
export type CampaignInsert = Database['public']['Tables']['campaigns']['Insert']
export type ContactInsert = Database['public']['Tables']['contacts']['Insert']
export type SendLogInsert = Database['public']['Tables']['send_logs']['Insert']

// Update types
export type UserUpdate = Database['public']['Tables']['users']['Update']
export type ClientUpdate = Database['public']['Tables']['clients']['Update']
export type TemplateUpdate = Database['public']['Tables']['templates']['Update']
export type CampaignUpdate = Database['public']['Tables']['campaigns']['Update']
export type ContactUpdate = Database['public']['Tables']['contacts']['Update']

// Extended types with relations
export type UserWithClient = User & {
  clients: Client | null
}

export type CampaignWithAnalytics = Campaign & {
  campaign_analytics: CampaignAnalytics | null
}

export type CampaignWithClient = Campaign & {
  client: Client
}

// Contact List types (for future audience targeting feature)
export type ContactList = Database['public']['Tables']['contact_lists']['Row']
export type ContactListInsert = Database['public']['Tables']['contact_lists']['Insert']
export type ContactListUpdate = Database['public']['Tables']['contact_lists']['Update']
