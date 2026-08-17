-- Categories
-- Run in the Supabase SQL editor. Safe to re-run: every statement is idempotent.
--
-- Replaces the three hard-coded chips in app/shop/page.tsx with a real table,
-- so categories can be created, renamed, reordered and hidden from the admin.

create table if not exists categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  description text,
  sort_order  integer not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists categories_sort_idx on categories (sort_order, name);

-- Seed exactly what the shop page currently hard-codes, so nothing on the
-- storefront changes the moment this runs.
insert into categories (slug, name, active, sort_order, description) values
  ('makhana',    'Flavoured makhana', true,  0, 'Whole makhana, roasted in small batches and seasoned by hand.'),
  ('namkeen',    'Namkeen',           false, 1, 'Coming soon.'),
  ('gift-boxes', 'Gift boxes',        false, 2, 'Coming soon.')
on conflict (slug) do nothing;

-- Link products to a category.
alter table products add column if not exists category_id uuid;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'products_category_id_fkey'
  ) then
    alter table products
      add constraint products_category_id_fkey
      foreign key (category_id) references categories (id) on delete set null;
  end if;
end $$;

create index if not exists products_category_idx on products (category_id);

-- Every existing product is flavoured makhana.
update products
   set category_id = (select id from categories where slug = 'makhana')
 where category_id is null;

-- The storefront and admin both read through the service-role key, which
-- bypasses RLS. Enabling it anyway means the anon key cannot read or write
-- this table if it is ever used from the browser.
alter table categories enable row level security;

drop policy if exists "categories are publicly readable" on categories;
create policy "categories are publicly readable"
  on categories for select
  using (active = true);
