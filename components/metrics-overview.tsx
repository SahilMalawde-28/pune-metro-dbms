import { ArrowUp, ArrowDown, AlertCircle, TrendingUp } from 'lucide-react';

interface MetricsOverviewProps {
  metrics: any;
}

export default function MetricsOverview({ metrics }: MetricsOverviewProps) {
  const metricCards = [
    {
      label: 'Total Trains',
      value: metrics.total_trains,
      icon: '🚇',
      color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    },
    {
      label: 'Active Stations',
      value: metrics.total_stations,
      icon: '🚉',
      color: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    },
    {
      label: 'Running Trains',
      value: metrics.running_trains,
      icon: '⚙️',
      color: 'bg-green-500/10 text-green-500 border-green-500/20',
      trend: 'up',
    },
    {
      label: 'Delayed Trains',
      value: metrics.delayed_trains,
      icon: '⏱️',
      color: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      trend: metrics.delayed_trains > 0 ? 'down' : 'up',
    },
    {
      label: 'Unresolved Conflicts',
      value: metrics.unresolved_conflicts,
      icon: '⚠️',
      color: 'bg-red-500/10 text-red-500 border-red-500/20',
      critical: metrics.unresolved_conflicts > 0,
    },
    {
      label: 'Overcrowded Trains',
      value: metrics.overcrowded_trains,
      icon: '👥',
      color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metricCards.map((card) => (
          <div
            key={card.label}
            className={`p-4 rounded-lg border ${card.color} backdrop-blur-sm transition-all hover:shadow-lg`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
                <p className="text-3xl font-bold mt-2">{card.value}</p>
              </div>
              <span className="text-2xl">{card.icon}</span>
            </div>
            {card.trend && (
              <div className="flex items-center gap-1 mt-2 text-xs">
                {card.trend === 'up' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                <span>{card.trend === 'up' ? 'Improving' : 'Worsening'}</span>
              </div>
            )}
            {card.critical && <p className="text-xs text-red-500 mt-2 font-medium">⚠️ Action Required</p>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-6 rounded-lg border border-border bg-card">
          <h3 className="font-semibold text-foreground mb-4">System Health</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Overall Status</span>
                <span className="text-2xl font-bold text-primary">{metrics.system_health}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${metrics.system_health}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-lg border border-border bg-card">
          <h3 className="font-semibold text-foreground mb-4">Quick Stats</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Schedules</span>
              <span className="font-medium">{metrics.total_schedules}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Active Conflicts</span>
              <span className="font-medium text-orange-500">{metrics.total_conflicts}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
