// src/components/CoursesClientDebug.tsx
"use client";
import React, { useEffect, useState } from "react";

export default function CoursesClientDebug() {
  const [courses, setCourses] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        console.log("DEBUG: fetch /api/courses");
        const res = await fetch("/api/courses");
        console.log("DEBUG status", res.status);
        const txt = await res.text();
        console.log("DEBUG raw body", txt.slice(0, 2000));
        let body;
        try { body = JSON.parse(txt); } catch { body = txt; }
        const data = body?.data ?? body;
        if (!mounted) return;
        setCourses(Array.isArray(data) ? data : []);
        console.log("DEBUG parsed length", Array.isArray(data) ? data.length : "not-array");
      } catch (e: any) {
        console.error("DEBUG fetch error", e);
        if (mounted) setError(String(e?.message ?? e));
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;
  if (courses === null) return <div>Cargando (client)…</div>;
  if (courses.length === 0) return <div>No hay cursos (client).</div>;

  return (
    <div>
      <h2>DEBUG - Cursos (client)</h2>
      <pre style={{ whiteSpace: "pre-wrap", fontSize: 12 }}>{JSON.stringify(courses, null, 2)}</pre>
    </div>
  );
}
