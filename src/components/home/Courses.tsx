// src/components/home/Courses.tsx
import CourseCard from "../CourseCard";
import { Course } from "../../types/Course";

interface Props {
  courses: Course[];
}

export default function Courses({ courses }: Props) {
  if (!courses || courses.length === 0) {
    return (
      <p className="text-gray-400">
        No hay cursos disponibles en este momento.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
