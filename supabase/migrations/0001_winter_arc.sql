-- Winter Arc v1 — run in Supabase SQL Editor (one go).
-- Creates tables, private photo bucket, and owner-only RLS.

-- ============ TABLES ============

create table if not exists profiles (
  user_id uuid primary key references auth.users on delete cascade,
  name text not null default '',
  email text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists arcs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  start_date date not null,
  end_date date not null,
  created_at timestamptz not null default now()
);

create table if not exists trackers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  arc_id uuid references arcs on delete set null,
  name text not null,
  type text not null default 'quantity',
  target numeric,
  unit text,
  step numeric not null default 1,
  frequency_kind text not null default 'daily',
  frequency_days int[] default '{}',
  start_date date not null,
  end_date date not null,
  allow_multiple boolean not null default true,
  icon text not null default 'heart',
  color text not null default '#38bdf8',
  category text not null default 'custom',
  status text not null default 'active',
  sort_order int not null default 0,
  reminder_time text,
  window_start text,
  window_end text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists tracker_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  tracker_id uuid not null references trackers on delete cascade,
  date date not null,
  value jsonb not null,
  completed boolean not null default false,
  slot text,
  target_snapshot numeric,
  unit_snapshot text,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- one row per tracker+day unless it carries a time slot (multi-entry loggers)
create unique index if not exists tracker_entries_single_day
  on tracker_entries (tracker_id, date) where slot is null;

create table if not exists meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  date_key date not null,
  slot text not null default 'custom',
  name text not null default 'Meal',
  items text not null default '',
  calories numeric not null default 0,
  protein numeric not null default 0,
  carbs numeric not null default 0,
  fats numeric not null default 0,
  fiber numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists photo_meta (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  date_key date not null,
  angle text not null default 'front' check (angle in ('front', 'side', 'back')),
  created_at timestamptz not null default now()
);

create table if not exists nutrition_targets (
  user_id uuid primary key references auth.users on delete cascade,
  calories numeric not null default 2000,
  protein numeric not null default 150,
  carbs numeric not null default 220,
  fats numeric not null default 70,
  fiber numeric not null default 30
);

create table if not exists preferences (
  user_id uuid primary key references auth.users on delete cascade,
  accent text not null default 'blue',
  units text not null default 'metric',
  start_tab text not null default '/'
);

create table if not exists reminders (
  user_id uuid primary key references auth.users on delete cascade,
  wake_up_time text not null default '05:00',
  wake_up_enabled boolean not null default false,
  sleep_time text not null default '22:30',
  sleep_enabled boolean not null default false,
  meal_time text not null default '08:00',
  meal_enabled boolean not null default false,
  workout_time text not null default '18:00',
  workout_enabled boolean not null default false,
  summary_time text not null default '21:00',
  summary_enabled boolean not null default false
);

-- ============ STORAGE (private body photos) ============

insert into storage.buckets (id, name, public)
values ('body-photos', 'body-photos', false)
on conflict (id) do nothing;

-- ============ ROW LEVEL SECURITY ============

alter table profiles enable row level security;
alter table arcs enable row level security;
alter table trackers enable row level security;
alter table tracker_entries enable row level security;
alter table meals enable row level security;
alter table photo_meta enable row level security;
alter table nutrition_targets enable row level security;
alter table preferences enable row level security;
alter table reminders enable row level security;

-- owner-only full access, one policy per table
create policy "owner all" on profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner all" on arcs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner all" on trackers
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner all" on tracker_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner all" on meals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner all" on photo_meta
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner all" on nutrition_targets
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner all" on preferences
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner all" on reminders
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- private storage: owners only (path convention: <user_id>/<file>)
create policy "owner all photos" on storage.objects
  for all using (
    bucket_id = 'body-photos' and auth.uid()::text = (storage.foldername(name))[1]
  ) with check (
    bucket_id = 'body-photos' and auth.uid()::text = (storage.foldername(name))[1]
  );
