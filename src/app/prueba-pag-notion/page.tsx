// src/app/prueba-pag-notion/page.tsx
'use client';

import { useState, useEffect } from 'react';
import ProgramaCurso from '@/components/ProgramaCurso';
import { Course } from '@/types/Course';

// Datos de ejemplo que simulan una fila de Notion
const cursoEjemplo: Course = {
  id: "curso-prueba-001",
  nombre: "Curso de Desarrollo Web Full Stack",
  descripcion: "Aprende desarrollo web completo con las últimas tecnologías y frameworks modernos.",
  fecha_inicio: "2024-03-15",
  profesores: ["Ana García", "Carlos López"],
  horas: 120,
  modulos: [
    "Fundamentos de HTML, CSS y JavaScript",
    "Desarrollo Frontend con React",
    "Backend con Node.js y Express",
    "Bases de datos y APIs REST",
    "Despliegue y DevOps"
  ],
  categoria: "Desarrollo Web",
  imagen: "/api/placeholder/800/400",
  destacado: true,
  modalidad: "Online en vivo con sesiones sincrónicas y material asincrónico",
  forma_pago: "Pago único o 3 cuotas sin interés",
  fechas_modulos: `MÓDULO 1: Fundamentos Web
• Fechas: 15/03/2024 - 29/03/2024
◦ Semana 1: HTML5 y CSS3 (15/03 - 22/03)
  - Estructura semántica HTML5
  - Flexbox y Grid CSS
  - Diseño responsive
◦ Semana 2: JavaScript Moderno (25/03 - 29/03)
  - ES6+ features
  - DOM manipulation
  - Async/await

MÓDULO 2: Frontend con React
• Fechas: 01/04/2024 - 26/04/2024
◦ Semana 3: React Fundamentals (01/04 - 05/04)
  - Components y JSX
  - Props y State
  - Hooks esenciales
◦ Semana 4: React Avanzado (08/04 - 12/04)
  - Context API
  - Custom hooks
  - Performance optimization
◦ Semana 5: Routing y State Management (15/04 - 19/04)
  - React Router
  - Redux Toolkit
◦ Semana 6: Proyecto Frontend (22/04 - 26/04)
  - Integración con APIs
  - Testing con Jest

MÓDULO 3: Backend Development
• Fechas: 29/04/2024 - 24/05/2024
◦ Semana 7: Node.js y Express (29/04 - 03/05)
  - Servidores HTTP
  - Middlewares
  - Routing
◦ Semana 8: Bases de Datos (06/05 - 10/05)
  - MongoDB y Mongoose
  - Relacionales con PostgreSQL
◦ Semana 9: Autenticación y Seguridad (13/05 - 17/05)
  - JWT tokens
  - Bcrypt hashing
  - CORS y seguridad
◦ Semana 10: APIs RESTful (20/05 - 24/05)
  - CRUD operations
  - Error handling
  - Documentation

MÓDULO 4: Proyecto Final
• Fechas: 27/05/2024 - 14/06/2024
◦ Semana 11: Planificación (27/05 - 31/05)
  - Arquitectura de la aplicación
  - User stories
◦ Semana 12: Desarrollo (03/06 - 07/06)
  - Implementación full-stack
◦ Semana 13: Testing y Deployment (10/06 - 14/06)
  - Tests integrales
  - Deployment en la nube`,

  programa: `MÓDULO 1: FUNDAMENTOS DE DESARROLLO WEB
• Objetivo: Comprender los pilares fundamentales del desarrollo web moderno
• Duración: 3 semanas | 30 horas

Contenidos:
1. HTML5 Avanzado
   - Estructura semántica
   - Formularios y validación
   - Accesibilidad web
   - SEO básico

2. CSS3 y Diseño Moderno
   - Flexbox y CSS Grid
   - Variables CSS
   - Animaciones y transiciones
   - Metodología BEM
   - Preprocesadores (SASS)

3. JavaScript ES6+
   - Arrow functions y destructuring
   - Promises y async/await
   - Modules (import/export)
   - Local Storage
   - Fetch API

MÓDULO 2: DESARROLLO FRONTEND CON REACT
• Objetivo: Construir aplicaciones interactivas con React
• Duración: 4 semanas | 40 horas

Contenidos:
1. React Fundamentals
   - Create React App
   - Functional Components
   - useState y useEffect
   - Event handling

2. React Avanzado
   - useContext y useReducer
   - Custom Hooks
   - React Router v6
   - Form handling

3. Estado Global
   - Redux Toolkit
   - RTK Query
   - Persistencia de estado

4. Proyecto Frontend
   - Component architecture
   - Styled Components
   - Testing con React Testing Library

MÓDULO 3: BACKEND Y BASES DE DATOS
• Objetivo: Desarrollar servidores y APIs robustas
• Duración: 4 semanas | 35 horas

Contenidos:
1. Node.js y Express
   - Módulos de Node.js
   - Express framework
   - Middleware stack
   - Error handling

2. Bases de Datos
   - MongoDB con Mongoose
   - Modelado de datos
   - Queries avanzadas
   - PostgreSQL con Sequelize

3. Autenticación y Seguridad
   - JWT implementation
   - Password hashing
   - Role-based access
   - CORS configuration

4. APIs REST
   - REST principles
   - API documentation
   - Versioning
   - Rate limiting

MÓDULO 4: PROYECTO FINAL Y DEPLOYMENT
• Objetivo: Integrar todos los conocimientos en un proyecto real
• Duración: 3 semanas | 15 horas

Contenidos:
1. Arquitectura Full-Stack
   - Monorepo setup
   - Environment variables
   - Code organization

2. Integración Frontend-Backend
   - API consumption
   - Error boundaries
   - Loading states

3. Deployment
   - Vercel/Netlify (frontend)
   - Railway/Render (backend)
   - Domain configuration
   - SSL certificates

4. Buenas Prácticas
   - Git workflow
   - Code reviews
   - Performance optimization
   - Security best practices`
};

