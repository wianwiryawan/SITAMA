import type { ITask } from "../../types/task";

export default function TaskTable({ tasks }: { tasks: ITask[] }) {
  return (
     <section className="max-w-7xl mx-auto bg-gray-50/50 p-6 md:p-12 rounded-[3.5rem] border border-gray-50 shadow-inner">

          <div className="overflow-hidden bg-white rounded-4xl border border-gray-100 shadow-sm mb-10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Nama Kegiatan</th>
                  <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Pelaksana</th>
                  <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {tasks.map(task => (
                  <tr key={task.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-6 text-sm font-bold text-gray-900">{task.title}</td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-black uppercase border border-indigo-100">
                          {task.assignee[0]}
                        </div>
                        <span className="text-[11px] font-bold text-gray-600">{task.assignee}</span>
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <span className={`text-[9px] px-4 py-1.5 rounded-full font-black uppercase tracking-tighter border ${
                        task.status === 'done' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                        task.status === 'doing' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-gray-100 text-gray-400 border-gray-200'
                      }`}>
                        {task.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
  );
}