import React from "react";
import CourseCard from "./CourseCard";

export default function CourseList({ courses } : { courses: any[] }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
      gap: 16
    }}>
      {courses.map((c: any) => <CourseCard key={String(c.id)} course={c} />)}
    </div>
  );
}
