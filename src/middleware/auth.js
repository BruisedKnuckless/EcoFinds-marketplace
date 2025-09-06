import jwt from "jsonwebtoken";

export function authRequired(req, res, next) {
  const header = req.headers.authorization || "";
  const [, token] = header.split(" ");
  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev");
    req.user = { id: payload.id, email: payload.email, username: payload.username };
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
