/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { getAllTasks, type ITaskData } from "../../api/task";
import type { ITask, TaskStatus, Priority } from "../../types/task";
import { getAllUsers } from "../../api/user";

export function useTasks() {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedParticipantIds, setSelectedParticipantIds] = useState<number[]>([]);
  const [selectedTask, setSelectedTask] = useState<ITaskData | null>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [customParticipants, setCustomParticipants] = useState<string[]>([]);

  const taskStats = useMemo(() => {
      return {
        total: tasks.length,
        completed: tasks.filter(t => t.status === 'done').length,
        todo: tasks.filter(t => t.status === 'todo').length,
        doing: tasks.filter(t => t.status === 'doing').length
      };
    }, [tasks]);
    
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
        assignee: t.assignees?.[0]?.user?.username || "Unassigned",
        note: t.note,
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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setAllUsers(data);
      } catch (err) {
        console.error("Gagal ambil daftar user", err);
      }
    };
    fetchUsers();
    fetchTasks();
  }, []);

  // Sync participants saat modal edit dibuka
  useEffect(() => {
    if (selectedTask) {
      const ids = selectedTask.assignee?.map((p: any) => p.userId);
      setSelectedParticipantIds(ids);
      // Jika ada external_participants string, pecah jadi array
      // setCustomParticipants(selectedEvent.external_participants?.split(', ') || []);
    } else {
      setSelectedParticipantIds([]);
      // setCustomParticipants([]);
    }
  }, [selectedTask, isModalOpen]);
      

  return { 
    tasks, setTasks, taskStats,
    loading, 
    fetchTasks, 
    selectedParticipantIds, setSelectedParticipantIds,
    setIsModalOpen, isModalOpen,
    setSelectedTask, selectedTask,
    allUsers,
    isDropdownOpen, setIsDropdownOpen,
    searchTerm, setSearchTerm,
    customParticipants, setCustomParticipants,
   };
}
