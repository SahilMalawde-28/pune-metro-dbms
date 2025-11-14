'use client';

import { useEffect, useState } from 'react';
import { getAllSchedules, updateScheduleStatus, Schedule, ScheduleDetail } from '@/lib/sql';
import { Clock, AlertCircle } from 'lucide-react';

export default function SchedulesList() {
  const [schedules, setSchedules] = useState<ScheduleDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSchedules();
    const interval = setInterval(loadSchedules, 10000);
    return () => clearInterval(interval);
  }, []);

  async function loadSchedules() {
    try {
      setLoading(true);
      const data = await getAllSchedules();
      setSchedules(data as ScheduleDetail[]);
    } catch (error) {
      console.error('Error loading schedules:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(schedule_id: string, newStatus: Schedule['status']) {
    try {
      await updateScheduleStatus(schedule_id, newStatus);
      loadSchedules();
    } catch (error) {
      console.error('Error updating schedule:', error);
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'delayed':
        return 'bg-orange-500/20 text-orange-700 border-orange-500/30';
      case 'completed':
        return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-700 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Train</th>
                <th className="px-4 py-3 text-left font-semibold">Line</th>
                <th className="px-4 py-3 text-left font-semibold">Departure</th>
                <th className="px-4 py-3 text-left font-semibold">Arrival</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {schedules.slice(0, 15).map((schedule) => (
                <tr key={schedule.schedule_id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 font-medium">{schedule.train?.train_name || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm">{schedule.line?.line_name || 'N/A'}</td>
                  <td className="px-4 py-3 text-xs">{new Date(schedule.departure_time).toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs">{new Date(schedule.arrival_time).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <select
                      value={schedule.status}
                      onChange={(e) => handleStatusChange(schedule.schedule_id, e.target.value as Schedule['status'])}
                      className={`px-2 py-1 rounded text-xs font-medium border cursor-pointer ${getStatusColor(schedule.status)}`}
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="running">Running</option>
                      <option value="delayed">Delayed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">Showing {Math.min(15, schedules.length)} of {schedules.length} schedules</p>
    </div>
  );
}
