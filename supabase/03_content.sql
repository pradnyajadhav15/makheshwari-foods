-- Website content (CMS)
-- Run in the Supabase SQL editor. Safe to re-run: every statement is idempotent.
--
-- Key/value store for editable storefront copy, following the same shape as
-- the existing `settings` table. Each row is one editable block; `value` is
-- jsonb so a block can hold several fields without a schema change per block.

create table if not exists content (
  key        text primary key,
  value      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Seed with the copy currently hard-coded in the page components, so the
-- storefront reads identically before and after this runs.
insert into content (key, value) values
  ('hero', jsonb_build_object(
      'eyebrow',  'Pond-grown in Samastipur, Bihar',
      'heading',  E'Roasted where\nit grows.',
      'body',     'Whole makhana from the ponds of the Mithila belt. Hot-air roasted, never fried, and sealed the day it is packed.',
      'ctaLabel', 'Shop the range',
      'ctaHref',  '/shop',
      'altLabel', 'Know your makhana',
      'altHref',  '/know-your-makhana',
      'footnote', 'FSSAI licensed · Free shipping over ₹499'
  )),
  ('origin', jsonb_build_object(
      'eyebrow', 'Know your makhana',
      'heading', 'It begins waist-deep in water.',
      'body',    'Makhana does not grow on a plant you can walk up to. It grows underwater, on a prickly water lily rooted in the pond bed, and every seed is brought up by hand.',
      'body2',   'We buy from those ponds, roast in Samastipur, and seal the same day.'
  )),
  ('purity', jsonb_build_object(
      'eyebrow', 'Raw and natural',
      'heading', E'Pure, natural,\nand nothing else.',
      'body',    'Sourced from the ponds of the Mithila belt and sorted by hand for size and colour. No additives, no preservatives, and nothing to hide behind.'
  )),
  ('bulk', jsonb_build_object(
      'eyebrow', 'Bulk & reseller',
      'heading', 'Buying by the carton?',
      'body',    'We supply retailers, distributors and corporate gifting direct from our Samastipur unit, with GST invoicing and custom pack sizes.'
  )),
  ('footer', jsonb_build_object(
      'heading', 'Roasted where it grows.',
      'body',    'Whole makhana from the ponds of the Mithila belt, hot-air roasted in small batches in Samastipur and sealed the day it is packed.'
  ))
on conflict (key) do nothing;

alter table content enable row level security;

drop policy if exists "content is publicly readable" on content;
create policy "content is publicly readable"
  on content for select
  using (true);
