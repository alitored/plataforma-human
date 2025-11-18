// src/types/Course.ts
export type ProcessedBlock =
  | { type: 'paragraph'; content: string; rich_text: any[] }
  | { type: 'heading_1'; content: string; rich_text: any[] }
  | { type: 'heading_2'; content: string; rich_text: any[] }
  | { type: 'heading_3'; content: string; rich_text: any[] }
  | { type: 'bulleted_list_item'; content: string; rich_text: any[] }
  | { type: 'numbered_list_item'; content: string; rich_text: any[] }
  | { type: 'quote'; content: string; rich_text: any[] }
  | { type: 'code'; content: string; language: string; rich_text: any[] }
  | { type: 'image'; url: string | null; caption: string }
  | { type: 'divider' }
  | { type: 'callout'; content: string; rich_text: any[]; icon: string | null }
  | { type: 'unsupported'; raw: any };

export interface Course {
  id: string;
  nombre: string;
  descripcion?: string;
  fecha_inicio?: string;
  profesores: string[];
  horas?: number;
  modulos: string[];
  categoria?: string;
  imagen?: string;
  destacado?: boolean;
  modalidad?: string;
  forma_pago?: string;
  fechas_modulos?: string;
  programa?: string;
  content?: ProcessedBlock[]; // ← Nuevo campo
}
