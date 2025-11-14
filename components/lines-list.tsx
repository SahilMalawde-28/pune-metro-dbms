'use client';

import { useEffect, useState } from 'react';
import { getAllLines, createLine, getAllStations, Station, createLineWithStations, Line } from '@/lib/sql';
import { Plus, Radio } from 'lucide-react';
import LineCreationModal from './line-creation-modal';

export default function LinesList() {
  const [lines, setLines] = useState<Line[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadLines();
  }, []);

  async function loadLines() {
    try {
      setLoading(true);
      const data = await getAllLines();
      setLines(data);
    } catch (error) {
      console.error('Error loading lines:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLineCreated() {
    await loadLines();
    setShowCreateModal(false);
  }

  return (
    <div className="space-y-6">
      {showCreateModal && (
        <LineCreationModal onClose={() => setShowCreateModal(false)} onLineCreated={handleLineCreated} />
      )}

      <button
        onClick={() => setShowCreateModal(true)}
        className="w-full md:w-auto px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity flex items-center gap-2 justify-center"
      >
        <Plus className="h-4 w-4" />
        Create New Line
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lines.map((line) => (
          <div
            key={line.line_id}
            className="p-4 rounded-lg border-2 bg-card hover:shadow-lg transition-shadow"
            style={{ borderColor: line.line_color }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: line.line_color }}
              ></div>
              <div>
                <h3 className="font-semibold text-foreground">{line.line_name}</h3>
                <p className="text-xs text-muted-foreground">{line.line_color}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
