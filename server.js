const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('../client'));
app.use('/uploads', express.static('uploads'));

// Data storage
const DB_FILE = 'products.json';
let products = [];
let orders = [];

// Load data
function loadData() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      products = JSON.parse(data).products || [];
    } else {
      // Seed data
      products = [
        { id: 1, name: 'Service LCD iPhone 13', price: 850000, image: 'iphone.jpg', desc: 'Premium service', category: 'service' },
        { id: 2, name: 'Case Premium Samsung', price: 150000, image: 'case.jpg', desc: 'Anti crack', category: 'accessory' },
        { id: 3, name: 'Baterai Original', price: 450000, image: 'battery.jpg', desc: '100% original', category: 'sparepart' }
      ];
      saveData();
    }
  } catch (e) {
    console.error('Load error:', e);
  }
}

function saveData() {
  fs.writeFileSync(DB_FILE, JSON.stringify({ products, orders }, null, 2));
}

// Multer for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Routes
app.get('/api/products', (req, res) => res.json(products));

app.get('/api/orders', (req, res) => res.json(orders));

app.post('/api/products', upload.single('image'), (req, res) => {
  const product = {
    id: Date.now(),
    name: req.body.name,
    price: parseInt(req.body.price),
    image: req.file ? req.file.filename : 'default.jpg',
    desc: req.body.desc,
    category: req.body.category
  };
  products.unshift(product);
  saveData();
  res.json(product);
});

app.put('/api/products/:id', upload.single('image'), (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = {
      ...products[index],
      name: req.body.name || products[index].name,
      price: parseInt(req.body.price) || products[index].price,
      image: req.file ? req.file.filename : products[index].image,
      desc: req.body.desc || products[index].desc,
      category: req.body.category || products[index].category
    };
    saveData();
    res.json(products[index]);
  } else {
    res.status(404).json({error: 'Product not found'});
  }
});

app.delete('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  products = products.filter(p => p.id !== id);
  saveData();
  res.json({success: true});
});

app.post('/api/orders', (req, res) => {
  orders.unshift({
    id: Date.now(),
    ...req.body,
    date: new Date().toISOString()
  });
  saveData();
  res.json({success: true});
});

// Admin route
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, '../client/admin.html')));

loadData();

app.listen(PORT, () => {
  console.log(`🚀 Nayz Server running on http://localhost:${PORT}`);
  console.log(`Admin: http://localhost:${PORT}/admin`);
});

