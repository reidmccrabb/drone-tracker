'use client';

import { Source, Layer } from 'react-map-gl/mapbox';
import { useDroneStore } from '@/lib/stores/drone-store';

export function UserLocationMarker() {
  const userLocation = useDroneStore((s) => s.userLocation);

  if (!userLocation) return null;

  const geojson: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [userLocation.longitude, userLocation.latitude],
        },
        properties: { accuracy: userLocation.accuracy },
      },
    ],
  };

  return (
    <Source id="user-location" type="geojson" data={geojson}>
      {/* Accuracy circle */}
      <Layer
        id="user-accuracy"
        type="circle"
        paint={{
          'circle-radius': 30,
          'circle-color': '#3b82f6',
          'circle-opacity': 0.1,
          'circle-stroke-color': '#3b82f6',
          'circle-stroke-width': 1,
          'circle-stroke-opacity': 0.3,
        }}
      />
      {/* Outer pulse ring */}
      <Layer
        id="user-pulse"
        type="circle"
        paint={{
          'circle-radius': 14,
          'circle-color': '#3b82f6',
          'circle-opacity': 0.2,
        }}
      />
      {/* Inner dot */}
      <Layer
        id="user-dot"
        type="circle"
        paint={{
          'circle-radius': 7,
          'circle-color': '#3b82f6',
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 2.5,
        }}
      />
    </Source>
  );
}
