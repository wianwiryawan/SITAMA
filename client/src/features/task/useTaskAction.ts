/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { createTask, updateTask, deleteTask, type ITaskData } from "../../api/task";
import type { ILog } from "../../types/task";
import { useTasks } from "./useTask";

export function useTaskActions(currentUser: any, fetchTasks: () => void, setLogs: any, selectedParticipantIds: any) {
  const {
    setSelectedParticipantIds,
  } = useTasks();

  const [selectedTask, setSelectedTask] = useState<ITaskData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
console.log("ketutup gaa",isModalOpen);
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

  // const handleAddTask = async (formData: FormData, closeModal: () => void) => {

  //   const newTaskData: ITaskData = {
  //     title: formData.get("title") as string,
  //     status: "todo",
  //     priority: (formData.get("priority") as ITaskData['priority']) || "medium",
  //     assignee: selectedParticipantIds,
  //   };

  //   console.log("selected partisipan dari use task action", selectedParticipantIds)

  //   try {
  //     await createTask(newTaskData);
  //     fetchTasks();
  //     closeModal();
  //   } catch (err) {
  //     console.error("Gagal simpan tugas:", err);
  //     alert("Terjadi kesalahan saat menyimpan tugas");
  //   }
  // };

  // const handleUpdateTask = async (id: number, formData: FormData, close: () => void) => {
  //   const title = formData.get("title") as string;
    
  //   try {
  //     await updateTask(id, {
  //       title,
  //       priority: formData.get("priority") as any,
  //     });

  //     close();
  //     addLog("Memperbarui tugas", title);
  //     fetchTasks();
  //    } catch (err) {
  //     alert("Gagal update tugas");
  //     console.log(err);
  //   }
  // };

  const handleSaveTask = async (e: React.FormEvent<HTMLFormElement>, taskId?: number) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const taskData: any = {
      title: formData.get("title") as string,
      priority: (formData.get("priority") as any) || "medium",
      assigneeIds: selectedParticipantIds, 
      status: selectedTask?.status || "todo",
    };

    // Validasi
    if (selectedParticipantIds.length === 0) {
      return alert("Harap pilih minimal satu pelaksana!");
    }
    console.log("formdata cek id", selectedTask?.id);
    try {
      if (taskId) {
        console.log("formdata  update", formData);
        await updateTask(taskId, taskData);
        setIsModalOpen(false);
        close();
        addLog("Memperbarui tugas", taskData.title);
      } else {
        console.log("formdata create", formData);
        await createTask(taskData);
        close();
        addLog("Membuat tugas baru", taskData.title);
      }

      await fetchTasks(); 
      setSelectedTask(null);
      setSelectedParticipantIds([]); 
      
    } catch (err: any) {
      console.error("Gagal simpan tugas:", err);
      alert(err.response?.data?.message || "Terjadi kesalahan saat menyimpan tugas");
    }
  };

  const handleDeleteTask = async (id: number, close: () => void) => {
    if (!window.confirm("Hapus tugas ini?")) return;
  console.log("Menghapus Task dengan ID adalahhh", id);
    await deleteTask(id);
    setIsModalOpen(false); 
    close();
    addLog("Menghapus tugas", "ID: " + close);
    
    await fetchTasks();
  };

  // const openAddTaskModal = async () => {
  //   setSelectedTask(null);
  //   setSelectedParticipantIds([]); // Reset state pelaksana untuk tugas baru
  //   setIsModalOpen(true);
  // };

  // const openEditTaskModal = async (task: ITaskData) => {
  //   setSelectedTask(task);
    
  //   const ids = task.assigneeIds?.map((a: any) => a.userId) || [];
  //   setSelectedParticipantIds(ids);
    
  //   setIsModalOpen(true);
  // };

  return {
    // handleAddTask,
    // handleUpdateTask,
    handleSaveTask,
    handleDeleteTask,
    addLog,
    // openAddTaskModal,
    // openEditTaskModal,
    isModalOpen,setIsModalOpen,
    setIsAddModalOpen, isAddModalOpen,
    selectedParticipantIds,
    selectedTask, setSelectedTask
  };
}