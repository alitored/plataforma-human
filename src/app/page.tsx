"use client";

import { useState, useEffect, useMemo } from "react";
import { Course } from "../types/Course";
import CoursesGrid from "../components/CoursesGrid";
import FeaturedCourses from "../components/home/FeaturedCourses";
import Hero from "../components/home/Hero";
import Header from "../components/home/Header";
import CoursesFilter from "../components/CoursesFilter";

async function getCourses(): Promise<Course[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/courses`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Error al cargar cursos");
  }

  // Soporta { data: [...] } o array directo
  const body = await res.json().catch(async () => {
    const txt = await res.text();
    try {
      return JSON.parse(txt);
    } catch {
      return txt;
    }
  });
  const data = body?.data ?? body;
  if (Array.isArray(data)) return data;
  if (Array.isArray(body?.results)) return body.results;
  return Array.isArray(body) ? body : [];
}

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadCourses() {
      setLoading(true);
      setError(null);
      try {
        const data = await getCourses();
        if (!mounted) return;
        setCourses(data);
        setFilteredCourses(data); // inicial: todos
      } catch (e: any) {
        console.error("getCourses error", e);
        if (!mounted) return;
        setError(e?.message ?? "Error inesperado");
        setCourses([]);
        setFilteredCourses([]);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }
    loadCourses();
    return () => {
      mounted = false;
    };
  }, []);

  // featured (3) y nonFeatured (3) evitando duplicados
  const featured = useMemo(
    () => courses.filter((c) => Boolean(c.destacado)).slice(0, 3),
    [courses]
  );

  const nonFeatured = useMemo(
    () =>
      courses
        .filter((c) => !Boolean(c.destacado) && !featured.some((f) => f.id === c.id))
        .slice(0, 3),
    [courses, featured]
  );

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <Header />
      <Hero />

      {/* Cursos destacados */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-6">Cursos destacados</h2>
        {loading ? (
          <div className="text-gray-400">Cargando destacados...</div>
        ) : featured.length === 0 ? (
          <div className="text-gray-400">No hay cursos destacados</div>
        ) : (
          <FeaturedCourses courses={featured} />
        )}
      </section>

      {/* Filtro + todos los cursos */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-6">Todos los cursos</h2>

        {/* Filtro arriba de los cards */}
        <CoursesFilter courses={courses} onFilter={setFilteredCourses} />

        {loading ? (
          <div className="text-gray-400">Cargando cursos...</div>
        ) : error ? (
          <div className="text-red-400">Error: {error}</div>
        ) : (
          <CoursesGrid courses={filteredCourses} />
        )}
      </section>

      
      
    </main>
  );
}
