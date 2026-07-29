import http from "http";

// Simple helper to perform HTTP POST to our local API
const postData = (path, data) => {
    return new Promise((resolve, reject) => {
        const payload = JSON.stringify(data);
        const options = {
            hostname: "localhost",
            port: 8000,
            path: path,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(payload)
            }
        };

        const req = http.request(options, (res) => {
            let responseBody = "";
            res.on("data", chunk => responseBody += chunk);
            res.on("end", () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(JSON.parse(responseBody));
                } else {
                    reject(new Error(`Status ${res.statusCode}: ${responseBody}`));
                }
            });
        });

        req.on("error", reject);
        req.write(payload);
        req.end();
    });
};

// Simulate fetching open-source data from the internet
// We use JSONPlaceholder as a reliable internet source to prove outbound fetching works,
// and we map the generic data into our agricultural schema.
async function fetchOpenSourceData() {
    console.log("1. Fetching open-source data from the internet...");
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const users = await response.json();

    // Map public generic data to our domain (Yields & Disease Logs)
    const yieldPayload = users.slice(0, 3).map((u, idx) => ({
        farmer_id: `public-farmer-${u.id}`,
        farm_id: uuid_v4_stub(idx),
        field_id: uuid_v4_stub(idx + 10),
        field_season_id: uuid_v4_stub(idx + 20),
        crop_code: "MAIZE",
        variety_code: "SC513",
        fresh_weight: 45.2 + (idx * 2.1),
        moisture: 14.5 - (idx * 0.3)
    }));

    const diseasePayload = users.slice(3, 5).map(u => ({
        text: `Open source pathology report for ${u.company.name}`,
        crop_code: "SORGHUM",
        source: `Internet - ${u.website}`,
        disease_code: "RUST_01",
        farmer_id: `public-farmer-${u.id}`,
        image_s3_path: `https://example.com/images/${u.id}.jpg`
    }));

    return { yieldPayload, diseasePayload };
}

// Simple deterministic UUID stub for mapping
function uuid_v4_stub(seed) {
    return `00000000-0000-0000-0000-${String(seed).padStart(12, "0")}`;
}

async function runPipeline() {
    try {
        const { yieldPayload, diseasePayload } = await fetchOpenSourceData();
        
        console.log("\n2. Pushing Bulk Yield Data (Relational DB + MinIO `agronomy/yield_logs/`)...");
        const yieldRes = await postData("/api/v1/ingest/orchestrate", {
            dataType: "YIELD",
            payload: yieldPayload
        });
        console.log("Success:", yieldRes.message);

        console.log("\n3. Pushing Disease Logs (Qdrant + Relational DB + MinIO `diagnostics/pathology_logs/`)...");
        const diseaseRes = await postData("/api/v1/ingest/orchestrate", {
            dataType: "DISEASE_LOG",
            payload: diseasePayload
        });
        console.log("Success:", diseaseRes.message);

        console.log("\n4. Pushing ODK Survey Data (MinIO `governance/surveys/`)...");
        const odkRes = await postData("/api/v1/ingest/odk", {
            farm_id: uuid_v4_stub(999),
            survey_data: { geo_fencing: true, total_area: 5.4 }
        });
        console.log("Success:", odkRes.message);

        console.log("\n✅ Integration Test Pipeline Completed Successfully!");
    } catch (e) {
        console.error("❌ Pipeline failed:", e.message);
    }
}

runPipeline();
