"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Project {
  _id: string;
  count: number;
  lastUpdated: number;
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("http://localhost:3000/api/projects");
        const data = await res.json();

        setProjects(data.projects);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

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
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
      }}
    >
      <h1
        className="text-3xl font-bold tracking-tight"
        style={{ color: "rgba(255,255,255,0.95)" }}
      >
        Infrastructure Projects
      </h1>
      <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
        {projects.length} project{projects.length !== 1 ? "s" : ""} available
      </p>
    </div>

    {/* Empty state */}
    {projects.length === 0 ? (
      <div
        className="flex flex-col items-center justify-center py-20 rounded-2xl"
        style={{
          background: "rgba(255, 255, 255, 0.04)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          <svg
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="rgba(255,255,255,0.4)"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 7h18M3 12h18M3 17h18"
            />
          </svg>
        </div>
        <p className="text-lg font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
          No projects found
        </p>
      </div>
    ) : (
      /* Project Grid */
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {projects.map((project) => (
          <Link
            key={project._id}
            href={`/project/${project._id}`}
            className="group block rounded-2xl p-6 transition-all duration-300"
            style={{
              background: "rgba(255, 255, 255, 0.06)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 4px 24px rgba(0, 0, 0, 0.2)",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.11)";
              e.currentTarget.style.border = "1px solid rgba(255,255,255,0.22)";
              e.currentTarget.style.boxShadow = "0 8px 40px rgba(0,0,0,0.35)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              e.currentTarget.style.border = "1px solid rgba(255,255,255,0.1)";
              e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.2)";
              e.currentTarget.style.transform = "translateY(0px)";
            }}
          >
            {/* Top row */}
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(139, 92, 246, 0.25)", border: "1px solid rgba(139,92,246,0.3)" }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="rgba(167,139,250,0.9)"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <div
                className="text-xs px-2.5 py-1 rounded-full"
                style={{
                  background: "rgba(139,92,246,0.15)",
                  border: "1px solid rgba(139,92,246,0.25)",
                  color: "rgba(196,181,253,0.9)",
                }}
              >
                Active
              </div>
            </div>

            {/* Project ID */}
            <h2
              className="text-lg font-semibold mb-3 truncate"
              style={{ color: "rgba(255,255,255,0.92)" }}
            >
              {project._id}
            </h2>

            {/* Divider */}
            <div
              className="mb-4"
              style={{ height: "1px", background: "rgba(255,255,255,0.07)" }}
            />

            {/* Stats */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="rgba(139,92,246,0.7)"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                  Proofs:{" "}
                  <span style={{ color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>
                    {project.count}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="rgba(139,92,246,0.7)"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                  {new Date(project.lastUpdated * 1000).toLocaleString()}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    )}
  </div>
);
}