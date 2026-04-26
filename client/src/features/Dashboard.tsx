/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { getAllLogs } from "../api/log";
import { useCalendar } from "../features/event/useCalendar";
import ActivityLog, { type ILog } from "./log/ActivityLog";
import AgendaList from "./event/AgendaList";
import { bgStyles, dashboardStyles } from "../styles/theme";

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

    <div className={`${bgStyles.backComponent} min-h-screen bg-[#fffcf5] text-gray-900 p-6 md:p-14 antialiased animate-in fade-in duration-700 rounded-[2.5rem]`}>
      {/* header */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <header className="max-w-7xl mx-auto mb-6">
          <h2 className="text-3xl font-black uppercase tracking-tighter">Dashboard</h2>
          <p className="text-gray-400 font-black uppercase text-[10px] tracking-[0.4em] mt-2">
            Sistem Informasi Tata Manajemen  Subdit SIAK
          </p>        
        </header>
        <p className="text-3xl font-black text-gray-400"></p>
      <h1 className="text-3xl font-black tracking-tighter italic leading-none mb-6 text-gray-950">
     
        </h1>
        <div className="lg:col-span-1">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-10">
            <div className={`${dashboardStyles.eventCard} rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden`}>
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
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="grid grid-cols-2 gap-4">
              <div className={`${dashboardStyles.taskCard} rounded-[2.5rem] p-8 text-white`}>
                <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">
                  Tugas Berjalan
                </p>
                <p className="text-5xl font-black mt-4 text-white">08</p>
              </div>

            <div className={`${dashboardStyles.taskCard} rounded-[2.5rem] p-8 text-white`}>
              <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">
                Tugas Selesai
              </p>
              <p className="text-5xl font-black mt-4 text-white">05</p>
            </div>

            <div className={`${dashboardStyles.taskCard} rounded-[2.5rem] p-8 text-white`}>
              <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">
                Tugas Pending
              </p>
              <p className="text-5xl font-black mt-4 text-white">02</p>
            </div>

              <div className={`${dashboardStyles.taskCard} rounded-[2.5rem] p-8 text-white`}>
                <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">
                  Total Tugas
                </p>
                <p className="text-5xl font-black mt-4 text-white">15</p>
              </div>
            </div>
        </div>

        <div className="lg:col-span-1">
          {loading ? (
            <div className="bg-amber-500 rounded-[3rem] p-10 h-full flex items-center justify-center">
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
