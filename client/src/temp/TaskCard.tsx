import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ITask } from "../types/task";

interface TaskCardProps {
  task: ITask;
}

const TaskCard = ({ task }: TaskCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1, // Efek transparan saat ditarik
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-3 cursor-grab active:cursor-grabbing hover:border-indigo-400 transition-all"
    >
      <div className="flex justify-between items-start">
        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
          task.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
        }`}>
          {task.priority}
        </span>
      </div>
      <h3 className="text-gray-700 font-medium text-sm mt-2">{task.title}</h3>
      <div className="mt-3 flex items-center gap-2">
        <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-[10px] text-white">
          {task.assignee.charAt(0)}
        </div>
        <span className="text-xs text-gray-500">{task.assignee}</span>
      </div>
    </div>
  );
};

export default TaskCard;