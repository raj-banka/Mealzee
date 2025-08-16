'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

interface MapComponentProps {
  center: [number, number];
  selectedPosition: [number, number] | null;
  onMapClick: (lat: number, lng: number) => void;
  onMapReady: () => void;
}

// Map click handler component
const MapClickHandler: React.FC<{ onMapClick: (lat: number, lng: number) => void }> = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      console.log('Map clicked at:', e.latlng.lat, e.latlng.lng);
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

// Map center updater component
const MapCenterUpdater: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMapEvents({});

  React.useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);

  return null;
};

const MapComponent: React.FC<MapComponentProps> = ({
  center,
  selectedPosition,
  onMapClick,
  onMapReady
}) => {
  // Fix Leaflet default markers on client side only
  useEffect(() => {
    const fixLeafletIcons = async () => {
      const L = await import('leaflet');
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
    };

    fixLeafletIcons();
  }, []);

  return (
    <MapContainer
      center={center}
      zoom={17}
      style={{ height: '100%', width: '100%' }}
      className="z-0 rounded-lg"
      whenReady={onMapReady}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapClickHandler onMapClick={onMapClick} />
      <MapCenterUpdater center={center} />
      {selectedPosition && (
        <Marker position={selectedPosition} />
      )}
    </MapContainer>
  );
};

export default MapComponent;
