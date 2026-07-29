import express from "express";
import {
    ingestOdk,
    ingestWhatsappMedia,
    ingestOrchestrate
} from "../controllers/ingestController.mjs";

const router = express.Router();

router.post("/odk", ingestOdk);
router.post("/whatsapp-media", ingestWhatsappMedia);
router.post("/orchestrate", ingestOrchestrate);

export default router;
