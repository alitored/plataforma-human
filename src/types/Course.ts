// src/types/Course.ts
export interface Course {
  id: string;
  nombre: string;
  descripcion?: string;
  fecha_inicio?: string;
  profesores?: string[];

  // 🔥 nuevas propiedades que tu CourseTemplate espera
  modalidad?: string;
  forma_pago?: string;
  fechas_modulos?: string;   // si lo guardás como texto plano
  programa?: string;

  // otras que ya tenías
  horas?: number;
  modulos?: string[];
  categoria?: string;
}
