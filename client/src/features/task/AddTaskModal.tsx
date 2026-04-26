/* eslint-disable @typescript-eslint/no-explicit-any */

export default function AddTaskModal({ onClose, onSubmit, }: any) {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-gray-900/40 backdrop-blur-md p-4">
      <form onSubmit={onSubmit} className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in duration-300">
        <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8">Tugas Baru <span className="text-amber-600">.</span></h2>
        <div className="space-y-4">
          <input name="title" required placeholder="Apa yang perlu dikerjakan?" className="w-full bg-gray-50 rounded-2xl p-4 font-bold outline-none focus:ring-2 ring-indigo-500/20 border-none" />
          <input name="assignee" required placeholder="Nama Pelaksana" className="w-full bg-gray-50 rounded-2xl p-4 font-bold outline-none border-none" />
          
          <select name="priority" className="w-full bg-gray-50 rounded-2xl p-4 font-bold outline-none border-none appearance-none">
            <option value="low">Priority: Low</option>
            <option value="medium">Priority: Medium</option>
            <option value="high">Priority: High</option>
          </select>
        </div>
        
        <div className="flex gap-4 mt-10">
          <button type="button" onClick={onClose} className="flex-1 py-4 font-black text-gray-400 uppercase text-[10px]">Batal</button>
          <button type="submit" className="flex-1 py-4 bg-gray-950 text-white rounded-2xl font-black uppercase text-[10px] shadow-lg">Simpan</button>
        </div>
      </form>
    </div>

  );
}