const API_BASE_URL = 'http://localhost:8080/api';
const TIMEOUT_MS = 30000;
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 2000;

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiryTime: number;
}

class ClientCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private readonly defaultExpiry = 5 * 60 * 1000;
  
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    const now = Date.now();
    if (now > entry.expiryTime) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data as T;
  }
  
  set<T>(key: string, data: T, expiry: number = this.defaultExpiry): void {
    const timestamp = Date.now();
    this.cache.set(key, {
      data,
      timestamp,
      expiryTime: timestamp + expiry
    });
  }
  
  clear(): void {
    this.cache.clear();
  }
}

const clientCache = new ClientCache();

const fetchConfig = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  mode: 'cors' as RequestMode,
};

const fetchWithRetry = async <T>(
  url: string, 
  options = {}, 
  retries = RETRY_ATTEMPTS, 
  timeout = TIMEOUT_MS
): Promise<T> => {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      if (attempt > 0) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
      }
      
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Timeout: ${url}`));
        }, timeout);
      });
      
      const fetchPromise = fetch(url, options);
      const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json() as T;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt === retries - 1) {
        throw lastError;
      }
    }
  }
  
  throw new Error('Error inesperado en fetchWithRetry');
};

const fetchApiData = async <T>(endpoint: string, forceRefresh = false): Promise<T> => {
  const cacheKey = `api_${endpoint}`;
  
  if (!forceRefresh) {
    const cachedData = clientCache.get<T>(cacheKey);
    if (cachedData) {
      return cachedData;
    }
  }
  
  const data = await fetchWithRetry<T>(`${API_BASE_URL}${endpoint}`, fetchConfig);
  clientCache.set<T>(cacheKey, data);
  return data;
};

// Interfaces
export interface TotalVolumeData {
  hourly: Record<string, number>;
  daily: Record<string, number>;
  total: Record<string, number>;
}

export interface VehicleCounts {
  [vehicleType: string]: number;
}

export interface LaneVehicleData {
  [lane: string]: VehicleCounts;
}

export interface HourlyPatternsData {
  [hour: string]: number;
}

export interface SpeedByLaneData {
  [lane: string]: number;
}

export interface BottleneckItem {
  lane: string;
  avgSpeed: number;
  totalVehicles: number;
}

export interface TrafficEvolutionData {
  timestamps: string[];
  car: number[];
  bus: number[];
  truck: number[];
}

export interface SpeedEvolutionData {
  timestamps: string[];
  lane_1: number[];
  lane_2: number[];
  lane_3: number[];
}

export interface VehicleTypeDominanceData {
  [vehicleType: string]: number;
}

export interface DashboardData {
  totalVolume: TotalVolumeData;
  volumeByLane: LaneVehicleData;
  hourlyPatterns: HourlyPatternsData;
  avgSpeedByLane: SpeedByLaneData;
  bottlenecks: BottleneckItem[];
  trafficEvolution: TrafficEvolutionData;
  speedEvolution: SpeedEvolutionData;
  vehicleTypeDominance: VehicleTypeDominanceData;
}

export interface DataStructures {
  arrayData: number[];
  stackData: any[];
  queueData: any[];
  treeData: any;
}

export const fetchData = async (forceRefresh = false): Promise<DashboardData> => {
  const results = await Promise.allSettled([
    fetchApiData<TotalVolumeData>('/detections/volume/total', forceRefresh),
    fetchApiData<LaneVehicleData>('/detections/volume/by-lane', forceRefresh),
    fetchApiData<HourlyPatternsData>('/detections/patterns/hourly', forceRefresh),
    fetchApiData<SpeedByLaneData>('/detections/lanes/speed', forceRefresh),
    fetchApiData<BottleneckItem[]>('/detections/lanes/bottlenecks', forceRefresh),
    fetchApiData<TrafficEvolutionData>('/detections/temporal/evolution', forceRefresh),
    fetchApiData<SpeedEvolutionData>('/detections/temporal/speed', forceRefresh),
    fetchApiData<VehicleTypeDominanceData>('/detections/vehicle-types/dominance', forceRefresh)
  ]);
  
  const dashboardData: DashboardData = {
    totalVolume: results[0].status === 'fulfilled' ? results[0].value : { hourly: {}, daily: {}, total: {} },
    volumeByLane: results[1].status === 'fulfilled' ? results[1].value : {},
    hourlyPatterns: results[2].status === 'fulfilled' ? results[2].value : {},
    avgSpeedByLane: results[3].status === 'fulfilled' ? results[3].value : {},
    bottlenecks: results[4].status === 'fulfilled' ? results[4].value : [],
    trafficEvolution: results[5].status === 'fulfilled' ? results[5].value : { timestamps: [], car: [], bus: [], truck: [] },
    speedEvolution: results[6].status === 'fulfilled' ? results[6].value : { timestamps: [], lane_1: [], lane_2: [], lane_3: [] },
    vehicleTypeDominance: results[7].status === 'fulfilled' ? results[7].value : {}
  };
  
  return dashboardData;
};

export const fetchDataStructures = async (): Promise<DataStructures> => {
  const results = await Promise.allSettled([
    fetchApiData<number[]>('/detections/structures/array'),
    fetchApiData<any[]>('/detections/structures/stack'),
    fetchApiData<any[]>('/detections/structures/queue'),
    fetchApiData<any>('/detections/structures/tree')
  ]);
  
  return {
    arrayData: results[0].status === 'fulfilled' ? results[0].value : [],
    stackData: results[1].status === 'fulfilled' ? results[1].value : [],
    queueData: results[2].status === 'fulfilled' ? results[2].value : [],
    treeData: results[3].status === 'fulfilled' ? results[3].value : { value: null, children: [] }
  };
};

export const fetchTotalVehicleVolume = async (forceRefresh = false): Promise<TotalVolumeData> => 
  fetchApiData<TotalVolumeData>('/detections/volume/total', forceRefresh);

export const fetchVehicleVolumeByLane = async (forceRefresh = false): Promise<LaneVehicleData> => 
  fetchApiData<LaneVehicleData>('/detections/volume/by-lane', forceRefresh);

export const fetchHourlyPatterns = async (forceRefresh = false): Promise<HourlyPatternsData> => 
  fetchApiData<HourlyPatternsData>('/detections/patterns/hourly', forceRefresh);

export const fetchAvgSpeedByLane = async (forceRefresh = false): Promise<SpeedByLaneData> => 
  fetchApiData<SpeedByLaneData>('/detections/lanes/speed', forceRefresh);

export const cache = {
  clear: () => clientCache.clear()
};