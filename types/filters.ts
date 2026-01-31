import { FlightPurpose } from './drone';

export interface DroneFilters {
  altitudeRange: [number, number];
  distanceRange: [number, number];
  searchQuery: string;
  flightPurposeFilter: FlightPurpose[];
  faaVerifiedOnly: boolean;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}
