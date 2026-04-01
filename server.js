const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Storage gambar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// Data sementara (nanti bisa upgrade database)
let products = [
  { id: 1, name: "Service HP", price: 50000, category: "service", desc: "Perbaikan HP", image: "" },
  { id: 2, name: "Ganti LCD", price: 150000, category: "service", desc: "LCD original", image: "" }
];

// ROOT
app.get("/", (req, res) => {
  res.send("Nayz Service Phone API jalan 🚀");
});

// GET PRODUCTS
app.get("/api/products", (req, res) => {
  res.json(products);
});

// ADD PRODUCT
app.post("/api/products", upload.single("image"), (req, res) => {
  const { name, price, category, desc } = req.body;

  const newProduct = {
    id: Date.now(),
    name,
    price: Number(price),
    category,
    desc,
    image: req.file ? req.file.filename : ""
  };

  products.push(newProduct);
  res.json({ success: true, product: newProduct });
});

// DELETE PRODUCT
app.delete("/api/products/:id", (req, res) => {
  const id = Number(req.params.id);
  products = products.filter(p => p.id !== id);
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server jalan di port " + PORT);
});
