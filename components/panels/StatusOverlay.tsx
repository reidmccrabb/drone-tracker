'use client';

import { useDroneStore } from '@/lib/stores/drone-store';
import { Radio, Wifi, WifiOff } from 'lucide-react';

export function StatusOverlay() {
  const isConnected = useDroneStore((s) => s.isConnected);
  const droneCount = useDroneStore((s) => s.drones.length);
  const filteredCount = useDroneStore((s) => s.filteredDrones.length);

  return (
    <div className="bg-slate-900/90 border border-slate-700 rounded-lg backdrop-blur-sm px-3 py-2 flex items-center gap-3 text-xs">
      <div className={`flex items-center gap-1.5 ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
        {isConnected ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
        {isConnected ? 'Connected' : 'Disconnected'}
      </div>
      <div className="w-px h-4 bg-slate-700" />
      <div className="flex items-center gap-1.5 text-gray-300">
        <Radio className="h-3.5 w-3.5 text-cyan-400" />
        {filteredCount}/{droneCount} drones
      </div>
    </div>
  );
}
