export const MAPBOX_CONFIG = {
  mapStyle: 'mapbox://styles/mapbox/dark-v11',
  initialViewState: {
    longitude: -97.74,
    latitude: 30.27,
    zoom: 11,
    pitch: 0,
    bearing: 0,
  },
  fog: {
    color: 'rgb(10, 10, 30)',
    'high-color': 'rgb(20, 20, 50)',
    'space-color': 'rgb(5, 5, 15)',
    'horizon-blend': 0.1,
    'star-intensity': 0.8,
  },
};

export const CLUSTER_CONFIG = {
  cluster: true,
  clusterMaxZoom: 14,
  clusterRadius: 50,
};
