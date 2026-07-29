import { DataTypes } from "sequelize";

export function defineFarmer(db) {
    return db.define(
        "Farmer",
        {
            farmer_id: { type: DataTypes.STRING(64), primaryKey: true, field: "farmer_id" },
            gender_code: { type: DataTypes.CHAR(1), allowNull: true },
            age_band: { type: DataTypes.STRING(16), allowNull: true },
            preferred_language: { type: DataTypes.STRING(32), allowNull: true, defaultValue: "English" },
            farming_experience_band: { type: DataTypes.STRING(32), allowNull: true },
            primary_livelihood: { type: DataTypes.STRING(64), allowNull: true },
            province_code: { type: DataTypes.STRING(8), allowNull: true },
            district_code: { type: DataTypes.STRING(8), allowNull: true },
            ward_code: { type: DataTypes.STRING(16), allowNull: true },
            consent_status: { type: DataTypes.STRING(16), allowNull: true, defaultValue: "VALID" },
            registration_date: { type: DataTypes.DATEONLY, allowNull: true, defaultValue: DataTypes.NOW },
            quality_flag: { type: DataTypes.STRING(16), allowNull: true, defaultValue: "PASS" }
        },
        {
            tableName: "farmers",
            schema: "governance",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            indexes: [{ fields: ["district_code"] }, { fields: ["consent_status"] }]
        }
    );
}
