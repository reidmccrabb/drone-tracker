'use client';

import { useDroneStore } from '@/lib/stores/drone-store';
import { Filter, Search, RotateCcw } from 'lucide-react';

export function FilterPanel() {
  const filters = useDroneStore((s) => s.filters);
  const filteredCount = useDroneStore((s) => s.filteredDrones.length);
  const totalCount = useDroneStore((s) => s.drones.length);
  const userLocation = useDroneStore((s) => s.userLocation);
  const setAltitudeRange = useDroneStore((s) => s.setAltitudeRange);
  const setDistanceRange = useDroneStore((s) => s.setDistanceRange);
  const setSearchQuery = useDroneStore((s) => s.setSearchQuery);
  const clearFilters = useDroneStore((s) => s.clearFilters);

  return (
    <div className="bg-slate-900/95 border border-cyan-500/30 rounded-lg backdrop-blur-sm p-4 w-72">
      <div className="flex items-center gap-2 mb-1">
        <Filter className="h-4 w-4 text-cyan-400" />
        <h3 className="text-cyan-400 font-semibold">Filters</h3>
      </div>
      <p className="text-xs text-gray-500 mb-4">
        {filteredCount} of {totalCount} drones
      </p>

      {/* Search */}
      <div className="mb-4">
        <label className="text-gray-300 text-xs font-medium block mb-1">Search</label>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
          <input
            type="text"
            placeholder="Drone ID or Operator..."
            value={filters.searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
      </div>

      {/* Altitude Range */}
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <label className="text-gray-300 text-xs font-medium">Altitude</label>
          <span className="text-cyan-400 text-xs font-mono">
            {filters.altitudeRange[0]}–{filters.altitudeRange[1]}m
          </span>
        </div>
        <div className="flex gap-2">
          <input
            type="range"
            min={0} max={500} step={10}
            value={filters.altitudeRange[0]}
            onChange={(e) => setAltitudeRange([+e.target.value, filters.altitudeRange[1]])}
            className="w-full accent-cyan-500"
          />
          <input
            type="range"
            min={0} max={500} step={10}
            value={filters.altitudeRange[1]}
            onChange={(e) => setAltitudeRange([filters.altitudeRange[0], +e.target.value])}
            className="w-full accent-cyan-500"
          />
        </div>
      </div>

      {/* Distance Range */}
      {userLocation ? (
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <label className="text-gray-300 text-xs font-medium">Distance</label>
            <span className="text-cyan-400 text-xs font-mono">
              {(filters.distanceRange[0] / 1000).toFixed(0)}–{(filters.distanceRange[1] / 1000).toFixed(0)}km
            </span>
          </div>
          <div className="flex gap-2">
            <input
              type="range"
              min={0} max={50000} step={1000}
              value={filters.distanceRange[0]}
              onChange={(e) => setDistanceRange([+e.target.value, filters.distanceRange[1]])}
              className="w-full accent-cyan-500"
            />
            <input
              type="range"
              min={0} max={50000} step={1000}
              value={filters.distanceRange[1]}
              onChange={(e) => setDistanceRange([filters.distanceRange[0], +e.target.value])}
              className="w-full accent-cyan-500"
            />
          </div>
        </div>
      ) : (
        <p className="text-xs text-gray-600 italic mb-4">Enable location to filter by distance</p>
      )}

      {/* Clear */}
      <button
        onClick={clearFilters}
        className="w-full flex items-center justify-center gap-2 py-1.5 border border-cyan-500/40 text-cyan-400 text-sm rounded hover:bg-cyan-500/10 transition-colors"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Clear Filters
      </button>
    </div>
  );
}
