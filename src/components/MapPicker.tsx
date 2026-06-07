import { useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface MapPickerProps {
  lat: number | null;
  lng: number | null;
  onChange: (lat: number | null, lng: number | null) => void;
}

// Paris par défaut
const DEFAULT_CENTER: [number, number] = [48.8566, 2.3522];

const ClickLayer = ({ onClick }: { onClick: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const MapPicker = ({ lat, lng, onChange }: MapPickerProps) => {
  const hasPin = lat !== null && lng !== null;
  const center: [number, number] = hasPin ? [lat!, lng!] : DEFAULT_CENTER;

  const handleClick = useCallback(
    (newLat: number, newLng: number) => onChange(newLat, newLng),
    [onChange]
  );

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground flex items-center gap-1">
        <MapPin size={12} /> Cliquez sur la carte pour placer le pin de la destination.
      </p>
      <div className="rounded-lg overflow-hidden h-56 w-full border border-border z-0">
        <MapContainer center={center} zoom={hasPin ? 8 : 5} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickLayer onClick={handleClick} />
          {hasPin && <Marker position={[lat!, lng!]} />}
        </MapContainer>
      </div>
      {hasPin && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground flex-1">
            {lat!.toFixed(5)}, {lng!.toFixed(5)}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-xs h-7 text-destructive hover:text-destructive"
            onClick={() => onChange(null, null)}
          >
            Retirer le pin
          </Button>
        </div>
      )}
    </div>
  );
};

export default MapPicker;
