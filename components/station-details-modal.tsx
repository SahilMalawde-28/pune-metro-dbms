'use client';

import { StationDetail } from '@/lib/sql';
import { X, Zap, Users } from 'lucide-react';

interface StationDetailsModalProps {
  station: StationDetail;
  onClose: () => void;
}

export default function StationDetailsModal({ station, onClose }: StationDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border bg-muted">
          <div>
            <h2 className="text-2xl font-bold">{station.station_name}</h2>
            <p className="text-sm text-muted-foreground">{station.location}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-background rounded-lg">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-border bg-card">
              <p className="text-xs text-muted-foreground flex items-center gap-1"><Zap className="h-4 w-4" /> Lines Serving</p>
              <p className="text-2xl font-bold mt-1">{station.intersectingLines.length}</p>
            </div>
            <div className="p-4 rounded-lg border border-border bg-card">
              <p className="text-xs text-muted-foreground flex items-center gap-1"><Users className="h-4 w-4" /> Trains Today</p>
              <p className="text-2xl font-bold mt-1">{station.trainsToday}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Metro Lines at this Station</h3>
            <div className="space-y-2">
              {station.intersectingLines.length === 0 ? (
                <p className="text-sm text-muted-foreground">No lines serve this station</p>
              ) : (
                station.intersectingLines.map((line) => (
                  <div key={line} className="p-3 rounded-lg border border-border bg-muted/50">
                    <p className="font-medium text-sm">{line}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Connected Stations</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {station.lines.length === 0 ? (
                <p className="text-sm text-muted-foreground">No connections available</p>
              ) : (
                station.lines.map((line) => (
                  <div key={line.line_id} className="p-3 rounded-lg border border-border bg-muted/50">
                    <p className="font-medium text-sm mb-2 flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: line.line_color }}></span>
                      {line.line_name}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {line.line_stations.map((ls) => (
                        <span key={ls.station.station_id} className="text-xs bg-background px-2 py-1 rounded">
                          {ls.station.station_name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
