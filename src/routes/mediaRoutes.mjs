import express from "express";
import { uploadMiddleware, uploadMedia } from "../controllers/mediaController.mjs";

const router = express.Router();

router.post("/upload", uploadMiddleware, uploadMedia);

export default router;
