import { defineConfig } from "drizzle-kit";
import 'dotenv/config';

export default defineConfig({
  // Lokasi file schema
  schema: "./src/db/schema.ts",
  
  // Folder  catatan migrasi 
  out: "./src/db/drizzle",
  
  dialect: "postgresql",
  
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});