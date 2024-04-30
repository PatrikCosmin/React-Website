import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const Map = () => {
  // Random location (for demonstration purposes)
  const latitude = 51.5074; // London
  const longitude = -0.1278; // London

  // Create a custom marker icon from Leaflet's default icon set
  const customIcon = L.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41], // Default icon size
    iconAnchor: [12, 41], // Position the anchor point of the icon
    popupAnchor: [0, -41] // Position the popup relative to the icon
  });

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <MapContainer center={[latitude, longitude]} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]} icon={customIcon}>
          <Popup>
            A popup for your restaurant!
            <br />
            <a href={`http://maps.google.com/maps?q=${latitude},${longitude}`} target="_blank" rel="noopener noreferrer">Open in Google Maps</a>
            <br />
            <a href={`http://maps.apple.com/maps?daddr=${latitude},${longitude}`} target="_blank" rel="noopener noreferrer">Open in Apple Maps</a>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Map;
