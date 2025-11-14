-- Seed data for Pune Metro Aqua Line and Purple Line

-- ============= AQUA LINE DATA =============

-- Insert Aqua Line stations
INSERT INTO stations (station_name, location) VALUES
('Phugewale', 'West Pune'),
('Vanaz', 'West Pune'),
('Anand Nagar', 'West Pune'),
('PCMC', 'Pimpri-Chinchwad'),
('Dapodi', 'Pimpri-Chinchwad'),
('Aundh', 'North Pune'),
('Kalas', 'North Pune'),
('Lokmanya Nagar', 'North Pune'),
('Kothrud', 'Pune Central'),
('Karve Nagar', 'South Pune'),
('Market Yard', 'South Pune'),
('Bund Garden', 'South Pune')
ON CONFLICT (station_name) DO NOTHING;

-- ============= PURPLE LINE DATA =============

-- Insert Purple Line stations
INSERT INTO stations (station_name, location) VALUES
('Ramwadi', 'East Pune'),
('Hadapsar', 'East Pune'),
('Vimaan Nagar', 'East Pune'),
('Airport', 'East Pune'),
('Yerawada', 'East Pune'),
('Wagholi', 'North Pune'),
('Kalas', 'North Pune'),
('Aundh', 'North Pune')
ON CONFLICT (station_name) DO NOTHING;

-- ============= CREATE TRAINS =============

INSERT INTO trains (train_name, train_type, capacity) VALUES
('Aqua-101', 'express', 450),
('Aqua-102', 'local', 400),
('Aqua-103', 'local', 400),
('Aqua-104', 'express', 450),
('Aqua-105', 'local', 400),
('Purple-201', 'express', 450),
('Purple-202', 'local', 400),
('Purple-203', 'express', 450),
('Purple-204', 'local', 400),
('Purple-205', 'express', 450)
ON CONFLICT (train_name) DO NOTHING;

-- ============= CREATE TRACKS =============

INSERT INTO tracks (source_station_id, destination_station_id, track_capacity) 
SELECT s1.station_id, s2.station_id, 5
FROM stations s1, stations s2
WHERE s1.station_name = 'Phugewale' AND s2.station_name = 'Vanaz'
ON CONFLICT DO NOTHING;

INSERT INTO tracks (source_station_id, destination_station_id, track_capacity)
SELECT s1.station_id, s2.station_id, 5
FROM stations s1, stations s2
WHERE s1.station_name = 'Vanaz' AND s2.station_name = 'Anand Nagar'
ON CONFLICT DO NOTHING;

INSERT INTO tracks (source_station_id, destination_station_id, track_capacity)
SELECT s1.station_id, s2.station_id, 5
FROM stations s1, stations s2
WHERE s1.station_name = 'Anand Nagar' AND s2.station_name = 'PCMC'
ON CONFLICT DO NOTHING;

INSERT INTO tracks (source_station_id, destination_station_id, track_capacity)
SELECT s1.station_id, s2.station_id, 5
FROM stations s1, stations s2
WHERE s1.station_name = 'PCMC' AND s2.station_name = 'Dapodi'
ON CONFLICT DO NOTHING;

INSERT INTO tracks (source_station_id, destination_station_id, track_capacity)
SELECT s1.station_id, s2.station_id, 5
FROM stations s1, stations s2
WHERE s1.station_name = 'Dapodi' AND s2.station_name = 'Aundh'
ON CONFLICT DO NOTHING;

INSERT INTO tracks (source_station_id, destination_station_id, track_capacity)
SELECT s1.station_id, s2.station_id, 5
FROM stations s1, stations s2
WHERE s1.station_name = 'Aundh' AND s2.station_name = 'Kothrud'
ON CONFLICT DO NOTHING;

INSERT INTO tracks (source_station_id, destination_station_id, track_capacity)
SELECT s1.station_id, s2.station_id, 5
FROM stations s1, stations s2
WHERE s1.station_name = 'Kothrud' AND s2.station_name = 'Karve Nagar'
ON CONFLICT DO NOTHING;

INSERT INTO tracks (source_station_id, destination_station_id, track_capacity)
SELECT s1.station_id, s2.station_id, 5
FROM stations s1, stations s2
WHERE s1.station_name = 'Karve Nagar' AND s2.station_name = 'Market Yard'
ON CONFLICT DO NOTHING;

INSERT INTO tracks (source_station_id, destination_station_id, track_capacity)
SELECT s1.station_id, s2.station_id, 5
FROM stations s1, stations s2
WHERE s1.station_name = 'Market Yard' AND s2.station_name = 'Bund Garden'
ON CONFLICT DO NOTHING;

-- Purple line tracks
INSERT INTO tracks (source_station_id, destination_station_id, track_capacity)
SELECT s1.station_id, s2.station_id, 5
FROM stations s1, stations s2
WHERE s1.station_name = 'Ramwadi' AND s2.station_name = 'Hadapsar'
ON CONFLICT DO NOTHING;

