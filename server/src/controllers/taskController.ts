import { Request, Response } from 'express';
import { db } from '../db';
import { tasks } from '../db/schema';
import { eq } from 'drizzle-orm';

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const allTasks = await db.query.tasks.findMany({
      with: {
        assignees: {
          with: {
            user: true,
          },
        },
      },
    });

    res.json(allTasks);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data", error });
  }
};