import { Request, Response } from 'express';
import { db } from '../db';
import { tasks, taskAssignments } from '../db/schema';
import { eq } from 'drizzle-orm';

export const taskController = {
  createTask: async (req: Request, res: Response) => {
    try {
      const { title, status, priority, assigneeIds, note } = req.body;

      const [newTask] = await db.insert(tasks).values({
        title,
        status,
        priority,
        note
      }).returning();

      // Jika ada assignees insert ke task_assignments
      if (assigneeIds && assigneeIds.length > 0) {
        const assignments = assigneeIds.map((userId: number) => ({
          userId,
          taskId: newTask.id,
        }));
        await db.insert(taskAssignments).values(assignments);
      }

      return res.status(201).json({ message: "Task berhasil dibuat", data: newTask });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Gagal membuat task" });
    }
  },

  getAllTasks: async (_req: Request, res: Response) => {
    try {
      const allTasks = await db.query.tasks.findMany({
        with: {
          assignees: {
            with: {
              user: true, 
            },
          },
        },
        orderBy: (tasks, { desc }) => [desc(tasks.createdAt)],
      });

      return res.status(200).json(allTasks);
    } catch (error) {
      console.error("gagal mengambil data task",error);
      return res.status(500).json({ message: "Gagal mengambil data task" });
    }
  },

  updateTask: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { title, status, priority, assigneeIds, note } = req.body;

      await db.update(tasks)
        .set({ title, status, priority, updatedAt: new Date(), note })
        .where(eq(tasks.id, Number(id)));

      // Update Assignees (hapus lama, insert baru)
      if (assigneeIds) {
        await db.delete(taskAssignments).where(eq(taskAssignments.taskId, Number(id)));
        
        if (assigneeIds.length > 0) {
          const assignments = assigneeIds.map((userId: number) => ({
            userId,
            taskId: Number(id),
          }));
          await db.insert(taskAssignments).values(assignments);
        }
      }

      return res.status(200).json({ message: "Task berhasil diperbarui" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Gagal memperbarui task" });
    }
  },

  deleteTask: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      // data di task_assignments otomatis terhapus saat task dihapus karena pake cascade
      await db.delete(tasks).where(eq(tasks.id, Number(id)));

      return res.status(200).json({ message: "Task berhasil dihapus" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Gagal menghapus task" });
    }
  }
};