import { DroneData } from '@/types/drone';

export interface DroneDataService {
  connect(): Promise<void>;
  disconnect(): void;
  isConnected(): boolean;
  subscribe(callback: (drones: DroneData[]) => void): () => void;
  getAllDrones(): DroneData[];
}
