"use client";
import { useState } from "react";
import { Course } from "@/types/Course";

interface Props {
  courses: Course[];
  onFilter: (filtered: Course[]) => void;
}

export default function CoursesFilter({ courses, onFilter }: Props) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedTitle, setSelectedTitle] = useState<string>("");

  // Extraer categorías únicas
  const categories = Array.from(new Set(courses.map((c) => c.categoria)));
  // Extraer títulos únicos
  const titles = Array.from(new Set(courses.map((c) => c.nombre)));

  const handleFilter = () => {
    let filtered = [...courses];

    if (selectedDate) {
      filtered = filtered.filter(
        (c) =>
          c.fecha_inicio &&
          new Date(c.fecha_inicio).toISOString().slice(0, 10) === selectedDate
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((c) => c.categoria === selectedCategory);
    }

    if (selectedTitle) {
      filtered = filtered.filter((c) => c.nombre === selectedTitle);
    }

    onFilter(filtered);
  };

  return (
    <section className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-bold text-verde-oscuro mb-4">Filtrar cursos</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Fecha */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de inicio
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full border rounded px-3 py-2 text-gray-900"
          />
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoría
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full border rounded px-3 py-2 text-gray-900"
          >
            <option value="">Todas</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Título */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Curso
          </label>
          <select
            value={selectedTitle}
            onChange={(e) => setSelectedTitle(e.target.value)}
            className="w-full border rounded px-3 py-2 text-gray-900"
          >
            <option value="">Todos</option>
            {titles.map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handleFilter}
        className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded"
      >
        Aplicar filtros
      </button>
    </section>
  );
}
