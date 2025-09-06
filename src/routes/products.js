import { Router } from "express";
import { db } from "../store.js";
import { authRequired } from "../middleware/auth.js";
import { v4 as uuid } from "uuid";

const router = Router();

// Create product
router.post("/", authRequired, (req, res) => {
  const { title, description, category, price, imageUrl } = req.body || {};
  if (!title || !category || price == null) return res.status(400).json({ error: "title, category, price required" });
  const product = {
    id: uuid(),
    title,
    description: description || "",
    category,
    price: Number(price),
    imageUrl: imageUrl || "https://via.placeholder.com/300x200?text=EcoFinds",
    ownerId: req.user.id,
    createdAt: new Date().toISOString()
  };
  db.products.push(product);
  res.status(201).json(product);
});

// List + filters
router.get("/", (req, res) => {
  const { q, category } = req.query;
  let items = [...db.products];
  if (category) items = items.filter(p => p.category.toLowerCase() === String(category).toLowerCase());
  if (q) {
    const s = String(q).toLowerCase();
    items = items.filter(p => p.title.toLowerCase().includes(s));
  }
  res.json(items);
});

// Get one
router.get("/:id", (req, res) => {
  const p = db.products.find(p => p.id === req.params.id);
  if (!p) return res.status(404).json({ error: "not found" });
  res.json(p);
});

// Update
router.put("/:id", authRequired, (req, res) => {
  const p = db.products.find(p => p.id === req.params.id);
  if (!p) return res.status(404).json({ error: "not found" });
  if (p.ownerId !== req.user.id) return res.status(403).json({ error: "forbidden" });
  const { title, description, category, price, imageUrl } = req.body || {};
  if (title !== undefined) p.title = title;
  if (description !== undefined) p.description = description;
  if (category !== undefined) p.category = category;
  if (price !== undefined) p.price = Number(price);
  if (imageUrl !== undefined) p.imageUrl = imageUrl;
  res.json(p);
});

// Delete
router.delete("/:id", authRequired, (req, res) => {
  const idx = db.products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "not found" });
  const p = db.products[idx];
  if (p.ownerId !== req.user.id) return res.status(403).json({ error: "forbidden" });
  db.products.splice(idx, 1);
  res.json({ ok: true });
});

// My listings
router.get("/owner/me/listings", authRequired, (req, res) => {
  const mine = db.products.filter(p => p.ownerId === req.user.id);
  res.json(mine);
});

export default router;
