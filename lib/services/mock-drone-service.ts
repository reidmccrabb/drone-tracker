import { DroneData, DroneStatus, UAType } from '@/types/drone';
import { DroneDataService } from './drone-data-service';
import { calculateDestination, addNoise } from '@/lib/utils/geo-utils';

type MovementPattern = 'circular' | 'linear' | 'hover' | 'search';

interface MockDroneConfig {
  id: string;
  uasId: string;
  uaType: UAType;
  lat: number;
  lng: number;
  altitude: number;
  speed: number;
  pattern: MovementPattern;
  patternRadius?: number;
  direction?: number;
  operatorLat: number;
  operatorLng: number;
  description: string;
}

// Austin, Texas area drones
const CONFIGS: MockDroneConfig[] = [
  {
    id: 'drone-001', uasId: 'DJI-ATX001', uaType: 'helicopter_or_multirotor',
    lat: 30.2672, lng: -97.7431, altitude: 120, speed: 12,
    pattern: 'circular', patternRadius: 400,
    operatorLat: 30.2660, operatorLng: -97.7420,
    description: 'Survey - Downtown Austin',
  },
  {
    id: 'drone-002', uasId: 'DJI-ATX002', uaType: 'helicopter_or_multirotor',
    lat: 30.2849, lng: -97.7341, altitude: 90, speed: 8,
    pattern: 'circular', patternRadius: 300,
    operatorLat: 30.2840, operatorLng: -97.7350,
    description: 'Inspection - UT Campus',
  },
  {
    id: 'drone-003', uasId: 'SKYDIO-003', uaType: 'helicopter_or_multirotor',
    lat: 30.2631, lng: -97.7510, altitude: 60, speed: 5,
    pattern: 'hover',
    operatorLat: 30.2620, operatorLng: -97.7500,
    description: 'Photography - Zilker Park',
  },
  {
    id: 'drone-004', uasId: 'AUTEL-004', uaType: 'helicopter_or_multirotor',
    lat: 30.2590, lng: -97.7460, altitude: 150, speed: 15,
    pattern: 'linear', direction: 45,
    operatorLat: 30.2580, operatorLng: -97.7450,
    description: 'Delivery - Lady Bird Lake',
  },
  {
    id: 'drone-005', uasId: 'DJI-ATX005', uaType: 'helicopter_or_multirotor',
    lat: 30.2500, lng: -97.7500, altitude: 100, speed: 10,
    pattern: 'search', patternRadius: 500,
    operatorLat: 30.2490, operatorLng: -97.7490,
    description: 'Search pattern - South Austin',
  },
  {
    id: 'drone-006', uasId: 'PARROT-006', uaType: 'helicopter_or_multirotor',
    lat: 30.2750, lng: -97.7400, altitude: 80, speed: 6,
    pattern: 'hover',
    operatorLat: 30.2745, operatorLng: -97.7395,
    description: 'Monitoring - Capitol area',
  },
  {
    id: 'drone-007', uasId: 'WING-007', uaType: 'aeroplane',
    lat: 30.2300, lng: -97.7600, altitude: 200, speed: 20,
    pattern: 'linear', direction: 180,
    operatorLat: 30.2310, operatorLng: -97.7590,
    description: 'Fixed-wing survey - South',
  },
  {
    id: 'drone-008', uasId: 'DJI-ATX008', uaType: 'helicopter_or_multirotor',
    lat: 30.2950, lng: -97.7200, altitude: 110, speed: 14,
    pattern: 'circular', patternRadius: 350,
    operatorLat: 30.2940, operatorLng: -97.7210,
    description: 'Mapping - East Austin',
  },
];

export class MockDroneService implements DroneDataService {
  private drones = new Map<string, DroneData>();
  private subscribers = new Set<(drones: DroneData[]) => void>();
  private interval: ReturnType<typeof setInterval> | null = null;
  private connected = false;
  private startTime = Date.now();

  async connect(): Promise<void> {
    if (this.connected) return;
    this.initDrones();
    this.interval = setInterval(() => {
      this.updateAll();
      this.notify();
    }, 1000);
    this.connected = true;
  }

  disconnect(): void {
    if (this.interval) clearInterval(this.interval);
    this.interval = null;
    this.connected = false;
  }

  isConnected(): boolean { return this.connected; }

