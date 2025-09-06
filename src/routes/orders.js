import { Router } from "express";
import { db } from "../store.js";
import { authRequired } from "../middleware/auth.js";
import { v4 as uuid } from "uuid";

const router = Router();

router.get("/", authRequired, (req, res) => {
  const mine = db.orders.filter(o => o.userId === req.user.id).map(o => ({
    ...o,
    product: db.products.find(p => p.id === o.productId) || null
  }));
  res.json(mine);
});

router.post("/", authRequired, (req, res) => {
  // Checkout all cart items -> create orders
  const items = db.cart.filter(c => c.userId === req.user.id);
  const created = items.map(c => ({
    id: uuid(),
    userId: req.user.id,
    productId: c.productId,
    purchasedAt: new Date().toISOString()
  }));
  db.orders.push(...created);
  // Clear cart
  db.cart = db.cart.filter(c => c.userId !== req.user.id);
  res.status(201).json({ ok: true, orders: created });
});

export default router;
