'use client';

import { useEffect, useState } from 'react';
import { getAllStations, createStation, Station, getStationDetail, StationDetail } from '@/lib/sql';
import { MapPin, Plus, ChevronRight } from 'lucide-react';
import StationDetailsModal from './station-details-modal';

export default function StationsList() {
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState<StationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [newStation, setNewStation] = useState({ station_name: '', location: '' });

  useEffect(() => {
    loadStations();
  }, []);

  async function loadStations() {
    try {
      setLoading(true);
      const data = await getAllStations();
      setStations(data);
    } catch (error) {
      console.error('Error loading stations:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddStation() {
    try {
      await createStation(newStation);
      setNewStation({ station_name: '', location: '' });
      loadStations();
    } catch (error) {
      console.error('Error adding station:', error);
    }
  }

  async function handleStationClick(station_id: string) {
    try {
      const detail = await getStationDetail(station_id);
      setSelectedStation(detail);
    } catch (error) {
      console.error('Error loading station details:', error);
    }
  }

  return (
    <div className="space-y-6">
      {selectedStation && <StationDetailsModal station={selectedStation} onClose={() => setSelectedStation(null)} />}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2">
          <input
            type="text"
            placeholder="Station Name"
            value={newStation.station_name}
            onChange={(e) => setNewStation({ ...newStation, station_name: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="lg:col-span-1">
          <input
            type="text"
            placeholder="Location"
            value={newStation.location}
            onChange={(e) => setNewStation({ ...newStation, location: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button
          onClick={handleAddStation}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity flex items-center gap-2 justify-center"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stations.map((station) => (
          <div
            key={station.station_id}
            onClick={() => handleStationClick(station.station_id)}
            className="p-4 rounded-lg border border-border bg-card hover:shadow-lg transition-all cursor-pointer"
          >
            <div className="flex items-start gap-3 justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                  <h3 className="font-semibold text-foreground">{station.station_name}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{station.location}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
