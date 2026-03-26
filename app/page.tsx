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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Infrastructure Projects
      </h1>

      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Link
              key={project._id}
              href={`/project/${project._id}`}
              className="block border p-4 rounded-lg shadow hover:bg-gray-100"
            >
              <h2 className="text-xl font-semibold">
                {project._id}
              </h2>

              <p className="text-sm mt-2">
                Proofs: {project.count}
              </p>

              <p className="text-sm">
                Last Update:{" "}
                {new Date(
                  project.lastUpdated * 1000
                ).toLocaleString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}