import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;
import * as schema from "@shared/schema";

let pool: pkg.Pool | null = null;
let db: ReturnType<typeof drizzle> | null = null;

async function getConnection() {
  if (!pool && process.env.DATABASE_URL) {
    try {
      pool = new Pool({
        connectionString: process.env.DATABASE_URL,
      });
      db = drizzle(pool, { schema });
      console.log('✅ Database connected successfully');
    } catch (error) {
      console.error('❌ Database connection failed:', error instanceof Error ? error.message : error);
      console.log('ℹ️  Application will run without database features');
    }
  }
  return { pool, db };
}

// Initialize connection lazily
export async function getDB() {
  if (!db) {
    await getConnection();
  }
  if (!db) {
    throw new Error('Database not available');
  }
  return db;
}

// For backward compatibility
export { db };
