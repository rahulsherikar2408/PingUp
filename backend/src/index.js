import "dotenv/config";

import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

import fs from "fs";
import path from "path";

import { connectDB } from "./lib/db.js";
import job from "./lib/cron.js";

import clerkWebhook from "./webhooks/clerk.webhook.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import streamRoutes from "./routes/stream.route.js";
import { app, server } from "./lib/socket.js";

import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL;
const publicDir = path.join(process.cwd(), "public");

// Middlewares
app.use("/api/webhooks/clerk", express.raw({ type: "application/json" }), clerkWebhook);
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? FRONTEND_URL || true
        : FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(clerkMiddleware());

app.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/stream", streamRoutes);

// Error handler for API / Multer errors
app.use((err, req, res, next) => {
  console.error("API error:", err);
  res.status(err.status || 400).json({ message: err.message || "Internal server error" });
});

// if the public directory exists, serve the static files (production build)
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
  app.get("/{*any}", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return res.status(404).json({ message: "API endpoint not found" });
    }
    res.sendFile(path.join(publicDir, "index.html"), (err) => {
      if (err) next(err);
    });
  });
}

server.listen(PORT, () => {
  connectDB();
  console.log(`Server is up and running on PORT: ${PORT}`);

  if (process.env.NODE_ENV === "production") {
    job.start();
  }
});
