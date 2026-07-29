import dotenv from "dotenv";

dotenv.config();

let db = null;
let queryDuckDB = async () => {
    return [];
};

try {
    const duckdbModule = await import("duckdb");
    const duckdb = duckdbModule.default || duckdbModule;
    const dbPath = process.env.DUCKDB_PATH || ":memory:";
    db = new duckdb.Database(dbPath);
    queryDuckDB = (sql, params = []) => {
        return new Promise((resolve, reject) => {
            db.all(sql, params, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    };
    console.log("DuckDB successfully loaded.");
} catch (e) {
    console.log("System Notice: DuckDB C++ native module is not installed on this system. Operating in standard mock analytics fallback mode.");
}

export { db, queryDuckDB };
