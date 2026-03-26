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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Project: {projectId}
      </h1>

      {/* ✅ MAP FIRST */}
      <div className="mb-8">
        <MapView proofs={proofs} />
      </div>

      {proofs.length === 0 ? (
        <p>No proofs found.</p>
      ) : (
        <div className="space-y-6">
          {proofs.map((proof) => (
            <div key={proof._id} className="flex gap-4 border p-4 rounded">
              <img
                src={proof.imageUrl}
                className="w-40 h-28 object-cover rounded"
              />

              <div>
                <p className="font-semibold">
                  {new Date(proof.timestamp * 1000).toLocaleString()}
                </p>
                <p>Device: {proof.deviceId}</p>
                <p>
                  Location: {proof.latitude}, {proof.longitude}
                </p>
              </div>

              <VerifyButton
                imageUrl={proof.imageUrl}
                dataHash={proof.dataHash}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}