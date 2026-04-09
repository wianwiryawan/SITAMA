import { useState, useMemo } from "react";

export interface IEvent {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  participants: string[];
  type: 'rapat' | 'perdin';
}

export default function CalendarSIAK({ currentUser }: { currentUser: any }) {
  const [viewDate, setViewDate] = useState(new Date());
  const [events, setEvents] = useState<IEvent[]>([
    { id: 1, title: "Koordinasi SIAK Pusat", startDate: "2026-03-20", endDate: "2026-03-20", startTime: "09:00", endTime: "11:00", location: "Lt. 3", participants: ["Rizka", "Lala"], type: 'rapat' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);
  const [prefilledDate, setPrefilledDate] = useState("");
  const [showMineOnly, setShowMineOnly] = useState(false);

  const canEdit = currentUser?.role === 'Pimpinan' || currentUser?.role === 'Ketua';

  const today = new Date();
  const todayStr = new Date().toISOString().split('T')[0];

  const isPastEvent = (event: IEvent) => {
    return new Date(event.endDate) < today;
  };

  const getEventTimeStatus = (event: IEvent) => {
    if (event.endDate < todayStr) return 'past';
    if (event.startDate <= todayStr && event.endDate >= todayStr) return 'today';
    return 'upcoming';
  };

  const statusStyles = {
    past: "bg-gray-50 border-gray-200 text-gray-400",
    today: "bg-indigo-50 border-indigo-200 text-indigo-700",
    upcoming: "bg-emerald-50 border-emerald-200 text-emerald-700",
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
    if (!canEdit) return;
    const dateStr = `${viewDate.getFullYear()}-${(viewDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    setPrefilledDate(dateStr);
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newEv: IEvent = {
      id: selectedEvent?.id || Date.now(),
      title: formData.get('title') as string,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      startTime: formData.get('startTime') as string,
      endTime: formData.get('endTime') as string,
      location: formData.get('location') as string,
      type: formData.get('type') as 'rapat' | 'perdin',
      participants: (formData.get('participants') as string).split(',').map(s => s.trim()),
    };

    setEvents(prev =>
      selectedEvent
        ? prev.map(ev => ev.id === selectedEvent.id ? newEv : ev)
        : [...prev, newEv]
    );

    setIsModalOpen(false);
  };

  const filteredAgenda = events
    .filter(e => isSameMonth(e))
    .filter(e => {
      if (!showMineOnly) return true;
      return e.participants
        .map(p => p.toLowerCase())
        .includes(currentUser.name.toLowerCase());
    })
    .sort((a, b) => {
      const aPast = isPastEvent(a);
      const bPast = isPastEvent(b);

      if (aPast !== bPast) {
        return aPast ? 1 : -1;
      }

      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

      {/* KANAN: LIST */}
      <div className="lg:col-span-4">
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          
          {filteredAgenda.map(e => {
            const status = getEventTimeStatus(e);

            return (
              <div
                key={e.id}
                onClick={() => { setSelectedEvent(e); setIsModalOpen(true); }}
                className={`p-5 rounded-3xl border shadow-sm cursor-pointer
                  ${statusStyles[status]}
                `}
              >
                <h4 className="text-[11px] font-black uppercase">
                  {e.title}
                </h4>

                <p className="text-[10px] mt-1">
                  {new Date(e.startDate).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short'
                  })} • {e.startTime}
                </p>

                <span className="text-[9px] font-bold uppercase mt-1 block">
                  {status === 'past' && 'Selesai'}
                  {status === 'today' && 'Hari ini'}
                  {status === 'upcoming' && 'Akan datang'}
                </span>
              </div>
            );
          })}

          {filteredAgenda.length === 0 && (
            <p className="text-[10px] text-gray-300 italic text-center py-10">
              Tidak ada agenda
            </p>
          )}

        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <form onSubmit={handleSave} className="bg-white p-8 rounded-2xl">
            <input name="title" placeholder="Nama kegiatan" className="border p-2" />
            <button type="submit">Simpan</button>
          </form>
        </div>
      )}

    </div>
  );
}