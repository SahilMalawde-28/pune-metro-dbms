'use client';

import { useEffect, useState } from 'react';
import { getAllTrains, createTrain, Train, getTrainDetail, TrainDetail } from '@/lib/sql';
import { Trash2, Plus, ChevronRight } from 'lucide-react';
import TrainDetailsModal from './train-details-modal';

export default function TrainsList() {
  const [trains, setTrains] = useState<Train[]>([]);
  const [selectedTrain, setSelectedTrain] = useState<TrainDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [newTrain, setNewTrain] = useState({ train_name: '', capacity: 450 });

  useEffect(() => {
    loadTrains();
  }, []);

  async function loadTrains() {
    try {
      setLoading(true);
      const data = await getAllTrains();
      setTrains(data);
    } catch (error) {
      console.error('Error loading trains:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddTrain() {
    try {
      await createTrain(newTrain);
      setNewTrain({ train_name: '', capacity: 450 });
      loadTrains();
    } catch (error) {
      console.error('Error adding train:', error);
    }
  }

  async function handleTrainClick(train_id: string) {
    try {
      const detail = await getTrainDetail(train_id);
      setSelectedTrain(detail);
    } catch (error) {
      console.error('Error loading train details:', error);
    }
  }

  return (
    <div className="space-y-6">
      {selectedTrain && <TrainDetailsModal train={selectedTrain} onClose={() => setSelectedTrain(null)} />}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2">
          <input
            type="text"
            placeholder="Train Name (e.g., PMPML-T01)"
            value={newTrain.train_name}
            onChange={(e) => setNewTrain({ ...newTrain, train_name: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="lg:col-span-1">
          <input
            type="number"
            placeholder="Capacity"
            value={newTrain.capacity}
            onChange={(e) => setNewTrain({ ...newTrain, capacity: parseInt(e.target.value) || 450 })}
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button
          onClick={handleAddTrain}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity flex items-center gap-2 justify-center"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Train Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Capacity</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Active Schedules</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {trains.map((train) => (
                <tr key={train.train_id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 font-medium">{train.train_name}</td>
                  <td className="px-4 py-3">{train.capacity} passengers</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{Math.floor(Math.random() * 8) + 1}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleTrainClick(train.train_id)}
                      className="flex items-center gap-1 text-primary hover:underline text-sm"
                    >
                      View Details <ChevronRight className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
