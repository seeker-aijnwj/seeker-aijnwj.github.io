-- NYZ — sync-backend/postgres/schema.sql
-- Exécutez ce script une fois dans votre base PostgreSQL :
--   psql -U votre_utilisateur -d votre_base -f schema.sql

CREATE TABLE IF NOT EXISTS articles (
  slug          TEXT PRIMARY KEY,
  title         TEXT NOT NULL,
  category      TEXT NOT NULL,
  category_label TEXT NOT NULL,
  excerpt       TEXT NOT NULL,
  date          DATE NOT NULL,
  read_time     INTEGER NOT NULL DEFAULT 5,
  tags          TEXT[] DEFAULT '{}',
  cover         TEXT DEFAULT 'cover-blue',
  content       JSONB NOT NULL,      -- tableau de paragraphes, ex. ["p1", "p2", ...]
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_articles_category ON articles (category);
CREATE INDEX IF NOT EXISTS idx_articles_date ON articles (date DESC);

CREATE TABLE IF NOT EXISTS products (
  slug          TEXT PRIMARY KEY,
  title         TEXT NOT NULL,
  category      TEXT NOT NULL,
  category_label TEXT NOT NULL,
  price         INTEGER NOT NULL,
  currency      TEXT NOT NULL DEFAULT 'XOF',
  excerpt       TEXT NOT NULL,
  description   JSONB NOT NULL,     -- tableau de paragraphes
  cover         TEXT DEFAULT 'cover-blue',
  available     BOOLEAN NOT NULL DEFAULT true,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_products_category ON products (category);

CREATE TABLE IF NOT EXISTS orders (
  ref             TEXT PRIMARY KEY,
  items           JSONB NOT NULL,     -- [{ slug, title, price, qty }, ...]
  total           INTEGER NOT NULL,
  currency        TEXT NOT NULL DEFAULT 'XOF',
  customer_name   TEXT NOT NULL,
  phone           TEXT NOT NULL,
  payment_method  TEXT NOT NULL,      -- wave | orange-money | momo | flooz | lemfi
  note            TEXT,
  status          TEXT NOT NULL DEFAULT 'en-attente', -- en-attente | confirmee | annulee
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);
