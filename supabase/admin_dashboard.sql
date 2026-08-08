-- Run this once in the Supabase SQL editor (https://supabase.com/dashboard -> your project -> SQL Editor).
-- Safe to re-run: every statement is idempotent.

-- Indexes used by the admin dashboard's search, filter and pagination.
create index if not exists orders_created_at_idx on orders (created_at desc);
create index if not exists orders_status_idx on orders (status);
create index if not exists orders_phone_idx on orders (phone);
create index if not exists orders_email_idx on orders (email);
create index if not exists orders_customer_name_idx on orders (customer_name);

-- If your `orders.status` column has a CHECK constraint limiting it to just
-- 'paid', widen it to the full lifecycle the dashboard now supports.
-- Uncomment and run only if you hit a constraint-violation error when
-- changing an order's status:
--
-- alter table orders drop constraint if exists orders_status_check;
-- alter table orders add constraint orders_status_check
--   check (status in ('paid', 'packed', 'shipped', 'delivered', 'cancelled'));
