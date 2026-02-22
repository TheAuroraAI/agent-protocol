import express from "express";
import dotenv from "dotenv";
import { ACTIONS_CORS_HEADERS } from "@solana/actions";
import actionsRouter from "./routes/actions";
import invokeRouter from "./routes/invoke";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON request bodies
app.use(express.json());

// Apply Solana Actions CORS headers to every response
app.use((req, res, next) => {
  Object.entries(ACTIONS_CORS_HEADERS).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// Mount routes
app.use(actionsRouter);
app.use(invokeRouter);

// Root route
app.get("/", (_req, res) => {
  res.json({
    name: "Agent Protocol",
    description: "Trustless agent-to-agent payment protocol on Solana, powered by Blinks.",
    blink: "/api/actions/invoke",
    actions: "/actions.json",
    health: "/health",
    program: "GEtqx8oSqZeuEnMKmXMPCiDsXuQBoVk1q72SyTWxJYUG",
    network: "devnet",
  });
});

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Agent Protocol Blink Server running on port ${PORT}`);
});

export default app;
