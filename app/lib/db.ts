import { Pool } from "pg";

const globalForPostgres = globalThis as unknown as {
  postgresPool?: Pool;
};

export const db =
  globalForPostgres.postgresPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPostgres.postgresPool = db;
}