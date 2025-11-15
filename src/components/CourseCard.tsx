import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { Course } from "../types/Course";

interface Props {
  course: Course;
}

export default function CourseCard({ course }: Props) {
  const {
    id,
    nombre,
    descripcion,
    horas,
    modulos,
    categoria,
    imagen,
    destacado,
  } = course;

  const desc = descripcion?.trim() || "Descripción pendiente";
  const cat = categoria?.trim() || "General";
  const imgSrc = imagen?.trim() || "/placeholder.jpg";

  return (
    <div className="bg-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition flex flex-col">
      {/* Imagen */}
      <div className="relative w-full h-48">
        <Image
          src={imgSrc}
          alt={nombre}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
          priority={destacado}
        />
      </div>

      {/* Contenido */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-white">{nombre}</h3>
        <p className="text-sm text-gray-300 line-clamp-3">{desc}</p>

        {/* Badges */}
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {horas && horas > 0 && (
            <span className="inline-block px-2 py-1 rounded-full bg-blue-600 text-white font-semibold">
              {horas}h
            </span>
          )}
          {modulos && modulos > 0 && (
            <span className="inline-block px-2 py-1 rounded-full bg-purple-600 text-white font-semibold">
              {modulos} módulos
            </span>
          )}
          <span className="inline-block px-2 py-1 rounded-full bg-gray-700 text-gray-200 font-semibold">
            {cat}
          </span>
          {destacado && (
            <span className="inline-block px-2 py-1 rounded-full bg-emerald-500 text-white font-semibold">
              ★ Destacado
            </span>
          )}
        </div>

        {/* Botón profesional */}
        <Link
          href={`/courses/${id}`}
          className="mt-6 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105"
        >
          Leer más
          <ArrowRightIcon className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
