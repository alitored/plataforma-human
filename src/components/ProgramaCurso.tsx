'use client';

import { useState } from 'react';

interface ProgramaCursoProps {
  fechasModulos?: string;
  programa?: string;
  className?: string;
  titulo?: string;
  descripcion?: string;
}

export default function ProgramaCurso({ 
  fechasModulos, 
  programa, 
  className = '',
  titulo = "Programa Académico",
  descripcion = "Estructura completa organizada por módulos y semanas"
}: ProgramaCursoProps) {
  const [modulosExpandidos, setModulosExpandidos] = useState<Set<number>>(new Set([0]));

  // Usar fechasModulos si está disponible, sino programa
  const contenido = fechasModulos || programa;
  
  if (!contenido?.trim()) return null;

  // Parser ultra-flexible que funciona con múltiples formatos
  const parsearContenido = (texto: string) => {
    const modulos: Array<{
      numero: number;
      titulo: string;
      fecha?: string;
      contenido: string;
      semanas?: Array<{
        numero: number;
        titulo: string;
        descripcion: string;
        fecha?: string;
      }>;
    }> = [];

    if (!texto?.trim()) return null;

    // Limpiar y normalizar el texto
    const textoLimpio = texto
      .replace(/\r\n/g, '\n')
      .replace(/\t/g, ' ')
      .replace(/  +/g, ' ')
      .trim();

    // Intentar diferentes estrategias de parsing

    // Estrategia 1: Dividir por módulos con múltiples patrones
    const patronesModulo = [
      /(?:^|\n)(?:MÓDULO|MODULO|Módulo|Modulo|MOD|Mod)\s*(\d+)[:\.\-]?\s*([^\n•◦•\-]*)/gi,
      /(?:^|\n)(\d+)[:\.\)]\s*([^\n•◦•\-]*)/gi,
      /(?:^|\n)([IVX]+)[:\.\)]\s*([^\n•◦•\-]*)/gi
    ];

    let bloques: string[] = [];
    let patronEncontrado = false;

    for (const patron of patronesModulo) {
      const matches = [...textoLimpio.matchAll(patron)];
      if (matches.length > 0) {
        // Dividir el texto usando las posiciones de los matches
        const indices = matches.map(match => match.index);
        for (let i = 0; i < indices.length; i++) {
          const inicio = indices[i];
          const fin = indices[i + 1] || textoLimpio.length;
          const bloque = textoLimpio.substring(inicio, fin).trim();
          if (bloque) bloques.push(bloque);
        }
        patronEncontrado = true;
        break;
      }
    }

    // Estrategia 2: Si no se encontraron módulos, dividir por líneas que parezcan títulos
    if (!patronEncontrado) {
      const lineas = textoLimpio.split('\n').filter(linea => linea.trim());
      const titulos = lineas.filter(linea => 
        linea.length < 100 && // Líneas no muy largas
        !linea.toLowerCase().includes('fecha') &&
        !linea.toLowerCase().includes('semana') &&
        (linea.match(/[A-Z]/) || linea.match(/\d/)) &&
        !linea.startsWith('•') &&
        !linea.startsWith('◦') &&
        !linea.startsWith('-')
      );

      if (titulos.length > 1) {
        // Usar los títulos como divisores de módulos
        titulos.forEach((titulo, index) => {
          const inicio = textoLimpio.indexOf(titulo);
          const siguienteTitulo = titulos[index + 1];
          const fin = siguienteTitulo ? textoLimpio.indexOf(siguienteTitulo) : textoLimpio.length;
          const bloque = textoLimpio.substring(inicio, fin).trim();
          if (bloque) bloques.push(bloque);
        });
        patronEncontrado = true;
      }
    }

    // Estrategia 3: Si todo falla, usar el texto completo como un módulo
    if (!patronEncontrado) {
      bloques = [textoLimpio];
    }

    // Procesar cada bloque
    bloques.forEach((bloque, index) => {
      // Extraer número y título
      let numero = index + 1;
      let titulo = `Módulo ${numero}`;
      let fecha: string | undefined;

      // Buscar número y título con múltiples patrones
      const patronTitulo = /(?:MÓDULO|MODULO|Módulo|Modulo|MOD|Mod)?\s*(\d+)[:\.\-]?\s*([^\n•◦•\-]*)/i;
      const matchTitulo = bloque.match(patronTitulo);
      
      if (matchTitulo) {
        numero = parseInt(matchTitulo[1]);
        titulo = matchTitulo[2]?.trim() || titulo;
      }

      // Buscar fecha
      const patronFecha = /(?:fechas?|dates?):?\s*([^\n◦•\-]+)/i;
      const matchFecha = bloque.match(patronFecha);
      if (matchFecha) {
        fecha = matchFecha[1].trim();
      }

      // Extraer contenido del módulo (sin el título)
      let contenidoModulo = bloque;
      if (matchTitulo) {
        contenidoModulo = bloque.substring(matchTitulo[0].length).trim();
      }

      // Intentar extraer semanas si el formato es estructurado
      const semanas: Array<{ numero: number; titulo: string; descripcion: string; fecha?: string }> = [];
      
      // Patrones para semanas
      const patronesSemana = [
        /(?:•|◦|\-)\s*(?:Semana|semana|SEMANA)\s*(\d+)[:\.]?\s*([^\n\(\)]+)(?:\(([^)]+)\))?\s*([^•◦\-]*)/gi,
        /(?:•|◦|\-)\s*(\d+)[:\.]?\s*([^\n\(\)]+)(?:\(([^)]+)\))?\s*([^•◦\-]*)/gi,
        /Semana\s*(\d+)[\s\-:]+([^:\n]+):?\s*([^\n•◦\-]*)/gi
      ];

      for (const patron of patronesSemana) {
        const matches = [...contenidoModulo.matchAll(patron)];
        if (matches.length > 0) {
          matches.forEach(match => {
            const semNum = match[1] ? parseInt(match[1]) : semanas.length + 1;
            const semTitulo = match[2]?.trim() || `Semana ${semNum}`;
            const semFecha = match[3]?.trim();
            const semDescripcion = match[4]?.trim() || '';
            
            semanas.push({
              numero: semNum,
              titulo: semTitulo,
              descripcion: semDescripcion,
              fecha: semFecha
            });
          });
          break;
        }
      }

      // Si no se encontraron semanas, dividir el contenido por líneas
      if (semanas.length === 0) {
        const lineas = contenidoModulo.split('\n')
          .filter(linea => linea.trim())
          .filter(linea => !linea.toLowerCase().includes('fecha'))
          .filter(linea => linea.length > 10); // Filtrar líneas muy cortas

        lineas.forEach((linea, lineaIndex) => {
          if (lineaIndex < 10) { // Límite razonable de semanas por módulo
            const tituloSemana = linea.replace(/^[•◦\-\s]*/, '').trim();
            if (tituloSemana && !tituloSemana.toLowerCase().includes('módulo')) {
              semanas.push({
                numero: lineaIndex + 1,
                titulo: tituloSemana,
                descripcion: '',
                fecha: undefined
              });
            }
          }
        });
      }

      // Ordenar semanas por número
      semanas.sort((a, b) => a.numero - b.numero);

      modulos.push({
        numero,
        titulo: titulo.trim(),
        fecha,
        contenido: contenidoModulo,
        semanas: semanas.length > 0 ? semanas : [{
          numero: 1,
          titulo: 'Contenido del módulo',
          descripcion: contenidoModulo || 'Detalles del módulo por definir'
        }]
      });
    });

    // Ordenar módulos por número
    modulos.sort((a, b) => a.numero - b.numero);
    
    return modulos.length > 0 ? modulos : null;
  };

  const modulos = parsearContenido(contenido);

  const toggleModulo = (numero: number) => {
    setModulosExpandidos(prev => {
      const nuevo = new Set(prev);
      if (nuevo.has(numero)) {
        nuevo.delete(numero);
      } else {
        nuevo.add(numero);
      }
      return nuevo;
    });
  };

  // DEBUG: Mostrar información del parsing
  console.log('Contenido original:', contenido);
  console.log('Módulos parseados:', modulos);

  // Si no se puede parsear, mostrar contenido crudo pero formateado
  if (!modulos || modulos.length === 0) {
    return (
      <section className={`bg-white rounded-2xl shadow-lg p-6 ${className}`}>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{titulo}</h2>
        <div className="prose prose-gray max-w-none">
          <div className="whitespace-pre-wrap text-gray-700 font-sans text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border">
            {contenido}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`bg-white rounded-2xl shadow-lg p-6 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{titulo}</h2>
          <p className="text-gray-600">{descripcion}</p>
        </div>
        
        {modulos.length > 1 && (
          <div className="flex gap-2">
            <button
              onClick={() => setModulosExpandidos(new Set(modulos.map(m => m.numero)))}
              className="px-3 py-1 text-sm bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
            >
              Expandir Todos
            </button>
            <button
              onClick={() => setModulosExpandidos(new Set())}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Colapsar Todos
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {modulos.map((modulo) => (
          <div 
            key={modulo.numero}
            className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Header del módulo */}
            <button
              onClick={() => toggleModulo(modulo.numero)}
              className="w-full text-left p-6 bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex-shrink-0 w-12 h-12 bg-emerald-500 text-white rounded-lg flex items-center justify-center font-bold text-lg">
                    {modulo.numero}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {modulo.titulo}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm">
                      {modulo.fecha && (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                          📅 {modulo.fecha}
                        </span>
                      )}
                      <span className="text-gray-600">
                        {modulo.semanas.length} semana{modulo.semanas.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>
                <svg 
                  className={`flex-shrink-0 w-6 h-6 text-gray-500 transition-transform ${
                    modulosExpandidos.has(modulo.numero) ? 'rotate-180' : ''
                  }`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {/* Contenido del módulo */}
            {modulosExpandidos.has(modulo.numero) && (
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <div className="grid gap-3">
                  {modulo.semanas.map((semana) => (
                    <div 
                      key={semana.numero}
                      className="bg-white rounded-lg p-4 border border-gray-200 hover:border-emerald-300 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-semibold mt-1">
                          {semana.numero}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900 text-lg">
                              {semana.titulo}
                            </h4>
                            {semana.fecha && (
                              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap">
                                {semana.fecha}
                              </span>
                            )}
                          </div>
                          {semana.descripcion && (
                            <p className="text-gray-700 text-sm leading-relaxed">
                              {semana.descripcion}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Mostrar contenido crudo si no hay semanas estructuradas */}
                {modulo.semanas.length === 1 && modulo.semanas[0].descripcion === modulo.contenido && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800 text-sm">
                      <strong>Nota:</strong> Mostrando contenido en formato original
                    </p>
                    <div className="mt-2 whitespace-pre-wrap text-gray-700 text-sm">
                      {modulo.contenido}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer informativo */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-500 text-center">
          Total: {modulos.length} módulos • {modulos.reduce((total, mod) => total + mod.semanas.length, 0)} semanas
        </p>
      </div>
    </section>
  );
}