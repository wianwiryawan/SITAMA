/* eslint-disable @typescript-eslint/no-explicit-any */
export default function TaskDetailModal({ task, onClose, onDelete, onSubmit }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-black">Detail Tugas</h2>
          <button onClick={onDelete} className="bg-red-50 text-red-500 px-3 py-1 rounded-lg text-sm font-bold hover:bg-red-500 hover:text-white transition-all">Hapus Tugas</button>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Judul</label>
          <input name="title" defaultValue={task.title} required className="w-full bg-gray-50 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500 border-none" />
          
          <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Prioritas</label>
          <select name="priority" defaultValue={task.priority} className="w-full bg-gray-50 rounded-2xl p-4 outline-none border-none">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <div className="flex gap-3 mt-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 font-bold text-gray-400 text-sm">Tutup</button>
            <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm">Update Tugas</button>
          </div>
        </form>
      </div>
    </div>
  );
}