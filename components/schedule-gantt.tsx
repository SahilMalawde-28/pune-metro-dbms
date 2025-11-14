'use client';

import { ScheduleDetail } from '@/lib/sql';

interface ScheduleGanttProps {
  schedules: ScheduleDetail[];
}

export default function ScheduleGantt({ schedules }: ScheduleGanttProps) {
  const timeToMinutes = (time: string) => {
    const date = new Date(time);
    return date.getHours() * 60 + date.getMinutes();
  };

  const minTime = Math.min(...schedules.map(s => timeToMinutes(s.departure_time)));
  const maxTime = Math.max(...schedules.map(s => timeToMinutes(s.arrival_time)));
  const timeSpan = maxTime - minTime || 60;

  return (
    <div className="space-y-4">
      {/* Timeline header */}
      <div className="flex gap-2">
        <div className="w-32 text-xs font-medium text-muted-foreground">Line</div>
        <div className="flex-1">
          <div className="flex items-center justify-between px-2 text-xs text-muted-foreground">
            <span>{Math.floor(minTime / 60)}:00</span>
            <span>{Math.floor((minTime + timeSpan / 2) / 60)}:00</span>
            <span>{Math.floor((maxTime) / 60)}:00</span>
          </div>
        </div>
      </div>

      {/* Gantt bars */}
      {schedules.map((schedule) => {
        const start = timeToMinutes(schedule.departure_time) - minTime;
        const duration = timeToMinutes(schedule.arrival_time) - timeToMinutes(schedule.departure_time);
        const startPercent = (start / timeSpan) * 100;
        const widthPercent = (duration / timeSpan) * 100;

        const statusColor = {
          running: 'bg-green-500',
          delayed: 'bg-orange-500',
          scheduled: 'bg-blue-500',
          completed: 'bg-gray-500',
          cancelled: 'bg-red-500',
        }[schedule.status as keyof typeof statusColor] || 'bg-gray-400';

        return (
          <div key={schedule.schedule_id} className="flex gap-2 items-center">
            <div className="w-32 text-xs truncate">{schedule.line?.line_name || 'Unknown'}</div>
            <div className="flex-1 relative h-8 bg-muted rounded overflow-hidden">
              <div
                className={`${statusColor} h-full rounded absolute top-0 transition-all flex items-center px-2`}
                style={{
                  left: `${startPercent}%`,
                  width: `${Math.max(widthPercent, 5)}%`,
                }}
                title={`${new Date(schedule.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(schedule.arrival_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
              >
                <span className="text-xs text-white font-medium truncate">
                  {new Date(schedule.departure_time).getHours()}:{String(new Date(schedule.departure_time).getMinutes()).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
