/* eslint-disable @typescript-eslint/no-explicit-any */
import { createTask, updateTask, deleteTask, type ITaskData } from "../../api/task";
import type { ILog } from "../../types/task";

export function useTaskActions(currentUser: any, fetchTasks: () => void, setLogs: any) {

  const addLog = (action: string, target: string) => {
    const newLog: ILog = {
      id: Date.now(),
      user: currentUser.username,
      action,
      target,
      timestamp: new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    setLogs((prev: ILog[]) => [newLog, ...prev].slice(0, 50));
  };

  const handleAddTask = async (formData: FormData, closeModal: () => void) => {
    const newTaskData: ITaskData = {
      title: formData.get("title") as string,
      status: "todo",
      priority: formData.get("priority") as any,
    };

    try {
      await createTask(newTaskData);
      closeModal();
      addLog("Membuat tugas baru", newTaskData.title);
      fetchTasks();
    } catch (err) {
      alert("Gagal simpan tugas");
      console.log(err);
    }  
  };

  const handleUpdateTask = async (id: number, formData: FormData, close: () => void) => {
    const title = formData.get("title") as string;
    
    try {
      await updateTask(id, {
        title,
        priority: formData.get("priority") as any,
      });

      close();
      addLog("Memperbarui tugas", title);
      fetchTasks();
     } catch (err) {
      alert("Gagal update tugas");
      console.log(err);
    }
  };

  const handleDeleteTask = async (id: number, close: () => void) => {
    if (!window.confirm("Hapus tugas ini?")) return;

    await deleteTask(id);
    close();
    addLog("Menghapus tugas", "ID: " + id);
    fetchTasks();
  };

  return {
    handleAddTask,
    handleUpdateTask,
    handleDeleteTask,
    addLog,
  };
}