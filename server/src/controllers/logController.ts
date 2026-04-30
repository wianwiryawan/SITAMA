import { Request, Response } from 'express';
import { db } from '../db'; 
import { activityLogs } from '../db/schema';
import { desc, sql } from 'drizzle-orm';

export const LogController = {
  createLog: async (req: Request, res: Response) => {
    try {
      const { username, action, feature, targetName } = req.body;

      await db.insert(activityLogs).values({
        username: username, 
        action: action,
        feature: feature,
        targetName: targetName,
        timestamp: new Date(),
      });

      //Menghapus log lama jadi tabel hanya berisi 100 baris terbaru
      await db.execute(sql`
        DELETE FROM activity_logs 
        WHERE id NOT IN (
          SELECT id FROM (
            SELECT id FROM activity_logs 
            ORDER BY timestamp DESC 
            LIMIT 100
          ) as temp
        )
  `   );

      return res.status(201).json({ message: 'Log berhasil dicatat' });
    } catch (error) {
      console.error('Error Create Log:', error);
      return res.status(500).json({ message: 'Gagal mencatat log' });
    }
  },

  getAllLogs: async (_req: Request, res: Response) => {
    try {
      const logs = await db
        .select()
        .from(activityLogs)
        .orderBy(desc(activityLogs.timestamp))
        .limit(100);

      return res.status(200).json(logs);
    } catch (error) {
      console.error('Error Get Logs:', error);
      return res.status(500).json({ message: 'Gagal mengambil data log' });
    }
  }
};