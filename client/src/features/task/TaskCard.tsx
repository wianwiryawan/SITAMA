import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ITask, Priority } from "../../types/task";

interface TaskCardProps {
  task: ITask;
  onClick: (task: ITask) => void;
}

const TaskCard = ({ task, onClick }: TaskCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  
  const style = { 
    transform: CSS.Transform.toString(transform), 
    transition, 
    opacity: isDragging ? 0.3 : 1 
  };

  const priorityStyles: Record<Priority, string> = {
    high: "bg-red-50 text-red-600 border-red-100",
    medium: "bg-amber-50 text-amber-600 border-amber-100",
    low: "bg-emerald-50 text-emerald-600 border-emerald-100",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-4 cursor-pointer hover:border-indigo-200 transition-all group"
      onClick={() => onClick(task)}
    >
      <div {...attributes} {...listeners} className="touch-none">
        <span className={`text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest border ${priorityStyles[task.priority]}`}>
          {task.priority}
        </span>
        <h3 className="text-gray-950 font-bold text-sm leading-snug mt-3 mb-5">{task.title}</h3>
        <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
          <div className="w-6 h-6 bg-gray-950 rounded-full flex items-center justify-center text-[8px] text-white font-black uppercase">
            {task.assignee.charAt(0)}
          </div>
          <span className="text-[10px] text-gray-500 font-black uppercase tracking-wider">{task.assignee}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;