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
  <div
    className="relative rounded-2xl overflow-hidden"
    style={{
      padding: "3px",
      background: "linear-gradient(135deg, rgba(139,92,246,0.5), rgba(255,255,255,0.08), rgba(139,92,246,0.3))",
      boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)",
    }}
  >
    {/* Inner glass frame */}
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: "rgba(15,12,41,0.6)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{
          background: "rgba(255,255,255,0.04)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{
              background: "rgba(139,92,246,0.25)",
              border: "1px solid rgba(139,92,246,0.35)",
            }}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="rgba(196,181,253,0.9)">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
          </div>
          <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>
            Live Map
          </span>
          {/* Pulse dot */}
          <div className="flex items-center gap-1.5">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: "#4ade80",
                boxShadow: "0 0 6px rgba(74,222,128,0.8)",
                animation: "pulse 2s infinite",
              }}
            />
            <span className="text-xs" style={{ color: "rgba(74,222,128,0.8)" }}>
              {proofs.length} marker{proofs.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Coordinate pill */}
        <div
          className="text-xs px-3 py-1 rounded-full font-mono"
          style={{
            background: "rgba(139,92,246,0.15)",
            border: "1px solid rgba(139,92,246,0.25)",
            color: "rgba(196,181,253,0.7)",
          }}
        >
          {center[0].toFixed(4)}, {center[1].toFixed(4)}
        </div>
      </div>

      {/* Map */}
      <MapContainer
        center={center}
        zoom={13}
        className="h-96 w-full"
        style={{ background: "#1a1035" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {proofs.map((p, i) => (
          <Marker key={i} position={[p.latitude, p.longitude]}>
            <Popup>
              <div
                style={{
                  background: "rgba(20,15,50,0.95)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(139,92,246,0.35)",
                  borderRadius: "12px",
                  padding: "10px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                  minWidth: "140px",
                }}
              >
                <img
                  src={p.imageUrl}
                  style={{
                    width: "128px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    border: "1px solid rgba(139,92,246,0.3)",
                    display: "block",
                  }}
                />
                <div
                  style={{
                    marginTop: "8px",
                    fontSize: "11px",
                    fontFamily: "monospace",
                    color: "rgba(196,181,253,0.8)",
                    textAlign: "center",
                  }}
                >
                  {p.latitude.toFixed(4)}, {p.longitude.toFixed(4)}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Bottom bar */}
      <div
        className="flex items-center gap-4 px-5 py-2.5"
        style={{
          background: "rgba(255,255,255,0.03)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center gap-1.5">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="rgba(139,92,246,0.6)">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
            Proof locations plotted
          </span>
        </div>
        <div
          className="ml-auto text-xs px-2 py-0.5 rounded-full"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.3)",
          }}
        >
          zoom {13}
        </div>
      </div>
    </div>

    {/* Pulse keyframe */}
    <style>{`
      @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.5; transform: scale(0.85); }
      }
    `}</style>
  </div>
);
}