import { Client } from "@notionhq/client";
import { Course } from "../../types/Course";

const NOTION_TOKEN: string = process.env.NOTION_TOKEN!;
const DATABASE_ID: string = process.env.NOTION_DATABASE_ID!;

if (!NOTION_TOKEN) throw new Error("Falta NOTION_TOKEN");
if (!DATABASE_ID) throw new Error("Falta NOTION_DATABASE_ID");

const notion = new Client({ auth: NOTION_TOKEN });

// GET curso por ID
export async function getCursoPorId(id: string): Promise<Course | null> {
  const response = await notion.databases.query({
    database_id: DATABASE_ID,
    filter: { property: "ID", rich_text: { equals: id } },
    page_size: 1,
  });

  if (!response.results.length) return null;

  const page = response.results[0] as any;
  const props = page.properties;

  const curso: Course = {
    id,
    nombre: props.Nombre?.title?.[0]?.plain_text || "",
    descripcion: props.Descripcion?.rich_text?.[0]?.plain_text || "",
    profesores: props.Profesores?.multi_select?.map((p: any) => p.name) || [],
    fecha_inicio: props.Fecha_inicio?.date?.start || "",
    horas: props.Horas?.number || 0,
    modulos: props.Modulos?.number || 0,
    categoria: props.Categoria?.select?.name || "General",
    imagen: props.Imagen?.files?.[0]?.file?.url || "/placeholder.jpg",
    destacado: props.Destacado?.checkbox || false,
  };

  return curso;
}
