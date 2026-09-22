-- NYZ — sync-backend/mysql/schema.sql
-- Exécutez ce script une fois dans votre base MySQL :
--   mysql -u votre_utilisateur -p votre_base < schema.sql

CREATE TABLE IF NOT EXISTS articles (
  slug            VARCHAR(191) PRIMARY KEY,
  title           VARCHAR(255) NOT NULL,
  category        VARCHAR(50) NOT NULL,
  category_label  VARCHAR(100) NOT NULL,
  excerpt         TEXT,
  date            DATE NOT NULL,
  read_time       INT NOT NULL DEFAULT 5,
  tags            JSON,
  cover           VARCHAR(50) DEFAULT 'cover-blue',
  content         JSON NOT NULL,      -- tableau de paragraphes, ex. ["p1", "p2", ...]
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_articles_category (category),
  INDEX idx_articles_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS products (
  slug            VARCHAR(191) PRIMARY KEY,
  title           VARCHAR(255) NOT NULL,
  category        VARCHAR(50) NOT NULL,
  category_label  VARCHAR(100) NOT NULL,
  price           INT NOT NULL,
  currency        VARCHAR(10) NOT NULL DEFAULT 'XOF',
  excerpt         TEXT NOT NULL,
  description     JSON NOT NULL,
  cover           VARCHAR(50) DEFAULT 'cover-blue',
  available       TINYINT(1) NOT NULL DEFAULT 1,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_products_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS orders (
  ref             VARCHAR(64) PRIMARY KEY,
  items           JSON NOT NULL,
  total           INT NOT NULL,
  currency        VARCHAR(10) NOT NULL DEFAULT 'XOF',
  customer_name   VARCHAR(191) NOT NULL,
  phone           VARCHAR(50) NOT NULL,
  payment_method  VARCHAR(30) NOT NULL,
  note            TEXT,
  status          VARCHAR(20) NOT NULL DEFAULT 'en-attente',
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_orders_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
