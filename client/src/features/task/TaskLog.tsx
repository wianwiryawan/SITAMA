import type { ILog } from "../../types/task";

export default function TaskLogs({ logs }: { logs: ILog[] }) {
  return (
    <div>
      {logs.map(log => (
        <div key={log.id}>
          {log.user} {log.action} "{log.target}"
        </div>
      ))}
    </div>
  );
}