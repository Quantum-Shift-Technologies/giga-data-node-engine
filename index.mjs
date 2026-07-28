import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";

import datasetRoutes from "./src/routes/datasetRoutes.mjs";
import mapRoutes from "./src/routes/mapRoutes.mjs";
import accessRequestRoutes from "./src/routes/accessRequestRoutes.mjs";
import chatbotRoutes from "./src/routes/chatbotRoutes.mjs";
import { openapiSpecification } from "./src/docs/openapi.mjs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Health endpoint
app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

// Branding/Root endpoint
app.get("/", (req, res) => {
    res.json({
        platform: "GigaData Engine",
        description: "National Agronomic Data Infrastructure Platform in Zimbabwe.",
        status: "Online",
        endpoints: {
            swagger_documentation: "/api-docs",
            api_docs_json: "/api-docs.json"
        }
    });
});

app.get("/api-docs.json", (_req, res) => {
    res.json(openapiSpecification);
});

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(openapiSpecification, {
        explorer: true,
        swaggerOptions: {
            docExpansion: "list",
        },
    })
);

// Routing Middlewares
const prefix = "/api/v1";
app.use(`${prefix}/datasets`, datasetRoutes);
app.use(`${prefix}/map`, mapRoutes);
app.use(`${prefix}/access-requests`, accessRequestRoutes);
app.use(`${prefix}/chatbot`, chatbotRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Unhandled API Error:", err);
    const statusCode = err.status || err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        error: err.message || "Internal Server Error",
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
