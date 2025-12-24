const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Konfigurasi Database
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Sesuaikan dengan user mysql Anda
  password: "", // Sesuaikan dengan password mysql Anda
  database: "crud_db",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Database connected...");
});

// 1. CREATE (Tambah Produk)
app.post("/products", (req, res) => {
  const { name, price } = req.body;
  const sql = "INSERT INTO products (name, price) VALUES (?, ?)";
  db.query(sql, [name, price], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send(result);
  });
});

// 2. READ (Ambil Semua Produk)
app.get("/products", (req, res) => {
  const sql = "SELECT * FROM products";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// 3. UPDATE (Edit Produk)
app.put("/products/:id", (req, res) => {
  const { name, price } = req.body;
  const { id } = req.params;
  const sql = "UPDATE products SET name = ?, price = ? WHERE id = ?";
  db.query(sql, [name, price, id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send(result);
  });
});

// 4. DELETE (Hapus Produk)
app.delete("/products/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM products WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send(result);
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
