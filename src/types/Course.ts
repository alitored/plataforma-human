import { z } from "zod";

// Esquema de validación
export const CourseSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  descripcion: z.string().optional(),
  horas: z.number().optional(),
  modulos: z.number().optional(),
  categoria: z.string().optional(),
  imagen: z.string().optional(),
  destacado: z.boolean().optional(),
  profesores: z.array(z.string()).optional(),
  fecha_inicio: z.string().optional(),
});

export type Course = z.infer<typeof CourseSchema>;
