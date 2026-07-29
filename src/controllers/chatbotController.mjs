import { getBotResponse } from "../models/mockData.mjs";
import { qdrant } from "../config/qdrant.mjs";

export const queryChatbot = async (req, res, next) => {
    try {
        const { message } = req.body;

        if (!message || typeof message !== 'string') {
            return res.status(422).json({
                detail: [{ loc: ["body", "message"], msg: "field required", type: "value_error" }]
            });
        }

        let qdrantResults = null;
        try {
            // Check collections list to check if cluster connects
            const collections = await qdrant.getCollections();
            const collectionExists = collections.collections.some(c => c.name === "agronomy_manuals");

            if (collectionExists) {
                // In production, we would compute text embeddings and perform search:
                // qdrantResults = await qdrant.search("agronomy_manuals", { vector: queryVector, limit: 3 });
                console.log("Vector search collection 'agronomy_manuals' found on Qdrant.");
            }
        } catch (qdrantError) {
            console.warn("Qdrant query failed (falling back to mock catalog):", qdrantError.message);
        }

        const result = getBotResponse(message);
        res.json({
            text: result.text,
            source_documents: result.source_documents,
            qdrant_status: qdrantResults ? "Active Vector Search" : "Mock Fallback"
        });
    } catch (err) {
        next(err);
    }
};
