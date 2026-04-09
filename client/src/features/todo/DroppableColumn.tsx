import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { ITask, TaskStatus } from "../../pages/ToDoList";
import TaskCard from "./TaskCard";

interface DroppableColumnProps {
  status: TaskStatus;
  tasks: ITask[];
  onTaskClick: (task: ITask) => void;
}

const DroppableColumn = ({ status, tasks, onTaskClick }: DroppableColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div 
      ref={setNodeRef} 
      className={`bg-gray-50/50 p-6 rounded-[2.5rem] min-h-125 border transition-all ${
        isOver ? 'bg-indigo-50/30 border-indigo-200' : 'border-gray-50'
      }`}
    >
      <div className="flex justify-between items-center mb-8 px-2">
        <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">{status}</h3>
        <span className="bg-white text-gray-400 text-[9px] font-black px-2 py-1 rounded-lg border border-gray-100 shadow-sm">
          {tasks.length}
        </span>
      </div>
      
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={onTaskClick} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

export default DroppableColumn;