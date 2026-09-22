/* =========================================================
   NYZ — sync-backend/mysql/server.js
   Serveur Node.js (Express) qui expose une API REST pour
   synchroniser le blog, la boutique et les commandes avec une
   base MySQL. Utilisé par js/sync.js côté site (provider: "api").

   Installation :
     npm install
     cp .env.example .env      puis complétez vos identifiants
     node server.js
   ========================================================= */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || "localhost",
  port: process.env.MYSQL_PORT || 3306,
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "nyz_blog",
});

// ---------------------------------------------------------------
// Articles
// ---------------------------------------------------------------
app.get("/api/articles", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT slug, title, category, category_label AS categoryLabel, excerpt, date,
              read_time AS readTime, tags, cover, content
       FROM articles ORDER BY date DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur lors de la lecture des articles." });
  }
});

app.post("/api/articles", async (req, res) => {
  const { slug, title, category, categoryLabel, excerpt, date, readTime, tags, cover, content } = req.body;
  if (!slug || !title || !category || !content) {
    return res.status(400).json({ error: "Champs obligatoires manquants (slug, title, category, content)." });
  }
  try {
    await pool.query(
      `INSERT INTO articles (slug, title, category, category_label, excerpt, date, read_time, tags, cover, content)
       VALUES (?,?,?,?,?,?,?,?,?,?)
       ON DUPLICATE KEY UPDATE
         title=VALUES(title), category=VALUES(category), category_label=VALUES(category_label),
         excerpt=VALUES(excerpt), date=VALUES(date), read_time=VALUES(read_time),
         tags=VALUES(tags), cover=VALUES(cover), content=VALUES(content)`,
      [slug, title, category, categoryLabel || category, excerpt || "", date, readTime || 5, JSON.stringify(tags || []), cover || "cover-blue", JSON.stringify(content)]
    );
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur lors de l'enregistrement de l'article." });
  }
});

// ---------------------------------------------------------------
// Produits
// ---------------------------------------------------------------
app.get("/api/products", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT slug, title, category, category_label AS categoryLabel, price, currency,
              excerpt, description, cover, available
       FROM products ORDER BY title ASC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur lors de la lecture des produits." });
  }
});

app.post("/api/products", async (req, res) => {
  const { slug, title, category, categoryLabel, price, currency, excerpt, description, cover, available } = req.body;
  if (!slug || !title || !category || price == null || !description) {
    return res.status(400).json({ error: "Champs obligatoires manquants (slug, title, category, price, description)." });
  }
  try {
    await pool.query(
      `INSERT INTO products (slug, title, category, category_label, price, currency, excerpt, description, cover, available)
       VALUES (?,?,?,?,?,?,?,?,?,?)
       ON DUPLICATE KEY UPDATE
         title=VALUES(title), category=VALUES(category), category_label=VALUES(category_label),
         price=VALUES(price), currency=VALUES(currency), excerpt=VALUES(excerpt),
         description=VALUES(description), cover=VALUES(cover), available=VALUES(available)`,
      [slug, title, category, categoryLabel || category, price, currency || "XOF", excerpt || "", JSON.stringify(description), cover || "cover-blue", available !== false ? 1 : 0]
    );
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur lors de l'enregistrement du produit." });
  }
});

// ---------------------------------------------------------------
// Commandes
// ---------------------------------------------------------------
app.get("/api/orders", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT ref, items, total, currency, customer_name AS customerName, phone,
              payment_method AS paymentMethod, note, status, created_at AS createdAt
       FROM orders ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur lors de la lecture des commandes." });
  }
});

app.post("/api/orders", async (req, res) => {
  const { ref, items, total, currency, customerName, phone, paymentMethod, note, status, createdAt } = req.body;
  if (!ref || !items || total == null || !customerName || !phone) {
    return res.status(400).json({ error: "Champs obligatoires manquants (ref, items, total, customerName, phone)." });
  }
  try {
    await pool.query(
      `INSERT INTO orders (ref, items, total, currency, customer_name, phone, payment_method, note, status, created_at)
       VALUES (?,?,?,?,?,?,?,?,?,?)
       ON DUPLICATE KEY UPDATE status=VALUES(status), note=VALUES(note)`,
      [ref, JSON.stringify(items), total, currency || "XOF", customerName, phone, paymentMethod || "", note || "", status || "en-attente", createdAt ? new Date(createdAt) : new Date()]
    );
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur lors de l'enregistrement de la commande." });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API MySQL prête sur http://localhost:${PORT}`));
