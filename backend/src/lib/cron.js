import { CronJob } from "cron";
import http from "node:http";
import https from "node:https";

// every 14 minutes send a GET request to the health endpoint
const job = new CronJob("*/14 * * * *", function () {
  const base = process.env.RENDER_EXTERNAL_URL || process.env.FRONTEND_URL;
  if (!base) return;

  try {
    const url = new URL("/health", base).href;
    const client = url.startsWith("https:") ? https : http;

    client
      .get(url, (res) => {
        if (res.statusCode === 200) console.log("Health check ping sent successfully");
        else console.log("Health check ping response status:", res.statusCode);
      })
      .on("error", (e) => console.error("Error while pinging health check:", e.message));
  } catch (err) {
    console.error("Invalid URL in cron job:", err.message);
  }
});

export default job;
