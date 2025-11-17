// check_courses.js
// Ejecutar: node check_courses.js [BASE_URL]
// Ejemplo: node check_courses.js http://localhost:3000

const BASE = process.argv[2] || "http://localhost:3000";

function ok(msg) { console.log("\x1b[32m%s\x1b[0m", "OK:", msg); }
function warn(msg) { console.log("\x1b[33m%s\x1b[0m", "WARN:", msg); }
function err(msg) { console.log("\x1b[31m%s\x1b[0m", "ERROR:", msg); }

async function fetchJson(path) {
  const url = `${BASE.replace(/\/$/, "")}${path}`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    const text = await res.text();
    let json;
    try { json = JSON.parse(text); } catch (e) { json = text; }
    return { ok: true, status: res.status, body: json };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

function isStringArray(x) {
  return Array.isArray(x) && x.every(i => typeof i === "string");
}

(async () => {
  console.log("Base URL:", BASE);
  console.log("1) Fetch /api/courses");
  const coursesRes = await fetchJson("/api/courses");
  if (!coursesRes.ok) { err("No se pudo conectar a " + BASE + "/api/courses — " + coursesRes.error); process.exit(2); }

  console.log("Status:", coursesRes.status);
  const json = coursesRes.body;

  if (typeof json !== "object") {
    err("Respuesta no es JSON (o está mal parseada). Body preview:\n" + String(json).slice(0, 500));
    process.exit(3);
  }

  if (json?.ok !== true || !Array.isArray(json?.data)) {
    warn("Formato inesperado. Esperado { ok: true, data: [...] }.");
    console.log("Respuesta recibida (preview):", JSON.stringify(json).slice(0, 800));
  }

  const data = Array.isArray(json?.data) ? json.data : (Array.isArray(json) ? json : []);
  console.log("Cursos detectados:", data.length);

  if (data.length === 0) {
    warn("No hay cursos en data[]. Si esperabas cursos, revisá el endpoint o las variables de entorno del servidor.");
  }

  // Validar primer curso
  const sample = data[0];
  if (!sample) {
    warn("No hay un curso de muestra para validar propiedades.");
  } else {
    const required = ["id","nombre","modulos"];
    const missing = required.filter(k => !(k in sample));
    if (missing.length) {
      warn("Faltan campos en el primer curso: " + missing.join(", "));
    } else {
      ok("Primer curso tiene id y nombre.");
      if (!isStringArray(sample.modulos)) {
        warn("sample.modulos no es string[]; valor: " + JSON.stringify(sample.modulos).slice(0,200));
      } else {
        ok("sample.modulos es string[] (length=" + sample.modulos.length + ").");
      }
    }

    if (sample.imagen && typeof sample.imagen === "string") {
      ok("sample.imagen presente.");
    } else {
      warn("sample.imagen ausente o no es string.");
    }
  }

  // Si hay id, probar /api/courses/:id y /api/courses/:id/blocks
  const id = sample?.id;
  if (id) {
    console.log("\n2) Fetch /api/courses/:id (id usado):", id);
    const rawId = encodeURIComponent(String(id).trim());
    const singleRes = await fetchJson(`/api/courses/${rawId}`);
    if (!singleRes.ok) { warn("Error conectando a /api/courses/:id — " + singleRes.error); }
    else {
      console.log("Status:", singleRes.status);
      console.log("Body preview:", JSON.stringify(singleRes.body).slice(0,800));
      if (singleRes.body?.ok === false) {
        warn("/api/courses/:id devolvió ok:false -> " + JSON.stringify(singleRes.body).slice(0,200));
      } else {
        ok("/api/courses/:id devolvió información (ver preview arriba).");
      }
    }

    console.log("\n3) Fetch /api/courses/:id/blocks");
    const blocksRes = await fetchJson(`/api/courses/${rawId}/blocks`);
    if (!blocksRes.ok) { warn("Error conectando a /api/courses/:id/blocks — " + blocksRes.error); }
    else {
      console.log("Status:", blocksRes.status);
      const b = blocksRes.body;
      console.log("Body preview:", JSON.stringify(b).slice(0,800));
      const blocksArray = b?.data?.blocks ?? b?.blocks ?? b?.data ?? (Array.isArray(b) ? b : null);
      if (!Array.isArray(blocksArray)) {
        warn("Formato blocks inesperado; se esperaba array. Valor recibido: " + JSON.stringify(b).slice(0,500));
      } else {
        ok("Blocks array recibido, length=" + blocksArray.length);
      }
    }
  } else {
    warn("No se encontró un id válido en el primer curso; saltando comprobaciones por id.");
  }

  // Diagnóstico final simple
  console.log("\nDIAGNÓSTICO SUGERIDO:");
  if (data.length === 0) {
    console.log("- Revisa logs del servidor y variables de entorno (NOTION_TOKEN, NOTION_COURSES_DB_ID).");
  } else if (!isStringArray(sample?.modulos)) {
    console.log("- Asegurate que en /api/courses normalizas modulos a string[] (aunque sea []).");
  } else if (sample?.imagen && sample.imagen.startsWith("http") === false) {
    console.log("- Imagen no es URL. Revisa la normalización de imagen en el endpoint.");
  } else {
    console.log("- Backend parece OK. Si no ves cards en el cliente: 1) añadir logs en page.tsx para confirmar setCourses(data); 2) probar render temporal de títulos en lugar de CourseCard; 3) cambiar temporalmente next/image por <img> en CourseCard para descartar bloqueo por imagen remota.");
  }

  process.exit(0);
})();
