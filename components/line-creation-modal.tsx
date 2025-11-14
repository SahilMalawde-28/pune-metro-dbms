'use client';

import { useEffect, useState } from 'react';
import { getAllStations, Station, createLineWithStations } from '@/lib/sql';
import { X, Plus, Trash2 } from 'lucide-react';

interface LineCreationModalProps {
  onClose: () => void;
  onLineCreated: () => void;
}

export default function LineCreationModal({ onClose, onLineCreated }: LineCreationModalProps) {
  const [stations, setStations] = useState<Station[]>([]);
  const [lineName, setLineName] = useState('');
  const [lineColor, setLineColor] = useState('#00B4D8');
  const [selectedStations, setSelectedStations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStations();
  }, []);

  async function loadStations() {
    try {
      const data = await getAllStations();
      setStations(data);
    } catch (error) {
      console.error('Error loading stations:', error);
    }
  }

  function handleAddStation(stationId: string) {
    if (!selectedStations.includes(stationId)) {
      setSelectedStations([...selectedStations, stationId]);
    }
  }

  function handleRemoveStation(stationId: string) {
    setSelectedStations(selectedStations.filter((id) => id !== stationId));
  }

  async function handleCreateLine() {
    if (!lineName || selectedStations.length < 2) {
      alert('Please provide a line name and select at least 2 stations');
      return;
    }

    try {
      setLoading(true);
      await createLineWithStations(lineName, lineColor, selectedStations);
      onLineCreated();
    } catch (error) {
      console.error('Error creating line:', error);
      alert('Error creating line');
    } finally {
      setLoading(false);
    }
  }

  const availableStations = stations.filter((s) => !selectedStations.includes(s.station_id));

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border bg-muted">
          <h2 className="text-2xl font-bold">Create New Metro Line</h2>
          <button onClick={onClose} className="p-2 hover:bg-background rounded-lg">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Line Name</label>
              <input
                type="text"
                placeholder="e.g., Blue Line, Green Line"
                value={lineName}
                onChange={(e) => setLineName(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Line Color</label>
              <div className="flex items-center gap-3 mt-1">
                <input
                  type="color"
                  value={lineColor}
                  onChange={(e) => setLineColor(e.target.value)}
                  className="w-12 h-10 rounded-lg cursor-pointer border border-input"
                />
                <span className="text-sm text-muted-foreground">{lineColor}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">Selected Stations (in order)</h3>
            {selectedStations.length === 0 ? (
              <p className="text-sm text-muted-foreground">No stations selected</p>
            ) : (
              <div className="space-y-2">
                {selectedStations.map((stationId, index) => {
                  const station = stations.find((s) => s.station_id === stationId);
                  return (
                    <div key={stationId} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/50">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium text-sm">{station?.station_name}</p>
                          <p className="text-xs text-muted-foreground">{station?.location}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveStation(stationId)}
                        className="p-2 hover:bg-background rounded-lg text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">Available Stations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
              {availableStations.map((station) => (
                <button
                  key={station.station_id}
                  onClick={() => handleAddStation(station.station_id)}
                  className="p-3 rounded-lg border border-border bg-muted hover:bg-muted/80 transition-colors text-left"
                >
                  <p className="font-medium text-sm">{station.station_name}</p>
                  <p className="text-xs text-muted-foreground">{station.location}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-input hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateLine}
              disabled={loading || !lineName || selectedStations.length < 2}
              className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Line'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
