-- Migration: create job_requests table for gilmore client
-- All job estimate requests from gilmore.vercel.app

create table if not exists job_requests (
  id          uuid primary key default gen_random_uuid(),
  client_slug text not null default 'gilmore',
  name        text not null,
  phone       text not null,
  email       text,
  service     text not null,
  description text,
  status      text not null default 'new',
  created_at  timestamptz not null default now()
);

-- Index for dashboard queries
create index if not exists job_requests_client_slug_idx on job_requests (client_slug);
create index if not exists job_requests_created_at_idx  on job_requests (created_at desc);

-- RLS: allow service role to insert (API route uses service key)
alter table job_requests enable row level security;

create policy "service role full access"
  on job_requests
  for all
  using (true)
  with check (true);
