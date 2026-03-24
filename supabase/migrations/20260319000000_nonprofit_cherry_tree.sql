-- CherryTree Foundation — nonprofit_cherry_tree schema
-- 10 tables: data_subjects, donations, members, programs, participation,
--            impressions, email_campaigns, grants, audit_log, config
-- DPA-compliant: audit_log is INSERT-ONLY, data_subjects is soft-delete only

CREATE SCHEMA IF NOT EXISTS nonprofit_cherry_tree;

-- 1. data_subjects (CRM spine — DPA-compliant, soft-delete only)
CREATE TABLE nonprofit_cherry_tree.data_subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text,
  language_preference text DEFAULT 'en' CHECK (language_preference IN ('en', 'es')),
  consent_given boolean NOT NULL DEFAULT false,
  consent_date timestamptz,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'deleted')),
  deletion_completed_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. donations (financial records)
CREATE TABLE nonprofit_cherry_tree.donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_email text NOT NULL,
  donor_name text,
  amount_cents int NOT NULL CHECK (amount_cents >= 100),
  type text DEFAULT 'one_time' CHECK (type IN ('one_time', 'monthly')),
  stripe_payment_intent_id text,
  stripe_charge_id text,
  campaign_name text DEFAULT 'General Fund',
  message text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at timestamptz DEFAULT now()
);

-- 3. members (recurring donors)
CREATE TABLE nonprofit_cherry_tree.members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id uuid REFERENCES nonprofit_cherry_tree.data_subjects(id),
  membership_tier text DEFAULT 'supporter' CHECK (membership_tier IN ('supporter', 'advocate', 'champion')),
  stripe_customer_id text,
  stripe_subscription_id text,
  monthly_amount_cents int,
  status text DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled')),
  started_at timestamptz DEFAULT now(),
  cancelled_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- 4. programs (program catalog)
CREATE TABLE nonprofit_cherry_tree.programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  start_date date,
  end_date date,
  created_at timestamptz DEFAULT now()
);

-- 5. participation (attendance records)
CREATE TABLE nonprofit_cherry_tree.participation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id uuid REFERENCES nonprofit_cherry_tree.data_subjects(id),
  program_id uuid REFERENCES nonprofit_cherry_tree.programs(id),
  attended_at timestamptz DEFAULT now(),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- 6. impressions (digital engagement)
CREATE TABLE nonprofit_cherry_tree.impressions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL,
  event_type text NOT NULL,
  subject_id uuid REFERENCES nonprofit_cherry_tree.data_subjects(id),
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- 7. email_campaigns (marketing history)
CREATE TABLE nonprofit_cherry_tree.email_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  subject_line text NOT NULL,
  body_html text,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'scheduled')),
  sent_at timestamptz,
  recipients_count int DEFAULT 0,
  opens int DEFAULT 0,
  clicks int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 8. grants (grant applications)
CREATE TABLE nonprofit_cherry_tree.grants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  funder text,
  amount_cents int,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'awarded', 'rejected', 'completed')),
  submitted_at timestamptz,
  deadline date,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- 9. audit_log (INSERT-ONLY — DPA legal requirement, Rule 7)
-- NEVER UPDATE OR DELETE FROM THIS TABLE
CREATE TABLE nonprofit_cherry_tree.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL,
  performed_by text NOT NULL,
  subject_id text,
  affected_table text NOT NULL,
  change_summary text,
  change_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- 10. config (schema settings)
CREATE TABLE nonprofit_cherry_tree.config (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX idx_data_subjects_email ON nonprofit_cherry_tree.data_subjects(email);
CREATE INDEX idx_data_subjects_status ON nonprofit_cherry_tree.data_subjects(status);
CREATE INDEX idx_donations_donor_email ON nonprofit_cherry_tree.donations(donor_email);
CREATE INDEX idx_donations_status ON nonprofit_cherry_tree.donations(status);
CREATE INDEX idx_donations_stripe_pi ON nonprofit_cherry_tree.donations(stripe_payment_intent_id);
CREATE INDEX idx_audit_log_action ON nonprofit_cherry_tree.audit_log(action);
CREATE INDEX idx_audit_log_created ON nonprofit_cherry_tree.audit_log(created_at);
CREATE INDEX idx_participation_subject ON nonprofit_cherry_tree.participation(subject_id);
CREATE INDEX idx_participation_program ON nonprofit_cherry_tree.participation(program_id);
CREATE INDEX idx_impressions_subject ON nonprofit_cherry_tree.impressions(subject_id);
