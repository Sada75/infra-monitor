"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {LatLngExpression} from "leaflet";

interface Proof {
  latitude: number;
  longitude: number;
  imageUrl: string;
}

export default function MapView({ proofs }: { proofs: Proof[] }) {
  if (proofs.length === 0) return null;

  const center: LatLngExpression = [
    proofs[0].latitude,
    proofs[0].longitude,
  ];

  return (
    <MapContainer
      center={center}
      zoom={13}
      className="h-96 w-full rounded-lg"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {proofs.map((p, i) => (
        <Marker key={i} position={[p.latitude, p.longitude]}>
          <Popup>
            <img src={p.imageUrl} className="w-32" />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}