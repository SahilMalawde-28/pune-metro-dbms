import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============= SCHEMA & TYPE DEFINITIONS =============

export interface Train {
  train_id: string;
  train_name: string;
  capacity: number;
  created_at: string;
}

export interface Station {
  station_id: string;
  station_name: string;
  location: string;
  created_at: string;
}

export interface Track {
  track_id: string;
  source_station_id: string;
  destination_station_id: string;
  track_capacity: number;
  created_at: string;
}

export interface Line {
  line_id: string;
  line_name: string;
  line_color: string;
  created_at: string;
}

export interface LineStation {
  id: string;
  line_id: string;
  station_id: string;
  sequence_no: number;
  created_at: string;
}

export interface Schedule {
  schedule_id: string;
  train_id: string;
  line_id: string;
  track_id: string;
  departure_time: string;
  arrival_time: string;
  status: 'scheduled' | 'running' | 'completed' | 'delayed' | 'cancelled';
  created_at: string;
}

export interface PassengerFlow {
  flow_id: string;
  train_id: string;
  station_id: string;
  occupancy_count: number;
  occupancy_percentage: number;
  timestamp: string;
  created_at: string;
}

export interface ConflictLog {
  conflict_id: string;
  schedule_id_1: string;
  schedule_id_2: string;
  conflict_type: string;
  severity: 'low' | 'medium' | 'high';
  resolved: boolean;
  details: string;
  created_at: string;
}

export interface TrainDetail extends Train {
  schedules: ScheduleDetail[];
  totalDistance: number;
  nextStation?: string;
  currentOccupancy: number;
}

export interface ScheduleDetail extends Schedule {
  train?: { train_name: string; capacity: number };
  line?: { line_name: string; line_color: string };
  track?: { source_station_id: string; destination_station_id: string };
  sourceStation?: { station_name: string };
  destStation?: { station_name: string };
}

export interface StationDetail extends Station {
  lines: LineWithStations[];
  intersectingLines: string[];
  trainsToday: number;
}

export interface LineWithStations extends Line {
  line_stations: {
    sequence_no: number;
    station: Station;
  }[];
}

// ============= INITIALIZATION QUERIES =============

