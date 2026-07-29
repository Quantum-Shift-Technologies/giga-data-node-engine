import express from "express";
import {
    getClimateRisk,
    getCropMigrationSuitability,
    getDiseaseOutbreaks,
    getYieldProjections,
    getFarmerCreditScore,
    getSupplyChainDemand
} from "../controllers/commercialController.mjs";

const router = express.Router();

// Four core use cases & commercial channels
router.get("/climate-risk", getClimateRisk);
router.get("/crop-suitability-migration", getCropMigrationSuitability);
router.get("/disease-outbreak-alert", getDiseaseOutbreaks);
router.get("/yield-projections", getYieldProjections);
router.get("/credit/scores/:farmer_id", getFarmerCreditScore);
router.get("/supply-chain/demand-forecast", getSupplyChainDemand);

export default router;
