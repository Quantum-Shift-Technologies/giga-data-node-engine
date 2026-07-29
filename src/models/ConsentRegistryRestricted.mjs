import { DataTypes } from "sequelize";

export function defineConsentRegistryRestricted(db) {
    return db.define(
        "ConsentRegistryRestricted",
        {
            consent_record_id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4, field: "consent_record_id" },
            farmer_id: { type: DataTypes.STRING(64), allowNull: false, unique: true },
            farmer_name: { type: DataTypes.STRING(128), allowNull: false },
            phone_number: { type: DataTypes.STRING(32), allowNull: false },
            identity_reference: { type: DataTypes.STRING(64), allowNull: true },
            consent_version: { type: DataTypes.STRING(16), allowNull: false, defaultValue: "1.0" },
            consent_timestamp: { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW },
            location_consent_status: { type: DataTypes.STRING(16), allowNull: false, defaultValue: "GRANTED" },
            image_consent_status: { type: DataTypes.STRING(16), allowNull: false, defaultValue: "GRANTED" },
            data_sharing_consent_status: { type: DataTypes.STRING(16), allowNull: false, defaultValue: "GRANTED" },
            withdrawal_status: { type: DataTypes.STRING(16), allowNull: false, defaultValue: "ACTIVE" }
        },
        {
            tableName: "consent_registry_restricted",
            schema: "governance",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            indexes: [{ fields: ["farmer_id"] }]
        }
    );
}
