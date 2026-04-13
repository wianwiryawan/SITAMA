import { Request, Response } from 'express';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.username, username),
    });

    if (!user) {
      return res.status(404).json({ message: "Username tidak ditemukan" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Password salah" });
    }

    // const token = jwt.sign(
    //   { id: user.id, role: user.role },
    //   process.env.JWT_SECRET || "secret",
    //   { expiresIn: "1d" }
    // );

    res.json({ 
      message: "Login Berhasil",
      // token,
      user: { 
        id: user.id,
        username: user.username,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};