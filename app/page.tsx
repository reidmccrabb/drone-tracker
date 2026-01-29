'use client';

import { Globe } from '@/components/map/Globe';
import { DroneDetailPanel } from '@/components/panels/DroneDetailPanel';
import { FilterPanel } from '@/components/panels/FilterPanel';
import { StatusOverlay } from '@/components/panels/StatusOverlay';
import { useDroneData } from '@/hooks/use-drone-data';
import { useUserLocation } from '@/hooks/use-user-location';
import { useDroneStore } from '@/lib/stores/drone-store';

export default function Home() {
  useDroneData();
  useUserLocation();

  const selectedDroneId = useDroneStore((s) => s.selectedDroneId);

  return (
    <main className="relative w-screen h-screen">
      {/* Globe fills the screen */}
      <Globe />

      {/* Status bar - top left */}
      <div className="absolute top-4 left-4 z-10">
        <StatusOverlay />
      </div>

      {/* Filter panel - bottom left */}
      <div className="absolute bottom-4 left-4 z-10">
        <FilterPanel />
      </div>

      {/* Drone detail panel - right side */}
      {selectedDroneId && (
        <div className="absolute top-4 right-16 z-10">
          <DroneDetailPanel />
        </div>
      )}

      {/* Title */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
        <h1 className="text-cyan-400 font-mono text-xl font-bold tracking-wider opacity-80">
          DRONE TRACKER
        </h1>
      </div>
    </main>
  );
}
