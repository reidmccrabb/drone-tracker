'use client';

import { useRef, useCallback, useState } from 'react';
import Map, {
  NavigationControl,
  GeolocateControl,
  MapRef,
} from 'react-map-gl/mapbox';
import type { MapLayerMouseEvent } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import { DroneMarkers, INTERACTIVE_LAYER_IDS } from './DroneMarkers';
import { FlightPathLayer } from './FlightPathLayer';
import { DronePopup } from './DronePopup';
import { UserLocationMarker } from './UserLocationMarker';
import { useDroneStore } from '@/lib/stores/drone-store';
import { MAPBOX_CONFIG } from '@/lib/constants/map-config';

export function Globe() {
  const mapRef = useRef<MapRef>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const selectedDroneId = useDroneStore((s) => s.selectedDroneId);
  const selectDrone = useDroneStore((s) => s.selectDrone);
  const setHoveredDrone = useDroneStore((s) => s.setHoveredDrone);
  const setMapZoom = useDroneStore((s) => s.setMapZoom);

  const handleLoad = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    map.setFog(MAPBOX_CONFIG.fog as any);
    setMapLoaded(true);
  }, []);

  const handleClick = useCallback((e: MapLayerMouseEvent) => {
    const feature = e.features?.[0];
    if (!feature) {
      selectDrone(null);
      return;
    }

    if (feature.properties?.cluster_id) {
      const map = mapRef.current?.getMap();
      const source = map?.getSource('drones') as any;
      source?.getClusterExpansionZoom(feature.properties.cluster_id, (err: any, zoom: number) => {
        if (err || !zoom) return;
        map?.easeTo({
          center: (feature.geometry as any).coordinates,
          zoom,
        });
      });
    } else {
      selectDrone(feature.properties?.id ?? null);
    }
  }, [selectDrone]);

  const handleMouseEnter = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (map) map.getCanvas().style.cursor = 'pointer';
  }, []);

  const handleMouseLeave = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (map) map.getCanvas().style.cursor = '';
    setHoveredDrone(null);
  }, [setHoveredDrone]);

  return (
    <div className="w-full h-full">
      <Map
        ref={mapRef}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={MAPBOX_CONFIG.initialViewState}
        mapStyle={MAPBOX_CONFIG.mapStyle}
        projection={{ name: 'globe' }}
        onLoad={handleLoad}
        onZoomEnd={(e) => setMapZoom(e.viewState.zoom)}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        interactiveLayerIds={mapLoaded ? INTERACTIVE_LAYER_IDS : []}
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
      >
        <NavigationControl position="top-right" />
        <GeolocateControl position="top-right" trackUserLocation showUserHeading />

        {mapLoaded && <DroneMarkers />}
        {mapLoaded && selectedDroneId && <FlightPathLayer droneId={selectedDroneId} />}
        {mapLoaded && <DronePopup />}
        {mapLoaded && <UserLocationMarker />}
      </Map>
    </div>
  );
}
