import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const DEFAULT_DB_PORT = 5432;

function buildDatabaseConfig() {
    const host = process.env.DB_HOST || "127.0.0.1";
    const port = Number(process.env.DB_PORT || DEFAULT_DB_PORT);
    const database = process.env.DB_NAME || "giga_data_engine";
    const username = process.env.DB_USER || "postgres";
    const password = process.env.DB_PASSWORD || "12345";
    const logging = (process.env.DB_LOGGING || "false").toLowerCase() === "true";

    return {
        host,
        port,
        database,
        username,
        password,
        logging,
    };
}

export const dbConfig = buildDatabaseConfig();

export const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: "postgres",
    logging: dbConfig.logging ? console.log : false,
    dialectOptions: {
        application_name: "giga-data-engine-backend",
    },
    pool: {
        max: 10,
        min: 0,
        idle: 10000,
        acquire: 30000,
    },
});
