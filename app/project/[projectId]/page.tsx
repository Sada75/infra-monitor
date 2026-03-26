"use client";

import { useEffect, useState,use } from "react";

interface Proof {
  _id: string;
  projectId: string;
  deviceId: string;
  timestamp: number;
  ipfsHash: string;
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

      {proofs.length === 0 ? (
        <p>No proofs found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {proofs.map((proof) => (
            <div
              key={proof._id}
              className="border rounded-lg p-4 shadow"
            >
              <img
                src={proof.imageUrl}
                alt="proof"
                className="w-full h-48 object-cover rounded"
              />

              <div className="mt-3 text-sm">
                <p>
                  <strong>Device:</strong> {proof.deviceId}
                </p>
                <p>
                  <strong>Time:</strong>{" "}
                  {new Date(proof.timestamp * 1000).toLocaleString()}
                </p>
                <p>
                  <strong>Location:</strong> {proof.latitude},{" "}
                  {proof.longitude}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}