/* eslint-disable @typescript-eslint/no-explicit-any */
import { textStyles } from "../../styles/theme";
import type { IEvent } from "./useCalendar"; 

interface AgendaListProps {
  showMineOnly: boolean;
  setShowMineOnly: (val: boolean) => void;
  filteredAgenda: IEvent[];
  isPastEvent: (e: IEvent) => boolean;
  isTodayEvent: (e: IEvent) => boolean;
  isNextEvent: (e: IEvent) => boolean;
  onEventClick: (e: IEvent) => void;
}

export default function EventModal({
  showMineOnly,
  setShowMineOnly,
  filteredAgenda,
  isPastEvent,
  isTodayEvent,
  isNextEvent,
  onEventClick,
}: AgendaListProps) {
  return (
    <div className="lg:col-span-4">
        <div className="flex justify-between items-center mb-4 px-2">
          <h3 className={textStyles.agendaList}>Agenda Bulan Ini</h3>
           <div className="flex items-center gap-3">
            <div className="flex bg-gray-100 p-1 rounded-2xl w-fit">
              <button onClick={() => setShowMineOnly(false)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase ${!showMineOnly ? 'bg-white text-amber-600 shadow-sm' : 'text-gray-400'}`}>Semua Agenda</button>
              <button onClick={() => setShowMineOnly(true)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase ${showMineOnly ? 'bg-white text-amber-600 shadow-sm' : 'text-gray-400'}`}>Agenda Saya</button>
            </div>
           </div> 
        </div>

        <div className="space-y-4 max-h-150 overflow-y-auto pr-2">
          {filteredAgenda.map(e => {
            const isPast = isPastEvent(e);
            const isToday = isTodayEvent(e);
            const isNext = isNextEvent(e);

  return (
    <div 
      key={e.id}
        onClick={() => onEventClick(e)}
      className={`p-5 rounded-3xl border shadow-sm transition-all cursor-pointer group 
        ${isPast 
          ? 'bg-gray-50 opacity-60 border-transparent' 
          : isToday 
            ? 'bg-indigo-50/30 border-indigo-200 ring-2 ring-indigo-500/5' 
            : isNext 
              ? 'bg-emerald-50/50 border-emerald-200 ring-2 ring-emerald-500/10' // Warna Hijau untuk Next Event
              : 'bg-white border-gray-100 hover:shadow-md'
        }`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-2 h-10 rounded-full transition-all 
          ${isPast ? 'bg-gray-300' : isNext ? 'bg-emerald-500' : e.type === 'rapat' ? 'bg-indigo-600' : 'bg-amber-400'}`} 
        />
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h4 className={`text-[11px] font-black uppercase tracking-tight transition-colors 
              ${isNext ? 'text-emerald-700' : 'text-gray-900'} 
              group-hover:text-amber-600`}
            >
              {e.title}
            </h4>
            
            {isNext && (
              <span className="text-[7px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded-full uppercase tracking-tighter">
                Next Up
              </span>
            )}
          </div>
          
          <p className="text-[10px] font-bold text-gray-400 mt-1">
            {new Date(e.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} • {e.startTime} - {e.endTime}
          </p>
        </div>
      </div>
    </div>
  );
})}
          {filteredAgenda.length === 0 && <p className="text-[10px] font-bold text-gray-300 italic text-center py-10">Tidak ada agenda.</p>}
        </div>
      </div>
  );
}