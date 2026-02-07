import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

const config: Config = {
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || process.env.SUPABASE_DATABASE_URL || "",
  },
  // Print SQL statements in console during migration
  verbose: true,
  // Strict mode for type safety
  strict: true,
};

export default config;
