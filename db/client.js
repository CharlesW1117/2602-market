import pg from "pg";

const client = new pg.Client({
  connectionString:
    process.env.DATABASE_URL || "postgres://localhost:5432/market",
});

export default client;
