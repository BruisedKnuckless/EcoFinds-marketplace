import { Router } from "express";
import { db } from "../store.js";
import { authRequired } from "../middleware/auth.js";
import { v4 as uuid } from "uuid";

const router = Router();

router.get("/", authRequired, (req, res) => {
  const items = db.cart.filter(c => c.userId === req.user.id).map(c => ({
    ...c,
    product: db.products.find(p => p.id === c.productId) || null
  }));
  res.json(items);
});

router.post("/", authRequired, (req, res) => {
  const { productId, qty } = req.body || {};
  const product = db.products.find(p => p.id === productId);
  if (!product) return res.status(404).json({ error: "product not found" });
  const item = { id: uuid(), userId: req.user.id, productId, qty: Number(qty || 1) };
  db.cart.push(item);
  res.status(201).json(item);
});

router.delete("/:id", authRequired, (req, res) => {
  const idx = db.cart.findIndex(c => c.id === req.params.id && c.userId === req.user.id);
  if (idx === -1) return res.status(404).json({ error: "not found" });
  db.cart.splice(idx, 1);
  res.json({ ok: true });
});

export default router;
