import { Router } from "express";
import { db } from "../store.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

router.get("/me", authRequired, (req, res) => {
  const me = db.users.find(u => u.id === req.user.id);
  if (!me) return res.status(404).json({ error: "not found" });
  res.json({ id: me.id, email: me.email, username: me.username });
});

router.put("/me", authRequired, (req, res) => {
  const me = db.users.find(u => u.id === req.user.id);
  const { username } = req.body || {};
  if (username) me.username = username;
  res.json({ id: me.id, email: me.email, username: me.username });
});

export default router;
