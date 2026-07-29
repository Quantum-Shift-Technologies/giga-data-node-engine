import { DataTypes } from "sequelize";

export function defineFarm(db) {
    return db.define(
        "Farm",
        {
            farm_id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4, field: "farm_id" },
            farm_name_code: { type: DataTypes.STRING(32), allowNull: true },
            farm_centroid: { type: DataTypes.JSONB, allowNull: true }, // GeoJSON Point
            farm_polygon: { type: DataTypes.JSONB, allowNull: true }, // GeoJSON Polygon
            natural_region: { type: DataTypes.CHAR(5), allowNull: true },
            elevation_m: { type: DataTypes.FLOAT, allowNull: true },
            total_area_ha: { type: DataTypes.FLOAT, allowNull: true },
            tenure_type: { type: DataTypes.STRING(32), allowNull: true },
            primary_water_source: { type: DataTypes.STRING(32), allowNull: true },
            polygon_validation_status: { type: DataTypes.STRING(16), allowNull: true, defaultValue: "UNVERIFIED" },
            quality_flag: { type: DataTypes.STRING(16), allowNull: true, defaultValue: "PASS" }
        },
        {
            tableName: "farms",
            schema: "spatial",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            indexes: [{ fields: ["natural_region"] }, { fields: ["polygon_validation_status"] }]
        }
    );
}
