-- Add more intersecting stations for better coverage
INSERT INTO stations (station_name, location) VALUES
('Phugewale', 'Akurdi'),
('Moshi', 'Moshi'),
('Dapodi', 'Dapodi'),
('Ravivar Peth', 'Ravivar Peth'),
('Hadapsar', 'Hadapsar'),
('Ghod Bunder Road', 'Wakad'),
('Vastrad Nagar', 'Vastrad Nagar'),
('Bund Garden', 'Bund Garden'),
('Ramwadi', 'Ramwadi'),
('Kasarwadi', 'Kasarwadi'),
('Swargate', 'Swargate'),
('Civil Court', 'Civil Court'),
('Mangalwar Peth', 'Mangalwar Peth'),
('Aundh', 'Aundh'),
('Vetal Hill', 'Vetal Hill'),
('Ishanya', 'Ishanya'),
('Kothrud', 'Kothrud'),
('Deccan Gymkhana', 'Deccan'),
('Karve Road', 'Karve Road'),
('Rasta Peth', 'Rasta Peth')
ON CONFLICT (station_name) DO NOTHING;
