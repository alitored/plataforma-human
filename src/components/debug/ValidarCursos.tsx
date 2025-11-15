"use client";

import { useEffect } from "react";

type Curso = {
  id: string;
  nombre: string;
  imagen: string;
  destacado: boolean;
};

function esUUID(id: string) {
  const uuidRegex = /^[0-9a-f]{32}$/i;
  const cleaned = id.replace(/-/g, "");
  return uuidRegex.test(cleaned);
}

export default function ValidarCursos() {
  useEffect(() => {
    async function validar() {
      try {
        const res = await fetch("/api/courses");
        const cursos: Curso[] = await res.json();

        console.log("🔍 Validando cursos...\n");

        cursos.forEach((curso, index) => {
          const errores: string[] = [];

          if (!curso.imagen || curso.imagen === "/placeholder.jpg") {
            errores.push("❌ imagen ausente o genérica");
          }

          if (!esUUID(curso.id)) {
            errores.push("❌ id inválido");
          }

          if (!curso.destacado) {
            errores.push("⚠️ no está marcado como destacado");
          }

          if (errores.length === 0) {
            console.log(`✅ Curso ${index + 1}: ${curso.nombre} — OK`);
          } else {
            console.log(`🧪 Curso ${index + 1}: ${curso.nombre}`);
            errores.forEach((e) => console.log("   " + e));
          }
        });
      } catch (err) {
        console.error("❌ Error al validar cursos:", err);
      }
    }

    validar();
  }, []);

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Validando cursos en consola...</h1>
      <p className="text-slate-400">Abrí la consola del navegador para ver los resultados.</p>
    </div>
  );
}
