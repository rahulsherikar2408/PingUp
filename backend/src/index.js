import "dotenv/config"

import express from "express"

import { connectDB } from "./lib/db.js";

import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

const app = express();
const PORT = process.env.PORT;

app.get("/health", (req, res) => {
    res.status(200).json({ ok: true });
});

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is up and running on PORT: ${PORT}`);
});