import { MOCK_DISTRICTS } from "../models/mockData.mjs";

export const getBoundaries = (req, res, next) => {
    try {
        res.json({
            type: "FeatureCollection",
            features: [
                {
                    type: "Feature",
                    properties: { name: "Mutoko", district_id: "mutoko", province: "Mashonaland East", avg_yield: 4.35 },
                    geometry: {
                        type: "Polygon",
                        coordinates: [[[32.1, -17.3], [32.3, -17.3], [32.3, -17.5], [32.1, -17.5], [32.1, -17.3]]]
                    }
                },
                {
                    type: "Feature",
                    properties: { name: "Bindura", district_id: "bindura", province: "Mashonaland Central", avg_yield: 5.12 },
                    geometry: {
                        type: "Polygon",
                        coordinates: [[[31.2, -17.2], [31.4, -17.2], [31.4, -17.4], [31.2, -17.4], [31.2, -17.2]]]
                    }
                },
                {
                    type: "Feature",
                    properties: { name: "Mazowe", district_id: "mazowe", province: "Mashonaland Central", avg_yield: 5.60 },
                    geometry: {
                        type: "Polygon",
                        coordinates: [[[30.8, -17.4], [31.0, -17.4], [31.0, -17.6], [30.8, -17.6], [30.8, -17.4]]]
                    }
                }
            ]
        });
    } catch (err) {
        next(err);
    }
};

export const getMapTimeline = (req, res, next) => {
    try {
        res.json({
            dates: ["April 2024", "May 2024", "June 2024", "July 2024", "August 2024", "September 2024", "October 2024", "November 2024", "December 2024", "January 2025", "February 2025", "March 2025", "Today"],
            metrics_by_month: {
                "April 2024": { avg_ndvi: 0.38, rain_accumulated: "420mm", active_reports: 12 },
                "August 2024": { avg_ndvi: 0.31, rain_accumulated: "450mm", active_reports: 45 },
                "December 2024": { avg_ndvi: 0.52, rain_accumulated: "580mm", active_reports: 112 },
                "Today": { avg_ndvi: 0.65, rain_accumulated: "620mm", active_reports: 248 }
            }
        });
    } catch (err) {
        next(err);
    }
};

export const getDistrictDetails = (req, res, next) => {
    try {
        const { name } = req.params;
        const details = MOCK_DISTRICTS[name.toLowerCase()];
        if (!details) {
            return res.status(404).json({ detail: `Agronomic data for district '${name}' not found` });
        }
        res.json(details);
    } catch (err) {
        next(err);
    }
};
