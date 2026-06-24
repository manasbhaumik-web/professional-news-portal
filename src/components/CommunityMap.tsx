import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Camera, AlertTriangle, Users, Info } from 'lucide-react';
import { renderToString } from 'react-dom/server';

// Fix Leaflet's default icon path issues
delete (L.Icon.Default.prototype as any)._getIconUrl;

const createCustomIcon = (iconStr: string, color: string) => {
  return L.divIcon({
    html: `<div style="background-color: ${color}; color: white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.3); border: 2px solid white;">${iconStr}</div>`,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

const icons = {
  traffic: createCustomIcon(renderToString(<AlertTriangle size={18} />), '#ef4444'),
  event: createCustomIcon(renderToString(<Users size={18} />), '#3b82f6'),
  hazard: createCustomIcon(renderToString(<Info size={18} />), '#f59e0b'),
  incident: createCustomIcon(renderToString(<Camera size={18} />), '#8b5cf6')
};

function RecenterAutomatically({lat, lon}: {lat: number, lon: number}) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon]);
  }, [lat, lon, map]);
  return null;
}

interface CommunityMapProps {
  lat: number;
  lon: number;
}

export default function CommunityMap({ lat, lon }: CommunityMapProps) {
  const mockReports = [
    { id: 1, type: 'traffic', title: 'Major Traffic Delay', desc: 'Accident reported causing 20 min delays.', lat: lat + 0.005, lon: lon - 0.005 },
    { id: 2, type: 'event', title: 'Community Farmers Market', desc: 'Local vendors and music until 2 PM.', lat: lat - 0.003, lon: lon + 0.004 },
    { id: 3, type: 'hazard', title: 'Pothole Hazard', desc: 'Large pothole in the right lane.', lat: lat + 0.002, lon: lon + 0.008 },
    { id: 4, type: 'incident', title: 'Lost Dog Found', desc: 'Golden Retriever found near the park.', lat: lat - 0.006, lon: lon - 0.002 }
  ];

  return (
    <div className="w-full h-[600px] rounded-xl overflow-hidden border border-portal-border relative z-0 shadow-sm">
      <MapContainer center={[lat, lon]} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterAutomatically lat={lat} lon={lon} />
        
        <Marker position={[lat, lon]}>
          <Popup>
            <div className="font-bold">Your Location</div>
          </Popup>
        </Marker>

        {mockReports.map(report => (
          <Marker 
            key={report.id} 
            position={[report.lat, report.lon]} 
            icon={icons[report.type as keyof typeof icons] || icons.hazard}
          >
            <Popup>
              <div className="flex flex-col gap-1 min-w-[200px]">
                <strong className="text-sm border-b pb-1 mb-1">{report.title}</strong>
                <span className="text-xs text-gray-600">{report.desc}</span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
