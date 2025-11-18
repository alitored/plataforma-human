// src/app/debug-cursos/page.tsx (temporal)
import Link from 'next/link';

const testCourseIds = [
  '2ac6754d-bb0a-8024-be06-c24bb1ea5ab8',
  '2ac6754d-bb0a-802c-a133-dd59a90f5143'
];

async function testCourse(id: string) {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/courses/${id}`);
    return {
      id,
      status: res.status,
      ok: res.ok,
      data: res.ok ? await res.json() : null
    };
  } catch (error) {
    return { id, error: String(error) };
  }
}

export default async function DebugPage() {
  const results = await Promise.all(
    testCourseIds.map(id => testCourse(id))
  );

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Debug de Cursos</h1>
      
      <div className="space-y-6">
        {results.map((result, index) => (
          <div key={result.id} className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">
              Curso {index + 1}: {result.id}
            </h2>
            <div className="space-y-2">
              <p><strong>Status:</strong> {result.status}</p>
              <p><strong>OK:</strong> {result.ok ? '✅' : '❌'}</p>
              {result.data && (
                <>
                  <p><strong>Nombre:</strong> {result.data.nombre}</p>
                  <p><strong>Descripción:</strong> {result.data.descripcion?.substring(0, 100)}...</p>
                </>
              )}
              {result.error && (
                <p><strong>Error:</strong> {result.error}</p>
              )}
              <Link 
                href={`/cursos/${result.id}`}
                className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Probar Página
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}