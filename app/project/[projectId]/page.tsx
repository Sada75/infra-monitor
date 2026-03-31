"use client";

import { useEffect, useState,use } from "react";
import MapView from "@/components/MapView";
import VerifyButton from "@/components/VerifyButton";

interface Proof {
  _id: string;
  projectId: string;
  deviceId: string;
  timestamp: number;
  ipfsHash: string;
  dataHash: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
}

export default function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const [proofs, setProofs] = useState<Proof[]>([]);
  const [loading, setLoading] = useState(true);

  const { projectId } = use(params);

  useEffect(() => {
    async function fetchProofs() {
      try {
        const res = await fetch(
          `http://localhost:3000/api/projects/${projectId}`
        );
        const data = await res.json();

        setProofs(data.proofs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProofs();
  }, [projectId]);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
  <div
    className="min-h-screen p-8"
    style={{
      background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
    }}
  >
    {/* Header */}
    <div
      className="mb-8 p-6 rounded-2xl"
      style={{
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: "rgba(139,92,246,0.25)",
            border: "1px solid rgba(139,92,246,0.3)",
          }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="rgba(167,139,250,0.9)">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <div>
          <p className="text-xs font-medium mb-0.5" style={{ color: "rgba(167,139,250,0.8)" }}>
            Project
          </p>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "rgba(255,255,255,0.95)" }}>
            {projectId}
          </h1>
        </div>
      </div>
    </div>

    {/* Map Section */}
    <div
      className="mb-8 rounded-2xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      }}
    >
      <div
        className="px-5 py-3 flex items-center gap-2"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="rgba(167,139,250,0.8)">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
          />
        </svg>
        <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>
          Proof Locations
        </span>
      </div>
      <div className="p-4">
        <MapView proofs={proofs} />
      </div>
    </div>

    {/* Proofs List */}
    {proofs.length === 0 ? (
      <div
        className="flex flex-col items-center justify-center py-20 rounded-2xl"
        style={{
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.4)">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <p className="text-lg font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
          No proofs found
        </p>
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
          Proofs submitted for this project will appear here
        </p>
      </div>
    ) : (
      <div className="space-y-4">
        {/* Section label */}
        <div className="flex items-center gap-2 px-1 mb-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="rgba(167,139,250,0.7)">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.45)" }}>
            {proofs.length} proof{proofs.length !== 1 ? "s" : ""} submitted
          </span>
        </div>

        {proofs.map((proof) => (
          <div
            key={proof._id}
            className="flex gap-5 p-5 rounded-2xl transition-all duration-300"
            style={{
              background: "rgba(255,255,255,0.06)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              e.currentTarget.style.border = "1px solid rgba(255,255,255,0.18)";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 40px rgba(0,0,0,0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              e.currentTarget.style.border = "1px solid rgba(255,255,255,0.1)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.2)";
            }}
          >
            {/* Image */}
            <div className="relative flex-shrink-0">
              <img
                src={proof.imageUrl}
                className="w-40 h-28 object-cover rounded-xl"
                style={{ border: "1px solid rgba(255,255,255,0.1)" }}
              />
              {/* Subtle image overlay shine */}
              <div
                className="absolute inset-0 rounded-xl pointer-events-none"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%)",
                }}
              />
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col justify-center gap-2.5 min-w-0">
              {/* Timestamp */}
              <div className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="rgba(167,139,250,0.7)">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.88)" }}>
                  {new Date(proof.timestamp * 1000).toLocaleString()}
                </p>
              </div>

              {/* Device */}
              <div className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="rgba(139,92,246,0.7)">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                  Device:{" "}
                  <span style={{ color: "rgba(255,255,255,0.8)" }}>{proof.deviceId}</span>
                </p>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="rgba(139,92,246,0.7)">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <p className="text-sm font-mono" style={{ color: "rgba(255,255,255,0.55)" }}>
                  {proof.latitude},{" "}
                  <span style={{ color: "rgba(255,255,255,0.55)" }}>{proof.longitude}</span>
                </p>
              </div>
            </div>

            {/* Verify Button */}
            <div className="flex-shrink-0 flex items-center">
              <VerifyButton imageUrl={proof.imageUrl} dataHash={proof.dataHash} />
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
}