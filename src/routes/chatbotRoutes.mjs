import express from "express";
import {
    queryChatbot
} from "../controllers/chatbotController.mjs";

const router = express.Router();

router.post("/query", queryChatbot);

export default router;
