import { Pool } from "pg";

const globalForPool = globalThis as unknown as { authPool?: Pool };

export const pool =
  globalForPool.authPool ?? new Pool({ connectionString: process.env.DATABASE_URL });

if (process.env.NODE_ENV !== "production") globalForPool.authPool = pool;
