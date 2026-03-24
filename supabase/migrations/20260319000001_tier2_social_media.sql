-- Tier 2: Social Media AI Marketing tables
-- Only for clients who upgrade to Social Starter / Social Pro / Social Auto
-- All tables use client_slug as the multi-tenant key (Rule 5)
-- All posts insert as status: 'draft' — never auto-publish (Rule 10)

-- 1. social_accounts — platform OAuth tokens
CREATE TABLE IF NOT EXISTS social_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_slug text NOT NULL,
  platform text NOT NULL CHECK (platform IN ('facebook', 'instagram', 'google_business')),
  access_token text NOT NULL,
  token_expires_at timestamptz,
  account_id text,
  account_name text,
  created_at timestamptz DEFAULT now()
);

-- 2. brand_voice — per-client AI generation config
CREATE TABLE IF NOT EXISTS brand_voice (
  client_slug text PRIMARY KEY,
  tone text DEFAULT 'friendly',
  post_frequency int DEFAULT 3,
  topics text[],
  hashtags text[],
  custom_instructions text,
  updated_at timestamptz DEFAULT now()
);

-- 3. social_posts — generated content with approval workflow
CREATE TABLE IF NOT EXISTS social_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_slug text NOT NULL,
  platform text NOT NULL,
  content_en text NOT NULL,
  content_es text,
  image_url text,
  status text DEFAULT 'draft'
    CHECK (status IN ('draft', 'approved', 'scheduled', 'sent', 'failed')),
  scheduled_for timestamptz,
  sent_at timestamptz,
  platform_post_id text,
  created_at timestamptz DEFAULT now()
);

-- 4. post_analytics — engagement metrics pulled back from platforms
CREATE TABLE IF NOT EXISTS post_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES social_posts(id),
  client_slug text NOT NULL,
  impressions int DEFAULT 0,
  reach int DEFAULT 0,
  engagement int DEFAULT 0,
  clicks int DEFAULT 0,
  pulled_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_social_accounts_slug ON social_accounts(client_slug);
CREATE INDEX idx_social_posts_slug ON social_posts(client_slug);
CREATE INDEX idx_social_posts_status ON social_posts(status);
CREATE INDEX idx_social_posts_scheduled ON social_posts(scheduled_for) WHERE status = 'approved';
CREATE INDEX idx_post_analytics_slug ON post_analytics(client_slug);
CREATE INDEX idx_post_analytics_post ON post_analytics(post_id);
