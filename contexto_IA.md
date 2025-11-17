# **ESTRATEGIAS PARA MANTENER LA MEMORIA DEL PROYECTO**

### **1. TÉCNICA DEL "CONTEXTO COMPARTIDO"**

### **Crear un Archivo de Contexto:**
# CONTEXTO-PROYECTO.md
## Estructura del Proyecto:
- /app - Next.js 14 App Router
- /lib/supabase.ts - Cliente de Supabase
- /lib/notion.ts - Cliente de Notion
- /types/database.ts - Tipos TypeScript

## Configuraciones Clave:
- Supabase URL: [tu-url]
- Notion Database ID: [tu-id]
- Tablas: users(id, email), posts(id, title, content)
- Relaciones: posts.user_id → users.id