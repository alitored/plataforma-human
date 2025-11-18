// src/app/cursos/[id]/page.tsx
import { notFound } from "next/navigation";
import CourseTemplate from "@/components/CourseTemplate";

async function getCourse(id: string) {
  try {
    // Construir base URL segura para producción y desarrollo
    const base =
      process.env.NODE_ENV === "production" && process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000";

    const res = await fetch(`${base}/api/courses/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error(`Error ${res.status}: ${res.statusText}`);
    }

    const body = await res.json();
    return body?.data ?? body;
  } catch (error) {
    console.error("Error fetching course:", error);
    return null;
  }
}

export default async function CoursePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const course = await getCourse(id);

  if (!course) {
    notFound();
  }

  return <CourseTemplate {...course} />;
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const course = await getCourse(id);

  if (!course) {
    return {
      title: "Curso No Encontrado",
    };
  }

  return {
    title: course.nombre,
    description: course.descripcion,
  };
}
