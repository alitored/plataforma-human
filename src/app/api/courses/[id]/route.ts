// src/app/api/courses/[id]/route.ts
import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const notion = NOTION_TOKEN ? new Client({ auth: NOTION_TOKEN }) : null;

// Types para TypeScript
interface NotionRichText {
  plain_text?: string;
  text?: { content?: string };
  type?: string;
  href?: string | null;
  annotations?: any;
}

interface NotionBlock {
  type: string;
  paragraph?: { rich_text: NotionRichText[] };
  heading_1?: { rich_text: NotionRichText[] };
  heading_2?: { rich_text: NotionRichText[] };
  heading_3?: { rich_text: NotionRichText[] };
  bulleted_list_item?: { rich_text: NotionRichText[] };
  numbered_list_item?: { rich_text: NotionRichText[] };
  quote?: { rich_text: NotionRichText[] };
  code?: { rich_text: NotionRichText[]; language?: string };
  [key: string]: any;
}

interface ProcessedBlock {
  type: string;
  content?: string;
  rich_text?: NotionRichText[];
  language?: string;
}

function normalizeId(raw: unknown): string | null {
  if (!raw) return null;
  const s = String(raw).trim();
  const cleaned = decodeURIComponent(s)
    .replace(/[#?].*$/, "")
    .replace(/\s+/g, "");
  
  // UUID con guiones
  if (/^[0-9a-fA-F-]{36}$/.test(cleaned)) {
    return cleaned.toLowerCase();
  }
  
  // 32 caracteres hex a UUID con guiones
  const onlyHex = cleaned.replace(/[^0-9a-fA-F]/g, "");
  if (/^[0-9a-fA-F]{32}$/.test(onlyHex)) {
    return `${onlyHex.slice(0, 8)}-${onlyHex.slice(8, 12)}-${onlyHex.slice(12, 16)}-${onlyHex.slice(16, 20)}-${onlyHex.slice(20, 32)}`.toLowerCase();
  }
  
  return null;
}

// Función mejorada para limpiar y extraer texto plano
function cleanRichText(richTextArray: any[] | null | undefined): string {
  if (!Array.isArray(richTextArray)) return "";
  
  const result = richTextArray
    .map(item => {
      // Debug para ver la estructura real
      console.log('🔍 RichText item structure:', JSON.stringify(item, null, 2));
      
      // Extraer texto de cualquier estructura
      if (item?.plain_text) return item.plain_text;
      if (item?.text?.content) return item.text.content;
      if (typeof item === 'string') return item;
      if (item?.content) return item.content;
      return "";
    })
    .filter(text => text && typeof text === 'string' && text.trim() !== "")
    .join("")
    .trim();

  console.log('📝 Texto extraído:', result);
  return result;
}

// Procesar bloques de forma más robusta
function processBlocksSafely(blocks: NotionBlock[]): ProcessedBlock[] {
  const result: ProcessedBlock[] = [];
  
  console.log(`🔄 Procesando ${blocks.length} bloques...`);
  
  for (const block of blocks) {
    try {
      let processedBlock: ProcessedBlock | null = null;
      
      console.log(`📦 Bloque tipo: ${block.type}`, block.id);
      
      switch (block.type) {
        case 'paragraph':
          const paraText = cleanRichText(block.paragraph?.rich_text);
          if (paraText) {
            processedBlock = {
              type: 'paragraph',
              content: paraText,
              rich_text: block.paragraph?.rich_text || []
            };
          }
          break;
          
        case 'heading_1':
          const h1Text = cleanRichText(block.heading_1?.rich_text);
          if (h1Text) {
            processedBlock = {
              type: 'heading_1',
              content: h1Text,
              rich_text: block.heading_1?.rich_text || []
            };
          }
          break;
          
        case 'heading_2':
          const h2Text = cleanRichText(block.heading_2?.rich_text);
          if (h2Text) {
            processedBlock = {
              type: 'heading_2',
              content: h2Text,
              rich_text: block.heading_2?.rich_text || []
            };
          }
          break;
          
        case 'heading_3':
          const h3Text = cleanRichText(block.heading_3?.rich_text);
          if (h3Text) {
            processedBlock = {
              type: 'heading_3',
              content: h3Text,
              rich_text: block.heading_3?.rich_text || []
            };
          }
          break;
          
        case 'bulleted_list_item':
          const bulletText = cleanRichText(block.bulleted_list_item?.rich_text);
          if (bulletText) {
            processedBlock = {
              type: 'bulleted_list_item',
              content: bulletText,
              rich_text: block.bulleted_list_item?.rich_text || []
            };
          }
          break;
          
        case 'numbered_list_item':
          const numberText = cleanRichText(block.numbered_list_item?.rich_text);
          if (numberText) {
            processedBlock = {
              type: 'numbered_list_item',
              content: numberText,
              rich_text: block.numbered_list_item?.rich_text || []
            };
          }
          break;
          
        case 'quote':
          const quoteText = cleanRichText(block.quote?.rich_text);
          if (quoteText) {
            processedBlock = {
              type: 'quote',
              content: quoteText,
              rich_text: block.quote?.rich_text || []
            };
          }
          break;
          
        case 'code':
          const codeText = cleanRichText(block.code?.rich_text);
          if (codeText) {
            processedBlock = {
              type: 'code',
              content: codeText,
              language: block.code?.language || 'plain',
              rich_text: block.code?.rich_text || []
            };
          }
          break;
          
        case 'divider':
          processedBlock = { type: 'divider' };
          break;
          
        case 'image':
          const imageUrl = block.image?.file?.url || block.image?.external?.url;
          if (imageUrl) {
            processedBlock = {
              type: 'image',
              content: imageUrl,
              rich_text: block.image?.caption || []
            };
          }
          break;
          
        default:
          console.log(`⚠️ Tipo de bloque no manejado: ${block.type}`);
          // Intentar extraer texto de cualquier propiedad que tenga rich_text
          for (const key in block) {
            if (key !== 'type' && key !== 'id' && block[key]?.rich_text) {
              const text = cleanRichText(block[key].rich_text);
              if (text) {
                processedBlock = {
                  type: block.type,
                  content: text,
                  rich_text: block[key].rich_text
                };
                break;
              }
            }
          }
          break;
      }
      
      if (processedBlock) {
        result.push(processedBlock);
        console.log(`✅ Bloque procesado: ${processedBlock.type} - "${processedBlock.content?.substring(0, 50)}..."`);
      } else {
        console.log(`❌ Bloque sin contenido: ${block.type}`);
      }
    } catch (error) {
      console.error(`💥 Error procesando bloque ${block.type}:`, error);
      continue;
    }
  }
  
  console.log(`🎯 Total de bloques procesados: ${result.length}`);
  return result;
}

async function getAllBlocks(pageId: string): Promise<NotionBlock[]> {
  if (!notion) return [];
  
  let blocks: NotionBlock[] = [];
  let cursor: string | undefined;
  
  try {
    do {
      const response = await notion.blocks.children.list({
        block_id: pageId,
        start_cursor: cursor,
        page_size: 100,
      });
      
      blocks = blocks.concat(response.results as NotionBlock[]);
      cursor = response.has_more ? response.next_cursor : undefined;
    } while (cursor);
    
    return blocks;
  } catch (error) {
    console.error("❌ Error obteniendo bloques:", error);
    return [];
  }
}

function safeFilesFirstUrl(files: any): string | null {
  try {
    if (typeof files === 'string') return files;
    const arr = Array.isArray(files) ? files : files?.files ?? [];
    const first = arr?.[0];
    return first?.file?.url ?? first?.external?.url ?? first?.url ?? null;
  } catch (error) {
    console.error("❌ Error procesando archivos:", error);
    return null;
  }
}

function resolveProp(props: any, keys: string[]): any {
  for (const k of keys) {
    if (props[k] !== undefined && props[k] !== null) return props[k];
  }
  return undefined;
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: rawId } = await params;
    const id = normalizeId(rawId);
    
    console.log(`🔍 Solicitando curso ID: ${id} (raw: ${rawId})`);
    
    if (!id) {
      return NextResponse.json({ 
        error: "Invalid course ID format",
        rawId 
      }, { status: 400 });
    }

    // Fallback cuando Notion no está configurado
    if (!notion) {
      console.warn("⚠️ Notion token no configurado");
      return NextResponse.json({
        id,
        nombre: "Curso (detalle no disponible - Configurar NOTION_TOKEN)",
        descripcion: "Configure el token de Notion para ver los detalles del curso.",
        horas: 0,
        modulos: [],
        categoria: null,
        imagen: null,
        destacado: false,
        fecha_inicio: null,
        profesores: [],
        modalidad: "",
        forma_pago: null,
        fechas_modulos: "",
        programa: "",
        content: []
      });
    }

    // Obtener página de Notion
    const page = await notion.pages.retrieve({ page_id: id });
    const props = (page as any).properties || {};

    console.log("📋 Propiedades encontradas:", Object.keys(props));

    // Resolver propiedades con múltiples nombres posibles
    const Nombre = resolveProp(props, ["Nombre", "Title", "titulo", "Name", "Título"]);
    const Descripcion = resolveProp(props, ["Descripcion", "Descripción", "Description", "descripcion"]);
    const Horas = resolveProp(props, ["Horas", "Duración", "Duration", "horas", "duracion"]);
    const Modulos = resolveProp(props, ["Modulos", "Módulos", "Modules", "modulos"]);
    const Categoria = resolveProp(props, ["Categoria", "Categoría", "Category", "categoria"]);
    const ImagenDestacada = resolveProp(props, ["Imagen_Destacada", "Imagen Destacada", "Cover", "Imagen", "Portada"]);
    const Destacado = resolveProp(props, ["Destacado", "Featured", "destacado"]);
    const FechaInicio = resolveProp(props, ["FechaInicio", "Fecha Inicio", "Start", "Inicio", "Fecha"]);
    const Profesores = resolveProp(props, ["Profesores", "Teachers", "Docentes", "profesores"]);
    const Modalidad = resolveProp(props, ["Modalidad", "Mode", "modalidad"]);
    const FormaPago = resolveProp(props, ["FormaPago", "Forma de pago", "Payment", "Pago"]);
    const FechasModulos = resolveProp(props, ["FechasModulos", "Fechas Módulos", "Cronograma", "Fechas"]);
    const Programa = resolveProp(props, ["Programa", "Syllabus", "Contenido", "programa"]);

    // Procesar módulos
    const modulos = Array.isArray(Modulos?.multi_select) 
      ? Modulos.multi_select.map((m: any) => m.name).filter(Boolean)
      : (Modulos?.number ? Array.from({ length: Modulos.number }, (_, i) => `Módulo ${i + 1}`) : []);

    // Obtener URL de imagen
    const imagenUrl = safeFilesFirstUrl(ImagenDestacada?.files ?? ImagenDestacada);

    // Obtener y procesar bloques de contenido
    console.log("📚 Obteniendo contenido de la página...");
    const blocks = await getAllBlocks(id);
    const processedContent = processBlocksSafely(blocks);

    // Construir objeto del curso
    const course = {
      id: String(page.id),
      nombre: cleanRichText(Nombre?.title) || "Curso sin título",
      descripcion: cleanRichText(Descripcion?.rich_text) || cleanRichText(Descripcion?.title),
      horas: Number(Horas?.number ?? Horas?.rollup?.number ?? 0) || 0,
      modulos: modulos.map(m => String(m)),
      categoria: Categoria?.select?.name ? String(Categoria.select.name) : null,
      imagen: imagenUrl,
      destacado: Boolean(Destacado?.checkbox ?? false),
      fecha_inicio: FechaInicio?.date?.start || null,
      profesores: Array.isArray(Profesores?.multi_select)
        ? Profesores.multi_select.map((p: any) => p.name).filter(Boolean).map((n: string) => String(n))
        : [],
      modalidad: cleanRichText(Modalidad?.rich_text) || cleanRichText(Modalidad?.select?.name),
      forma_pago: FormaPago?.select?.name ? String(FormaPago.select.name) : null,
      fechas_modulos: cleanRichText(FechasModulos?.rich_text),
      programa: cleanRichText(Programa?.rich_text),
      content: processedContent
    };

    console.log("✅ Curso procesado:", {
      nombre: course.nombre,
      bloques_contenido: course.content.length,
      tiene_imagen: !!course.imagen,
      modulos: course.modulos.length,
      profesores: course.profesores.length
    });

    // Devolver el curso directamente (sin wrapper)
    return NextResponse.json(course);

  } catch (err: any) {
    console.error("💥 Error en API de curso:", err);
    
    // Error específico para página no encontrada
    if (err.code === 'object_not_found' || err.message?.includes('not found')) {
      return NextResponse.json({ 
        error: "Curso no encontrado en Notion" 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      error: err.message || "Error interno del servidor"
    }, { status: 500 });
  }
}