  subscribe(callback: (drones: DroneData[]) => void): () => void {
    this.subscribers.add(callback);
    callback(this.getAllDrones());
    return () => { this.subscribers.delete(callback); };
  }

  getAllDrones(): DroneData[] {
    return Array.from(this.drones.values());
  }

  private initDrones(): void {
    const now = Date.now();
    for (const c of CONFIGS) {
      this.drones.set(c.id, {
        id: c.id,
        identification: { uasId: c.uasId, uaType: c.uaType },
        location: {
          latitude: c.lat, longitude: c.lng,
          altitudeBaro: c.altitude, altitudeGeo: c.altitude,
          height: c.altitude, heightType: 'ground',
          direction: c.direction ?? 0,
          speedHorizontal: c.speed, speedVertical: 0,
          timestamp: now,
        },
        status: 'airborne',
        operator: {
          operatorId: `OP-${c.id}`,
          operatorLatitude: c.operatorLat,
          operatorLongitude: c.operatorLng,
          areaRadius: 1000,
          areaCeiling: 400, areaFloor: 0,
        },
        selfIdDescription: c.description,
        flightPath: [{ latitude: c.lat, longitude: c.lng, altitude: c.altitude, timestamp: now, speed: c.speed }],
        lastSeen: now,
        signalStrength: -55 + Math.random() * 15,
      });
    }
  }

  private updateAll(): void {
    const now = Date.now();
    const elapsed = (now - this.startTime) / 1000;

    for (const config of CONFIGS) {
      const drone = this.drones.get(config.id);
      if (!drone) continue;

      let lat = drone.location.latitude;
      let lng = drone.location.longitude;
      let heading = drone.location.direction;
      let speed = config.speed;
      const alt = config.altitude;

      switch (config.pattern) {
        case 'circular': {
          const r = (config.patternRadius ?? 400) / 111320;
          const angularSpeed = config.speed / (config.patternRadius ?? 400);
          const angle = angularSpeed * elapsed;
          lat = config.lat + r * Math.sin(angle);
          lng = config.lng + r * Math.cos(angle) / Math.cos(config.lat * Math.PI / 180);
          heading = ((angle * 180 / Math.PI) + 90) % 360;
          break;
        }
        case 'linear': {
          const dir = config.direction ?? 0;
          // Bounce back after 2km
          const dist = (config.speed * elapsed) % 4000;
          const effectiveDist = dist > 2000 ? 4000 - dist : dist;
          const dest = calculateDestination(config.lat, config.lng, effectiveDist, dir);
          lat = dest.latitude;
          lng = dest.longitude;
          heading = dist > 2000 ? (dir + 180) % 360 : dir;
          break;
        }
        case 'hover': {
          lat = config.lat + addNoise(0, 0.00005);
          lng = config.lng + addNoise(0, 0.00005);
          speed = Math.random() * 1.5;
          heading = Math.random() * 360;
          break;
        }
        case 'search': {
          const r = (config.patternRadius ?? 500) / 111320;
          const t = elapsed * 0.3;
          lat = config.lat + r * Math.sin(2 * t) / 2;
          lng = config.lng + r * Math.sin(t) / Math.cos(config.lat * Math.PI / 180);
          heading = (Math.atan2(Math.cos(t), Math.cos(2 * t)) * 180 / Math.PI + 360) % 360;
          break;
        }
      }

      drone.location = {
        ...drone.location,
        latitude: lat, longitude: lng,
        altitudeBaro: addNoise(alt, 0.5),
        altitudeGeo: addNoise(alt, 0.5),
        height: addNoise(alt, 0.5),
        direction: heading,
        speedHorizontal: addNoise(speed, 0.3),
        speedVertical: addNoise(0, 0.1),
        timestamp: now,
      };

      drone.flightPath.push({
        latitude: lat, longitude: lng,
        altitude: alt, timestamp: now, speed,
      });
      if (drone.flightPath.length > 120) {
        drone.flightPath = drone.flightPath.slice(-120);
      }

      drone.lastSeen = now;
      drone.signalStrength = -55 + Math.random() * 15;
    }
  }

  private notify(): void {
    const drones = this.getAllDrones();
    this.subscribers.forEach(cb => cb(drones));
  }
}

let instance: MockDroneService | null = null;
export function getMockDroneService(): MockDroneService {
  if (!instance) instance = new MockDroneService();
  return instance;
}
