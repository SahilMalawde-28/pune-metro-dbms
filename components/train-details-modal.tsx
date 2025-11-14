'use client';

import { TrainDetail } from '@/lib/sql';
import { X, Calendar, MapPin, Zap } from 'lucide-react';
import ScheduleGantt from './schedule-gantt';

interface TrainDetailsModalProps {
  train: TrainDetail;
  onClose: () => void;
}

export default function TrainDetailsModal({ train, onClose }: TrainDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border bg-muted">
          <div>
            <h2 className="text-2xl font-bold">{train.train_name}</h2>
            <p className="text-sm text-muted-foreground">Capacity: {train.capacity} passengers</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-background rounded-lg">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border border-border bg-card">
              <p className="text-xs text-muted-foreground flex items-center gap-1"><Zap className="h-4 w-4" /> Current Occupancy</p>
              <p className="text-2xl font-bold mt-1">{train.currentOccupancy}%</p>
            </div>
            <div className="p-4 rounded-lg border border-border bg-card">
              <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-4 w-4" /> Total Distance</p>
              <p className="text-2xl font-bold mt-1">{train.totalDistance} km</p>
            </div>
            <div className="p-4 rounded-lg border border-border bg-card">
              <p className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="h-4 w-4" /> Schedules Today</p>
              <p className="text-2xl font-bold mt-1">{train.schedules.length}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Today's Schedule Timeline</h3>
            <ScheduleGantt schedules={train.schedules} />
          </div>

          <div>
            <h3 className="font-semibold mb-4">Schedule Details</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {train.schedules.map((schedule) => (
                <div key={schedule.schedule_id} className="p-3 rounded-lg border border-border bg-muted/50">
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <p className="font-medium">{schedule.line?.line_name || 'Unknown Line'}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(schedule.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} → {new Date(schedule.arrival_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      schedule.status === 'running' ? 'bg-green-500/20 text-green-700' :
                      schedule.status === 'delayed' ? 'bg-orange-500/20 text-orange-700' :
                      'bg-gray-500/20 text-gray-700'
                    }`}>
                      {schedule.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
