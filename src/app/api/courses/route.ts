import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_COURSES_DB_ID!; // ✅

export async function GET() {
  try {
    const response = await notion.databases.query({ database_id: databaseId });

    const courses = response.results.map((row: any) => {
      const props = row.properties;
      return {
  id: row.id,
  nombre: props.Nombre?.title?.[0]?.plain_text || "Curso sin nombre",
  descripcion: props.Descripcion?.rich_text?.map((t: any) => t.plain_text).join(" ") || "",
  horas: props.Horas?.number || 0,
  modulos: props.Modulos?.number || 0,
  categoria: props.Categoria?.select?.name || "General",
  imagen: props.Imagen_Destacada?.files?.[0]?.file?.url || "/placeholder.jpg",
  destacado: props.Destacado?.checkbox || false,

  // Campos extendidos
  fecha_inicio: props.FechaInicio?.date?.start || null,
  profesores: props.Profesores?.multi_select?.map((p: any) => p.name) || [],
  modalidad: props.Modalidad?.rich_text?.map((t: any) => t.plain_text).join(" ") || "",
  forma_pago: props.FormaPago?.select?.name || null,
  fechas_modulos: props.FechasModulos?.rich_text?.map((t: any) => t.plain_text).join(" ") || "",
  programa: props.Programa?.rich_text?.map((t: any) => t.plain_text).join(" ") || "",
};

    });

    return NextResponse.json(courses); // ✅ devuelve array directo
  } catch (error) {
    console.error("Error cargando cursos:", error);
    return NextResponse.json({ error: "Error al cargar cursos" }, { status: 500 });
  }
}
