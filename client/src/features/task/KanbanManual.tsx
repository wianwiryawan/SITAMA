import { DndContext } from "@dnd-kit/core";
import DroppableColumn from "./DroppableColumn";
import { useTasks } from "./useTask";
import type { TaskStatus } from "../../types/task";
import { arrayMove } from "@dnd-kit/sortable";
import { KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent, type DragOverEvent } from "@dnd-kit/core";
import { useActivityLog } from "../log/useActivityLog";
import {  updateTask } from "../../api/task";

/* eslint-disable @typescript-eslint/no-explicit-any */

type KanbanManualProps = {
  closestCorners: any;
  currentUser: any;
  filterMode: "all" | "mine";
  onTaskClick: (task: any) => void;
  fetchTasks: () => void;
};

export default function KanbanManual({ closestCorners,currentUser, filterMode, onTaskClick, fetchTasks,}: KanbanManualProps) {
    // const [filterMode, setFilterMode] = useState<'all' | 'mine'>('all');
    const { tasks, setTasks } = useTasks();
    const role = currentUser.role;
    const iskasubdit = role === 'kasubdit';
    const filteredTasks = (!iskasubdit && filterMode === 'mine')
    ? tasks.filter(t => t.assignee === currentUser.username)
    : tasks;

    const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
    );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id && !iskasubdit) {
      setTasks((items) => {
        const oldIdx = items.findIndex(t => t.id === active.id);
        const newIdx = items.findIndex(t => t.id === over.id);
        return arrayMove(items, oldIdx, newIdx);
      });
    }
  };

  const { saveLog } = useActivityLog(currentUser);
  const handleDragOver = async (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || iskasubdit) return;
    
    const activeTask = tasks.find(t => t.id === active.id);
    if (!activeTask) return;

    let newStatus: TaskStatus | null = null;
    if (['todo', 'doing', 'done'].includes(over.id as string)) {
        newStatus = over.id as TaskStatus;
    } else {
      const overTask = tasks.find(t => t.id === over.id);
      if (overTask) newStatus = overTask.status;
    }

    if (newStatus && activeTask.status !== newStatus) {
        setTasks(prev => prev.map(t => t.id === active.id ? { ...t, status: newStatus as TaskStatus } : t));
        
        // Update di DB
        try {
          await updateTask(Number(active.id), { status: newStatus });
          // addLog("Mengubah status", activeTask.title + " ke " + newStatus);
          await saveLog("Mengubah status", "TASK", activeTask.title + " ke " + newStatus);
        } catch (err) {
          fetchTasks(); // Rollback jika gagal
          console.log(err);
        }
      }
    };
  
  return (
    <main className="max-w-7xl mx-auto mb-24">
        <DndContext 
        sensors={sensors} 
        collisionDetection={closestCorners} 
        onDragOver={handleDragOver} 
        onDragEnd={handleDragEnd}
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {(['todo', 'doing', 'done'] as const).map(status => (
                <DroppableColumn 
                    key={status} 
                    status={status} 
                    tasks={filteredTasks.filter(t => t.status === status)} 
                    onTaskClick={onTaskClick}
                />
                ))}
            </div>
        </DndContext>
    </main>
  );
}