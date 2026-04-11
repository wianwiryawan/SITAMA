import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
// import { db } from './src/db/index'; 
import routes from './routes';

// Inisialisasi Environment Variables
dotenv.config();

const app = express();

// Middleware Global
app.use(cors());
app.use(express.json());

// Routes Utama
app.use('/api', routes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server SITAMA jalan di port ${PORT}`);
    });
  } catch (error) {
    console.error('Gagal menyalakan server SITAMA:', error);
    process.exit(1);
  }
};

startServer();