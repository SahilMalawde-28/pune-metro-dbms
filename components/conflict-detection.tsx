'use client';

import { useEffect, useState } from 'react';
import { getAllConflicts, resolveConflict, ConflictLog } from '@/lib/sql';
import { AlertTriangle, CheckCircle } from 'lucide-react';

export default function ConflictDetection() {
  const [conflicts, setConflicts] = useState<ConflictLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConflicts();
    const interval = setInterval(loadConflicts, 5000);
    return () => clearInterval(interval);
  }, []);

  async function loadConflicts() {
    try {
      setLoading(true);
      const data = await getAllConflicts();
      setConflicts(data);
    } catch (error) {
      console.error('Error loading conflicts:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleResolve(conflict_id: string) {
    try {
      await resolveConflict(conflict_id);
      loadConflicts();
    } catch (error) {
      console.error('Error resolving conflict:', error);
    }
  }

  const unresolved = conflicts.filter((c) => !c.resolved);
  const resolved = conflicts.filter((c) => c.resolved);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-500/20 text-red-700 border-red-500/30';
      case 'medium':
        return 'bg-orange-500/20 text-orange-700 border-orange-500/30';
      case 'low':
        return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border border-red-500/20 bg-red-500/5">
          <p className="text-sm text-muted-foreground">Unresolved Conflicts</p>
          <p className="text-3xl font-bold text-red-500 mt-1">{unresolved.length}</p>
        </div>
        <div className="p-4 rounded-lg border border-green-500/20 bg-green-500/5">
          <p className="text-sm text-muted-foreground">Resolved Today</p>
          <p className="text-3xl font-bold text-green-500 mt-1">{resolved.length}</p>
        </div>
        <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
          <p className="text-sm text-muted-foreground">Total Conflicts</p>
          <p className="text-3xl font-bold text-primary mt-1">{conflicts.length}</p>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Unresolved Conflicts</h3>
        {unresolved.length === 0 ? (
          <div className="p-6 rounded-lg border border-green-500/20 bg-green-500/5 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
            <p className="text-green-700 font-medium">No conflicts detected</p>
          </div>
        ) : (
          <div className="space-y-2">
            {unresolved.map((conflict) => (
              <div key={conflict.conflict_id} className={`p-4 rounded-lg border ${getSeverityColor(conflict.severity)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold">{conflict.conflict_type}</p>
                      <p className="text-xs mt-1">{conflict.details}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleResolve(conflict.conflict_id)}
                    className="px-3 py-1 rounded text-xs font-medium bg-white/10 hover:bg-white/20 transition-colors ml-4 flex-shrink-0"
                  >
                    Resolve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
