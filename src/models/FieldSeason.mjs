import { DataTypes } from "sequelize";

export function defineFieldSeason(db) {
    return db.define(
        "FieldSeason",
        {
            field_season_id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4, field: "field_season_id" },
            field_id: { type: DataTypes.UUID, allowNull: false },
            season_id: { type: DataTypes.STRING(16), allowNull: false },
            season_status: { type: DataTypes.STRING(24), allowNull: true, defaultValue: "ACTIVE" },
            primary_crop_code: { type: DataTypes.STRING(32), allowNull: false },
            primary_variety_code: { type: DataTypes.STRING(32), allowNull: true },
            planting_date: { type: DataTypes.DATEONLY, allowNull: true },
            actual_harvest_date: { type: DataTypes.DATEONLY, allowNull: true },
            record_completeness_pct: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 }
        },
        {
            tableName: "field_seasons",
            schema: "agronomy",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            indexes: [{ fields: ["field_id"] }, { fields: ["season_id"] }, { fields: ["primary_crop_code"] }]
        }
    );
}
