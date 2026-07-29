import pg from "pg";
import { dbConfig, sequelize } from "./database.mjs";
import { initializeModels, syncModels } from "../models/index.mjs";

export async function verifyDatabaseConnection() {
    try {
        await sequelize.authenticate();
    } catch (err) {
        if (err.message && err.message.includes("does not exist")) {
            console.log(`Database "${dbConfig.database}" does not exist. Attempting self-healing creation...`);
            const client = new pg.Client({
                host: dbConfig.host,
                port: dbConfig.port,
                user: dbConfig.username,
                password: dbConfig.password,
                database: "postgres" // connect to default administrative database
            });
            await client.connect();
            await client.query(`CREATE DATABASE "${dbConfig.database}"`);
            await client.end();
            console.log(`Database "${dbConfig.database}" created successfully.`);
            
            // Attempt to re-authenticate with the newly created database
            await sequelize.authenticate();
        } else {
            throw err;
        }
    }
    return dbConfig;
}
export async function createSchemas() {
    const schemas = ["governance", "spatial", "agronomy", "diagnostics"];
    for (const schema of schemas) {
        await sequelize.query(`CREATE SCHEMA IF NOT EXISTS ${schema};`);
    }
}

export async function initializeDatabase(options = {}) {
    const {
        sync = (process.env.DB_SYNC_ON_STARTUP || "false").toLowerCase() === "true",
        alter = (process.env.DB_SYNC_ALTER || "false").toLowerCase() === "true",
        force = false,
    } = options;

    initializeModels();
    await verifyDatabaseConnection();

    if (sync) {
        await createSchemas();
        await syncModels({ alter, force, logging: false });
        console.log("Database models synchronized successfully.");
    }
}
