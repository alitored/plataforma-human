// src/components/CourseEnrollmentForm.tsx
"use client";

import React, { useState } from 'react';
import { Course } from '@/types/Course';
import { supabase } from '@/lib/supabaseClient'; // ✅ IMPORTACIÓN CORRECTA
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface CourseEnrollmentFormProps {
  course: Course;
  onClose?: () => void;
}

interface FormData {
  nombre: string;
  email: string;
  telefono: string;
  mensaje?: string;
}

export default function CourseEnrollmentForm({ course, onClose }: CourseEnrollmentFormProps) {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    // Validación básica
    if (!formData.nombre.trim() || !formData.email.trim() || !formData.telefono.trim()) {
      setSubmitError('Por favor completa todos los campos obligatorios.');
      setIsSubmitting(false);
      return;
    }

    try {
      // ✅ INTEGRACIÓN REAL CON SUPABASE - USANDO TU CLIENTE
      const { data, error } = await supabase
        .from('inscripciones')
        .insert([
          {
            nombre: formData.nombre.trim(),
            email: formData.email.trim(),
            telefono: formData.telefono.trim(),
            mensaje: formData.mensaje?.trim() || '',
            curso_id: course.id,
            curso_nombre: course.nombre,
            curso_categoria: course.categoria,
            curso_horas: course.horas,
            fecha_inscripcion: new Date().toISOString(),
            estado: 'pendiente'
          }
        ])
        .select();

      if (error) {
        throw new Error(error.message);
      }

      console.log('✅ Inscripción guardada en Supabase:', data);
      setSubmitSuccess(true);

      // Limpiar formulario
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        mensaje: ''
      });

      // Cerrar automáticamente después de 3 segundos
      if (onClose) {
        setTimeout(() => {
          onClose();
        }, 3000);
      }

    } catch (error) {
      console.error('❌ Error en inscripción:', error);
      setSubmitError(
        error instanceof Error 
          ? `Error: ${error.message}`
          : 'Hubo un error al procesar tu inscripción. Por favor, inténtalo de nuevo.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Estado de éxito
  if (submitSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Inscripción Exitosa!</h3>
          <p className="text-gray-600 mb-6">
            Te has inscrito correctamente a <strong>{course.nombre}</strong>. 
            Nos pondremos en contacto contigo pronto.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-emerald-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-emerald-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Inscribirse al Curso</h2>
            <p className="text-gray-600 mt-1">{course.nombre}</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Campo Nombre */}
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre completo *
            </label>
            <div className="relative">
              <UserIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="Tu nombre completo"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Campo Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <div className="relative">
              <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="tu@email.com"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Campo Teléfono */}
          <div>
            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono *
            </label>
            <div className="relative">
              <PhoneIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="+54 11 1234-5678"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Campo Mensaje (opcional) */}
          <div>
            <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-1">
              Mensaje (opcional)
            </label>
            <textarea
              id="mensaje"
              name="mensaje"
              value={formData.mensaje}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
              placeholder="¿Alguna consulta específica sobre el curso?"
              disabled={isSubmitting}
            />
          </div>

          {/* Mensaje de Error */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-700 text-sm">{submitError}</p>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Procesando...
                </span>
              ) : (
                '🎓 Inscribirme'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}