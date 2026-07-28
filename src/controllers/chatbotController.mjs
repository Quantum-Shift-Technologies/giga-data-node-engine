import { getBotResponse } from "../models/mockData.mjs";

export const queryChatbot = (req, res, next) => {
    try {
        const { message } = req.body;

        if (!message || typeof message !== 'string') {
            return res.status(422).json({
                detail: [{ loc: ["body", "message"], msg: "field required", type: "value_error" }]
            });
        }

        const result = getBotResponse(message);
        res.json({
            text: result.text,
            source_documents: result.source_documents
        });
    } catch (err) {
        next(err);
    }
};
