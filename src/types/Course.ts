// src/types/Course.ts
export interface Course {
  id: string;
  nombre: string;
  descripcion?: string;
  fecha_inicio?: string;
  profesores?: string[];

  modalidad?: string;
  forma_pago?: string;
  fechas_modulos?: string;
  programa?: string;

  horas?: number;
  modulos?: string[];
  categoria?: string;

  // 🔥 nuevas propiedades para CourseCard
  imagen?: string;       // URL de la imagen del curso
  destacado?: boolean;   // flag para marcar cursos destacados
}
