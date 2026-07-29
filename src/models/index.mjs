import { sequelize } from "../config/database.mjs";
import { defineFarmer } from "./Farmer.mjs";
import { defineConsentRegistryRestricted } from "./ConsentRegistryRestricted.mjs";
import { defineFarm } from "./Farm.mjs";
import { defineField } from "./Field.mjs";
import { defineFieldSeason } from "./FieldSeason.mjs";
import { defineHarvestMeasurement } from "./HarvestMeasurement.mjs";
import { definePathologyRecord } from "./PathologyRecord.mjs";

let initializedModels = null;

function defineModels(db) {
    const Farmer = defineFarmer(db);
    const ConsentRegistryRestricted = defineConsentRegistryRestricted(db);
    const Farm = defineFarm(db);
    const Field = defineField(db);
    const FieldSeason = defineFieldSeason(db);
    const HarvestMeasurement = defineHarvestMeasurement(db);
    const PathologyRecord = definePathologyRecord(db);

    return {
        Farmer,
        ConsentRegistryRestricted,
        Farm,
        Field,
        FieldSeason,
        HarvestMeasurement,
        PathologyRecord
    };
}

function defineAssociations(models) {
    const {
        Farm,
        Field,
        FieldSeason,
        HarvestMeasurement,
        PathologyRecord
    } = models;

    // Farm -> Field association
    Field.belongsTo(Farm, { foreignKey: "farm_id", onDelete: "CASCADE", as: "farm" });
    Farm.hasMany(Field, { foreignKey: "farm_id", as: "fields" });

    // Field -> FieldSeason association
    FieldSeason.belongsTo(Field, { foreignKey: "field_id", onDelete: "CASCADE", as: "field" });
    Field.hasMany(FieldSeason, { foreignKey: "field_id", as: "seasons" });

    // FieldSeason -> HarvestMeasurement association
    HarvestMeasurement.belongsTo(FieldSeason, { foreignKey: "field_season_id", onDelete: "CASCADE", as: "season" });
    FieldSeason.hasMany(HarvestMeasurement, { foreignKey: "field_season_id", as: "measurements" });

    // FieldSeason -> PathologyRecord association
    PathologyRecord.belongsTo(FieldSeason, { foreignKey: "field_season_id", onDelete: "SET NULL", as: "season" });
    FieldSeason.hasMany(PathologyRecord, { foreignKey: "field_season_id", as: "pathology_records" });
}

export function initializeModels() {
    if (initializedModels) {
        return initializedModels;
    }

    const models = defineModels(sequelize);
    defineAssociations(models);
    initializedModels = models;
    return models;
}

export async function syncModels(options = {}) {
    const models = initializeModels();
    await sequelize.sync(options);
    return models;
}

export function getModels() {
    if (!initializedModels) {
        return initializeModels();
    }
    return initializedModels;
}
