/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { getAllTasks } from "../../api/task";
import type { ITask, TaskStatus, Priority } from "../../types/task";

export function useTasks() {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getAllTasks();

      // Map data backend ke format ITask di frontend
      const mappedTasks = data.map((t: any) => ({
        id: t.id,
        title: t.title,
        status: t.status as TaskStatus,
        priority: t.priority as Priority,
        // Ambil nama user dari tabel assignments
        assignee: t.assignees?.[0]?.user?.username || "Unassigned"
      }));

      setTasks(mappedTasks);
    } catch (err) {
      console.error("Gagal ambil task:",err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return { tasks, setTasks, loading, fetchTasks };
}