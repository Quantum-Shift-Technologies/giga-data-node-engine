import { DataTypes } from "sequelize";

export function defineField(db) {
    return db.define(
        "Field",
        {
            field_id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4, field: "field_id" },
            farm_id: { type: DataTypes.UUID, allowNull: false },
            field_name_code: { type: DataTypes.STRING(32), allowNull: true },
            field_polygon: { type: DataTypes.JSONB, allowNull: true }, // GeoJSON Polygon
            area_ha: { type: DataTypes.FLOAT, allowNull: true },
            soil_texture: { type: DataTypes.STRING(32), allowNull: true },
            irrigation_status: { type: DataTypes.STRING(32), allowNull: true, defaultValue: "RAINFED" },
            quality_flag: { type: DataTypes.STRING(16), allowNull: true, defaultValue: "PASS" }
        },
        {
            tableName: "fields",
            schema: "spatial",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            indexes: [{ fields: ["farm_id"] }]
        }
    );
}
