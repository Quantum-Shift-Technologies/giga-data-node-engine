import { v4 as uuidv4 } from "uuid";
import { ACCESS_REQUEST_STORE } from "../models/mockData.mjs";

export const submitAccessRequest = (req, res, next) => {
    try {
        const { organization, use_case, project_description, plan_selected } = req.body;

        // Pydantic-like validation
        const errors = [];
        if (!organization || typeof organization !== 'string' || organization.length < 2) {
            errors.push({ loc: ["body", "organization"], msg: "field required and must be at least 2 characters", type: "value_error" });
        }
        if (!use_case || typeof use_case !== 'string') {
            errors.push({ loc: ["body", "use_case"], msg: "field required", type: "value_error" });
        }
        if (!project_description || typeof project_description !== 'string' || project_description.length < 10) {
            errors.push({ loc: ["body", "project_description"], msg: "field required and must be at least 10 characters", type: "value_error" });
        }
        if (!plan_selected || typeof plan_selected !== 'string') {
            errors.push({ loc: ["body", "plan_selected"], msg: "field required", type: "value_error" });
        }

        if (errors.length > 0) {
            return res.status(422).json({ detail: errors });
        }

        const req_id = `REQ-${uuidv4().substring(0, 8).toUpperCase()}`;
        const new_request = {
            request_id: req_id,
            organization,
            plan_selected,
            status: "APPROVED_AUTO",
            message: "Access keys provisioned successfully under Cyber and Data Protection constraints.",
            submission_timestamp: new Date().toISOString()
        };
        ACCESS_REQUEST_STORE.push(new_request);
        res.status(201).json(new_request);
    } catch (err) {
        next(err);
    }
};

export const getAccessRequests = (req, res, next) => {
    try {
        res.json(ACCESS_REQUEST_STORE);
    } catch (err) {
        next(err);
    }
};
