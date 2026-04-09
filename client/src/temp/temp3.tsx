import { useState, useMemo } from "react";

export interface IEvent {
  id: number;
  title: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD (Untuk Perdin multi-hari)
  startTime: string;
  endTime: string;
  location: string;
  participants: string[];
  type: 'rapat' | 'perdin';
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'calendar' | 'monitoring'>('calendar');
  const [viewDate, setViewDate] = useState(new Date());
  const [events, setEvents] = useState<IEvent[]>([
    { id: 1, title: "Koordinasi SIAK Pusat", startDate: "2026-03-20", endDate: "2026-03-20", startTime: "09:00", endTime: "11:00", location: "Lt. 3", participants: ["Andi", "Susi"], type: 'rapat' },
    { id: 2, title: "Bimtek SIAK Terpusat", startDate: "2026-03-22", endDate: "2026-03-25", startTime: "08:00", endTime: "17:00", location: "Bali", participants: ["Budi"], type: 'perdin' }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // --- LOGIKA CEK BENTROK PERSONIL ---
  const checkIndividualConflict = (newEv: Partial<IEvent>, excludeId?: number) => {
    const start = new Date(`${newEv.startDate}T${newEv.startTime}`);
    const end = new Date(`${newEv.endDate}T${newEv.endTime}`);

    for (const event of events) {
      if (excludeId && event.id === excludeId) continue;
      
      const existingStart = new Date(`${event.startDate}T${event.startTime}`);
      const existingEnd = new Date(`${event.endDate}T${event.endTime}`);

      // Cek apakah waktu bersinggungan
      const isOverlapping = start < existingEnd && end > existingStart;

      if (isOverlapping) {
        // Cek apakah ada personil yang sama
        const clashingPeople = newEv.participants?.filter(p => event.participants.includes(p));
        if (clashingPeople && clashingPeople.length > 0) {
          return `${clashingPeople.join(', ')} sudah memiliki agenda "${event.title}" di waktu tersebut.`;
        }
      }
    }
    return null;
  };

  // --- GENERATOR KALENDER ---
  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    const padding = firstDay === 0 ? 6 : firstDay - 1;
    for (let i = 0; i < padding; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [viewDate]);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const participants = (formData.get('participants') as string).split(',').map(s => s.trim());
    
    const newEv: Partial<IEvent> = {
      title: formData.get('title') as string,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      startTime: formData.get('startTime') as string,
      endTime: formData.get('endTime') as string,
      location: formData.get('location') as string,
      type: formData.get('type') as 'rapat' | 'perdin',
      participants
    };

    const conflict = checkIndividualConflict(newEv, selectedEvent?.id);
    if (conflict) {
      setErrorMsg(conflict);
      return;
    }

    const finalEv = { ...newEv, id: selectedEvent?.id || Date.now() } as IEvent;
    setEvents(selectedEvent ? events.map(ev => ev.id === selectedEvent.id ? finalEv : ev) : [...events, finalEv]);
    setIsModalOpen(false);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-32">
      {/* NAV BAR */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-950/90 backdrop-blur-md px-10 py-5 rounded-full flex gap-10 shadow-2xl z-[100] border border-white/10 text-white text-xs font-bold uppercase tracking-widest">
        <button onClick={() => setActiveTab('calendar')} className={activeTab === 'calendar' ? 'text-indigo-400' : 'text-gray-400'}>Kalender</button>
        <button onClick={() => setActiveTab('monitoring')} className={activeTab === 'monitoring' ? 'text-indigo-400' : 'text-gray-400'}>Monitoring Pimpinan</button>
      </nav>

      <div className="max-w-7xl mx-auto p-6 md:p-14">
        <header className="mb-10 flex justify-between items-end border-b border-gray-100 pb-10">
          <div>
            <h1 className="text-5xl font-black tracking-tighter">SITAMA</h1>
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Sistem Informasi Tata Manajemen/p>
          </div>
          <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl border border-gray-100">
            <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1))} className="p-2 font-bold">←</button>
            <span className="min-w-[150px] text-center font-black text-indigo-600 uppercase text-xs tracking-widest">
              {viewDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' })}
            </span>
            <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1))} className="p-2 font-bold">→</button>
          </div>
        </header>

        {activeTab === 'calendar' ? (
          <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden animate-in fade-in">
            <div className="grid grid-cols-7 bg-gray-50/50 border-b border-gray-100">
              {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map(d => (
                <div key={d} className="py-4 text-[10px] font-black text-gray-400 uppercase text-center">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {calendarDays.map((day, idx) => {
                const dateStr = day ? `${viewDate.getFullYear()}-${(viewDate.getMonth()+1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}` : "";
                // Logika menampilkan event (termasuk yang multi-hari)
                const dayEvents = events.filter(e => dateStr >= e.startDate && dateStr <= e.endDate);

                return (
                  <div key={idx} onClick={() => { if(day) { setSelectedEvent(null); setIsModalOpen(true); }}} 
                    className={`min-h-[160px] p-2 border-r border-b border-gray-50 transition-all ${day ? 'hover:bg-gray-50/50 cursor-pointer' : 'bg-gray-50/10'}`}>
                    {day && (
                      <div className="h-full">
                        <span className="text-[10px] font-black text-gray-300 w-6 h-6 flex items-center justify-center">{day}</span>
                        <div className="mt-2 space-y-1">
                          {dayEvents.map(e => (
                            <div key={e.id} onClick={(x) => { x.stopPropagation(); setSelectedEvent(e); setIsModalOpen(true); }}
                              className={`p-2 rounded-lg text-[10px] font-bold truncate ${e.type === 'rapat' ? 'bg-indigo-600 text-white' : 'bg-amber-400 text-amber-950'}`}>
                              {e.title}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* --- MONITORING PIMPINAN --- */
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-black">Monitoring Kegiatan Staff</h2>
            <div className="grid grid-cols-1 gap-4">
              {events.sort((a,b) => a.startDate.localeCompare(b.startDate)).map(e => (
                <div key={e.id} className="bg-white border border-gray-100 p-8 rounded-[2.5rem] shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex gap-6 items-center flex-1">
                    <div className={`p-5 rounded-3xl flex flex-col items-center min-w-[100px] ${e.type === 'rapat' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}>
                      <span className="text-[10px] font-black uppercase tracking-widest">{e.type}</span>
                      <span className="text-lg font-black mt-1">
                        {new Date(e.startDate).getDate()}{e.startDate !== e.endDate ? `-${new Date(e.endDate).getDate()}` : ''}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-950">{e.title}</h3>
                      <p className="text-sm text-gray-400 font-medium">{e.location} • {e.startTime} - {e.endTime}</p>
                    </div>
                  </div>
                  <div className="flex -space-x-3">
                    {e.participants.map((p, i) => (
                      <div key={i} className="w-12 h-12 rounded-full bg-gray-100 border-4 border-white flex items-center justify-center text-xs font-black text-gray-600" title={p}>
                        {p.substring(0,2).toUpperCase()}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL EDIT/TAMBAH */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-gray-950/60 backdrop-blur-xl p-4">
          <form onSubmit={handleSave} className="bg-white w-full max-w-xl rounded-[3rem] p-12 shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter">{selectedEvent ? 'Ubah Agenda' : 'Agenda Baru'}</h2>
              {selectedEvent && (
                <button type="button" onClick={() => {setEvents(events.filter(ev => ev.id !== selectedEvent.id)); setIsModalOpen(false);}} className="text-red-500 text-xs font-black uppercase tracking-widest hover:underline">Hapus</button>
              )}
            </div>

            {errorMsg && <div className="mb-6 p-5 bg-red-50 border border-red-100 text-red-600 text-xs font-black rounded-2xl">{errorMsg}</div>}

            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <select name="type" defaultValue={selectedEvent?.type || 'rapat'} className="w-full bg-gray-50 p-5 rounded-[1.5rem] outline-none font-bold appearance-none">
                  <option value="rapat">Rapat / Internal</option>
                  <option value="perdin">Perjalanan Dinas (Perdin)</option>
                </select>
              </div>
              <div className="col-span-2">
                <input name="title" defaultValue={selectedEvent?.title} required className="w-full bg-gray-50 p-5 rounded-[1.5rem] outline-none focus:ring-2 ring-indigo-500 font-bold" placeholder="Nama Kegiatan" />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-2 block">Tgl Mulai</label>
                <input name="startDate" type="date" defaultValue={selectedEvent?.startDate} required className="w-full bg-gray-50 p-5 rounded-[1.5rem] outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-2 block">Tgl Selesai</label>
                <input name="endDate" type="date" defaultValue={selectedEvent?.endDate} required className="w-full bg-gray-50 p-5 rounded-[1.5rem] outline-none" />
              </div>
              <div className="col-span-2">
                <input name="location" defaultValue={selectedEvent?.location} required className="w-full bg-gray-50 p-5 rounded-[1.5rem] outline-none" placeholder="Lokasi (cth: Jakarta / Ruang 402)" />
              </div>
              <div>
                <input name="startTime" type="time" defaultValue={selectedEvent?.startTime} required className="w-full bg-gray-50 p-5 rounded-[1.5rem] outline-none" />
              </div>
              <div>
                <input name="endTime" type="time" defaultValue={selectedEvent?.endTime} required className="w-full bg-gray-50 p-5 rounded-[1.5rem] outline-none" />
              </div>
              <div className="col-span-2">
                <input name="participants" defaultValue={selectedEvent?.participants.join(', ')} required className="w-full bg-gray-50 p-5 rounded-[1.5rem] outline-none" placeholder="Pelaksana (cth: Andi, Budi, Susi)" />
              </div>
            </div>

            <div className="flex gap-4 mt-12">
              <button type="button" onClick={() => {setIsModalOpen(false); setErrorMsg(null);}} className="flex-1 py-5 font-black text-gray-400 uppercase tracking-widest text-xs">Batal</button>
              <button type="submit" className="flex-1 py-5 bg-gray-950 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-xl">Simpan Agenda</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}