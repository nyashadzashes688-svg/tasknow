-- ============================================================
-- TaskNow — Supabase schema
-- Run in the Supabase SQL editor (or `supabase db push`).
-- ============================================================

-- ------------------------------------------------------------------
-- PROFILES (one row per auth.users row; created automatically)
-- ------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  name text,
  role text check (role in ('client', 'provider')),
  phone text,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- provider-only extension fields
create table if not exists public.providers (
  id uuid primary key references public.profiles (id) on delete cascade,
  bio text default '',
  hourly_rate numeric default 50,
  is_verified boolean default false,
  is_available boolean default true,
  rating numeric default 0,
  review_count integer default 0,
  completed_jobs integer default 0,
  documents_uploaded boolean default false,
  lat double precision,
  lng double precision,
  address text,
  categories text[] default '{}',
  created_at timestamptz not null default now()
);

-- auto-create a profile row whenever a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ------------------------------------------------------------------
-- BOOKINGS
-- ------------------------------------------------------------------
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles (id) on delete cascade,
  provider_id uuid not null references public.profiles (id) on delete cascade,
  category text not null,
  title text not null,
  description text default '',
  status text not null default 'pending'
    check (status in ('pending','accepted','en_route','arrived','in_progress','completed','cancelled')),
  scheduled_date date not null,
  scheduled_time text not null,
  address text not null,
  lat double precision default 40.7128,
  lng double precision default -74.006,
  estimated_cost numeric not null default 0,
  actual_cost numeric,
  rating smallint check (rating between 1 and 5),
  review text,
  created_at timestamptz not null default now()
);

create index if not exists bookings_client_idx on public.bookings (client_id);
create index if not exists bookings_provider_idx on public.bookings (provider_id);

-- ------------------------------------------------------------------
-- MESSAGES (realtime chat)
-- ------------------------------------------------------------------
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles (id) on delete cascade,
  receiver_id uuid not null references public.profiles (id) on delete cascade,
  booking_id uuid references public.bookings (id) on delete set null,
  content text not null default '',
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists messages_sender_idx on public.messages (sender_id);
create index if not exists messages_receiver_idx on public.messages (receiver_id);

alter table public.messages replica identity full; -- needed for realtime payloads

-- ------------------------------------------------------------------
-- SUBSCRIPTIONS (Stripe-backed)
-- ------------------------------------------------------------------
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade unique,
  stripe_customer_id text,
  stripe_subscription_id text,
  tier text not null default 'free' check (tier in ('free','basic','pro','enterprise')),
  status text not null default 'active' check (status in ('active','trialing','cancelled')),
  current_period_end timestamptz,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.providers enable row level security;
alter table public.bookings enable row level security;
alter table public.messages enable row level security;
alter table public.subscriptions enable row level security;

-- users can read & update their own profile
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- providers are public to read; only owners can update
create policy "providers_read_all" on public.providers
  for select using (true);
create policy "providers_update_own" on public.providers
  for update using (auth.uid() = id);
create policy "providers_insert_own" on public.providers
  for insert with check (auth.uid() = id);

-- bookings: client or provider involved in the booking can read
create policy "bookings_select_participant" on public.bookings
  for select using (auth.uid() = client_id or auth.uid() = provider_id);
create policy "bookings_insert_client" on public.bookings
  for insert with check (auth.uid() = client_id);
create policy "bookings_update_participant" on public.bookings
  for update using (auth.uid() = client_id or auth.uid() = provider_id);

-- messages: only the two conversation participants can read
create policy "messages_select_participant" on public.messages
  for select using (auth.uid() in (sender_id, receiver_id));
create policy "messages_insert_sender" on public.messages
  for insert with check (auth.uid() = sender_id);

-- subscriptions: only the owner can read
create policy "subscriptions_select_own" on public.subscriptions
  for select using (auth.uid() = user_id);

-- ------------------------------------------------------------------
-- REALTIME — enable the messages table for live chat
-- ------------------------------------------------------------------
alter publication supabase_realtime add table public.messages;

-- ============================================================
-- SEED DATA — demo providers (matches the offline demo)
-- ============================================================
-- Insert provider profile rows (these are demo accounts; replace the
-- uuids with real auth.users ids if you want them login-able).
insert into public.profiles (id, email, name, role)
values
  ('11111111-1111-1111-1111-111111111111', 'marcus.johnson@email.com', 'Marcus Johnson', 'provider'),
  ('22222222-2222-2222-2222-222222222222', 'sarah.chen@email.com', 'Sarah Chen', 'provider'),
  ('33333333-3333-3333-3333-333333333333', 'david.martinez@email.com', 'David Martinez', 'provider'),
  ('44444444-4444-4444-4444-444444444444', 'emily.watson@email.com', 'Emily Watson', 'provider'),
  ('55555555-5555-5555-5555-555555555555', 'aisha.okafor@email.com', 'Aisha Okafor', 'provider')
on conflict (id) do nothing;

insert into public.providers (id, bio, hourly_rate, is_verified, is_available, rating, review_count, completed_jobs, documents_uploaded, lat, lng, address, categories)
values
  ('11111111-1111-1111-1111-111111111111', 'Licensed plumber with 12+ years experience.', 65, true, true, 4.9, 127, 342, true, 40.7128, -74.006, 'Manhattan, NY', '{plumbing,handyman}'),
  ('22222222-2222-2222-2222-222222222222', 'Eco-friendly cleaning specialist.', 45, true, true, 4.8, 89, 256, true, 40.7589, -73.9851, 'Midtown, NY', '{cleaning}'),
  ('33333333-3333-3333-3333-333333333333', 'Certified electrician. Code-compliant work.', 75, true, false, 4.7, 64, 198, true, 40.7282, -73.7949, 'Queens, NY', '{electrical,handyman}'),
  ('44444444-4444-4444-4444-444444444444', 'SAT/ACT prep expert & math tutor.', 40, true, true, 5.0, 42, 156, true, 40.7484, -73.9967, 'Chelsea, NY', '{tutoring}'),
  ('55555555-5555-5555-5555-555555555555', 'Licensed cosmetologist. Bridal + everyday.', 55, true, true, 4.9, 103, 289, true, 40.7614, -73.9776, 'Upper East Side, NY', '{beauty}')
on conflict (id) do nothing;

-- ------------------------------------------------------------------
-- Indexes & cleanup
-- ------------------------------------------------------------------
create index if not exists profiles_role_idx on public.profiles (role);
revoke all on function public.handle_new_user() from public; -- security definer: block direct calls