-- ============================================================
-- GrowSari QA Monitor — Supabase Schema
-- Run this in your Supabase SQL Editor:
-- https://app.supabase.com/project/_/sql
-- ============================================================

-- Enable UUID extension (usually enabled by default)
create extension if not exists "pgcrypto";

-- -------------------------------------------------------
-- USERS table (QA engineers + managers)
-- -------------------------------------------------------
create table if not exists public.users (
  id          uuid primary key default gen_random_uuid(),
  username    text unique not null,
  name        text not null,
  role        text not null default 'qa'
                check (role in ('manager', 'qa')),
  squad       text not null,
  status      text not null default 'active'
                check (status in ('active', 'available', 'busy', 'on_leave')),
  projects    text[] not null default '{}',
  current_task text,
  capacity    int not null default 50
                check (capacity >= 0 and capacity <= 100),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- -------------------------------------------------------
-- SQUADS table (reference data)
-- -------------------------------------------------------
create table if not exists public.squads (
  id       uuid primary key default gen_random_uuid(),
  name     text unique not null,
  color    text not null default '#4CBFB1',
  projects text[] not null default '{}'
);

-- -------------------------------------------------------
-- TASKS table
-- -------------------------------------------------------
create table if not exists public.tasks (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  description     text,
  assignee_id     uuid references public.users(id) on delete set null,
  squad           text not null,
  project         text not null,
  status          text not null default 'not_started'
                    check (status in ('in_progress', 'completed', 'blocked', 'not_started')),
  priority        text not null default 'medium'
                    check (priority in ('low', 'medium', 'high', 'critical')),
  jira_key        text,
  testpad_run_id  text,
  due_date        date,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- -------------------------------------------------------
-- Trigger: auto-update updated_at
-- -------------------------------------------------------
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_updated_at
  before update on public.users
  for each row execute procedure public.handle_updated_at();

create trigger tasks_updated_at
  before update on public.tasks
  for each row execute procedure public.handle_updated_at();

-- -------------------------------------------------------
-- Row Level Security
-- -------------------------------------------------------
alter table public.users  enable row level security;
alter table public.squads enable row level security;
alter table public.tasks  enable row level security;

-- Public read for all authenticated users
create policy "Authenticated users can read users"
  on public.users for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users can read squads"
  on public.squads for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users can read tasks"
  on public.tasks for select
  using (auth.role() = 'authenticated');

-- Only managers can insert/update/delete users
create policy "Managers can manage users"
  on public.users for all
  using (
    exists (
      select 1 from public.users u
      where u.id = auth.uid() and u.role = 'manager'
    )
  );

-- Only managers can manage tasks
create policy "Managers can manage tasks"
  on public.tasks for all
  using (
    exists (
      select 1 from public.users u
      where u.id = auth.uid() and u.role = 'manager'
    )
  );

-- QA engineers can update their own record (status, current_task, capacity)
create policy "QA engineers can update own record"
  on public.users for update
  using (auth.uid() = id);

-- -------------------------------------------------------
-- Seed data — 6 squads
-- -------------------------------------------------------
insert into public.squads (name, color, projects) values
  ('ESERV',             '#4CBFB1', array['2026 Sprint 1', 'Sprint 4']),
  ('FINSERV',           '#6B8EFF', array['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4']),
  ('INFRASTRUCTURE',    '#F59E0B', array['Store Network', 'Common Service', 'GrowCube', 'Mobile Platform', '1WS']),
  ('OPS',               '#EC4899', array['LM & BH', 'PSP App', 'Supply Grow & MS']),
  ('STORE APP RELEASE', '#8B5CF6', array['Tech Debt', 'Sprint 1', 'Sprint 2']),
  ('STORE FRONTS',      '#10B981', array['Ecommerce', 'Web & Merchant Admin'])
on conflict (name) do nothing;

-- -------------------------------------------------------
-- Seed data — demo users
-- (Passwords are handled by Supabase Auth separately;
--  these rows are the profile records)
-- -------------------------------------------------------
insert into public.users (username, name, role, squad, status, projects, current_task, capacity) values
  ('admin',          'Maria Santos',       'manager', 'OPS',               'active',    array['LM & BH', 'PSP App'],              'Q1 QA Planning & Review',                85),
  ('qa.you',         'You (QA Engineer)',  'qa',      'OPS',               'active',    array['LM & BH', 'Supply Grow & MS'],     'Regression Testing - LM Sprint 2',        70),
  ('qa.reyes',       'Carlos Reyes',       'qa',      'ESERV',             'busy',      array['2026 Sprint 1', 'Sprint 4'],       'API Test Automation - ESERV Sprint 1',   90),
  ('qa.dela',        'Ana Dela Cruz',      'qa',      'FINSERV',           'active',    array['Sprint 1', 'Sprint 2'],            'Smoke Testing - FINSERV Sprint 2',        60),
  ('qa.tan',         'Kevin Tan',          'qa',      'FINSERV',           'available', array['Sprint 3', 'Sprint 4'],            null,                                      20),
  ('qa.garcia',      'Lisa Garcia',        'qa',      'INFRASTRUCTURE',    'active',    array['Store Network', 'Common Service'], 'E2E Suite for Store Network',             75),
  ('qa.lim',         'James Lim',          'qa',      'INFRASTRUCTURE',    'busy',      array['GrowCube', 'Mobile Platform', '1WS'], 'Mobile Platform Performance Testing',  95),
  ('qa.bautista',    'Rose Bautista',      'qa',      'OPS',               'active',    array['PSP App'],                         'PSP Payment Flow Testing',                65),
  ('qa.mendoza',     'Rico Mendoza',       'qa',      'STORE APP RELEASE', 'on_leave',  array['Tech Debt', 'Sprint 1'],           null,                                       0),
  ('qa.cruz',        'Pia Cruz',           'qa',      'STORE APP RELEASE', 'active',    array['Sprint 2'],                        'Release Candidate Validation',            80),
  ('qa.villanueva',  'Mark Villanueva',    'qa',      'STORE FRONTS',      'active',    array['Ecommerce'],                       'Checkout Flow Regression',                70),
  ('qa.torres',      'Jenna Torres',       'qa',      'STORE FRONTS',      'available', array['Web & Merchant Admin'],            null,                                      30)
on conflict (username) do nothing;
