import { useState } from "react";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Status = 'todo' | 'doing' | 'done';

interface ITask {
  id: string;
  title: string;
  detail: string;
  deadline: string;
  status: Status;
  assignees: string[];
}

const STAFF_LIST = ["Andi Staff", "Budi Ketua", "Susi Pimpinan", "Rani Staff", "Tono Staff"];

function TaskCard({ task }: { task: ITask }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id: task.id,
    data: { type: 'Task', task }
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div 
      ref={setNodeRef} style={style} {...attributes} {...listeners}
      className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md mb-4 cursor-grab active:cursor-grabbing transition-all"
    >
      <div className="flex justify-between items-start mb-3">
        <span className="text-[7px] font-black bg-indigo-50 text-indigo-500 px-2 py-1 rounded-md uppercase tracking-widest">
          {task.deadline || 'No Date'}
        </span>
      </div>
      <h4 className="font-bold text-gray-900 text-xs leading-snug mb-3">{task.title}</h4>
      <div className="flex -space-x-2">
        {task.assignees.map((a, i) => (
          <div key={i} title={a} className="w-6 h-6 rounded-full bg-gray-950 border-2 border-white flex items-center justify-center text-[8px] font-black text-white shadow-sm">
            {a[0]}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TodoList({ currentUser }: { currentUser: any }) {
  const [tasks, setTasks] = useState<ITask[]>([
    { id: "1", title: "Update Database SIAK", detail: "Cek NIK", deadline: "2026-04-01", status: "todo", assignees: ["Andi Staff"] },
    { id: "2", title: "Review Laporan Bulanan", detail: "Cek Anggaran", deadline: "2026-03-30", status: "doing", assignees: ["Budi Ketua"] }
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filterMine, setFilterMine] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", detail: "", deadline: "", assignees: [] as string[] });

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const isPimpinan = currentUser?.role === 'Pimpinan';
  const isKetua = currentUser?.role === 'Ketua';
  const canAdd = isPimpinan || isKetua;

  // --- DRAG LOGIC ---
  const handleDragOver = (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over) return;
      const activeTask = tasks.find(t => t.id === active.id);
      if (!activeTask) return;
      let newStatus: Status | null = null;
      if (['todo', 'doing', 'done'].includes(over.id as string)) newStatus = over.id as Status;
      else {
        const overTask = tasks.find(t => t.id === over.id);
        if (overTask) newStatus = overTask.status;
      }
      if (newStatus && activeTask.status !== newStatus) {
        setTasks(prev => prev.map(t => t.id === active.id ? { ...t, status: newStatus as Status } : t));
      }
    };
  
    const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        setTasks((items) => {
          const oldIdx = items.findIndex(t => t.id === active.id);
          const newIdx = items.findIndex(t => t.id === over.id);
          return arrayMove(items, oldIdx, newIdx);
        });
      }
    };

  // --- FORM HANDLER ---
  const saveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title || newTask.assignees.length === 0) {
      alert("Judul dan Pelaksana wajib diisi!");
      return;
    }
    const task: ITask = { ...newTask, id: Date.now().toString(), status: 'todo' };
    setTasks([...tasks, task]);
    setIsFormOpen(false);
    setNewTask({ title: "", detail: "", deadline: "", assignees: [] });
  };

  const displayedTasks = (filterMine && !isPimpinan) 
    ? tasks.filter(t => t.assignees.includes(currentUser.name)) 
    : tasks;

  return (
    <div className="animate-in fade-in duration-700">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black tracking-tighter italic uppercase text-gray-950">
            SIAK Board <span className="text-indigo-600">.</span>
          </h2>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 italic">
            Monitoring Role: {currentUser.role}
          </p>
        </div>

        {/* Filter disembunyikan jika Pimpinan */}
        {!isPimpinan && (
          <div className="flex bg-gray-100 p-1 rounded-2xl">
            <button onClick={() => setFilterMine(false)} className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${!filterMine ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400'}`}>Semua</button>
            <button onClick={() => setFilterMine(true)} className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${filterMine ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400'}`}>Milik Saya</button>
          </div>
        )}
      </header>

      {/* FORM TAMBAH TUGAS */}
      {canAdd && (
        <div className="mb-10">
          {!isFormOpen ? (
            <button onClick={() => setIsFormOpen(true)} className="bg-gray-950 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] shadow-xl hover:bg-indigo-600 transition-all">
              + Buat Tugas Baru
            </button>
          ) : (
            <div className="bg-white border border-gray-100 p-10 rounded-[3rem] shadow-2xl animate-in slide-in-from-top-4 duration-300">
              <form onSubmit={saveTask} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[9px] font-black uppercase text-gray-400 px-2 tracking-widest">Informasi Utama</label>
                  <input required value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} placeholder="Judul Tugas..." className="w-full bg-gray-50 p-4 rounded-2xl outline-none font-bold text-sm border focus:border-indigo-100" />
                  <textarea value={newTask.detail} onChange={e => setNewTask({...newTask, detail: e.target.value})} placeholder="Detail Instruksi..." className="w-full bg-gray-50 p-4 rounded-2xl outline-none font-medium text-sm border h-24" />
                </div>
                
                <div className="space-y-4">
                  <label className="text-[9px] font-black uppercase text-gray-400 px-2 tracking-widest">Pelaksana & Batas Waktu</label>
                  
                  {/* DROPDOWN PELAKSANA */}
                  <select 
                    multiple 
                    className="w-full bg-gray-50 p-4 rounded-2xl outline-none font-bold text-xs border h-32"
                    value={newTask.assignees}
                    onChange={(e) => {
                      const options = Array.from(e.target.selectedOptions, option => option.value);
                      setNewTask({...newTask, assignees: options});
                    }}
                  >
                    {STAFF_LIST.map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                  <p className="text-[8px] text-gray-400 px-2">*Tahan Ctrl/Cmd untuk memilih lebih dari satu</p>

                  <input type="date" value={newTask.deadline} onChange={e => setNewTask({...newTask, deadline: e.target.value})} className="w-full bg-gray-50 p-4 rounded-2xl outline-none font-bold text-sm text-gray-400 border" />

                  <div className="pt-4 flex gap-3">
                    <button type="submit" className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase text-[10px] shadow-lg shadow-indigo-100 hover:bg-gray-950 transition-all">Simpan & Tugaskan</button>
                    <button type="button" onClick={() => setIsFormOpen(false)} className="px-6 text-[10px] font-black uppercase text-gray-400">Batal</button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* KANBAN BOARD */}
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(['todo', 'doing', 'done'] as Status[]).map((col) => (
            <div key={col} className="bg-gray-50/50 p-6 rounded-[3.5rem] border border-gray-50 min-h-[500px]">
              <div className="flex justify-between items-center mb-8 px-4">
                <h3 className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em]">{col}</h3>
                <span className="bg-white text-gray-300 text-[8px] font-black px-2 py-0.5 rounded-full border border-gray-100">
                   {displayedTasks.filter(t => t.status === col).length}
                </span>
              </div>
              <SortableContext id={col} items={displayedTasks.filter(t => t.status === col)} strategy={verticalListSortingStrategy}>
                <div className="min-h-[150px]">
                  {displayedTasks.filter(t => t.status === col).map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </SortableContext>
            </div>
          ))}
        </div>
      </DndContext>
    </div>
  );
}