-- Extended product fields
-- Run in the Supabase SQL editor. Safe to re-run: every statement is idempotent.
--
-- These columns back the fields that the admin product form previously showed
-- as disabled ("Not stored yet"). Everything is nullable and additive, so
-- existing rows, the storefront and the checkout flow are unaffected until
-- values are actually filled in.

alter table products
  add column if not exists sku                 text,
  add column if not exists brand               text,
  add column if not exists short_description   text,
  add column if not exists description         text,
  add column if not exists ingredients         text,
  add column if not exists allergens           text,
  add column if not exists shelf_life          text,
  add column if not exists storage             text,
  add column if not exists nutrition           jsonb  default '[]'::jsonb,
  add column if not exists batch_number        text,
  add column if not exists low_stock_threshold integer default 5,
  add column if not exists cost_price          numeric(10,2),
  add column if not exists gst_rate            numeric(5,2) default 5,
  add column if not exists meta_title          text,
  add column if not exists meta_description    text;

-- SKUs must be unique when present, but stay optional.
create unique index if not exists products_sku_key
  on products (sku) where sku is not null;

-- Seed the copy that currently lives in lib/products.ts, so the admin has
-- something real to edit rather than empty fields. Only fills blanks —
-- re-running will not overwrite anything an admin has since edited.
update products set
  ingredients = coalesce(ingredients, 'Makhana (fox nut), edible vegetable oil, peri peri seasoning, iodised salt.'),
  allergens   = coalesce(allergens,   'Packed in a facility that also handles nuts and milk products.'),
  shelf_life  = coalesce(shelf_life,  '6-8 months from date of packing'),
  storage     = coalesce(storage,     'Store in a cool, dry place away from direct sunlight. Reseal after opening.')
where slug = 'peri-peri';

update products set
  ingredients = coalesce(ingredients, 'Makhana (fox nut), edible vegetable oil, mint seasoning, iodised salt.'),
  allergens   = coalesce(allergens,   'Packed in a facility that also handles nuts and milk products.'),
  shelf_life  = coalesce(shelf_life,  '6-8 months from date of packing'),
  storage     = coalesce(storage,     'Store in a cool, dry place away from direct sunlight. Reseal after opening.')
where slug = 'garden-mint';

update products set
  ingredients = coalesce(ingredients, 'Makhana (fox nut), edible vegetable oil, Himalayan pink salt.'),
  allergens   = coalesce(allergens,   'Packed in a facility that also handles nuts and milk products.'),
  shelf_life  = coalesce(shelf_life,  '6-8 months from date of packing'),
  storage     = coalesce(storage,     'Store in a cool, dry place away from direct sunlight. Reseal after opening.')
where slug = 'himalayan-pink-salt';

-- Nutrition is left empty on purpose. The values in lib/products.ts are
-- placeholder em-dashes, and a nutrition panel is FSSAI-regulated — it needs
-- real lab figures, not copied placeholders.
