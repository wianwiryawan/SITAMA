/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { getAllLogs } from "../api/log";
import { useCalendar } from "../features/event/useCalendar";
import ActivityLog, { type ILog } from "./log/ActivityLog";
import AgendaList from "./event/AgendaList";

export default function Dashboard({ user }: { user: any }) {
const {
    filteredAgenda,
    setIsModalOpen,
    setSelectedEvent,
    showMineOnly, setShowMineOnly,
    isPastEvent,
    isTodayEvent,
    isNextEvent,
  } = useCalendar(user);

  const [logs, setLogs] = useState<ILog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const data = await getAllLogs();
      setLogs(data);
    } catch (err) {
      console.error("Gagal ambil log:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 30000);
    return () => clearInterval(interval);
  }, []);

  return (

    <div className="min-h-screen bg-white text-gray-900 p-6 md:p-14 antialiased animate-in fade-in duration-700">
      {/* header */}
            <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
            
      <header className="max-w-7xl mx-auto mb-12">
        <h2 className="text-3xl font-black uppercase tracking-tighter">Dashboard SITAMA</h2>
        <p className="text-gray-400 font-black uppercase text-[10px] tracking-[0.4em] mt-2">
          Sistem Informasi Tata Manajemen  Subdit SIAK
        </p>        
      </header>
    <div className="animate-in fade-in duration-700">
    <p className="text-3xl font-black text-gray-400">Hi</p>
   <h1 className="text-3xl font-black tracking-tighter italic leading-none mb-6 text-gray-950">
   {user?.username}
    </h1>
    </div>
        <div className="lg:col-span-2 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Agenda */}
            <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
              {/* <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">Total Agenda</p>
              <p className="text-5xl font-black mt-4">12</p>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div> */}
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
            </div>

            {/* Tugas */}
            <div className="bg-gray-950 rounded-[2.5rem] p-8 text-white shadow-xl shadow-gray-200">
              <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">Tugas Berjalan</p>
              <p className="text-5xl font-black mt-4 text-emerald-400">08</p>
            </div>
          </div>

{/*     
          <div className="bg-gray-50 border border-gray-100 rounded-[3rem] p-10 h-80 flex items-center justify-center">
            <p className="text-gray-300 font-black uppercase text-[10px] tracking-widest">Visualisasi Data Progress (Coming Soon)</p>
          </div> */}
        </div>

        {/* log  */}
        <div className="lg:col-span-1">
          {loading ? (
            <div className="bg-gray-950 rounded-[3rem] p-10 h-full flex items-center justify-center">
              <p className="text-white font-black animate-pulse text-[10px] uppercase">Memuat Log...</p>
            </div>
          ) : (
            <ActivityLog logs={logs} maxHeight="max-h-[600px]" />
          )}
        </div>

      </main>
    </div>
  );
}

// function useState<T>(arg0: never[]): [any, any] {
//   throw new Error("Function not implemented.");
// }
