import { DataTypes } from "sequelize";

export function definePathologyRecord(db) {
    return db.define(
        "PathologyRecord",
        {
            pathology_record_id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4, field: "pathology_record_id" },
            field_season_id: { type: DataTypes.UUID, allowNull: true },
            farmer_id_hash: { type: DataTypes.STRING(64), allowNull: true },
            disease_code: { type: DataTypes.STRING(32), allowNull: true },
            severity_score: { type: DataTypes.FLOAT, allowNull: true },
            confidence_score: { type: DataTypes.FLOAT, allowNull: true },
            image_s3_path: { type: DataTypes.STRING(255), allowNull: true },
            vector_qdrant_id: { type: DataTypes.STRING(64), allowNull: true },
            expert_verified: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
            diagnosis_date: { type: DataTypes.DATEONLY, allowNull: true, defaultValue: DataTypes.NOW }
        },
        {
            tableName: "pathology_records",
            schema: "diagnostics",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            indexes: [{ fields: ["field_season_id"] }, { fields: ["disease_code"] }]
        }
    );
}
