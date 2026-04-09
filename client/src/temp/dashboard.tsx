import { useMemo } from "react";

// TYPES (samakan dengan file ToDo kamu)
type TaskStatus = 'todo' | 'doing' | 'done';

export interface ITask {
  id: number;
  title: string;
  status: TaskStatus;
  assignee: string;
  priority: 'low' | 'medium' | 'high';
}

// CARD
const DashboardCard = ({
  title,
  count,
  color,
  onClick,
}: {
  title: string;
  count: number;
  color: string;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`p-8 rounded-[2.5rem] text-left border shadow-sm hover:shadow-xl transition-all ${color}`}
    >
      <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">
        {title}
      </p>
      <h2 className="text-4xl font-black mt-2">{count}</h2>
    </button>
  );
};

// MAIN DASHBOARD PAGE
export default function DashboardPage({
  tasks,
  onNavigateToKanban,
}: {
  tasks: ITask[];
  onNavigateToKanban: (filter?: TaskStatus) => void;
}) {
  // SUMMARY
  const summary = useMemo(() => ({
    todo: tasks.filter((t) => t.status === "todo").length,
    doing: tasks.filter((t) => t.status === "doing").length,
    done: tasks.filter((t) => t.status === "done").length,
  }), [tasks]);

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-14">
        <h1 className="text-5xl font-black tracking-tighter text-gray-950">Dashboard</h1>
        <p className="text-gray-400 font-black uppercase text-[10px] tracking-[0.4em] mt-2">
          Ringkasan Tugas
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <DashboardCard
          title="To Do"
          count={summary.todo}
          color="bg-gray-50 border-gray-100"
          onClick={() => onNavigateToKanban('todo')}
        />

        <DashboardCard
          title="On Progress"
          count={summary.doing}
          color="bg-amber-50 border-amber-100"
          onClick={() => onNavigateToKanban('doing')}
        />

        <DashboardCard
          title="Done"
          count={summary.done}
          color="bg-emerald-50 border-emerald-100"
          onClick={() => onNavigateToKanban('done')}
        />
      </section>
    </div>
  );
}

/*
CARA PAKAI DI APP UTAMA:

import DashboardPage from "./DashboardPage";

{page === 'dashboard' && (
  <DashboardPage
    tasks={tasks}
    onNavigateToKanban={(filter) => {
      setPage('kanban');
      // optional: simpan filter kalau mau
    }}
  />
)}

*/
