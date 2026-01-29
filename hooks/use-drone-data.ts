'use client';

import { useEffect, useRef } from 'react';
import { useDroneStore } from '@/lib/stores/drone-store';
import { getMockDroneService } from '@/lib/services/mock-drone-service';

export function useDroneData() {
  const { setDrones, setConnected } = useDroneStore();
  const serviceRef = useRef(getMockDroneService());

  useEffect(() => {
    const service = serviceRef.current;

    service.connect().then(() => setConnected(true));

    const unsubscribe = service.subscribe((drones) => {
      setDrones(drones);
    });

    return () => {
      unsubscribe();
      service.disconnect();
      setConnected(false);
    };
  }, [setDrones, setConnected]);
}
