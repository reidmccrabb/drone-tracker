export type UAType =
  | 'helicopter_or_multirotor'
  | 'aeroplane'
  | 'gyroplane'
  | 'glider'
  | 'kite'
  | 'other';

export type DroneStatus =
  | 'undeclared'
  | 'ground'
  | 'airborne'
  | 'emergency'
  | 'remote_id_system_failure';

export interface DroneLocation {
  latitude: number;
  longitude: number;
  altitudeBaro: number;
  altitudeGeo: number;
  height: number;
  heightType: 'takeoff' | 'ground';
  direction: number; // 0-360 degrees
  speedHorizontal: number; // m/s
  speedVertical: number; // m/s
  timestamp: number;
}

export interface OperatorInfo {
  operatorId: string;
  operatorLatitude: number | null;
  operatorLongitude: number | null;
  areaRadius: number; // meters
  areaCeiling: number | null;
  areaFloor: number | null;
}

export interface DroneIdentification {
  uasId: string;
  uaType: UAType;
}

export interface FlightPathPoint {
  latitude: number;
  longitude: number;
  altitude: number;
  timestamp: number;
  speed: number;
}

export interface DroneData {
  id: string;
  identification: DroneIdentification;
  location: DroneLocation;
  status: DroneStatus;
  operator: OperatorInfo;
  selfIdDescription: string | null;
  flightPath: FlightPathPoint[];
  lastSeen: number;
  signalStrength: number | null;
}

export interface DroneFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: {
    id: string;
    uasId: string;
    altitude: number;
    speed: number;
    heading: number;
    status: DroneStatus;
    uaType: UAType;
  };
}
