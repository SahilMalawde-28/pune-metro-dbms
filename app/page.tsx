'use client';

import { useEffect, useState } from 'react';
import { getAllTrains, getAllStations, getAllLines, getSystemMetrics, getAllSchedules, getOvercrowdedTrains } from '@/lib/sql';
import DashboardHeader from '@/components/dashboard-header';
import MetricsOverview from '@/components/metrics-overview';
import NavigationTabs from '@/components/navigation-tabs';
import TrainsList from '@/components/trains-list';
import StationsList from '@/components/stations-list';
import LinesList from '@/components/lines-list';
import SchedulesList from '@/components/schedules-list';
import ConflictDetection from '@/components/conflict-detection';
import PassengerAnalytics from '@/components/passenger-analytics';

type Tab = 'overview' | 'trains' | 'stations' | 'lines' | 'schedules' | 'conflicts' | 'analytics';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const data = await getSystemMetrics();
        setMetrics(data);
      } catch (error) {
        console.error('Error loading metrics:', error);
      } finally {
        setLoading(false);
      }
    }

    loadMetrics();
    const interval = setInterval(loadMetrics, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading system data...</p>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && metrics && <MetricsOverview metrics={metrics} />}
            {activeTab === 'trains' && <TrainsList />}
            {activeTab === 'stations' && <StationsList />}
            {activeTab === 'lines' && <LinesList />}
            {activeTab === 'schedules' && <SchedulesList />}
            {activeTab === 'conflicts' && <ConflictDetection />}
            {activeTab === 'analytics' && <PassengerAnalytics />}
          </>
        )}
      </main>
    </div>
  );
}
