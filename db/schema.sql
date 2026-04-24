CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  segment TEXT,
  target_audience TEXT,
  tone TEXT CHECK (tone IN ('formal', 'consultivo', 'direto', 'descontraido')),
  default_cta TEXT,
  platforms TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  brand_config JSONB DEFAULT '{}',
  logo_url TEXT,
  plan TEXT DEFAULT 'trial',
  trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'owner' CHECK (role IN ('owner', 'member')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  format TEXT NOT NULL CHECK (format IN ('post', 'carousel', 'story')),
  framework TEXT,
  topic TEXT,
  template_style TEXT DEFAULT 'classic',
  slides JSONB NOT NULL DEFAULT '[]',
  caption TEXT,
  hashtags TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  month TEXT NOT NULL,
  posts_generated INTEGER DEFAULT 0,
  UNIQUE(tenant_id, month)
);

-- Daily limit: 3 posts per user per day, resets at 00:00
CREATE TABLE IF NOT EXISTS daily_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  posts_generated INTEGER NOT NULL DEFAULT 0,
  UNIQUE(user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_users_tenant       ON users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_users_email        ON users(email);
CREATE INDEX IF NOT EXISTS idx_posts_tenant       ON posts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_posts_created      ON posts(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_usage_tenant_month ON usage(tenant_id, month);
CREATE INDEX IF NOT EXISTS idx_daily_usage_user   ON daily_usage(user_id, date);
