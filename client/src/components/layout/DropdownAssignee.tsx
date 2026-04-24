/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
// import type { User } from "../../types/user";

interface DropdownAssigneeProps {
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

export default function DropdownAssignee({
  allUsers,
  selectedParticipantIds,
  setSelectedParticipantIds,
  customParticipants,
  setCustomParticipants,
  isDropdownOpen,
  setIsDropdownOpen,
  searchTerm,
  setSearchTerm,
}: DropdownAssigneeProps) {

  console.log(customParticipants);

  return (
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
                Daftar pelaksana
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
  );
}