"use client";

import React, { useEffect, useState } from "react";
import CourseCard from "@/components/CourseCard";

type Course = {
  id: string;
  nombre?: string;
  descripcion?: string;
  imagen?: string;
  modulos?: string[];
  horas?: number;
  categoria?: string;
  destacado?: boolean;
};

export default function Page() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      try {
        // En cliente podemos usar window.location.origin
        const origin =
          typeof window !== "undefined"
            ? window.location.origin
            : process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

        const base = origin.replace(/\/$/, "");
        const res = await fetch(`${base}/api/courses`, { cache: "no-store" });

        const txt = await res.text();
        const body = (() => {
          try {
            return JSON.parse(txt);
          } catch {
            return txt;
          }
        })();

        const data = body?.data ?? body;

        if (Array.isArray(data)) setCourses(data);
        else if (Array.isArray(body?.results)) setCourses(body.results);
        else setCourses(Array.isArray(body) ? body : []);
      } catch (e) {
        console.error("fetchCourses error", e);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, []);

  if (loading) {
    return (
      <main style={{ padding: 20 }}>
        <div>Cargando cursos...</div>
      </main>
    );
  }

  return (
    <main style={{ padding: 20 }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 18,
        }}
      >
        <h1 style={{ margin: 0 }}>Cursos</h1>
        <div style={{ fontSize: 13, color: "#666" }}>
          Mostrando <strong>{courses.length}</strong> cursos
        </div>
      </header>

      {courses.length === 0 ? (
        <div style={{ color: "#999" }}>No se encontraron cursos.</div>
      ) : (
        <div id="courses-grid" style={{ display: "grid", gap: 12 }}>
          {courses.map((c) => (
            <CourseCard key={String(c.id)} course={c} />
          ))}
        </div>
      )}
    </main>
  );
}
