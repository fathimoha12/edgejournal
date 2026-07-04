-- Edge Journal Supabase schema
-- Run this in the Supabase SQL editor after creating your project.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  timezone text default 'UTC',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.trading_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'Primary account',
  starting_balance numeric(14, 2) not null default 0,
  currency text not null default 'USD',
  default_risk_amount numeric(14, 2) not null default 100,
  default_rr numeric(8, 3) not null default 3,
  max_daily_risk_percent numeric(5, 2) not null default 3,
  max_weekly_drawdown_percent numeric(5, 2) not null default 6,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.strategies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

do $$
begin
  if not exists (select 1 from pg_type where typname = 'trade_direction') then
    create type public.trade_direction as enum ('Buy', 'Sell');
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'trade_result') then
    create type public.trade_result as enum ('TP', 'SL', 'BE', 'Partial', 'Open');
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'trading_session') then
    create type public.trading_session as enum ('Asia', 'London', 'New York');
  end if;
end $$;

create table if not exists public.trades (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  strategy_id uuid references public.strategies(id) on delete set null,
  pair text not null,
  direction public.trade_direction not null,
  entry numeric(16, 6) not null,
  stop_loss numeric(16, 6) not null,
  take_profit numeric(16, 6) not null,
  risk_amount numeric(14, 2) not null,
  reward_amount numeric(14, 2) not null,
  rr numeric(8, 3) not null default 3,
  result public.trade_result not null,
  profit_loss numeric(14, 2) not null,
  r_multiple numeric(8, 3) not null,
  trade_date date not null,
  session public.trading_session not null,
  strategy_names text[] not null default '{}',
  area text not null default 'Backtesting',
  strategy_points text[] not null default '{}',
  emotion text,
  mistake text,
  notes text,
  screenshot_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.screenshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  trade_id uuid references public.trades(id) on delete cascade,
  storage_path text,
  public_url text,
  caption text,
  created_at timestamptz not null default now()
);

create table if not exists public.journal_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  trade_id uuid references public.trades(id) on delete cascade,
  title text,
  body text not null,
  note_date date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists trading_accounts_updated_at on public.trading_accounts;
create trigger trading_accounts_updated_at
before update on public.trading_accounts
for each row execute function public.set_updated_at();

drop trigger if exists trades_updated_at on public.trades;
create trigger trades_updated_at
before update on public.trades
for each row execute function public.set_updated_at();

drop trigger if exists journal_notes_updated_at on public.journal_notes;
create trigger journal_notes_updated_at
before update on public.journal_notes
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.trading_accounts enable row level security;
alter table public.strategies enable row level security;
alter table public.trades enable row level security;
alter table public.screenshots enable row level security;
alter table public.journal_notes enable row level security;

create policy "profiles_select_own" on public.profiles
for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "trading_accounts_own" on public.trading_accounts
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "strategies_own" on public.strategies
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "trades_own" on public.trades
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "screenshots_own" on public.screenshots
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "journal_notes_own" on public.journal_notes
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists trades_user_date_idx on public.trades(user_id, trade_date desc);
create index if not exists trades_user_pair_idx on public.trades(user_id, pair);
create index if not exists trades_user_strategy_idx on public.trades(user_id, strategy_id);
create index if not exists journal_notes_user_date_idx on public.journal_notes(user_id, note_date desc);
