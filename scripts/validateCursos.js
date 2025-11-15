// scripts/validateCursos.js
const fs = require("fs");
const path = require("path");

// Ruta al archivo cursos.json
const filePath = path.join(__dirname, "../src/data/cursos.json");

// Leer y parsear cursos.json
const rawData = fs.readFileSync(filePath, "utf-8");
const cursos = JSON.parse(rawData);

// Validar cantidad total y destacados
console.log("Total cursos:", cursos.length);
console.log("Destacados:", cursos.filter(c => c.destacado).length);

// Validar campos vacíos
const issues = cursos
  .map((curso) => {
    const problemas = [];
    if (!curso.descripcion || curso.descripcion.trim() === "") {
      problemas.push("descripcion vacía");
    }
    if (!curso.categoria || curso.categoria.trim() === "") {
      problemas.push("categoria vacía");
    }
    if (!curso.imagen || curso.imagen.trim() === "" || curso.imagen === "/placeholder.jpg") {
      problemas.push("imagen vacía o placeholder");
    }
    return problemas.length > 0 ? { nombre: curso.nombre, problemas } : null;
  })
  .filter(Boolean);

if (issues.length === 0) {
  console.log("✅ Todos los cursos tienen descripcion, categoria e imagen correctos.");
} else {
  console.log("⚠️ Cursos con problemas detectados:");
  issues.forEach((item) => {
    console.log(`- ${item.nombre}`);
    item.problemas.forEach((p) => console.log(`   • ${p}`));
  });
}
