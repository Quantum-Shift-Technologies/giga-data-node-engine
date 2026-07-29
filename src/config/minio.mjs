import * as Minio from "minio";
import dotenv from "dotenv";

dotenv.config();

let minioClient = null;

export const initializeMinioClient = () => {
    if (minioClient) return minioClient;

    const requiredEnvVars = ["MINIO_ENDPOINT", "MINIO_ACCESS_KEY", "MINIO_SECRET_KEY"];
    for (const v of requiredEnvVars) {
        if (!process.env[v]) {
            console.warn(`MinIO connection warning: Environment variable ${v} is missing.`);
        }
    }

    minioClient = new Minio.Client({
        endPoint: process.env.MINIO_ENDPOINT || "localhost",
        port: parseInt(process.env.MINIO_PORT) || 9000,
        useSSL: process.env.MINIO_USE_SSL === "true",
        accessKey: process.env.MINIO_ACCESS_KEY || "",
        secretKey: process.env.MINIO_SECRET_KEY || ""
    });

    return minioClient;
};

export const getMinioClient = () => {
    if (!minioClient) {
        return initializeMinioClient();
    }
    return minioClient;
};
