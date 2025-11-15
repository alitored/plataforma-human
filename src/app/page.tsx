"use client";

import { useState, useEffect } from "react";
import { Course } from "../types/Course";
import CoursesGrid from "../components/CoursesGrid";
import FeaturedCourses from "../components/home/FeaturedCourses";
import Hero from "../components/home/Hero";
import Header from "../components/home/Header";
import Footer from "../components/home/Footer";
import CoursesFilter from "../components/CoursesFilter";

async function getCourses(): Promise<Course[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/courses`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Error al cargar cursos");
  }

  return res.json();
}

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);

  useEffect(() => {
    async function loadCourses() {
      const data = await getCourses();
      setCourses(data);
      setFilteredCourses(data); // inicial: todos
    }
    loadCourses();
  }, []);

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <Header />
      <Hero />

      {/* Cursos destacados */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-6">Cursos destacados</h2>
        <FeaturedCourses courses={courses} />
      </section>

      {/* Filtro + todos los cursos */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-6">Todos los cursos</h2>

        {/* Filtro arriba de los cards */}
        <CoursesFilter courses={courses} onFilter={setFilteredCourses} />

        <CoursesGrid courses={filteredCourses} />
      </section>

      <Footer />
    </main>
  );
}
