-- ══════════════════════════════════════════════════════════
-- Vastraa — Supabase Schema
-- Run this SQL in your Supabase SQL Editor
-- ══════════════════════════════════════════════════════════

-- 1. Enable pgvector extension
create extension if not exists vector;

-- 2. Products table
create table if not exists products (
  id              text primary key,
  name            text not null,
  brand           text not null,
  category        text,
  description     text,
  tags            text[]        default '{}',
  price           numeric       not null,
  currency        text          default 'INR',
  image_url       text          not null,
  product_url     text          not null,
  gender          text          default 'women' check (gender in ('women', 'men', 'unisex')),
  shopify_store_id text,
  embedding       vector(768),  -- Gemini text-embedding-004 output dimension
  created_at      timestamptz   default now()
);

-- 3. Index for fast vector search (cosine distance)
create index if not exists products_embedding_idx
  on products
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- 4. Index for gender filtering
create index if not exists products_gender_idx on products (gender);

-- 5. Search function — cosine similarity with optional gender filter
create or replace function search_products(
  query_embedding  vector(768),
  gender_filter    text    default null,
  match_count      int     default 20,
  match_threshold  float   default 0.3
)
returns table (
  id          text,
  name        text,
  brand       text,
  category    text,
  description text,
  tags        text[],
  price       numeric,
  currency    text,
  image_url   text,
  product_url text,
  gender      text,
  similarity  float
)
language sql stable
as $$
  select
    p.id,
    p.name,
    p.brand,
    p.category,
    p.description,
    p.tags,
    p.price,
    p.currency,
    p.image_url,
    p.product_url,
    p.gender,
    1 - (p.embedding <=> query_embedding) as similarity
  from products p
  where
    p.embedding is not null
    and (gender_filter is null or p.gender = gender_filter or p.gender = 'unisex')
    and 1 - (p.embedding <=> query_embedding) > match_threshold
  order by p.embedding <=> query_embedding
  limit match_count;
$$;

-- 6. User favourites table (for Phase 3 — Auth)
create table if not exists user_favorites (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  product_id  text not null references products(id) on delete cascade,
  saved_at    timestamptz default now(),
  unique (user_id, product_id)
);

-- 7. User uploads table (for Phase 5 — Uploads)
create table if not exists user_uploads (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  storage_path text not null,
  file_name    text,
  uploaded_at  timestamptz default now()
);

-- 8. Row Level Security — only owners can read their own data
alter table user_favorites enable row level security;
alter table user_uploads   enable row level security;

create policy "Users can manage own favorites"
  on user_favorites for all
  using (auth.uid() = user_id);

create policy "Users can manage own uploads"
  on user_uploads for all
  using (auth.uid() = user_id);

-- Products are public (read only via anon key)
alter table products enable row level security;
create policy "Products are public"
  on products for select
  using (true);
