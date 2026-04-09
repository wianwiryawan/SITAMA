import { defineConfig } from "drizzle-kit";
import 'dotenv/config';

export default defineConfig({
  // Lokasi file schema yang tadi kita buat
  schema: "./src/db/schema.ts",
  
  // Folder tempat Drizzle menyimpan catatan migrasi (akan dibuat otomatis)
  out: "./drizzle",
  
  // Kita pakai PostgreSQL
  dialect: "postgresql",
  
  dbCredentials: {
    // Mengambil string koneksi dari file .env
    url: process.env.DATABASE_URL!,
  },
});