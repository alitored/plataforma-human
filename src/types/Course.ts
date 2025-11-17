//src\types\Course.ts
export interface Course {
  id: string;
  nombre: string;
  descripcion?: string;
  fecha_inicio?: string;
  profesores: string[]; // array de nombres
  horas?: number;
  modulos: string[]; // siempre presente, puede estar vacío
  categoria?: string;
  imagen?: string;
  destacado?: boolean;
  modalidad?: string;
  forma_pago?: string;
  fechas_modulos?: string;
  programa?: string;
}