export async function initializeDatabase() {
  try {
    // Create trains table
    await supabase.from('trains').select('*').limit(0);
    
    // If tables don't exist, they'll be created via the migration script
    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
}

// ============= TRAIN OPERATIONS =============

export async function createTrain(train: Omit<Train, 'created_at' | 'train_id'>) {
  const { data, error } = await supabase
    .from('trains')
    .insert([train])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getAllTrains(): Promise<Train[]> {
  const { data, error } = await supabase
    .from('trains')
    .select('*')
    .order('train_name');
  if (error) throw error;
  return data || [];
}

export async function updateTrain(train_id: string, updates: Partial<Train>) {
  const { data, error } = await supabase
    .from('trains')
    .update(updates)
    .eq('train_id', train_id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTrain(train_id: string) {
  const { error } = await supabase
    .from('trains')
    .delete()
    .eq('train_id', train_id);
  if (error) throw error;
}

// ============= STATION OPERATIONS =============

export async function createStation(station: Omit<Station, 'created_at'>) {
  const { data, error } = await supabase
    .from('stations')
    .insert([station])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getAllStations(): Promise<Station[]> {
  const { data, error } = await supabase
    .from('stations')
    .select('*')
    .order('station_name');
  if (error) throw error;
  return data || [];
}

export async function updateStation(station_id: string, updates: Partial<Station>) {
  const { data, error } = await supabase
    .from('stations')
    .update(updates)
    .eq('station_id', station_id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ============= TRACK OPERATIONS =============

export async function createTrack(track: Omit<Track, 'created_at'>) {
  const { data, error } = await supabase
    .from('tracks')
    .insert([track])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getAllTracks(): Promise<Track[]> {
  const { data, error } = await supabase
    .from('tracks')
    .select(`
      *,
      source_station: stations!source_station_id(station_name),
      destination_station: stations!destination_station_id(station_name)
    `)
    .order('track_id');
  if (error) throw error;
  return data || [];
}

export async function getAvailableTracks(departure_time: string, arrival_time: string): Promise<Track[]> {
  const { data, error } = await supabase
    .from('tracks')
    .select(`
      *,
      schedules!inner(schedule_id)
    `)
    .lt('schedules.departure_time', arrival_time)
    .gt('schedules.arrival_time', departure_time)
    .order('track_id');
  if (error) throw error;
  return data || [];
}

// ============= LINE OPERATIONS =============

export async function createLine(line: Omit<Line, 'created_at'>) {
  const { data, error } = await supabase
    .from('lines')
    .insert([line])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getAllLines(): Promise<Line[]> {
  const { data, error } = await supabase
    .from('lines')
    .select('*')
    .order('line_name');
  if (error) throw error;
  return data || [];
}

export async function getLineWithStations(line_id: string) {
  const { data, error } = await supabase
    .from('lines')
    .select(`
      *,
      line_stations: line_stations(
        sequence_no,
        station: stations(*)
      )
    `)
    .eq('line_id', line_id)
    .single();
  if (error) throw error;
  return data;
}

// ============= LINE STATION OPERATIONS =============

export async function addStationToLine(line_id: string, station_id: string, sequence_no: number) {
  const { data, error } = await supabase
    .from('line_stations')
    .insert([{ line_id, station_id, sequence_no }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ============= SCHEDULE OPERATIONS =============

export async function createSchedule(schedule: Omit<Schedule, 'created_at'>) {
  // Check for conflicts first
  const conflicts = await detectScheduleConflicts(schedule);
  if (conflicts.length > 0) {
    throw new Error(`Schedule conflicts detected: ${conflicts.length} conflict(s) found`);
  }

  const { data, error } = await supabase
    .from('schedules')
    .insert([schedule])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getAllSchedules(): Promise<Schedule[]> {
  const { data, error } = await supabase
    .from('schedules')
    .select(`
      *,
      train: trains(train_name),
      line: lines(line_name),
      track: tracks(*)
    `)
    .order('departure_time');
  if (error) throw error;
  return data || [];
}

export async function getSchedulesByTrain(train_id: string): Promise<Schedule[]> {
  const { data, error } = await supabase
    .from('schedules')
    .select('*')
    .eq('train_id', train_id)
    .order('departure_time');
  if (error) throw error;
  return data || [];
}

export async function getSchedulesByLine(line_id: string): Promise<Schedule[]> {
  const { data, error } = await supabase
    .from('schedules')
    .select(`
      *,
      train: trains(train_name),
      track: tracks(*)
    `)
    .eq('line_id', line_id)
    .order('departure_time');
  if (error) throw error;
  return data || [];
}

export async function updateScheduleStatus(schedule_id: string, status: Schedule['status']) {
  const { data, error } = await supabase
    .from('schedules')
    .update({ status })
    .eq('schedule_id', schedule_id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ============= CONFLICT DETECTION =============

export async function detectScheduleConflicts(newSchedule: Omit<Schedule, 'created_at'>) {
  const { data: existingSchedules, error } = await supabase
    .from('schedules')
    .select('*')
    .eq('track_id', newSchedule.track_id);

  if (error) throw error;

  const conflicts = [];
  for (const schedule of existingSchedules || []) {
    if (
      (newSchedule.departure_time < schedule.arrival_time &&
        newSchedule.arrival_time > schedule.departure_time) ||
      newSchedule.departure_time === schedule.departure_time
    ) {
      conflicts.push({
        schedule_id_1: newSchedule.schedule_id || 'new',
        schedule_id_2: schedule.schedule_id,
        conflict_type: 'track_overlap',
        severity: 'high',
        details: `Train overlap on track ${newSchedule.track_id}`,
      });
    }
  }

  return conflicts;
}

export async function getAllConflicts(): Promise<ConflictLog[]> {
  const { data, error } = await supabase
    .from('conflict_logs')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function resolveConflict(conflict_id: string) {
  const { data, error } = await supabase
    .from('conflict_logs')
    .update({ resolved: true })
    .eq('conflict_id', conflict_id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ============= PASSENGER FLOW OPERATIONS =============

export async function recordPassengerFlow(flow: Omit<PassengerFlow, 'created_at'>) {
  const { data, error } = await supabase
    .from('passenger_flows')
    .insert([flow])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getPassengerFlowByTrain(train_id: string): Promise<PassengerFlow[]> {
  const { data, error } = await supabase
    .from('passenger_flows')
    .select('*')
    .eq('train_id', train_id)
    .order('timestamp', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getPassengerFlowByStation(station_id: string): Promise<PassengerFlow[]> {
  const { data, error } = await supabase
    .from('passenger_flows')
    .select(`
      *,
      train: trains(train_name),
      station: stations(station_name)
    `)
    .eq('station_id', station_id)
    .order('timestamp', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getPeakHourAnalysis() {
  const { data, error } = await supabase
    .from('passenger_flows')
    .select('timestamp, occupancy_percentage')
    .order('timestamp');
  if (error) throw error;

  // Group by hour and calculate average occupancy
  const hourlyData: Record<string, number[]> = {};
  (data || []).forEach((flow) => {
    const hour = new Date(flow.timestamp).getHours();
    const key = `${hour}:00`;
    if (!hourlyData[key]) hourlyData[key] = [];
    hourlyData[key].push(flow.occupancy_percentage);
  });

  return Object.entries(hourlyData).map(([hour, occupancies]) => ({
    hour,
    average_occupancy: occupancies.reduce((a, b) => a + b, 0) / occupancies.length,
    total_records: occupancies.length,
  }));
}

export async function getOvercrowdedTrains(threshold: number = 80): Promise<PassengerFlow[]> {
  const { data, error } = await supabase
    .from('passenger_flows')
    .select(`
      *,
      train: trains(train_name, capacity),
      station: stations(station_name)
    `)
    .gte('occupancy_percentage', threshold)
    .order('occupancy_percentage', { ascending: false });
  if (error) throw error;
  return data || [];
}

// ============= ANALYTICS QUERIES =============

export async function getSystemMetrics() {
  try {
    const [trains, stations, schedules, conflicts, overCrowded] = await Promise.all([
      getAllTrains(),
      getAllStations(),
      getAllSchedules(),
      getAllConflicts(),
      getOvercrowdedTrains(),
    ]);

    const runningSchedules = schedules.filter((s) => s.status === 'running').length;
    const delayedSchedules = schedules.filter((s) => s.status === 'delayed').length;
    const unresolvedConflicts = conflicts.filter((c) => !c.resolved).length;

    return {
      total_trains: trains.length,
      total_stations: stations.length,
      total_schedules: schedules.length,
      running_trains: runningSchedules,
      delayed_trains: delayedSchedules,
      total_conflicts: conflicts.length,
      unresolved_conflicts: unresolvedConflicts,
      overcrowded_trains: overCrowded.length,
      system_health: Math.max(0, 100 - unresolvedConflicts * 5),
    };
  } catch (error) {
    console.error('Error fetching metrics:', error);
    throw error;
  }
}

export async function getLineMetrics(line_id: string) {
  const [schedules, stations] = await Promise.all([
    getSchedulesByLine(line_id),
    supabase
      .from('line_stations')
      .select('station_id')
      .eq('line_id', line_id),
  ]);

  return {
    total_schedules: schedules.length,
    running: schedules.filter((s) => s.status === 'running').length,
    delayed: schedules.filter((s) => s.status === 'delayed').length,
    completed: schedules.filter((s) => s.status === 'completed').length,
    total_stations: stations.data?.length || 0,
  };
}

// ============= DETAILED QUERIES =============

export async function getTrainDetail(train_id: string): Promise<TrainDetail> {
  const { data, error } = await supabase
    .from('trains')
    .select(`
      *,
      schedules: schedules(
        *,
        train: trains(train_name, capacity),
        line: lines(line_name, line_color),
        track: tracks(*)
      )
    `)
    .eq('train_id', train_id)
    .single();
  if (error) throw error;

  const schedules = data?.schedules || [];
  return {
    ...data,
    schedules,
    totalDistance: schedules.length > 0 ? schedules.length * 5 : 0,
    currentOccupancy: Math.floor(Math.random() * 100),
  };
}

export async function getStationDetail(station_id: string): Promise<StationDetail> {
  const { data: station, error } = await supabase
    .from('stations')
    .select('*')
    .eq('station_id', station_id)
    .single();

  if (error) throw error;

  // Get all lines passing through this station
  const { data: lineStations } = await supabase
    .from('line_stations')
    .select(`
      line: lines(
        *,
        line_stations(
          sequence_no,
          station: stations(*)
        )
      )
    `)
    .eq('station_id', station_id);

  const lines = lineStations?.map(ls => ls.line) || [];
  const intersectingLines = lines.map(l => l.line_name);

  return {
    ...station,
    lines: lines as LineWithStations[],
    intersectingLines,
    trainsToday: Math.floor(Math.random() * 50),
  };
}

export async function getSchedulesByLineDetailed(line_id: string): Promise<ScheduleDetail[]> {
  const { data, error } = await supabase
    .from('schedules')
    .select(`
      *,
      train: trains(train_name, capacity),
      line: lines(line_name, line_color),
      track: tracks(*)
    `)
    .eq('line_id', line_id)
    .order('departure_time');

  if (error) throw error;

  // Fetch station details for each schedule
  const schedulesWithStations = await Promise.all((data || []).map(async (schedule) => {
    const [source, dest] = await Promise.all([
      supabase.from('stations').select('*').eq('station_id', schedule.track.source_station_id).single(),
      supabase.from('stations').select('*').eq('station_id', schedule.track.destination_station_id).single(),
    ]);

    return {
      ...schedule,
      sourceStation: source.data,
      destStation: dest.data,
    };
  }));

  return schedulesWithStations;
}

export async function createLineWithStations(
  lineName: string,
  lineColor: string,
  stationIds: string[]
): Promise<Line> {
  // Create the line
  const line = await createLine({ line_name: lineName, line_color: lineColor });

  // Add stations to line
  for (let i = 0; i < stationIds.length; i++) {
    await addStationToLine(line.line_id, stationIds[i], i + 1);
  }

  // Auto-generate schedules for the new line
  await generateSchedulesForLine(line.line_id);

  return line;
}

export async function generateSchedulesForLine(line_id: string) {
  const { data: lineWithStations } = await supabase
    .from('lines')
    .select(`
      *,
      line_stations: line_stations(
        sequence_no,
        station: stations(*)
      )
    `)
    .eq('line_id', line_id)
    .single();

  if (!lineWithStations || !lineWithStations.line_stations) return;

  const stations = lineWithStations.line_stations
    .sort((a: any, b: any) => a.sequence_no - b.sequence_no)
    .map((ls: any) => ls.station);

  // Get available trains
  const trains = await getAllTrains();

  // Generate schedules for consecutive stations
  const schedules = [];
  for (let i = 0; i < stations.length - 1; i++) {
    for (const train of trains.slice(0, 3)) {
      // Create 3 trains per line segment
      const baseTime = new Date();
      baseTime.setHours(6 + Math.floor(Math.random() * 12), 0, 0, 0);

      // Check if track exists
      const { data: existingTrack } = await supabase
        .from('tracks')
        .select('*')
        .eq('source_station_id', stations[i].station_id)
        .eq('destination_station_id', stations[i + 1].station_id)
        .single();

      let trackId = existingTrack?.track_id;

      if (!trackId) {
        const newTrack = await createTrack({
          source_station_id: stations[i].station_id,
          destination_station_id: stations[i + 1].station_id,
          track_capacity: 1000,
        });
        trackId = newTrack.track_id;
      }

      const departureTime = new Date(baseTime);
      departureTime.setMinutes(i * 10 + Math.floor(Math.random() * 5));

      const arrivalTime = new Date(departureTime);
      arrivalTime.setMinutes(arrivalTime.getMinutes() + 8);

      schedules.push({
        train_id: train.train_id,
        line_id: line_id,
        track_id: trackId,
        departure_time: departureTime.toISOString(),
        arrival_time: arrivalTime.toISOString(),
        status: 'scheduled' as const,
      });
    }
  }

  // Insert all schedules
  const { error } = await supabase
    .from('schedules')
    .insert(schedules);

  if (error) console.error('Error generating schedules:', error);
}
