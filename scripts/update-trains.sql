-- Add more trains to the system (remove express/local distinction)
INSERT INTO trains (train_name, capacity) VALUES
('PMPML-T01', 450),
('PMPML-T02', 450),
('PMPML-T03', 450),
('PMPML-T04', 450),
('PMPML-T05', 450),
('PMPML-T06', 480),
('PMPML-T07', 480),
('PMPML-T08', 480),
('PMPML-T09', 500),
('PMPML-T10', 500),
('PMPML-T11', 450),
('PMPML-T12', 480),
('PMPML-T13', 500),
('PMPML-T14', 450),
('PMPML-T15', 480)
ON CONFLICT DO NOTHING;