export default function PruebaPagNotion() {
  const [curso, setCurso] = useState<Course>(cursoEjemplo);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Página de Prueba - Datos de Notion
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Esta página muestra todos los campos de una fila de la base de datos de Notion,
            incluyendo el área de texto enriquecido parseado.
          </p>
        </header>

        {/* Información General del Curso */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">
            📊 Datos de la Tabla (Campos de Notion)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-500">ID</label>
              <p className="text-gray-900 font-mono text-sm">{curso.id}</p>
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-500">Nombre</label>
              <p className="text-gray-900 font-semibold text-lg">{curso.nombre}</p>
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-500">Categoría</label>
              <p className="text-gray-900">{curso.categoria}</p>
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-500">Fecha de Inicio</label>
              <p className="text-gray-900">{curso.fecha_inicio}</p>
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-500">Horas</label>
              <p className="text-gray-900">{curso.horas} horas</p>
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-500">Destacado</label>
              <p className="text-gray-900">{curso.destacado ? '✅ Sí' : '❌ No'}</p>
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-500">Modalidad</label>
              <p className="text-gray-900">{curso.modalidad}</p>
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-500">Forma de Pago</label>
              <p className="text-gray-900">{curso.forma_pago}</p>
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-500">Profesores</label>
              <p className="text-gray-900">{Array.isArray(curso.profesores) ? curso.profesores.join(', ') : curso.profesores}</p>
            </div>
          </div>

          {/* Descripción */}
          <div className="mt-6 space-y-1">
            <label className="text-sm font-semibold text-gray-500">Descripción</label>
            <p className="text-gray-700 leading-relaxed">{curso.descripcion}</p>
          </div>

          {/* Módulos */}
          <div className="mt-6 space-y-1">
            <label className="text-sm font-semibold text-gray-500">Módulos ({curso.modulos?.length})</label>
            <div className="grid grid-cols-1 gap-2 mt-2">
              {curso.modulos?.map((modulo, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="flex-shrink-0 w-6 h-6 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{modulo}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contenido Enriquecido - Calendario Académico */}
        <section className="mb-8">
          <ProgramaCurso
            fechasModulos={curso.fechas_modulos}
            programa={undefined}
            titulo="📅 Calendario Académico (Parseado desde fechas_modulos)"
            descripcion="Estructura de módulos y semanas con fechas específicas"
            className="mb-8"
          />
        </section>

        {/* Contenido Enriquecido - Programa Detallado */}
        <section className="mb-8">
          <ProgramaCurso
            fechasModulos={undefined}
            programa={curso.programa}
            titulo="📚 Programa Detallado (Parseado desde programa)"
            descripcion="Contenido educativo organizado por módulos y temas"
            className="mb-8"
          />
        </section>

        {/* Contenido Crudo para Comparación */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Fechas Módulos Crudo */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              📋 Contenido Crudo - fechas_modulos
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg border">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono leading-relaxed overflow-auto max-h-96">
                {curso.fechas_modulos || 'No hay contenido'}
              </pre>
            </div>
          </div>

          {/* Programa Crudo */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              📋 Contenido Crudo - programa
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg border">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono leading-relaxed overflow-auto max-h-96">
                {curso.programa || 'No hay contenido'}
              </pre>
            </div>
          </div>
        </section>

        {/* Debug Info */}
        <section className="mt-8 bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-yellow-800 mb-3">🔍 Información de Debug</h3>
          <div className="space-y-2 text-sm text-yellow-700">
            <p><strong>fechas_modulos existe:</strong> {curso.fechas_modulos ? '✅ Sí' : '❌ No'}</p>
            <p><strong>programa existe:</strong> {curso.programa ? '✅ Sí' : '❌ No'}</p>
            <p><strong>Longitud fechas_modulos:</strong> {curso.fechas_modulos?.length || 0} caracteres</p>
            <p><strong>Longitud programa:</strong> {curso.programa?.length || 0} caracteres</p>
          </div>
        </section>
      </div>
    </div>
  );
}