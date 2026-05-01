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
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDevice , setSelectedDevice] = useState<string | null>(null);
  const [analysis , setAnalysis] = useState<string | null>(null);
  const [analyzing , setAnalyzing] = useState(false);

  const { projectId } = use(params);

  useEffect(() => {
    setSelectedDevice(null);
  }, [selectedDate])

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

  async function handleAnalyze(){
    setAnalyzing(true);

    try{
      const res = await fetch("/api/analyze",{
        method : "POST", 
        headers : {
          "Content-Type" : "application/json",
        },
        body : JSON.stringify({
          proofs : displayedProofs,
        }),
      });

      const data = await res.json();
      setAnalysis(data.analysis);
    }catch(err){
      console.error(err);
    }finally{
      setAnalyzing(false);
    }
  }

  if (loading) return <div className="p-6">Loading...</div>;

  const groupedProofs = proofs.reduce((acc : any ,proof) => {
    const date = new Date(proof.timestamp * 1000).toDateString();
    
    if(!acc[date]) acc[date] = [];
    acc[date].push(proof);

    return acc;
  }, {})

  const proofsForDate = selectedDate ? groupedProofs[selectedDate] : proofs;

  const deviceIds = Array.from(
    new Set(proofsForDate.map((p : Proof) => p.deviceId))
  );

  const dates = Object.keys(groupedProofs);

  const displayedProofs = selectedDevice ? 
    proofsForDate.filter((p : Proof) => p.deviceId === selectedDevice) : proofsForDate;

