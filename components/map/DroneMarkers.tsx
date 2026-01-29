'use client';

import { useMemo } from 'react';
import { Source, Layer } from 'react-map-gl/mapbox';
import { useDroneStore } from '@/lib/stores/drone-store';
import { CLUSTER_CONFIG } from '@/lib/constants/map-config';

export const INTERACTIVE_LAYER_IDS = ['cluster-circles', 'drone-points'];

export function DroneMarkers() {
  const filteredDrones = useDroneStore((s) => s.filteredDrones);

  const geojson = useMemo(() => ({
    type: 'FeatureCollection' as const,
    features: filteredDrones.map((d) => ({
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [d.location.longitude, d.location.latitude],
      },
      properties: {
        id: d.id,
        uasId: d.identification.uasId,
        altitude: d.location.altitudeBaro,
        speed: d.location.speedHorizontal,
        heading: d.location.direction,
        status: d.status,
      },
    })),
  }), [filteredDrones]);

  return (
    <Source id="drones" type="geojson" data={geojson} {...CLUSTER_CONFIG}>
      <Layer
        id="cluster-circles"
        type="circle"
        filter={['has', 'point_count']}
        paint={{
          'circle-color': ['step', ['get', 'point_count'], '#00ff88', 5, '#00ccff', 15, '#ffaa00'],
          'circle-radius': ['step', ['get', 'point_count'], 18, 5, 25, 15, 35],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 0.85,
        }}
      />
      <Layer
        id="cluster-count"
        type="symbol"
        filter={['has', 'point_count']}
        layout={{
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 13,
        }}
        paint={{ 'text-color': '#ffffff' }}
      />
      <Layer
        id="drone-points"
        type="circle"
        filter={['!', ['has', 'point_count']]}
        paint={{
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 2, 5, 10, 8, 16, 12],
          'circle-color': [
            'match', ['get', 'status'],
            'airborne', '#00ff88',
            'ground', '#888888',
            'emergency', '#ff4444',
            'remote_id_system_failure', '#ffaa00',
            '#00ff88',
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': 'rgba(255,255,255,0.8)',
          'circle-opacity': 0.9,
        }}
      />
      <Layer
        id="drone-labels"
        type="symbol"
        filter={['all', ['!', ['has', 'point_count']], ['>=', ['zoom'], 12]]}
        layout={{
          'text-field': ['concat', ['to-string', ['round', ['get', 'altitude']]], 'm'],
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 11,
          'text-offset': [0, 1.5],
        }}
        paint={{
          'text-color': '#00ffcc',
          'text-halo-color': 'rgba(0,0,0,0.8)',
          'text-halo-width': 1,
        }}
      />
    </Source>
  );
}
