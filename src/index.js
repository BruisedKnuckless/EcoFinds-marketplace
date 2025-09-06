import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import cors from "cors";   // ✅ Add CORS

dotenv.config();
const app = express();

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.error("❌ MongoDB error:", err));

// middleware
app.use(express.json());

// ✅ Enable CORS (for frontend integration)
app.use(cors({
  origin: [
    "http://localhost:5173",        // Vite dev (if used)
    "http://localhost:3000",        // React dev
    "https://<your-lovable-domain>" // Replace with Lovable AI frontend domain
  ],
  credentials: false
}));

// test route
app.get("/", (req, res) => {
  res.json({ ok: true, service: "EcoFinds API" });
});

// ✅ Health check (useful for testing)
app.get("/api/health", async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// auth routes (changed to /api/auth)
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
