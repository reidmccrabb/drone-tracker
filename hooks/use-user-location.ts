'use client';

import { useEffect } from 'react';
import { useDroneStore } from '@/lib/stores/drone-store';

export function useUserLocation() {
  const setUserLocation = useDroneStore((s) => s.setUserLocation);

  useEffect(() => {
    if (!navigator.geolocation) return;

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setUserLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          timestamp: pos.timestamp,
        });
      },
      () => {}, // Silently fail if denied
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(id);
  }, [setUserLocation]);
}
