/* eslint-disable @typescript-eslint/no-explicit-any */
import { createTask, updateTask, deleteTask, type ITaskData } from "../../api/task";
import type { ILog } from "../../types/task";
// import { arrayMove } from "@dnd-kit/sortable";
// import { KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent, type DragOverEvent } from "@dnd-kit/core";
// import { useTasks } from "./useTask";
// import { useActivityLog } from "../log/useActivityLog";

export function useTaskActions(currentUser: any, fetchTasks: () => void, setLogs: any) {

  //   const sensors = useSensors(
  //   useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  //   useSensor(KeyboardSensor)
  // );

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

  // const role = currentUser.role;
  // const isPimpinan = role === 'pimpinan';
  // const { tasks, setTasks } = useTasks();
  // const handleDragEnd = (event: DragEndEvent) => {
  //   const { active, over } = event;
  //   if (over && active.id !== over.id && !isPimpinan) {
  //     setTasks((items) => {
  //       const oldIdx = items.findIndex(t => t.id === active.id);
  //       const newIdx = items.findIndex(t => t.id === over.id);
  //       return arrayMove(items, oldIdx, newIdx);
  //     });
  //   }
  // };

  // const { saveLog } = useActivityLog(currentUser);
  // const handleDragOver = async (event: DragOverEvent) => {
  //   const { active, over } = event;
  //   if (!over || isPimpinan) return;
    
  //   const activeTask = tasks.find(t => t.id === active.id);
  //   if (!activeTask) return;

  //   let newStatus: TaskStatus | null = null;
  //   if (['todo', 'doing', 'done'].includes(over.id as string)) {
  //       newStatus = over.id as TaskStatus;
  //   } else {
  //     const overTask = tasks.find(t => t.id === over.id);
  //     if (overTask) newStatus = overTask.status;
  //   }

  //   if (newStatus && activeTask.status !== newStatus) {
  //       setTasks(prev => prev.map(t => t.id === active.id ? { ...t, status: newStatus as TaskStatus } : t));
        
  //       // Update di DB
  //       try {
  //         await updateTask(Number(active.id), { status: newStatus });
  //         // addLog("Mengubah status", activeTask.title + " ke " + newStatus);
  //         await saveLog("Mengubah status", "TASK", activeTask.title + " ke " + newStatus);
  //       } catch (err) {
  //         fetchTasks(); // Rollback jika gagal
  //         console.log(err);
  //       }
  //     }
  //   };

  return {
    handleAddTask,
    handleUpdateTask,
    handleDeleteTask,
    addLog,
    // handleDragEnd,
    // handleDragOver,
    // sensors
  };
}