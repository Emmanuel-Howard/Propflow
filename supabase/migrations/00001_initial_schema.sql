-- Propflow Database Schema
-- Email Marketing SaaS for Real Estate Professionals

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- Synced from Clerk via webhook
-- ============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clerk_id TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'client')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- CLIENTS TABLE
-- Represents a client organization/account
-- ============================================
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company_name TEXT,
    company_address TEXT,
    website TEXT,

    -- Branding
    logo_url TEXT,
    primary_color TEXT DEFAULT '#1e3a5f',
    secondary_color TEXT DEFAULT '#d4af37',

    -- Email configuration
    sending_domain TEXT,
    reply_to_email TEXT,
    from_name TEXT,

    -- Preferences
    content_preferences JSONB DEFAULT '{"newsletters": true, "tips": true, "promotions": false}',
    notification_preferences JSONB DEFAULT '{"email": true, "in_app": true}',
    timezone TEXT DEFAULT 'America/New_York',

    -- Status
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_clients_user_id ON clients(user_id);
CREATE INDEX idx_clients_status ON clients(status);

-- ============================================
-- TEMPLATES TABLE
-- Email templates managed by admin
-- ============================================
CREATE TABLE templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    content_html TEXT NOT NULL,
    preview_image_url TEXT,
    category TEXT DEFAULT 'general',
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_templates_client_id ON templates(client_id);
CREATE INDEX idx_templates_category ON templates(category);

-- ============================================
-- CAMPAIGNS TABLE
-- ============================================
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    template_id UUID REFERENCES templates(id) ON DELETE SET NULL,

    -- Content
    subject TEXT NOT NULL,
    preview_text TEXT,
    content_html TEXT NOT NULL,

    -- Scheduling
    scheduled_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,

    -- Status workflow
    status TEXT NOT NULL DEFAULT 'draft' CHECK (
        status IN ('draft', 'pending_approval', 'approved', 'scheduled', 'sending', 'sent', 'failed', 'cancelled')
    ),

    -- Approval workflow
    approved_at TIMESTAMPTZ,
    approved_by UUID REFERENCES users(id),
    rejection_reason TEXT,

    -- Metadata
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_campaigns_client_id ON campaigns(client_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_scheduled_at ON campaigns(scheduled_at);
CREATE INDEX idx_campaigns_sent_at ON campaigns(sent_at);

-- ============================================
-- CONTACTS TABLE
-- ============================================
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,

    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,

    -- Segmentation
    tags TEXT[] DEFAULT '{}',
    custom_fields JSONB DEFAULT '{}',

    -- Status
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced', 'complained')),
    unsubscribed_at TIMESTAMPTZ,

    -- Source tracking
    source TEXT DEFAULT 'manual',

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(client_id, email)
);

CREATE INDEX idx_contacts_client_id ON contacts(client_id);
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_status ON contacts(status);

-- ============================================
-- SEND LOGS TABLE
-- Individual email delivery tracking
-- ============================================
CREATE TABLE send_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,

    -- Resend tracking
    resend_email_id TEXT,

    -- Delivery status
    status TEXT DEFAULT 'queued' CHECK (
        status IN ('queued', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'complained', 'failed')
    ),

    -- Timestamps
    queued_at TIMESTAMPTZ DEFAULT NOW(),
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    opened_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    bounced_at TIMESTAMPTZ,
    failed_at TIMESTAMPTZ,

    -- Additional data
    open_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    clicked_links JSONB DEFAULT '[]',
    error_message TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_send_logs_campaign_id ON send_logs(campaign_id);
CREATE INDEX idx_send_logs_contact_id ON send_logs(contact_id);
CREATE INDEX idx_send_logs_status ON send_logs(status);
CREATE INDEX idx_send_logs_resend_id ON send_logs(resend_email_id);

-- ============================================
-- CAMPAIGN ANALYTICS (Aggregated Stats)
-- ============================================
CREATE TABLE campaign_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID UNIQUE NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,

    total_recipients INTEGER DEFAULT 0,
    total_sent INTEGER DEFAULT 0,
    total_delivered INTEGER DEFAULT 0,
    total_opened INTEGER DEFAULT 0,
    total_clicked INTEGER DEFAULT 0,
    total_bounced INTEGER DEFAULT 0,
    total_complained INTEGER DEFAULT 0,
    total_unsubscribed INTEGER DEFAULT 0,

    -- Calculated rates
    delivery_rate DECIMAL(5,2) DEFAULT 0,
    open_rate DECIMAL(5,2) DEFAULT 0,
    click_rate DECIMAL(5,2) DEFAULT 0,
    bounce_rate DECIMAL(5,2) DEFAULT 0,

    last_updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_campaign_analytics_campaign_id ON campaign_analytics(campaign_id);

-- ============================================
-- MONTHLY ANALYTICS (For trends)
-- ============================================
CREATE TABLE monthly_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    month DATE NOT NULL,

    campaigns_sent INTEGER DEFAULT 0,
    total_emails_sent INTEGER DEFAULT 0,
    total_opens INTEGER DEFAULT 0,
    total_clicks INTEGER DEFAULT 0,
    total_bounces INTEGER DEFAULT 0,
    total_unsubscribes INTEGER DEFAULT 0,
    new_contacts INTEGER DEFAULT 0,

    avg_open_rate DECIMAL(5,2) DEFAULT 0,
    avg_click_rate DECIMAL(5,2) DEFAULT 0,
    engagement_score DECIMAL(5,2) DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(client_id, month)
);

CREATE INDEX idx_monthly_analytics_client_id ON monthly_analytics(client_id);
CREATE INDEX idx_monthly_analytics_month ON monthly_analytics(month);

-- ============================================
-- ACTIVITY LOG (Audit Trail)
-- ============================================
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,

    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id UUID,
    metadata JSONB DEFAULT '{}',

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activity_logs_client_id ON activity_logs(client_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

-- ============================================
-- TRIGGER: Update timestamps
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_send_logs_updated_at BEFORE UPDATE ON send_logs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- HELPER FUNCTIONS FOR ANALYTICS
-- ============================================

-- Increment metric function
CREATE OR REPLACE FUNCTION increment_campaign_metric(
    p_campaign_id UUID,
    p_column TEXT
)
RETURNS VOID AS $$
BEGIN
    EXECUTE format(
        'UPDATE campaign_analytics SET %I = %I + 1, last_updated_at = NOW() WHERE campaign_id = $1',
        p_column, p_column
    ) USING p_campaign_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recalculate rates function
CREATE OR REPLACE FUNCTION recalculate_campaign_rates(p_campaign_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE campaign_analytics
    SET
        delivery_rate = CASE WHEN total_sent > 0 THEN (total_delivered::DECIMAL / total_sent) * 100 ELSE 0 END,
        open_rate = CASE WHEN total_delivered > 0 THEN (total_opened::DECIMAL / total_delivered) * 100 ELSE 0 END,
        click_rate = CASE WHEN total_opened > 0 THEN (total_clicked::DECIMAL / total_opened) * 100 ELSE 0 END,
        bounce_rate = CASE WHEN total_sent > 0 THEN (total_bounced::DECIMAL / total_sent) * 100 ELSE 0 END,
        last_updated_at = NOW()
    WHERE campaign_id = p_campaign_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
