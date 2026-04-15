/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCalendar } from "./useCalendar";
import EventModal from "./EventModal";
import AgendaList from "./AgendaList";

export default function Calendar({ currentUser }: { currentUser: any }) {
  const {
    viewDate, setViewDate,
    loading,
    calendarDays,
    filteredAgenda,
    events,
    allUsers,
    canEdit,
    isModalOpen, setIsModalOpen,
    selectedEvent, setSelectedEvent,
    prefilledDate,
    showMineOnly, setShowMineOnly,
    showToast,
    selectedParticipantIds, setSelectedParticipantIds,
    customParticipants, setCustomParticipants,
    isDropdownOpen, setIsDropdownOpen,
    searchTerm, setSearchTerm,
    handleDateClick,
    handleSave,
    handleDelete,
    isPastEvent,
    isTodayEvent,
    isNextEvent
  } = useCalendar(currentUser);

  if (loading) return <div className="p-10 text-center font-black italic">MEMUAT DATA AGENDA...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in duration-700">
      
      {/* KALENDER */}
      <div className="lg:col-span-8">
        <div className="flex justify-between items-center mb-8">
          <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter">Kalender Kegiatan</h2>
          <p className="text-gray-400 font-black uppercase text-[10px] tracking-[0.4em] mt-2">
          Sistem Informasi Tata Manajemen
        </p>     
        <p className="text-gray-400 font-black uppercase text-[10px] tracking-[0.4em]">
         Subdit SIAK
        </p>
          {/* <p className="text-gray-400 font-black uppercase text-[10px] tracking-[0.4em] mt-2">SITAMA</p> */}
          </div>
          <button
            onClick={() => { setSelectedEvent(null); setIsModalOpen(true); }}
            className="px-5 py-3 bg-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all"
          >
            + Tambah Agenda
          </button>
        </div>

        {/* Kontrol Bulan */}
        <div className="flex items-center gap-3 bg-gray-100 p-1.5 rounded-2xl w-fit mb-4">
          <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1))} className="w-8 h-8 font-bold">←</button>
          <span className="text-[10px] font-black uppercase min-w-30 text-center">
            {viewDate.toLocaleString('id-ID', { month: 'short', year: 'numeric' })}
          </span>
          <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1))} className="w-8 h-8 font-bold">→</button>
        </div>

        {/* Grid Kalender */}
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
                  className={`min-h-20 p-2 border-r border-b border-gray-50 flex flex-col items-center transition-all ${day ? 'hover:bg-indigo-50/30 cursor-pointer' : 'bg-gray-50/10'}`}>
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

      <AgendaList 
        showMineOnly={showMineOnly}
        setShowMineOnly={setShowMineOnly}
        filteredAgenda={filteredAgenda}
        isPastEvent={isPastEvent}
        isTodayEvent={isTodayEvent}
        isNextEvent={isNextEvent}
        onEventClick={(e) => {
            setSelectedEvent(e);
            setIsModalOpen(true);
        }}
        />

      <EventModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedEvent={selectedEvent}
        prefilledDate={prefilledDate}
        canEdit={canEdit}
        handleSave={handleSave}
        handleDelete={handleDelete}
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

      {/* Toast Notifikasi */}
      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-gray-950 text-white px-6 py-3 rounded-2xl shadow-2xl z-200">
          <span className="text-[10px] font-black uppercase tracking-widest text-white">Data Berhasil Tersimpan</span>
        </div>
      )}
    </div>
  );
}