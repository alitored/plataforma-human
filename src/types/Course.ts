export interface Course {
  id: string;          // UUID con guiones
  nombre: string;      // Nombre del curso
  descripcion: string; // Texto descriptivo
  horas: number;       // Duración en horas
  módulos: number;     // Cantidad de módulos
  categoria: string;   //  (Branding, UX/UI, etc.)
  imagen: string;      // Ruta pública de la imagen
  destacado: boolean;  // Curso destacado
  notion_url: string;  // URL completa de Notion (referencia)
}
