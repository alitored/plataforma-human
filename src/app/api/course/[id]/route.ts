import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ unwrap del Promise

    const response = await notion.blocks.children.list({
      block_id: id,
    });

    return NextResponse.json({ blocks: response.results });
  } catch (error) {
    console.error("Error cargando curso:", error);
    return NextResponse.json({ error: "Error al cargar curso" }, { status: 500 });
  }
}
