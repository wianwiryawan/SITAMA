import { Request, Response } from 'express';
import { db } from '../db';
import { users } from '../db/schema';
import { asc } from 'drizzle-orm';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const allUsers = await db
      .select({
        id: users.id,
        username: users.username,
        role: users.role,
        name: users.name,
        nip: users.nip,
        pangkat: users.pangkat,
        jabatan: users.jabatan,
      })
      .from(users)
      .orderBy(asc(users.username)); 
    res.json(allUsers);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil daftar pegawai", error });
  }
};