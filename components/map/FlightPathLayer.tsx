'use client';

import { useMemo } from 'react';
import { Source, Layer } from 'react-map-gl/mapbox';
import { useDroneStore } from '@/lib/stores/drone-store';

interface FlightPathLayerProps {
  droneId: string;
}

export function FlightPathLayer({ droneId }: FlightPathLayerProps) {
  const drones = useDroneStore((s) => s.drones);

  const geojson = useMemo(() => {
    const drone = drones.find((d) => d.id === droneId);
    if (!drone || drone.flightPath.length < 2) return null;

    return {
      type: 'FeatureCollection' as const,
      features: [
        {
          type: 'Feature' as const,
          geometry: {
            type: 'LineString' as const,
            coordinates: drone.flightPath.map((p) => [p.longitude, p.latitude]),
          },
          properties: {},
        },
        // Operator location marker
        ...(drone.operator.operatorLatitude != null
          ? [{
              type: 'Feature' as const,
              geometry: {
                type: 'Point' as const,
                coordinates: [drone.operator.operatorLongitude!, drone.operator.operatorLatitude!],
              },
              properties: { type: 'operator' },
            }]
          : []),
      ],
    };
  }, [drones, droneId]);

  if (!geojson) return null;

  return (
    <Source id="flight-path" type="geojson" data={geojson}>
      <Layer
        id="flight-trail"
        type="line"
        filter={['==', '$type', 'LineString']}
        paint={{
          'line-color': '#00ffff',
          'line-width': 2,
          'line-opacity': 0.7,
          'line-dasharray': [2, 2],
        }}
      />
      <Layer
        id="operator-point"
        type="circle"
        filter={['==', ['get', 'type'], 'operator']}
        paint={{
          'circle-radius': 8,
          'circle-color': '#ff8800',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        }}
      />
    </Source>
  );
}
