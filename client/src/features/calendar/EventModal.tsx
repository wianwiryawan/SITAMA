/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import type { IEvent } from "../../pages/Calendar"; // Pastikan interface IEvent di-export di file utama

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEvent: IEvent | null;
  prefilledDate: string;
  canEdit: boolean;
  handleSave: (e: React.FormEvent<HTMLFormElement>) => void;
  handleDelete: () => void;

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
}

export default function EventModal({
  isOpen,
  onClose,
  selectedEvent,
  prefilledDate,
  canEdit,
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
}: EventModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-120 flex items-center justify-center bg-gray-950/40 backdrop-blur-md p-4">
      <form
        onSubmit={handleSave}
        className="bg-white w-full max-w-4xl rounded-[3.5rem] p-10 shadow-2xl animate-in zoom-in duration-300"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-10 px-2">
          <h2 className="text-3xl font-black italic uppercase tracking-tighter">
            {selectedEvent ? "Edit Agenda" : "Agenda Baru"}
          </h2>
          {selectedEvent && canEdit && (
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
            <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-2 block">
              Informasi Utama
            </label>

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

          {/* Pelaksana */}
          <div className="flex flex-col h-full">
            <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-1 block">Daftar Pelaksana</label>
            <div className="relative">
              <div 
                onClick={(e) => {
                    e.preventDefault();
                    setIsDropdownOpen(!isDropdownOpen);
                    }}
                className={`w-full bg-gray-50 p-4 rounded-2xl border-2 border-transparent hover:border-indigo-100 cursor-pointer transition-all flex items-center justify-between gap-3 ${
                  (selectedParticipantIds.length > 0 || customParticipants.length > 0) ? 'min-h-14 h-auto' : 'h-14'
                }`}
              >
                <div className="flex flex-wrap gap-2 items-center flex-1">
                  {selectedParticipantIds.length === 0 && customParticipants.length === 0 ? (
                    <span className="text-xs text-gray-400 font-bold ml-1">Pilih Pelaksana...</span>
                  ) : (
                    <>
                      {/* Daftar pelaksana */}
                      {allUsers.filter(u => selectedParticipantIds.includes(u.id)).map(user => (
                        <span key={user.id} className="bg-indigo-600 text-white px-3 py-1.5 rounded-xl text-[9px] font-black uppercase flex items-center gap-1">
                          {user.username}
                          <button type="button" onClick={(e) => { e.stopPropagation(); setSelectedParticipantIds(prev => prev.filter(id => id !== user.id)); }} className="ml-1">×</button>
                        </span>
                      ))}
                    </>
                  )}
                </div>
                <span className={`text-[10px] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
              </div>

              {/* Dropdown Logic */}
              {isDropdownOpen && (
                <div className="absolute z-130 left-0 right-0 mt-2 bg-white border border-gray-100 shadow-2xl rounded-[2.5rem] p-5">
                   <input 
                    autoFocus
                    placeholder="Cari atau ketik nama luar..."
                    className="w-full bg-gray-50 p-4 rounded-2xl text-xs font-bold outline-none mb-4 focus:ring-2 ring-indigo-500/10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && searchTerm.trim()) {
                        e.preventDefault();
                        if (!customParticipants.includes(searchTerm)) {
                            setCustomParticipants([...customParticipants, searchTerm]);
                            setSearchTerm("");
                        }
                        }
                    }}
                    />

                    <div className="max-h-48 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                    {allUsers
                        .filter(u => u.username.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((user) => {
                        const isSelected = selectedParticipantIds.includes(user.id);
                        return (
                            <div 
                            key={user.id}
                            onClick={() => {
                                if (isSelected) {
                                setSelectedParticipantIds(prev => prev.filter(id => id !== user.id));
                                } else {
                                setSelectedParticipantIds(prev => [...prev, user.id]);
                                }
                            }}
                            className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${isSelected ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100 text-gray-500'}`}
                            >
                            <div className="flex flex-col">
                                <span className="text-xs font-bold">{user.username}</span>
                                <span className={`text-[8px] uppercase font-black ${isSelected ? 'text-indigo-200' : 'text-gray-400'}`}>{user.role}</span>
                            </div>
                            {isSelected && <span className="font-bold text-sm">✓</span>}
                            </div>
                        );
                        })}
                    
                    {searchTerm && !allUsers.some(u => u.username.toLowerCase() === searchTerm.toLowerCase()) && (
                        <div 
                        onClick={() => { setCustomParticipants([...customParticipants, searchTerm]); setSearchTerm(""); }}
                        className="p-4 bg-amber-50 text-amber-700 rounded-2xl cursor-pointer text-[10px] font-black italic border-2 border-dashed border-amber-200"
                        >
                        + Tambah "{searchTerm}" ke Daftar Pelaksana
                        </div>
                    )}
                    </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-6 mt-12">
          <button type="button" onClick={onClose} className="flex-1 py-5 font-black text-gray-400 uppercase text-[11px]">Batal</button>
          <button type="submit" className="flex-1 py-5 bg-gray-950 text-white rounded-4xl font-black uppercase text-[11px] shadow-xl">Simpan Agenda</button>
        </div>
      </form>
    </div>
  );
}