import { Activity, BarChart3, AlertTriangle, Clock, MapPin, Radio, Train } from 'lucide-react';

interface NavigationTabsProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
}

export default function NavigationTabs({ activeTab, setActiveTab }: NavigationTabsProps) {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'trains', label: 'Trains', icon: Train },
    { id: 'stations', label: 'Stations', icon: MapPin },
    { id: 'lines', label: 'Lines', icon: Radio },
    { id: 'schedules', label: 'Schedules', icon: Clock },
    { id: 'conflicts', label: 'Conflicts', icon: AlertTriangle },
    { id: 'analytics', label: 'Analytics', icon: Activity },
  ];

  return (
    <nav className="flex gap-1 overflow-x-auto">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-primary text-primary font-medium'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className="h-4 w-4" />
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
