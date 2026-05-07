/* eslint-disable @typescript-eslint/no-explicit-any */

import DropdownAssignee from "../../components/layout/DropdownAssignee";

interface addTaskModalProps {
  onClose: () => void;
  onSubmit: any;
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

export default function AddTaskModal({ 
  onClose, onSubmit, 
  allUsers,
  selectedParticipantIds,
  setSelectedParticipantIds,
  customParticipants,
  setCustomParticipants,
  isDropdownOpen,
  setIsDropdownOpen,
  searchTerm,
  setSearchTerm,
}: addTaskModalProps) {

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-gray-900/40 backdrop-blur-md p-4">
      <form onSubmit={onSubmit} className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in duration-300">
        <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8">Tugas Baru <span className="text-amber-600">.</span></h2>
        <div className="space-y-4">
          <input name="title" required placeholder="Apa yang perlu dikerjakan?" className="w-full bg-gray-50 rounded-2xl p-4 font-bold outline-none focus:ring-2 ring-indigo-500/20 border-none" />
          {/* <input name="assignee" required placeholder="Nama Pelaksana" className="w-full bg-gray-50 rounded-2xl p-4 font-bold outline-none border-none" /> */}
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
          <input name="note" required placeholder="Keterangan" className="w-full bg-gray-50 rounded-2xl p-4 font-bold outline-none focus:ring-2 ring-indigo-500/20 border-none" />
          <select name="priority" className="w-full bg-gray-50 rounded-2xl p-4 font-bold outline-none border-none appearance-none">
            <option value="low">Priority: Low</option>
            <option value="medium">Priority: Medium</option>
            <option value="high">Priority: High</option>
          </select>
        </div>
        
        <div className="flex gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 p-4 rounded-2xl text-sm font-black uppercase text-gray-400 hover:bg-gray-50 transition-all"
            >
              Batal
            </button>
            <button 
              type="submit"
              className="flex-1 bg-indigo-600 p-4 rounded-2xl text-sm font-black uppercase text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
            >
              Simpan Tugas ({selectedParticipantIds.length})
            </button>
          </div>
      </form>
    </div>

  );
}