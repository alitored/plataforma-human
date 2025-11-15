import { Course } from "@/types/Course";
import {
  CalendarIcon,
  UserIcon,
  CreditCardIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";

interface Props extends Course {}

export default function CourseTemplate({
  nombre,
  descripcion,
  fecha_inicio,
  profesores,
  modalidad,
  forma_pago,
  fechas_modulos,
  programa,
}: Props) {
  const fechaLegible =
    fecha_inicio ? new Date(fecha_inicio).toLocaleDateString("es-AR") : null;

  return (
    <article className="space-y-12">
      {/* Hero */}
      <section className="rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-900 text-white p-8 shadow-lg">
        <div className="flex flex-col gap-4">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-white/80">
            <AcademicCapIcon className="w-5 h-5" />
            Curso profesional
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {nombre}
          </h1>
          {descripcion && (
            <p className="text-white/85 text-lg max-w-3xl">{descripcion}</p>
          )}
        </div>

        {/* Badges */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {fechaLegible && (
            <div className="flex items-center gap-3 rounded-xl bg-white/10 backdrop-blur p-4">
              <CalendarIcon className="w-6 h-6 text-white" />
              <div className="leading-tight">
                <p className="text-xs text-white/70">Fecha de inicio</p>
                <p className="text-base font-semibold">{fechaLegible}</p>
              </div>
            </div>
          )}
          {profesores?.length > 0 && (
            <div className="flex items-center gap-3 rounded-xl bg-white/10 backdrop-blur p-4">
              <UserIcon className="w-6 h-6 text-white" />
              <div className="leading-tight">
                <p className="text-xs text-white/70">Profesores</p>
                <p className="text-base font-semibold">
                  {profesores.join(", ")}
                </p>
              </div>
            </div>
          )}
          {forma_pago && (
            <div className="flex items-center gap-3 rounded-xl bg-white/10 backdrop-blur p-4">
              <CreditCardIcon className="w-6 h-6 text-white" />
              <div className="leading-tight">
                <p className="text-xs text-white/70">Forma de pago</p>
                <p className="text-base font-semibold">{forma_pago}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Contenido principal */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna izquierda: modalidad y fechas por módulo */}
        <div className="lg:col-span-2 space-y-8">
          {modalidad && (
            <div className="rounded-xl bg-white text-gray-900 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-verde-oscuro mb-2">
                Modalidad
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {modalidad}
              </p>
            </div>
          )}

          {fechas_modulos && (
            <div className="rounded-xl bg-white text-gray-900 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-verde-oscuro mb-3">
                Fechas de cada módulo
              </h2>
              <div className="prose max-w-none text-gray-800 whitespace-pre-line">
                {fechas_modulos}
              </div>
            </div>
          )}

          {programa && (
            <div className="rounded-xl bg-white text-gray-900 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-verde-oscuro mb-3">
                Programa
              </h2>
              <div className="prose max-w-none text-gray-800 whitespace-pre-line">
                {programa}
              </div>
            </div>
          )}
        </div>

        {/* Columna derecha: resumen y CTA */}
        <aside className="space-y-6">
          <div className="rounded-xl bg-white text-gray-900 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-verde-oscuro">Resumen</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              {fechaLegible && (
                <li className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-emerald-600" />
                  <span>Inicio: {fechaLegible}</span>
                </li>
              )}
              {profesores?.length > 0 && (
                <li className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-emerald-600" />
                  <span>Profesor(es): {profesores.join(", ")}</span>
                </li>
              )}
              {forma_pago && (
                <li className="flex items-center gap-2">
                  <CreditCardIcon className="w-4 h-4 text-emerald-600" />
                  <span>Pago: {forma_pago}</span>
                </li>
              )}
            </ul>
          </div>

          <div className="rounded-xl bg-emerald-50 p-6 border border-emerald-200">
            <h4 className="text-emerald-900 font-semibold">
              ¿Listo para empezar?
            </h4>
            <p className="text-emerald-800 text-sm mt-1">
              Inscribite y viví la experiencia de aprender con acompañamiento humano.
            </p>
            <button className="mt-4 btn">Inscribirme</button>
          </div>
        </aside>
      </section>
    </article>
  );
}
