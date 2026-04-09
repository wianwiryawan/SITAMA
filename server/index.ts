import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
// import { db } from './src/db/index'; 
import apiRoutes from './src/routes';

// Inisialisasi Environment Variables
dotenv.config();

const app = express();

// Middleware Global
app.use(cors());
app.use(express.json());

// Routes Utama
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 5000;

// Fungsi untuk memastikan server jalan
const startServer = async () => {
  try {
    // Di Drizzle + postgres-js, koneksi biasanya bersifat lazy (tersambung saat query pertama).
    // Tapi kita bisa melakukan "ping" sederhana untuk verifikasi koneksi saat startup.
    
    console.log('Mencoba memverifikasi koneksi database...');
    
    // Opsional: Cek koneksi sederhana
    // await db.execute('SELECT 1'); 
    
    console.log('Database SITAMA terhubung (via Drizzle).');

    app.listen(PORT, () => {
      console.log(`Server SITAMA (Full-TS) jalan di port ${PORT}`);
    });
  } catch (error) {
    console.error('Gagal menyalakan server SITAMA:', error);
    process.exit(1);
  }
};

startServer();