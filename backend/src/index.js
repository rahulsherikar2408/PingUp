import "dotenv/config"

import express from "express"
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

import { connectDB } from "./lib/db.js";

import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

const app = express();
const PORT = process.env.PORT;
const FRONTEND_URL = process.env.FRONTEND_URL;

// Middlewares
app.use(cors({
    origin: FRONTEND_URL,
    credentials: true
}));
app.use(express.json());
app.use(clerkMiddleware());

app.get("/health", (req, res) => {
    res.status(200).json({ ok: true });
});

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is up and running on PORT: ${PORT}`);
});