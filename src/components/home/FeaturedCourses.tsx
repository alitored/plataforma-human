import CourseCard from "@/components/CourseCard";
import { Course } from "@/types/Course";

interface Props {
  courses: Course[];
}

export default function FeaturedCourses({ courses }: Props) {
  // ✅ Aseguramos que courses sea siempre un array
  const safeCourses = Array.isArray(courses) ? courses : [];

  // ✅ Filtramos los destacados de forma explícita
  const featured = safeCourses.filter((c) => c.destacado === true);

  // ✅ Render defensivo
  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold text-verde-oscuro mb-6">
        Cursos destacados
      </h2>

      {featured.length === 0 ? (
        <p className="text-gray-400">No hay cursos destacados disponibles.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </section>
  );
}
