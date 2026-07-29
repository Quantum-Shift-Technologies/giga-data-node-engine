import express from "express";
import {
    registerConsent,
    withdrawConsent
} from "../controllers/consentController.mjs";

const router = express.Router();

router.post("/register", registerConsent);
router.post("/withdraw", withdrawConsent);

export default router;
