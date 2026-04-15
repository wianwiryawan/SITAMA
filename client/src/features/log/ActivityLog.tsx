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


export default function ActivityLog({ logs, maxHeight = "max-h-75" }: ActivityLogProps) {
    
  return (
    <div className="bg-gray-950 rounded-[3rem] p-10 text-white shadow-2xl h-full">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-black italic uppercase tracking-tighter">
          Log Aktivitas <span className="text-indigo-500">.</span>
        </h2>
        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
      </div>
      
      <div className={`space-y-6 overflow-y-auto pr-2 custom-scrollbar ${maxHeight}`}>
        {logs.length > 0 ? (
          logs.map((log) => (
          <div key={log.id} className="border-l-2 border-white/10 pl-4 py-1 relative">
            <div className="absolute -left-1.25 top-2 w-2 h-2 bg-indigo-500 rounded-full"></div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
                {log.timestamp}
              </p>
              <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold ${
                log.feature === 'TASK' ? 'bg-blue-500/20 text-blue-300' : 'bg-purple-500/20 text-purple-300'
              }`}>
                {log.feature}
                
              </span>
            </div>
            <p className="text-xs font-medium leading-relaxed">
              <span className="font-black text-white">{log.username}</span> {log.action}{" "}
              <span className="italic text-gray-400">"{log.targetName}"</span>
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