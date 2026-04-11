/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo, useEffect } from "react";
import { getAllEvents, createEvent, updateEvent, deleteEvent} from "../api/event";
import { getAllUsers } from "../api/user";

export interface IEvent {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  participants: any[];
  type: 'rapat' | 'perdin';
}

export default function Calendar({ currentUser }: { currentUser: any }) {
  const [viewDate, setViewDate] = useState(new Date());
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);
  const [prefilledDate, setPrefilledDate] = useState("");

  const canEdit = currentUser?.role === 'admin' || currentUser?.role === 'staff';
  const [showMineOnly, setShowMineOnly] = useState(false);

  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [selectedParticipantIds, setSelectedParticipantIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setAllUsers(data);
      } catch (err) {
        console.error("Gagal ambil daftar user");
        console.log("memuat data user", err)
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      // ID objek participants aja yang dikirim backend
      const ids = selectedEvent.participants.map((p: any) => p.userId);
      setSelectedParticipantIds(ids);
    } else {
      setSelectedParticipantIds([]);
    }
  }, [selectedEvent, isModalOpen]);

  const fetchEventsData = async () => {
    try {
      setLoading(true);
      const data = await getAllEvents();
      setEvents(data);
    } catch (err) {
      console.error("Gagal memuat agenda:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventsData();
  }, []);

  const normalizeDate = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const todayDate = normalizeDate(new Date());

  const isPastEvent = (event: IEvent) => {
    const end = normalizeDate(new Date(event.endDate));
    return end < todayDate;
  };

  const isTodayEvent = (event: IEvent) => {
    const end = normalizeDate(new Date(event.endDate));
    return end.getTime() === todayDate.getTime();
  };

  const isSameMonth = (event: IEvent) => {
    const eventDate = new Date(event.startDate);
    return (
      eventDate.getMonth() === viewDate.getMonth() &&
      eventDate.getFullYear() === viewDate.getFullYear()
    );
  };

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

  const handleDateClick = (day: number) => {
    // if (!canEdit) return;
    const dateStr = `${viewDate.getFullYear()}-${(viewDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    setPrefilledDate(dateStr);
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);

  const eventData: any = {
    title: formData.get('title'),
    startDate: formData.get('startDate'),
    endDate: formData.get('endDate'),
    startTime: formData.get('startTime'),
    endTime: formData.get('endTime'),
    location: formData.get('location'),
    type: formData.get('type'),
    participants: selectedParticipantIds, // Kirim array ID: [1, 2, 5]
  };

  try {
    if (selectedEvent) {
      await updateEvent(selectedEvent.id, eventData);
    } else {
      await createEvent(eventData);
    }
    // ... tutup modal & refresh data ...
  } catch (err: any) {
    alert(err.response?.data?.message || "Gagal simpan agenda");
  }
};

  const handleDelete = async () => {
    if (!selectedEvent) return;
    if (window.confirm("Hapus agenda ini?")) {
      try {
        await deleteEvent(selectedEvent.id);
        setIsModalOpen(false);
        fetchEventsData();
      } catch (err) {
        alert("Gagal menghapus agenda");
        console.log("hapus event",err)
      }
    }
  };

  const filteredAgenda = events
    .filter(e => isSameMonth(e))
    .filter(e => {
      if (!showMineOnly) return true;
      // Cek apakah username currentUser ada dalam daftar partisipan
      return e.participants?.some((p: any) => p.user?.username === currentUser.username);
    })
    .sort((a, b) => {
      const aPast = isPastEvent(a);
      const bPast = isPastEvent(b);
      if (aPast !== bPast) return aPast ? 1 : -1;
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    });

  if (loading) return <div className="p-10 text-center font-black italic">MEMUAT DATA AGENDA SIAK...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in duration-700">
      
      {/* KALENDER*/}
      <div className="lg:col-span-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-black italic tracking-tighter uppercase">Kalender Kegiatan</h2>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3 bg-gray-100 p-1.5 rounded-2xl">
            <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1))} className="w-8 h-8 flex items-center justify-center font-bold">←</button>
            <span className="text-[10px] font-black uppercase tracking-widest px-2 min-w-30 text-center">{viewDate.toLocaleString('id-ID', { month: 'short', year: 'numeric' })}</span>
            <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1))} className="w-8 h-8 flex items-center justify-center font-bold">→</button>
          </div>
          {/* {canEdit && ( */}
            <button
              onClick={() => { setSelectedEvent(null); setIsModalOpen(true); }}
              className="flex items-center gap-2 px-5 py-3 bg-indigo-500 text-white rounded-2xl shadow-sm hover:bg-indigo-600 transition-all"
            >
              <span className="text-[10px] font-black uppercase tracking-widest">+ Tambah Agenda</span>
            </button>
          {/* // )} */}
        </div>

        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-7 bg-gray-50/50 border-b border-gray-50">
            {['S', 'S', 'R', 'K', 'J', 'S', 'M'].map((d, i) => (
              <div key={i} className="py-4 text-[9px] font-black text-gray-400 text-center">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {calendarDays.map((day, idx) => {
              const dateStr = day ? `${viewDate.getFullYear()}-${(viewDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}` : "";
              const dayEvents = events.filter(e => dateStr >= e.startDate && dateStr <= e.endDate);
              
              return (
                <div key={idx} onClick={() => day && handleDateClick(day)}
                  className={`min-h-20 p-2 border-r border-b border-gray-50 flex flex-col items-center justify-start transition-all ${day ? 'hover:bg-indigo-50/30 cursor-pointer' : 'bg-gray-50/20'}`}>
                  {day && (
                    <>
                      <span className="text-[10px] font-bold text-gray-400 mb-1">{day}</span>
                      <div className="flex flex-wrap justify-center gap-1">
                        {dayEvents.map(e => (
                          <div key={e.id} className={`w-1.5 h-1.5 rounded-full ${e.type === 'rapat' ? 'bg-indigo-600' : 'bg-amber-400'}`} />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* AGENDA LIST */}
      <div className="lg:col-span-4">
        <div className="flex justify-between items-center mb-4 px-2">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Agenda Bulan Ini</h3>
           <div className="flex items-center gap-3">
            <div className="flex bg-gray-100 p-1 rounded-2xl w-fit">
              <button onClick={() => setShowMineOnly(false)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase ${!showMineOnly ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}>Semua Agenda</button>
              <button onClick={() => setShowMineOnly(true)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase ${showMineOnly ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}>Agenda Saya</button>
            </div>
           </div> 
        </div>

        <div className="space-y-4 max-h-150 overflow-y-auto pr-2">
          {filteredAgenda.map(e => (
            <div key={e.id} onClick={() => { setSelectedEvent(e); setIsModalOpen(true); }}
              className={`p-5 rounded-3xl border shadow-sm transition-all cursor-pointer group ${isPastEvent(e) ? 'bg-gray-50 opacity-70' : isTodayEvent(e) ? 'bg-indigo-100 border-indigo-300' : 'bg-white hover:shadow-md'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-2 h-10 rounded-full ${e.type === 'rapat' ? 'bg-indigo-600' : 'bg-amber-400'}`} />
                <div className="flex-1">
                  <h4 className="text-[11px] font-black uppercase tracking-tight text-gray-900 group-hover:text-indigo-600 transition-colors">{e.title}</h4>
                  <p className="text-[10px] font-bold text-gray-400 mt-1">
                    {new Date(e.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} • {e.startTime} - {e.endTime}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {filteredAgenda.length === 0 && <p className="text-[10px] font-bold text-gray-300 italic text-center py-10">Tidak ada agenda.</p>}
        </div>
      </div>

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-120 flex items-center justify-center bg-gray-950/40 backdrop-blur-md p-4">
          <form onSubmit={handleSave} className="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-start mb-8">
              <h2 className="text-2xl font-black italic uppercase">{selectedEvent ? 'Edit Agenda' : 'Agenda Baru'}</h2>
              {selectedEvent && canEdit && (
                <button type="button" onClick={handleDelete} className="text-red-500 text-[10px] font-black uppercase">Hapus</button>
              )}
            </div>
            
            <div className="space-y-4">
              <select name="type" defaultValue={selectedEvent?.type || 'rapat'} className="w-full bg-gray-50 p-4 rounded-2xl font-bold text-xs outline-none">
                <option value="rapat">Rapat / Internal</option>
                <option value="perdin">Perjalanan Dinas</option>
              </select>
              <input name="title" defaultValue={selectedEvent?.title} required placeholder="Nama Kegiatan" className="w-full bg-gray-50 p-4 rounded-2xl font-bold text-sm outline-none focus:ring-2 ring-indigo-500/20" />
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
              <div className="space-y-2">
                <input name="startTime" type="time" defaultValue={selectedEvent?.startTime || "09:00"} className="w-full bg-gray-50 p-4 rounded-2xl text-xs font-bold outline-none" />
                <input name="endTime" type="time" defaultValue={selectedEvent?.endTime || "17:00"} className="w-full bg-gray-50 p-4 rounded-2xl text-xs font-bold outline-none" />
              </div>
              <input name="location" defaultValue={selectedEvent?.location} placeholder="Lokasi" className="w-full bg-gray-50 p-4 rounded-2xl font-bold text-sm outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <label className="font-bold text-sm outline-none p-4"> Pelaksana </label>
              <div className="bg-gray-50 p-4 rounded-3xl max-h-40 overflow-y-auto space-y-2 border border-transparent focus-within:border-indigo-100 transition-all">
                {allUsers.map((user) => (
                  <label key={user.id} className="flex items-center gap-3 cursor-pointer group p-1">
                    <input
                      type="checkbox"
                      checked={selectedParticipantIds.includes(user.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedParticipantIds([...selectedParticipantIds, user.id]);
                        } else {
                          setSelectedParticipantIds(selectedParticipantIds.filter(id => id !== user.id));
                        }
                      }}
                      className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className={`text-xs font-bold ${selectedParticipantIds.includes(user.id) ? 'text-indigo-600' : 'text-gray-500'}`}>
                      {user.username} <span className="text-[9px] font-normal opacity-50">({user.role})</span>
                    </span>
                  </label>
                ))}
            </div>
          </div>

            <div className="flex gap-4 mt-10">
              <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 font-black text-gray-400 uppercase text-[10px]">Batal</button>
              <button type="submit" className="flex-1 py-4 bg-gray-950 text-white rounded-2xl font-black uppercase text-[10px] shadow-lg">Simpan</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}