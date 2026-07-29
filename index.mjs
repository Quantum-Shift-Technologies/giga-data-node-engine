import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

import datasetRoutes from "./src/routes/datasetRoutes.mjs";
import mapRoutes from "./src/routes/mapRoutes.mjs";
import accessRequestRoutes from "./src/routes/accessRequestRoutes.mjs";
import chatbotRoutes from "./src/routes/chatbotRoutes.mjs";
import ingestRoutes from "./src/routes/ingestRoutes.mjs";
import consentRoutes from "./src/routes/consentRoutes.mjs";
import mediaRoutes from "./src/routes/mediaRoutes.mjs";
import commercialRoutes from "./src/routes/commercialRoutes.mjs";
import { openapiSpecification } from "./src/docs/openapi.mjs";
import { initializeDatabase } from "./src/config/databaseBootstrap.mjs";
import { typeDefs } from "./src/graphql/schema.mjs";
import { resolvers } from "./src/graphql/resolvers.mjs";

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
            api_docs_json: "/api-docs.json",
            graphql_api: "/graphql"
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
app.use(`${prefix}/ingest`, ingestRoutes);
app.use(`${prefix}/consent`, consentRoutes);
app.use(`${prefix}/media`, mediaRoutes);
app.use(`${prefix}/commercial`, commercialRoutes);
app.use(`${prefix}`, commercialRoutes); // also mount directly under prefix for /policy/yield-forecast paths

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Unhandled API Error:", err);
    const statusCode = err.status || err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        error: err.message || "Internal Server Error",
    });
});

async function start() {
    try {
        await initializeDatabase();
    } catch (err) {
        console.error("Database connection/sync warning:", err.message);
    }

    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
    });
    await apolloServer.start();
    app.use("/graphql", expressMiddleware(apolloServer));

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`GraphQL endpoint available at http://localhost:${PORT}/graphql`);
    });
}

start();


