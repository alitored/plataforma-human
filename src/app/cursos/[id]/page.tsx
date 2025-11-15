"use client";

import { useEffect, useState } from "react";
import NotionBlockRenderer from "@/components/NotionBlockRenderer";

export default function CursoPage({ params }: { params: { id: string } }) {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlocks() {
      try {
        const res = await fetch(`/api/cursos/${params.id}`);
        const data = await res.json();
        setBlocks(data.blocks || []);
      } catch (err) {
        console.error("Error cargando bloques de Notion:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchBlocks();
  }, [params.id]);

  if (loading) {
    return <p className="text-center text-slate-400 mt-20">Cargando contenido...</p>;
  }

  return (
    <main className="min-h-screen px-6 py-12 space-y-10">
      <section className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-white">Detalle del curso</h1>
        <p className="text-lg text-slate-300 max-w-xl mx-auto">
          Información enriquecida desde Notion.
        </p>
      </section>

      <NotionBlockRenderer blocks={blocks} />
    </main>
  );
}
