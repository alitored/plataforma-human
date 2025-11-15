import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const blocks = await notion.blocks.children.list({
      block_id: params.id,
    });

    return NextResponse.json({ blocks: blocks.results });
  } catch (error: any) {
    console.error("❌ Error consultando Notion:", error.message);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
