import { DataTypes } from "sequelize";

export function defineHarvestMeasurement(db) {
    return db.define(
        "HarvestMeasurement",
        {
            harvest_measurement_id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4, field: "harvest_measurement_id" },
            field_season_id: { type: DataTypes.UUID, allowNull: false },
            harvest_date: { type: DataTypes.DATEONLY, allowNull: false },
            quadrat_area_m2: { type: DataTypes.FLOAT, allowNull: true, defaultValue: 4.0 },
            number_of_quadrats: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 1 },
            fresh_weight_kg: { type: DataTypes.FLOAT, allowNull: false },
            grain_moisture_pct: { type: DataTypes.FLOAT, allowNull: false },
            adjusted_dry_weight_kg: { type: DataTypes.FLOAT, allowNull: true },
            measured_yield_t_ha: { type: DataTypes.FLOAT, allowNull: true },
            enumerator_id_hash: { type: DataTypes.STRING(64), allowNull: false },
            verification_status: { type: DataTypes.STRING(16), allowNull: true, defaultValue: "PENDING" }
        },
        {
            tableName: "harvest_measurements",
            schema: "agronomy",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            indexes: [{ fields: ["field_season_id"] }],
            hooks: {
                beforeSave: (measurement) => {
                    if (measurement.fresh_weight_kg != null && measurement.grain_moisture_pct != null) {
                        // Formula: fresh_weight_kg * ( (100 - grain_moisture_pct) / (100 - 12.5) )
                        measurement.adjusted_dry_weight_kg = measurement.fresh_weight_kg * ((100 - measurement.grain_moisture_pct) / 87.5);
                    }
                }
            }
        }
    );
}
