'use client';

import { useDroneStore } from '@/lib/stores/drone-store';
import { X, MapPin, Compass, User, Radio, Clock } from 'lucide-react';
import { DroneModelViewer } from './DroneModel';

export function DroneDetailPanel() {
  const selectedDroneId = useDroneStore((s) => s.selectedDroneId);
  const drones = useDroneStore((s) => s.drones);
  const selectDrone = useDroneStore((s) => s.selectDrone);

  const drone = drones.find((d) => d.id === selectedDroneId);
  if (!drone) return null;

  const { identification, location, operator, status, selfIdDescription, lastSeen, signalStrength } = drone;

  const statusColor: Record<string, string> = {
    airborne: 'bg-green-500',
    ground: 'bg-gray-500',
    emergency: 'bg-red-500',
    remote_id_system_failure: 'bg-yellow-500',
    undeclared: 'bg-gray-400',
  };

  const secondsAgo = Math.round((Date.now() - lastSeen) / 1000);

  return (
    <div className="w-80 bg-slate-900/95 border border-cyan-500/30 rounded-lg backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <span className="text-cyan-400 font-mono font-bold text-lg">{identification.uasId}</span>
          <button
            onClick={() => selectDrone(null)}
            className="text-gray-400 hover:text-white p-1 rounded hover:bg-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex gap-2 mt-2">
          <span className={`${statusColor[status] ?? 'bg-gray-500'} text-white text-xs px-2 py-0.5 rounded-full font-semibold`}>
            {status.toUpperCase().replace(/_/g, ' ')}
          </span>
          <span className="border border-cyan-500/40 text-cyan-400 text-xs px-2 py-0.5 rounded-full">
            {identification.uaType.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      {/* 3D Model Viewer */}
      <div className="px-4 pt-3">
        <DroneModelViewer
          uaType={identification.uaType}
          uasId={identification.uasId}
        />
      </div>

      <div className="p-4 space-y-4 text-sm">
        {/* Location */}
        <section>
          <h4 className="text-cyan-400 font-semibold flex items-center gap-1.5 mb-2">
            <MapPin className="h-3.5 w-3.5" /> Location
          </h4>
          <div className="grid grid-cols-2 gap-1.5 text-gray-300 font-mono text-xs">
            <div><span className="text-gray-500">Lat:</span> {location.latitude.toFixed(6)}</div>
            <div><span className="text-gray-500">Lng:</span> {location.longitude.toFixed(6)}</div>
            <div><span className="text-gray-500">Alt:</span> {location.altitudeBaro.toFixed(1)}m</div>
            <div><span className="text-gray-500">Hgt:</span> {location.height.toFixed(1)}m</div>
          </div>
        </section>

        {/* Movement */}
        <section>
          <h4 className="text-cyan-400 font-semibold flex items-center gap-1.5 mb-2">
            <Compass className="h-3.5 w-3.5" /> Movement
          </h4>
          <div className="grid grid-cols-2 gap-1.5 text-gray-300 font-mono text-xs">
            <div><span className="text-gray-500">Speed:</span> {location.speedHorizontal.toFixed(1)} m/s</div>
            <div><span className="text-gray-500">Hdg:</span> {location.direction.toFixed(0)}°</div>
            <div><span className="text-gray-500">V-Spd:</span> {location.speedVertical.toFixed(1)} m/s</div>
          </div>
        </section>

        {/* Operator */}
        <section>
          <h4 className="text-cyan-400 font-semibold flex items-center gap-1.5 mb-2">
            <User className="h-3.5 w-3.5" /> Operator
          </h4>
          <div className="text-gray-300 text-xs space-y-1 font-mono">
            <div><span className="text-gray-500">ID:</span> {operator.operatorId}</div>
            {operator.operatorLatitude != null && (
              <div><span className="text-gray-500">Loc:</span> {operator.operatorLatitude.toFixed(4)}, {operator.operatorLongitude?.toFixed(4)}</div>
            )}
            <div><span className="text-gray-500">Area:</span> {operator.areaRadius}m radius</div>
          </div>
        </section>

        {/* Description */}
        {selfIdDescription && (
          <section>
            <div className="text-gray-400 text-xs italic">&ldquo;{selfIdDescription}&rdquo;</div>
          </section>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-slate-700">
          <div className="flex items-center gap-1">
            <Radio className="h-3 w-3" />
            {signalStrength ? `${signalStrength.toFixed(0)} dBm` : 'N/A'}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {secondsAgo}s ago
          </div>
        </div>
      </div>
    </div>
  );
}
