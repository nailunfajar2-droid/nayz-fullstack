const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Nayz Service Phone API jalan 🚀");
});

app.get("/api/products", (req, res) => {
  res.json([
    { name: "Service HP", price: 50000 },
    { name: "Ganti LCD", price: 150000 }
  ]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server jalan di port " + PORT);
});
