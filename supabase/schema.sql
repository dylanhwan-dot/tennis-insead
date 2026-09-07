-- Tennis @INSEAD — schema, RLS policies, and signup restriction.
-- Run this once in the Supabase SQL editor for your project.

-- ── Enums ────────────────────────────────────────────────────────────────

create type cohort as enum ('MIM ''28', 'MBA ''27J', 'MBA ''26D', 'Executive MBA', 'Other');
create type campus as enum ('Fontainebleau', 'Singapore');
create type skill_tier as enum ('Beginner', 'Improver', 'Intermediate', 'Advanced', 'Semi-professional/ex-professional');
create type intensity as enum ('Casual rally', 'Competitive match', 'Either');
create type day_of_week as enum ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
create type time_block as enum ('morning', 'afternoon', 'evening');

-- ── Tables ───────────────────────────────────────────────────────────────

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text not null,
  cohort cohort not null,
  cohort_other text,
  campus campus not null,
  skill_tier skill_tier not null,
  nationality text,
  years_playing integer,
  whatsapp text,
  intensity intensity,
  bio text check (char_length(bio) <= 80),
  created_at timestamptz not null default now(),
  constraint cohort_other_required check (
    (cohort <> 'Other') or (cohort_other is not null and cohort_other <> '')
  )
);

create table availability (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  day_of_week day_of_week not null,
  time_block time_block not null,
  unique (user_id, day_of_week, time_block)
);

-- ── Grants ───────────────────────────────────────────────────────────────
-- RLS policies only take effect once the role also has the underlying
-- table-level privilege. Tables created via the SQL editor (rather than
-- the dashboard Table Editor) don't get this automatically, so it's
-- explicit here.

grant usage on schema public to anon, authenticated;

grant select on profiles to anon, authenticated;
grant insert, update on profiles to authenticated;

grant select on availability to anon, authenticated;
grant insert, update, delete on availability to authenticated;

-- ── Row Level Security ──────────────────────────────────────────────────

alter table profiles enable row level security;
alter table availability enable row level security;

-- Anyone (including anonymous visitors) can browse the directory.
create policy "Public can view profiles"
  on profiles for select
  using (true);

create policy "Public can view availability"
  on availability for select
  using (true);

-- Authenticated users can only write their own row.
create policy "Users can insert their own profile"
  on profiles for insert
  to authenticated
  with check (id = auth.uid());

create policy "Users can update their own profile"
  on profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "Users can insert their own availability"
  on availability for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Users can update their own availability"
  on availability for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Users can delete their own availability"
  on availability for delete
  to authenticated
  using (user_id = auth.uid());

-- ── Restrict signups to @insead.edu ────────────────────────────────────
-- Belt-and-braces alongside the app's own domain check before sending a
-- magic link: this rejects the signup at the database level too.

create function restrict_signup_to_insead_domain()
returns trigger as $$
begin
  if new.email is null or new.email !~* '^[^@]+@insead\.edu$' then
    raise exception 'Only @insead.edu email addresses may sign up.';
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger enforce_insead_email_domain
  before insert on auth.users
  for each row execute function restrict_signup_to_insead_domain();
