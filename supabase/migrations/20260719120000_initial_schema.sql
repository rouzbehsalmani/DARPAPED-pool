-- Migration file (for the Supabase <-> GitHub integration's automatic
-- migration pipeline). Identical content to supabase/schema.sql - that
-- flat file is kept only as an easy-to-read reference copy; THIS file
-- (inside supabase/migrations/, with a timestamp prefix) is the one the
-- GitHub integration actually looks for.

-- =============================================================================
-- DARPAPED-pool (SpinVault) - Supabase schema
-- Run this once in Supabase Dashboard > SQL Editor (on a fresh project).
-- =============================================================================

-- One row per user, auto-created on signup (see trigger below). All balance
-- mutations happen ONLY through Edge Functions using the service role key
-- (which bypasses RLS) - the client can only ever READ its own row, never
-- write to it directly. This is what makes the economy server-authoritative
-- and prevents a modified client from ever granting itself free balance.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  silver integer not null default 0,
  gold integer not null default 0,
  diamond integer not null default 0,
  arpg integer not null default 0,
  wallet_cash_balance numeric(12, 4) not null default 0,
  arpg_share_accumulated numeric(12, 4) not null default 0,
  energy numeric(6, 2) not null default 100,
  energy_last_updated_at timestamptz not null default now(),
  is_vip boolean not null default false,
  vip_plan_id text,
  vip_expires_at timestamptz,
  ad_tier text not null default 'TIER_2',
  region text,
  game_play_count integer not null default 0,
  last_mega_pool_spin_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);
-- Deliberately NO insert/update/delete policy for the authenticated role -
-- every mutation goes through an Edge Function using the service role key.

-- Auto-create a profile row the moment someone signs up.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- Withdrawal requests - users can see their own history; only Edge
-- Functions insert new rows (after validating the balance).
create table public.withdrawal_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  amount_usd numeric(12, 2) not null,
  method_id text not null,
  destination text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

alter table public.withdrawal_requests enable row level security;

create policy "withdrawals_select_own"
  on public.withdrawal_requests for select
  using (auth.uid() = user_id);


-- Single shared row - the global Mega Pool jackpot balance.
create table public.mega_pool (
  id int primary key default 1,
  balance numeric(12, 4) not null default 0,
  constraint mega_pool_single_row check (id = 1)
);
insert into public.mega_pool (id, balance) values (1, 0);

alter table public.mega_pool enable row level security;

create policy "mega_pool_select_all"
  on public.mega_pool for select
  using (true);


-- Append-only ledger of every money-moving event, for bookkeeping/auditing/
-- fraud review. Every Edge Function below writes a row here.
create table public.platform_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  kind text not null, -- 'ad_view' | 'game_prize' | 'mega_pool_win' | 'withdrawal' | 'vip_purchase'
  amount_usd numeric(12, 4),
  meta jsonb,
  created_at timestamptz not null default now()
);

alter table public.platform_ledger enable row level security;

create policy "ledger_select_own"
  on public.platform_ledger for select
  using (auth.uid() = user_id);

-- FILE LOCATION: supabase/schema.sql (project root, NEW file - run in Supabase SQL Editor)
