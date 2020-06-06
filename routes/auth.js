import express from "express";
import { checkAuth } from "../controllers/auth.js";

const router = express.Router();
router.route("/").post(checkAuth);

export default router;
