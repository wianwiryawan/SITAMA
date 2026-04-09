import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: any;
}


export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Ambil token dari header 'Authorization' (Bearer <token>)
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log("--- DEBUG MIDDLEWARE ---");
  console.log("Request masuk ke rute:", req.url);

  if (!token) {
    return res.status(401).json({ message: "Akses ditolak, token tidak ada" });
  }

  try {
    // Verifikasi token menggunakan secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    
    // Simpan data user yang didecode ke dalam object request agar bisa dipakai di controller
    req.user = decoded;

    // Lanjut ke controller berikutnya
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token tidak valid atau sudah kadaluarsa" });
  }
};