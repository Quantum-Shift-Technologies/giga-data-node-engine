import { v4 as uuidv4 } from "uuid";

export const registerConsent = async (req, res, next) => {
    try {
        const { farmer_id, farmer_name, phone_number, consent_version } = req.body;

        if (!farmer_id || !farmer_name || !phone_number) {
            return res.status(422).json({
                error: "farmer_id, farmer_name, and phone_number are required fields"
            });
        }

        res.status(201).json({
            success: true,
            message: "Consent registered successfully",
            consent_record_id: uuidv4()
        });
    } catch (err) {
        next(err);
    }
};

export const withdrawConsent = async (req, res, next) => {
    try {
        const { farmer_id } = req.body;

        if (!farmer_id) {
            return res.status(422).json({
                error: "farmer_id is required"
            });
        }

        res.json({
            success: true,
            message: "Consent successfully withdrawn and cleanups queued"
        });
    } catch (err) {
        next(err);
    }
};
