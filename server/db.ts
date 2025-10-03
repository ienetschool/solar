import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import type { Connection } from 'mysql2/promise';
import * as schema from "@shared/schema";

let connection: Connection | null = null;
let db: ReturnType<typeof drizzle> | null = null;

async function getConnection() {
  if (!connection && process.env.DATABASE_URL) {
    try {
      connection = await mysql.createConnection(process.env.DATABASE_URL);
      db = drizzle(connection, { schema, mode: 'default' });
      console.log('✅ Database connected successfully');
    } catch (error) {
      console.error('❌ Database connection failed:', error instanceof Error ? error.message : error);
      console.log('ℹ️  Application will run without database features');
    }
  }
  return { connection, db };
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