return (
  <div
    className="min-h-screen p-6"
    style={{ background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)" }}
  >
    {/* ── Header ── */}
    <div
      className="mb-6 p-5 rounded-2xl flex items-center gap-4"
      style={{
        background: "rgba(255,255,255,0.06)",
        border: "0.5px solid rgba(255,255,255,0.12)",
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          background: "rgba(139,92,246,0.2)",
          border: "0.5px solid rgba(139,92,246,0.35)",
        }}
      >
        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="rgba(167,139,250,0.9)">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      </div>
      <div className="flex-1">
        <p className="text-xs font-medium mb-0.5 tracking-widest uppercase"
          style={{ color: "rgba(167,139,250,0.75)" }}>
          Project
        </p>
        <h1 className="text-xl font-semibold tracking-tight"
          style={{ color: "rgba(255,255,255,0.95)" }}>
          {projectId}
        </h1>
      </div>
      <div
        className="px-3 py-1.5 rounded-lg text-xs font-medium"
        style={{
          background: "rgba(139,92,246,0.15)",
          border: "0.5px solid rgba(139,92,246,0.3)",
          color: "rgba(167,139,250,0.85)",
        }}
      >
        {displayedProofs.length} proof{displayedProofs.length !== 1 ? "s" : ""}
      </div>
    </div>

    {/* ── Map ── */}
    <div
      className="mb-6 rounded-2xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "0.5px solid rgba(255,255,255,0.1)",
      }}
    >
      <div
        className="px-4 py-3 flex items-center gap-2"
        style={{ borderBottom: "0.5px solid rgba(255,255,255,0.07)" }}
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="rgba(167,139,250,0.7)">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
          />
        </svg>
        <span className="text-xs font-medium tracking-wide uppercase"
          style={{ color: "rgba(255,255,255,0.4)" }}>
          Proof locations
        </span>
      </div>
      <div className="p-4">
        <MapView proofs={displayedProofs} />
      </div>
    </div>

    {/* ── Filters ── */}
    <div className="flex gap-4 mb-6 flex-wrap">
      <div className="flex-1 min-w-48">
        <p className="text-xs tracking-widest uppercase mb-2"
          style={{ color: "rgba(255,255,255,0.3)" }}>
          Filter by date
        </p>
        <div className="flex gap-2 flex-wrap">
          {dates.map((date) => (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={
                selectedDate === date
                  ? {
                      background: "rgba(139,92,246,0.25)",
                      border: "0.5px solid rgba(139,92,246,0.45)",
                      color: "rgba(167,139,250,0.95)",
                    }
                  : {
                      background: "rgba(255,255,255,0.07)",
                      border: "0.5px solid rgba(255,255,255,0.12)",
                      color: "rgba(255,255,255,0.5)",
                    }
              }
            >
              {date}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 min-w-48">
        <p className="text-xs tracking-widest uppercase mb-2"
          style={{ color: "rgba(255,255,255,0.3)" }}>
          Filter by device
        </p>
        <div className="flex gap-2 flex-wrap">
          {deviceIds.map((device: any) => (
            <button
              key={device}
              onClick={() => setSelectedDevice(device)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={
                selectedDevice === device
                  ? {
                      background: "rgba(34,197,94,0.18)",
                      border: "0.5px solid rgba(34,197,94,0.35)",
                      color: "rgba(134,239,172,0.9)",
                    }
                  : {
                      background: "rgba(255,255,255,0.07)",
                      border: "0.5px solid rgba(255,255,255,0.12)",
                      color: "rgba(255,255,255,0.5)",
                    }
              }
            >
              {device}
            </button>
          ))}
        </div>
      </div>
    </div>

    {/* ── Analyze button ── */}
    <div className="mb-6">
      <button
        onClick={handleAnalyze}
        className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-all"
        style={{
          background: "rgba(139,92,246,0.25)",
          border: "0.5px solid rgba(139,92,246,0.45)",
          color: "rgba(167,139,250,1)",
        }}
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
        {analyzing ? "Analyzing…" : "Analyze proofs"}
      </button>
    </div>

    {/* ── AI Analysis Modal ── */}
{analysis && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center"
    style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
    onClick={() => setAnalysis(null)}
  >
    <div
      className="relative flex flex-col"
      style={{
        width: "520px",
        maxWidth: "90vw",
        maxHeight: "80vh",
        background: "rgba(20,16,48,0.97)",
        border: "0.5px solid rgba(139,92,246,0.35)",
        borderRadius: "20px",
        boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Modal header */}
      <div
        className="flex items-center justify-between px-6 py-4 flex-shrink-0"
        style={{ borderBottom: "0.5px solid rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{
              background: "rgba(139,92,246,0.2)",
              border: "0.5px solid rgba(139,92,246,0.35)",
            }}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="rgba(167,139,250,0.9)">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <h2 className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.9)" }}>
            AI Analysis
          </h2>
        </div>

        {/* Close button */}
        <button
          onClick={() => setAnalysis(null)}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "0.5px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.5)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.12)";
            e.currentTarget.style.color = "rgba(255,255,255,0.9)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.06)";
            e.currentTarget.style.color = "rgba(255,255,255,0.5)";
          }}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Modal body */}
      <div className="overflow-y-auto px-6 py-5" style={{ flex: 1 }}>
        <p
          className="text-sm leading-relaxed whitespace-pre-line"
          style={{ color: "rgba(255,255,255,0.65)" }}
        >
          {analysis}
        </p>
      </div>

      {/* Modal footer */}
      <div
            className="px-6 py-4 flex-shrink-0"
            style={{ borderTop: "0.5px solid rgba(255,255,255,0.08)" }}
          >
            <button
              onClick={() => setAnalysis(null)}
              className="w-full py-2 rounded-xl text-xs font-medium transition-all"
              style={{
                background: "rgba(139,92,246,0.15)",
                border: "0.5px solid rgba(139,92,246,0.3)",
                color: "rgba(167,139,250,0.85)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(139,92,246,0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(139,92,246,0.15)";
              }}
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    )}

    {/* ── Proofs list ── */}
    {displayedProofs.length === 0 ? (
      <div
        className="flex flex-col items-center justify-center py-20 rounded-2xl"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "0.5px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
          style={{ background: "rgba(255,255,255,0.07)" }}
        >
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.3)">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <p className="text-base font-medium mb-1" style={{ color: "rgba(255,255,255,0.45)" }}>
          No proofs found
        </p>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>
          Proofs submitted for this project will appear here
        </p>
      </div>
    ) : (
      <div className="space-y-3">
        {/* Section label */}
        <div className="flex items-center gap-2 px-1 mb-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="rgba(167,139,250,0.6)">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            {displayedProofs.length} proof{displayedProofs.length !== 1 ? "s" : ""} submitted
          </span>
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
        </div>

        {displayedProofs.map((proof: Proof) => (
          <div
            key={proof._id}
            className="flex gap-4 p-4 rounded-2xl transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.055)",
              border: "0.5px solid rgba(255,255,255,0.1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.09)";
              e.currentTarget.style.border = "0.5px solid rgba(255,255,255,0.16)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.055)";
              e.currentTarget.style.border = "0.5px solid rgba(255,255,255,0.1)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {/* Thumbnail */}
            <div className="relative flex-shrink-0">
              <img
                src={proof.imageUrl}
                className="w-36 h-24 object-cover rounded-xl"
                style={{ border: "0.5px solid rgba(255,255,255,0.1)" }}
              />
            </div>

            {/* Meta */}
            <div className="flex-1 flex flex-col justify-center gap-2.5 min-w-0">
              <div className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24"
                  stroke="rgba(167,139,250,0.65)">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.85)" }}>
                  {new Date(proof.timestamp * 1000).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24"
                  stroke="rgba(139,92,246,0.6)">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                  Device:{" "}
                  <span style={{ color: "rgba(255,255,255,0.75)" }}>{proof.deviceId}</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24"
                  stroke="rgba(139,92,246,0.6)">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {proof.latitude}° N, {proof.longitude}° E
                </p>
              </div>
            </div>

            {/* Verify */}
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