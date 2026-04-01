const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// FIX CORS (INI KUNCI UTAMA 🔥)
app.use(cors());

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SIMPAN DATA SEMENTARA
let products = [];

// UPLOAD (optional)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET PRODUK
app.get('/api/products', (req, res) => {
  res.json(products);
});

// TAMBAH PRODUK
app.post('/api/products', upload.single('image'), (req, res) => {
  const { name, price, category, desc } = req.body;

  const newProduct = {
    id: Date.now(),
    name,
    price,
    category,
    desc
  };

  products.push(newProduct);
  res.json({ success: true });
});

// HAPUS PRODUK
app.delete('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  products = products.filter(p => p.id !== id);
  res.json({ success: true });
});

// START SERVER
app.listen(PORT, () => {
  console.log("Server jalan di port", PORT);
});
