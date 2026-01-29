export interface DroneFilters {
  altitudeRange: [number, number];
  distanceRange: [number, number];
  searchQuery: string;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}
