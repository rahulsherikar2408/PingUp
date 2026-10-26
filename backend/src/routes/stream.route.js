import express from "express";
import { getStreamToken, initiateCall } from "../controllers/stream.controller.js";
import { protectRoute } from "../middleware/auth.mddleware.js";

const router = express.Router();

router.use(protectRoute);

router.get("/token", getStreamToken);
router.post("/call", initiateCall);

export default router;
