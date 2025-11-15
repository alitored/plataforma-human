'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import NotionBlockRenderer from '@/components/NotionBlockRenderer';
import CourseTemplate from '@/components/CourseTemplate';

export default function CoursePage() {
  const params = useParams();
  const id = params?.id as string;

  const [course, setCourse] = useState<any>(null);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourseData() {
      try {
        // 1. Traer los bloques de Notion
        const resBlocks = await fetch(`/api/course/${id}`);
        const dataBlocks = await resBlocks.json();
        setBlocks(dataBlocks.blocks || []);

        // 2. Traer los metadatos del curso desde /api/courses
        const resCourses = await fetch(`/api/courses`);
        const allCourses = await resCourses.json();
        const found = allCourses.find((c: any) => c.id === id);
        setCourse(found);
      } catch (error) {
        console.error("Error cargando curso:", error);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchCourseData();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-fondo text-texto flex items-center justify-center">
        <p className="text-lg text-texto-secundario">Cargando curso...</p>
      </main>
    );
  }

  if (!course) {
    return (
      <main className="min-h-screen bg-fondo text-texto flex items-center justify-center">
        <p className="text-lg text-red-500">Curso no encontrado</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-fondo text-texto font-sans px-6 py-12 space-y-10">
      {/* Plantilla modular */}
      <CourseTemplate {...course} />

      {/* Bloques enriquecidos de Notion */}
      <NotionBlockRenderer blocks={blocks} />
    </main>
  );
}