-- ============= CREATE LINES =============

INSERT INTO lines (line_name, line_color) VALUES
('Aqua Line', '#00B4D8'),
('Purple Line', '#9D4EDD')
ON CONFLICT (line_name) DO NOTHING;

-- ============= LINK STATIONS TO LINES =============

-- Aqua Line stations
INSERT INTO line_stations (line_id, station_id, sequence_no)
SELECT l.line_id, s.station_id, ROW_NUMBER() OVER (ORDER BY CASE 
  WHEN s.station_name = 'Phugewale' THEN 1
  WHEN s.station_name = 'Vanaz' THEN 2
  WHEN s.station_name = 'Anand Nagar' THEN 3
  WHEN s.station_name = 'PCMC' THEN 4
  WHEN s.station_name = 'Dapodi' THEN 5
  WHEN s.station_name = 'Aundh' THEN 6
  WHEN s.station_name = 'Kothrud' THEN 7
  WHEN s.station_name = 'Karve Nagar' THEN 8
  WHEN s.station_name = 'Market Yard' THEN 9
  WHEN s.station_name = 'Bund Garden' THEN 10
END)
FROM lines l, stations s
WHERE l.line_name = 'Aqua Line' AND s.station_name IN (
  'Phugewale', 'Vanaz', 'Anand Nagar', 'PCMC', 'Dapodi', 'Aundh', 'Kothrud', 'Karve Nagar', 'Market Yard', 'Bund Garden'
)
ON CONFLICT DO NOTHING;

-- Purple Line stations
INSERT INTO line_stations (line_id, station_id, sequence_no)
SELECT l.line_id, s.station_id, ROW_NUMBER() OVER (ORDER BY CASE 
  WHEN s.station_name = 'Ramwadi' THEN 1
  WHEN s.station_name = 'Hadapsar' THEN 2
  WHEN s.station_name = 'Vimaan Nagar' THEN 3
  WHEN s.station_name = 'Airport' THEN 4
  WHEN s.station_name = 'Yerawada' THEN 5
  WHEN s.station_name = 'Wagholi' THEN 6
  WHEN s.station_name = 'Kalas' THEN 7
  WHEN s.station_name = 'Aundh' THEN 8
END)
FROM lines l, stations s
WHERE l.line_name = 'Purple Line' AND s.station_name IN (
  'Ramwadi', 'Hadapsar', 'Vimaan Nagar', 'Airport', 'Yerawada', 'Wagholi', 'Kalas', 'Aundh'
)
ON CONFLICT DO NOTHING;

-- ============= CREATE SAMPLE SCHEDULES =============

-- Aqua Line schedules
INSERT INTO schedules (train_id, line_id, track_id, departure_time, arrival_time, status)
SELECT t.train_id, l.line_id, tr.track_id, 
  NOW() + INTERVAL '1 hour', 
  NOW() + INTERVAL '2 hours',
  'scheduled'
FROM trains t, lines l, tracks tr
WHERE t.train_name = 'Aqua-101' AND l.line_name = 'Aqua Line' 
  AND tr.source_station_id = (SELECT station_id FROM stations WHERE station_name = 'Phugewale')
  AND tr.destination_station_id = (SELECT station_id FROM stations WHERE station_name = 'Vanaz')
ON CONFLICT DO NOTHING;

-- Add more schedules
INSERT INTO schedules (train_id, line_id, track_id, departure_time, arrival_time, status)
SELECT t.train_id, l.line_id, tr.track_id,
  NOW() + INTERVAL '3 hours',
  NOW() + INTERVAL '4 hours', 
  'scheduled'
FROM trains t, lines l, tracks tr
WHERE t.train_name = 'Aqua-102' AND l.line_name = 'Aqua Line'
  AND tr.source_station_id = (SELECT station_id FROM stations WHERE station_name = 'Phugewale')
  AND tr.destination_station_id = (SELECT station_id FROM stations WHERE station_name = 'Vanaz')
ON CONFLICT DO NOTHING;

-- ============= SAMPLE PASSENGER FLOW DATA =============

INSERT INTO passenger_flows (train_id, station_id, occupancy_count, occupancy_percentage, timestamp)
SELECT t.train_id, s.station_id, 
  FLOOR(RANDOM() * 450)::INT,
  FLOOR(RANDOM() * 100)::INT,
  NOW() - INTERVAL '30 minutes'
FROM trains t, stations s
WHERE t.train_name = 'Aqua-101' AND s.station_name = 'Phugewale'
ON CONFLICT DO NOTHING;

INSERT INTO passenger_flows (train_id, station_id, occupancy_count, occupancy_percentage, timestamp)
SELECT t.train_id, s.station_id,
  FLOOR(RANDOM() * 450)::INT,
  FLOOR(RANDOM() * 100)::INT,
  NOW() - INTERVAL '15 minutes'
FROM trains t, stations s
WHERE t.train_name = 'Aqua-101' AND s.station_name = 'Vanaz'
ON CONFLICT DO NOTHING;
