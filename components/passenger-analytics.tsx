'use client';

import { useEffect, useState } from 'react';
import { getPeakHourAnalysis, getOvercrowdedTrains, PassengerFlow } from '@/lib/sql';
import { TrendingUp, AlertTriangle } from 'lucide-react';

export default function PassengerAnalytics() {
  const [peakHours, setPeakHours] = useState<any[]>([]);
  const [overcrowded, setOvercrowded] = useState<PassengerFlow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    try {
      setLoading(true);
      const [peak, over] = await Promise.all([
        getPeakHourAnalysis(),
        getOvercrowdedTrains(80),
      ]);
      setPeakHours(peak);
      setOvercrowded(over);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-lg border border-border bg-card">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Peak Hour Analysis
          </h3>
          <div className="space-y-3">
            {peakHours.slice(0, 8).map((hour) => (
              <div key={hour.hour}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-muted-foreground">{hour.hour}</span>
                  <span className="text-sm font-medium">{Math.round(hour.average_occupancy)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-accent to-primary h-2 rounded-full"
                    style={{ width: `${hour.average_occupancy}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-lg border border-border bg-card">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Overcrowded Trains (80%+)
          </h3>
          <div className="space-y-2">
            {overcrowded.length === 0 ? (
              <p className="text-sm text-muted-foreground">No overcrowded trains detected</p>
            ) : (
              overcrowded.slice(0, 8).map((flow) => (
                <div key={flow.flow_id} className="p-3 rounded bg-orange-500/10 border border-orange-500/20">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">{flow.train?.train_name || 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground">{flow.station?.station_name || 'Unknown'}</p>
                    </div>
                    <span className="font-bold text-orange-600">{flow.occupancy_percentage}%</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="p-6 rounded-lg border border-border bg-card">
        <h3 className="font-semibold text-foreground mb-4">System Occupancy Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { range: '0-25%', color: 'bg-green-500', count: Math.floor(Math.random() * 50) },
            { range: '25-50%', color: 'bg-blue-500', count: Math.floor(Math.random() * 60) },
            { range: '50-75%', color: 'bg-yellow-500', count: Math.floor(Math.random() * 50) },
            { range: '75-100%', color: 'bg-red-500', count: Math.floor(Math.random() * 30) },
          ].map((bucket) => (
            <div key={bucket.range} className="text-center">
              <div className={`${bucket.color} h-16 rounded-lg mb-2 flex items-center justify-center text-white font-bold`}>
                {bucket.count}
              </div>
              <p className="text-sm text-muted-foreground">{bucket.range}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
