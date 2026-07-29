import { QdrantClient } from "@qdrant/js-client-rest";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();

const qdrant = new QdrantClient({
    url: process.env.QDRANT_URL || "http://127.0.0.1:6333",
    apiKey: process.env.QDRANT_API_KEY || "",
});

const VECTOR_SIZE = 384; // all-MiniLM-L6-v2 size

// Generate a random vector of length VECTOR_SIZE
const generateRandomVector = () => {
    return Array.from({ length: VECTOR_SIZE }, () => Math.random() * 2 - 1);
};

const agronomyPayloads = [
    {
        text: "Maize Streak Virus (MSV) symptoms include thin, discontinuous yellow-to-white streaks running parallel along the leaf veins. Early treatment involves vector control targeting Leafhoppers (Cicadulina mbila).",
        crop_code: "MAIZE",
        disease_code: "MSV_01",
        source: "DR&SS Maize Pathology Bulletin Vol. 4",
        expert_verified: true,
        image_s3_path: "silver/diagnostics/processed_images/msv_sample.jpg"
    },
    {
        text: "Fall Armyworm (FAW) is a severe pest that feeds on the whorl of the maize plant. Key signs include ragged holes in leaves and sawdust-like frass near the whorl. Spraying recommended early morning or late afternoon with emamectin benzoate.",
        crop_code: "MAIZE",
        disease_code: "FAW_02",
        source: "DR&SS Pest Control Guidelines",
        expert_verified: true,
        image_s3_path: "silver/diagnostics/processed_images/faw_sample.jpg"
    },
    {
        text: "Historical telemetry indicates a shift in maize cultivation window in Natural Region IV (semi-arid zones like Masvingo and Matabeleland South). Due to compressed rain seasons, planting calendars are shifting from early November to late December.",
        crop_code: "MAIZE",
        disease_code: "N/A",
        source: "Zimbabwe Agroclimatic Shift Assessment 2024",
        expert_verified: true,
        image_s3_path: null
    },
    {
        text: "Pfumvudza/Intwasa is a climate-proofed conservation agriculture concept adopted in Zimbabwe. It involves the use of minimum tillage through holing out digging (usually 15cm deep) and covering the soil with mulch to retain moisture. Standard plots are 16m x 39m.",
        crop_code: "MULTIPLE",
        disease_code: "N/A",
        source: "Agritex Pfumvudza Extension Manual",
        expert_verified: true,
        image_s3_path: "silver/agronomy/pfumvudza_plot.jpg"
    },
    {
        text: "For drought-prone regions such as Matabeleland North (Region V), farmers are advised to transition from maize to small grains like Sorghum (Macia variety) and Pearl Millet, which require less than 400mm of annual rainfall and mature in 90-110 days.",
        crop_code: "SORGHUM",
        disease_code: "N/A",
        source: "Seed Co Small Grains Guide",
        expert_verified: true,
        image_s3_path: null
    },
    {
        text: "Armoured Cricket (Acanthoplus discoidalis) outbreaks are increasingly common in Sorghum and Pearl Millet fields in the Lowveld. They feed aggressively on the milky stage of the grain. Control involves deep trenching around fields and targeted baiting.",
        crop_code: "SORGHUM",
        disease_code: "PEST_03",
        source: "Plant Protection Research Institute (PPRI)",
        expert_verified: true,
        image_s3_path: "silver/diagnostics/processed_images/cricket_damage.jpg"
    },
    {
        text: "Soil pH in Mashonaland East typically ranges from 4.5 to 5.2, which is too acidic for optimal maize yields. It is recommended to apply agricultural lime (calcium carbonate) at a rate of 500kg per hectare at least a month before the onset of the rains to raise pH above 5.5.",
        crop_code: "MAIZE",
        disease_code: "N/A",
        source: "Chemistry and Soils Research Institute",
        expert_verified: true,
        image_s3_path: null
    },
    {
        text: "Maize Lethal Necrosis Disease (MLND) causes severe chlorosis, mottling, and premature drying of leaves. It is caused by a co-infection of Maize Chlorotic Mottle Virus (MCMV) and Sugarcane Mosaic Virus (SCMV). Infected fields must be completely uprooted and burned to prevent spread.",
        crop_code: "MAIZE",
        disease_code: "MLND_01",
        source: "Regional MLND Control Protocol",
        expert_verified: true,
        image_s3_path: "silver/diagnostics/processed_images/mlnd_leaf.jpg"
    },
    {
        text: "During El Niño seasons, which typically result in prolonged dry spells in January and February, top dressing of Nitrogen fertilizers (e.g. Ammonium Nitrate) should be split into smaller, more frequent applications, and applied only immediately after rain showers to avoid volatilization loss.",
        crop_code: "MAIZE",
        disease_code: "N/A",
        source: "Zimbabwe Fertilizer Company (ZFC) Agronomy Guide",
        expert_verified: true,
        image_s3_path: null
    },
    {
        text: "Seed Co SC719 is a late-maturing, high-yielding white maize hybrid suited for Natural Regions I and II (Mashonaland West and Central). It takes 140-150 days to mature and has strong resistance to Grey Leaf Spot and Maize Streak Virus.",
        crop_code: "MAIZE",
        disease_code: "N/A",
        source: "Seed Co Variety Catalog 2025",
        expert_verified: true,
        image_s3_path: null
    }
];

async function seedQdrant() {
    try {
        console.log("Connecting to Qdrant...");

        const collectionName = "agronomy_manuals";

        // Recreate the collection
        console.log(`Recreating collection: ${collectionName}`);
        try {
            await qdrant.deleteCollection(collectionName);
        } catch (e) {
            // Ignore if doesn't exist
        }

        await qdrant.createCollection(collectionName, {
            vectors: { size: VECTOR_SIZE, distance: "Cosine" }
        });

        console.log("Collection created. Inserting mock vectors...");

        const points = agronomyPayloads.map(payload => ({
            id: uuidv4(),
            vector: generateRandomVector(),
            payload: payload
        }));

        const result = await qdrant.upsert(collectionName, {
            wait: true,
            points: points
        });

        console.log("Upsert result:", result);
        console.log(`Successfully inserted ${points.length} mock vectors into '${collectionName}'.`);

    } catch (err) {
        console.error("Failed to seed Qdrant:", err);
    }
}

seedQdrant();
