-- Complete Pune Metro DBMS database schema with all tables and relationships

-- Create trains table
CREATE TABLE IF NOT EXISTS trains (
  train_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  train_name VARCHAR(100) NOT NULL UNIQUE,
  capacity INT NOT NULL CHECK (capacity > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create stations table
CREATE TABLE IF NOT EXISTS stations (
  station_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_name VARCHAR(150) NOT NULL UNIQUE,
  location VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create tracks table
CREATE TABLE IF NOT EXISTS tracks (
  track_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_station_id UUID NOT NULL REFERENCES stations(station_id) ON DELETE RESTRICT,
  destination_station_id UUID NOT NULL REFERENCES stations(station_id) ON DELETE RESTRICT,
  track_capacity INT NOT NULL CHECK (track_capacity > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT different_stations CHECK (source_station_id != destination_station_id)
);

-- Create lines table
CREATE TABLE IF NOT EXISTS lines (
  line_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  line_name VARCHAR(100) NOT NULL UNIQUE,
  line_color VARCHAR(7) DEFAULT '#000000',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create line_stations junction table
CREATE TABLE IF NOT EXISTS line_stations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  line_id UUID NOT NULL REFERENCES lines(line_id) ON DELETE CASCADE,
  station_id UUID NOT NULL REFERENCES stations(station_id) ON DELETE CASCADE,
  sequence_no INT NOT NULL CHECK (sequence_no > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(line_id, sequence_no)
);

-- Create schedules table
CREATE TABLE IF NOT EXISTS schedules (
  schedule_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  train_id UUID NOT NULL REFERENCES trains(train_id) ON DELETE CASCADE,
  line_id UUID NOT NULL REFERENCES lines(line_id) ON DELETE CASCADE,
  track_id UUID NOT NULL REFERENCES tracks(track_id) ON DELETE RESTRICT,
  departure_time TIMESTAMP WITH TIME ZONE NOT NULL,
  arrival_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'running', 'completed', 'delayed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_times CHECK (departure_time < arrival_time)
);

-- Create passenger_flows table
CREATE TABLE IF NOT EXISTS passenger_flows (
  flow_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  train_id UUID NOT NULL REFERENCES trains(train_id) ON DELETE CASCADE,
  station_id UUID NOT NULL REFERENCES stations(station_id) ON DELETE CASCADE,
  occupancy_count INT NOT NULL CHECK (occupancy_count >= 0),
  occupancy_percentage INT DEFAULT 0 CHECK (occupancy_percentage >= 0 AND occupancy_percentage <= 100),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create conflict_logs table
CREATE TABLE IF NOT EXISTS conflict_logs (
  conflict_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id_1 UUID,
  schedule_id_2 UUID,
  conflict_type VARCHAR(100) NOT NULL,
  severity VARCHAR(20) CHECK (severity IN ('low', 'medium', 'high')),
  resolved BOOLEAN DEFAULT FALSE,
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_schedules_train ON schedules(train_id);
CREATE INDEX idx_schedules_line ON schedules(line_id);
CREATE INDEX idx_schedules_track ON schedules(track_id);
CREATE INDEX idx_schedules_departure ON schedules(departure_time);
CREATE INDEX idx_line_stations_line ON line_stations(line_id);
CREATE INDEX idx_passenger_flows_train ON passenger_flows(train_id);
CREATE INDEX idx_passenger_flows_station ON passenger_flows(station_id);
CREATE INDEX idx_passenger_flows_timestamp ON passenger_flows(timestamp);
CREATE INDEX idx_conflict_logs_resolved ON conflict_logs(resolved);

-- Enable RLS (Row Level Security)
ALTER TABLE trains ENABLE ROW LEVEL SECURITY;
ALTER TABLE stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE line_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE passenger_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE conflict_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all for now - restrict in production)
CREATE POLICY "Allow all for trains" ON trains FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for stations" ON stations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for tracks" ON tracks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for lines" ON lines FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for line_stations" ON line_stations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for schedules" ON schedules FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for passenger_flows" ON passenger_flows FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for conflict_logs" ON conflict_logs FOR ALL USING (true) WITH CHECK (true);
