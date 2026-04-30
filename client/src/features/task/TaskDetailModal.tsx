/* eslint-disable @typescript-eslint/no-explicit-any */
import DropdownAssignee from "../../components/layout/DropdownAssignee";

interface addTaskModalProps {
  onClose: () => void;
  onSubmit: any;
  onDelete: any;
  task: any;
  allUsers: any[];
  selectedParticipantIds: number[];
  setSelectedParticipantIds: React.Dispatch<React.SetStateAction<number[]>>;
  customParticipants: string[];
  setCustomParticipants: React.Dispatch<React.SetStateAction<string[]>>;

  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export default function TaskDetailModal({ 
  allUsers,
  selectedParticipantIds,
  setSelectedParticipantIds,
  customParticipants,
  setCustomParticipants,
  isDropdownOpen,
  setIsDropdownOpen,
  searchTerm,
  setSearchTerm,
  task, onClose, onDelete, onSubmit
}: addTaskModalProps) {

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-black">Detail Tugas</h2>
          <button onClick={() => onDelete(task.id)} className="bg-red-50 text-red-500 px-3 py-1 rounded-lg text-sm font-bold hover:bg-red-500 hover:text-white transition-all">Hapus Tugas</button>
        </div>
        <form onSubmit={(e) => onSubmit(e, task?.id)} className="flex flex-col gap-5">
          <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Judul</label>
          <input name="title" defaultValue={task.title} required className="w-full bg-gray-50 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500 border-none" />
          <DropdownAssignee  
            allUsers={allUsers} 
            selectedParticipantIds={selectedParticipantIds} 
            setSelectedParticipantIds={setSelectedParticipantIds}
            customParticipants={customParticipants} 
            setCustomParticipants={setCustomParticipants} 
            isDropdownOpen={isDropdownOpen} 
            setIsDropdownOpen={setIsDropdownOpen} 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm}
          />
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