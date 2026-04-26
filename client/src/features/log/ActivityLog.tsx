import { dashboardStyles } from "../../styles/theme";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ILog {
  id: number;
  username: string;  
  action: string; 
  feature: 'TASK' | 'CALENDAR'; 
  targetName: string;
  timestamp: string;
}

interface ActivityLogProps {
  logs: ILog[];
  maxHeight?: string;
}

const formatDateTime = (value: string) => {
  return new Date(value).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};


export default function ActivityLog({ logs, maxHeight = "max-h-75" }: ActivityLogProps) {
    
  return (
    <div className={`${dashboardStyles.logCard} rounded-[3rem] p-10 text-white shadow-2xl h-full`}>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-black uppercase tracking-tighter">
          Log Aktivitas <span className="text-amber-500">.</span>
        </h2>
      </div>
      
      <div className={`space-y-6 overflow-y-auto pr-2 custom-scrollbar ${maxHeight}`}>
        {logs.length > 0 ? (
          logs.map((log) => (
          <div key={log.id} className="border-l-2 border-white/10 pl-4 py-1 relative">
            <div className="absolute -left-1.25 top-2 w-2 h-2 bg-indigo-500 rounded-full"></div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-white">
                {formatDateTime(log.timestamp)}
              </p>
              <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold ${
                log.feature === 'TASK' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-purple-500/20 text-purple-300'
              }`}>
                {log.feature}
                
              </span>
            </div>
            <p className="text-sm font-medium leading-relaxed">
              <span className="font-black text-white">{log.username}</span> {log.action}{" "}
              <span className="italic text-black">"{log.targetName}"</span>
            </p>
          </div>
        ))
        ) : (
          <p className="text-[10px] text-gray-500 font-bold italic uppercase tracking-widest text-center py-10">
            Belum ada aktivitas
          </p>
        )}
      </div>
    </div>
  );
}