import { AlertCircle, TrendingUp } from 'lucide-react';

export default function DashboardHeader() {
  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary text-primary-foreground font-bold">
            🚇
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Pune Metro DBMS</h1>
            <p className="text-sm text-muted-foreground">Advanced Transit Management System</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/10 text-accent border border-accent/20">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-medium">System Online</span>
          </div>
        </div>
      </div>
    </header>
  );
}
