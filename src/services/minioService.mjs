import { initializeMinioClient } from "../config/minio.mjs";

export const uploadMediaToMinio = async (buffer, objectName, mimeType, customMetadata = {}) => {
    const minioClient = initializeMinioClient();
    const bucketName = process.env.MINIO_BUCKET_NAME || "gigadata-lakehouse";

    // Ensure bucket exists
    const exists = await minioClient.bucketExists(bucketName);
    if (!exists) {
        await minioClient.makeBucket(bucketName, "us-east-1");
    }

    const metaData = {
        "Content-Type": mimeType,
        ...customMetadata
    };

    await minioClient.putObject(bucketName, objectName, buffer, buffer.length, metaData);

    return {
        bucket: bucketName,
        objectName: objectName
    };
};

export const getMediaPresignedUrl = async (objectName) => {
    const minioClient = initializeMinioClient();
    const bucketName = process.env.MINIO_BUCKET_NAME || "gigadata-lakehouse";

    // 7 days expiration
    return await minioClient.presignedGetObject(bucketName, objectName, 7 * 24 * 60 * 60);
};
