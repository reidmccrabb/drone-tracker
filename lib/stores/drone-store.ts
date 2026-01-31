import { create } from 'zustand';
import { DroneData, FlightPurpose } from '@/types/drone';
import { DroneFilters, UserLocation } from '@/types/filters';
import { calculateDistance } from '@/lib/utils/geo-utils';

interface DroneState {
  drones: DroneData[];
  filteredDrones: DroneData[];
  selectedDroneId: string | null;
  hoveredDroneId: string | null;
  filters: DroneFilters;
  userLocation: UserLocation | null;
  isConnected: boolean;
  mapZoom: number;
}

interface DroneActions {
  setDrones: (drones: DroneData[]) => void;
  selectDrone: (id: string | null) => void;
  setHoveredDrone: (id: string | null) => void;
  setAltitudeRange: (range: [number, number]) => void;
  setDistanceRange: (range: [number, number]) => void;
  setSearchQuery: (query: string) => void;
  setFlightPurposeFilter: (purposes: FlightPurpose[]) => void;
  setFaaVerifiedOnly: (verified: boolean) => void;
  clearFilters: () => void;
  setUserLocation: (location: UserLocation | null) => void;
  setConnected: (connected: boolean) => void;
  setMapZoom: (zoom: number) => void;
}

const initialFilters: DroneFilters = {
  altitudeRange: [0, 500],
  distanceRange: [0, 50000],
  searchQuery: '',
  flightPurposeFilter: [],
  faaVerifiedOnly: false,
};

function applyFilters(drones: DroneData[], filters: DroneFilters, userLocation: UserLocation | null): DroneData[] {
  let result = drones;

  const [minAlt, maxAlt] = filters.altitudeRange;
  result = result.filter(d => d.location.altitudeBaro >= minAlt && d.location.altitudeBaro <= maxAlt);

  if (userLocation && filters.distanceRange) {
    const [minDist, maxDist] = filters.distanceRange;
    result = result.filter(d => {
      const dist = calculateDistance(
        userLocation.latitude, userLocation.longitude,
        d.location.latitude, d.location.longitude
      );
      return dist >= minDist && dist <= maxDist;
    });
  }

  if (filters.flightPurposeFilter.length > 0) {
    result = result.filter(d => filters.flightPurposeFilter.includes(d.operator.flightPurpose));
  }

  if (filters.faaVerifiedOnly) {
    result = result.filter(d => d.operator.faaVerified);
  }

  if (filters.searchQuery.trim()) {
    const q = filters.searchQuery.toLowerCase();
    result = result.filter(d =>
      d.identification.uasId.toLowerCase().includes(q) ||
      d.operator.operatorId.toLowerCase().includes(q) ||
      d.operator.pilotName.toLowerCase().includes(q) ||
      d.operator.organization?.toLowerCase().includes(q) ||
      d.operator.licenseNumber?.toLowerCase().includes(q) ||
      d.operator.droneRegistration.toLowerCase().includes(q) ||
      d.selfIdDescription?.toLowerCase().includes(q)
    );
  }

  return result;
}

export const useDroneStore = create<DroneState & DroneActions>()((set, get) => ({
  drones: [],
  filteredDrones: [],
  selectedDroneId: null,
  hoveredDroneId: null,
  filters: initialFilters,
  userLocation: null,
  isConnected: false,
  mapZoom: 2,

  setDrones: (drones) => {
    const { filters, userLocation } = get();
    set({ drones, filteredDrones: applyFilters(drones, filters, userLocation) });
  },

  selectDrone: (id) => set({ selectedDroneId: id }),
  setHoveredDrone: (id) => set({ hoveredDroneId: id }),

  setAltitudeRange: (range) => {
    const state = get();
    const filters = { ...state.filters, altitudeRange: range };
    set({ filters, filteredDrones: applyFilters(state.drones, filters, state.userLocation) });
  },

  setDistanceRange: (range) => {
    const state = get();
    const filters = { ...state.filters, distanceRange: range };
    set({ filters, filteredDrones: applyFilters(state.drones, filters, state.userLocation) });
  },

  setSearchQuery: (query) => {
    const state = get();
    const filters = { ...state.filters, searchQuery: query };
    set({ filters, filteredDrones: applyFilters(state.drones, filters, state.userLocation) });
  },

  setFlightPurposeFilter: (purposes) => {
    const state = get();
    const filters = { ...state.filters, flightPurposeFilter: purposes };
    set({ filters, filteredDrones: applyFilters(state.drones, filters, state.userLocation) });
  },

  setFaaVerifiedOnly: (verified) => {
    const state = get();
    const filters = { ...state.filters, faaVerifiedOnly: verified };
    set({ filters, filteredDrones: applyFilters(state.drones, filters, state.userLocation) });
  },

  clearFilters: () => {
    const state = get();
    set({ filters: initialFilters, filteredDrones: applyFilters(state.drones, initialFilters, state.userLocation) });
  },

  setUserLocation: (location) => {
    const state = get();
    set({ userLocation: location, filteredDrones: applyFilters(state.drones, state.filters, location) });
  },

  setConnected: (connected) => set({ isConnected: connected }),
  setMapZoom: (zoom) => set({ mapZoom: zoom }),
}));
