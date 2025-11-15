import CourseCard from "@/components/CourseCard";
import { Course } from "@/types/Course";

interface Props {
  courses: Course[];
}

export default function CoursesGrid({ courses }: Props) {
  // ✅ defensivo: aseguramos que courses sea siempre un array
  const safeCourses = Array.isArray(courses) ? courses : [];

  // Ordenar: destacados primero
  const sortedCourses = [...safeCourses].sort((a, b) => {
    if (a.destacado && !b.destacado) return -1;
    if (!a.destacado && b.destacado) return 1;
    return 0;
  });

  if (sortedCourses.length === 0) {
    return (
      <section className="py-12">
        <h2 className="text-2xl font-bold text-verde-oscuro mb-6">
          Todos los cursos
        </h2>
        <p className="text-gray-400">No hay cursos disponibles.</p>
      </section>
    );
  }

  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold text-verde-oscuro mb-6">
        Todos los cursos
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sortedCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  );
}
