// src/app/cursos/[id]/page.tsx
import { notFound } from 'next/navigation';
import CourseTemplate from '@/components/CourseTemplate';

async function getCourse(id: string) {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/courses/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error(`Error ${res.status}: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching course:', error);
    return null;
  }
}

export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await getCourse(id);

  if (!course) {
    notFound();
  }

  return <CourseTemplate {...course} />;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await getCourse(id);

  if (!course) {
    return {
      title: 'Curso No Encontrado',
    };
  }

  return {
    title: course.nombre,
    description: course.descripcion,
  };
}