/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { type IEvent } from "./useCalendar";
import DropdownAssignee from "../../components/layout/DropdownAssignee";

interface EventModalProps {
  formRef: any
  isOpen: boolean;
  onClose: () => void;
  selectedEvent: IEvent | null;
  prefilledDate: string;
  canEdit: boolean;
  handleSave: (e: React.FormEvent<HTMLFormElement>) => void;
  handleDelete: () => void;
  executeGenerateST: () => void;
  handleOpenGenerateST:(e: React.MouseEvent) => void;

  // State untuk Pelaksana
  allUsers: any[];
  selectedParticipantIds: number[];
  setSelectedParticipantIds: React.Dispatch<React.SetStateAction<number[]>>;
  customParticipants: string[];
  setCustomParticipants: React.Dispatch<React.SetStateAction<string[]>>;
  
  // State untuk Dropdown Search
  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;

  //state untuk generate ST
  isPemberiModalOpen: boolean;
  setIsPemberiModalOpen: (open: boolean) => void;
  selectedPemberiId: number | "";
  setSelectedPemberiId: React.Dispatch<React.SetStateAction<number | "">>;
  isGenerating: boolean;
  setIsGenerating: (open: boolean) => void;
}


export default function EventModal({
  formRef,
  isOpen,
  onClose,
  selectedEvent,
  prefilledDate,
  // canEdit,
  handleSave,
  handleDelete,
  allUsers,
  selectedParticipantIds,
  setSelectedParticipantIds,
  customParticipants,
  setCustomParticipants,
  isDropdownOpen,
  setIsDropdownOpen,
  searchTerm,
  setSearchTerm,
  isPemberiModalOpen,
  setIsPemberiModalOpen,
  selectedPemberiId,
  setSelectedPemberiId,
  isGenerating,
  executeGenerateST,
  handleOpenGenerateST,
}: EventModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-120 flex items-center justify-center bg-gray-950/40 backdrop-blur-md p-4">
      <form
        ref={formRef}
        onSubmit={handleSave}
        className="bg-white w-full max-w-4xl rounded-[3.5rem] p-10 shadow-2xl animate-in zoom-in duration-300"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-10 px-2">
          <h2 className="text-3xl font-black italic uppercase tracking-tighter">
            {selectedEvent ? "Edit Agenda" : "Agenda Baru"}
          </h2>
          {selectedEvent && (
            <button
              type="button"
              onClick={handleDelete}
              className="text-red-500 text-[11px] font-black uppercase hover:bg-red-50 px-4 py-2 rounded-full transition-all"
            >
              Hapus Agenda
            </button>
          )}
        </div>

        {/* Detail Acara */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Form Input */}
          <div className="space-y-4">

            <select
              name="type"
              defaultValue={selectedEvent?.type || "rapat"}
              className="w-full bg-gray-50 p-4 rounded-2xl font-bold text-xs outline-none border-2 border-transparent focus:border-indigo-100 transition-all"
            >
              <option value="rapat">Rapat</option>
              <option value="perdin">Perjalanan Dinas</option>
            </select>

            <input
              name="title"
              defaultValue={selectedEvent?.title}
              required
              placeholder="Nama Kegiatan"
              className="w-full bg-gray-50 p-4 rounded-2xl font-bold text-sm outline-none focus:ring-2 ring-indigo-500/20"
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-1 block">Mulai</label>
                <input name="startDate" type="date" defaultValue={selectedEvent?.startDate || prefilledDate} required className="w-full bg-gray-50 p-4 rounded-2xl text-xs font-bold outline-none" />
              </div>
              <div>
                <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-1 block">Selesai</label>
                <input name="endDate" type="date" defaultValue={selectedEvent?.endDate || prefilledDate} required className="w-full bg-gray-50 p-4 rounded-2xl text-xs font-bold outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input name="startTime" type="time" defaultValue={selectedEvent?.startTime || "09:00"} className="w-full bg-gray-50 p-4 rounded-2xl text-xs font-bold outline-none" />
              <input name="endTime" type="time" defaultValue={selectedEvent?.endTime || "17:00"} className="w-full bg-gray-50 p-4 rounded-2xl text-xs font-bold outline-none" />
            </div>

            <input name="location" defaultValue={selectedEvent?.location} placeholder="Lokasi Kegiatan" className="w-full bg-gray-50 p-4 rounded-2xl font-bold text-sm outline-none" />
          </div>

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
        </div>
        

        {/* Footer Buttons */}
        <div className="flex gap-6 mt-12">
          <button type="button" onClick={onClose} className="flex-1 py-5 font-black text-gray-400 uppercase text-[11px]">Batal</button>
          <button ref={formRef} type="submit" className="flex-1 py-5 bg-gray-950 text-white rounded-4xl font-black uppercase text-[11px] shadow-xl">Simpan Agenda</button>
          <button 
            type="button" 
            onClick={handleOpenGenerateST}
            className="flex-1 py-5 bg-indigo-800 text-white rounded-4xl font-black uppercase text-[11px] shadow-xl hover:bg-indigo-900 transition-all"
          >
            Buat Surat Tugas
          </button>
        </div>
      </form>

      {isPemberiModalOpen && (
        <div className="fixed inset-0 z-200 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-4xl z-210 shadow-2xl w-full max-w-xs">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">🖋️</span>
              </div>
              <h3 className="text-sm font-black uppercase tracking-tighter text-gray-800">Penandatangan</h3>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">Pilih Pejabat Pemberi Tugas</p>
            </div>

            <div className="space-y-3">
              <select 
                value={selectedPemberiId}
                onChange={(e) => setSelectedPemberiId(Number(e.target.value))}
                className="w-full bg-gray-50 p-4 rounded-2xl font-bold text-xs border-2 border-transparent focus:border-indigo-500 outline-none appearance-none cursor-pointer text-center"
              >
                <option value="">— Pilih Nama —</option>
                {allUsers
                  .filter(u => u.role === 'katim' || u.role === 'kasubdit')
                  .map(p => (
                    <option key={p.id} value={p.id}>{p.username.toUpperCase()}</option>
                  ))}
              </select>

              <button 
                onClick={executeGenerateST}
                disabled={!selectedPemberiId || isGenerating}
                className={`w-full py-4 rounded-2xl font-black uppercase text-[10px] shadow-lg transition-all ${
                  isGenerating ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
                }`}
              >
                {isGenerating ? 'Memproses PDF...' : 'Cetak Surat Tugas'}
              </button>
              
              <button 
                onClick={() => setIsPemberiModalOpen(false)}
                className="w-full py-2 font-black text-gray-400 uppercase text-[9px] hover:text-red-500 transition-colors"
              >
                Kembali ke Form
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}