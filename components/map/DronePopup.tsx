'use client';

import { useMemo } from 'react';
import { Popup } from 'react-map-gl/mapbox';
import { useDroneStore } from '@/lib/stores/drone-store';

export function DronePopup() {
  const hoveredDroneId = useDroneStore((s) => s.hoveredDroneId);
  const selectedDroneId = useDroneStore((s) => s.selectedDroneId);
  const drones = useDroneStore((s) => s.drones);

  const drone = useMemo(() => {
    const id = hoveredDroneId || selectedDroneId;
    if (!id) return null;
    return drones.find((d) => d.id === id) ?? null;
  }, [hoveredDroneId, selectedDroneId, drones]);

  if (!drone) return null;

  // Don't show popup if detail panel is open for this drone
  if (selectedDroneId === drone.id && !hoveredDroneId) return null;

  return (
    <Popup
      longitude={drone.location.longitude}
      latitude={drone.location.latitude}
      anchor="bottom"
      closeButton={false}
      className="drone-popup"
    >
      <div className="bg-slate-900 text-white p-2 rounded text-xs font-mono min-w-[140px]">
        <div className="text-cyan-400 font-bold">{drone.identification.uasId}</div>
        <div className="text-gray-300 mt-1">
          Alt: {drone.location.altitudeBaro.toFixed(0)}m |
          Spd: {drone.location.speedHorizontal.toFixed(1)}m/s
        </div>
        <div className="text-gray-400">
          Hdg: {drone.location.direction.toFixed(0)}°
        </div>
      </div>
    </Popup>
  );
}
