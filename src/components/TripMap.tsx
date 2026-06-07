import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface TripMapProps {
  lat?: number | null;
  lng?: number | null;
  destination: string;
}

const TripMap = ({ lat, lng, destination }: TripMapProps) => {
  const [coords, setCoords] = useState<[number, number] | null>(
    lat && lng ? [lat, lng] : null
  );

  useEffect(() => {
    if (lat && lng) {
      setCoords([lat, lng]);
      return;
    }
    if (!destination) return;

    fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(destination)}&format=json&limit=1`,
      { headers: { "Accept-Language": "fr" } }
    )
      .then((r) => r.json())
      .then((results) => {
        if (results[0]) {
          setCoords([parseFloat(results[0].lat), parseFloat(results[0].lon)]);
        }
      })
      .catch(() => {});
  }, [lat, lng, destination]);

  if (!coords) return null;

  return (
    <div className="w-full h-full" style={{ zIndex: 0 }}>
      <MapContainer center={coords} zoom={10} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={coords}>
          <Popup>{destination}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default TripMap;
