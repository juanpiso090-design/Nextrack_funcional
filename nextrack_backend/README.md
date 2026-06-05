# 📑 Documentación Técnica de la API - Nextrack
**Proyecto:** Sistema de Control de Stock e Inventarios  
**Tecnologías:** Node.js, Express JS, Git  

---

## 1. Endpoint de Autenticación
* **URL:** `/api/nextrack/auth/login`
* **Método:** `POST`
* **Descripción:** Valida las credenciales de los empleados y retorna el rol asignado (Administrador/Operario) para controlar los accesos en el frontend.
* **Cuerpo de la Petición (JSON):**
```json
{
  "usuario": "juan_admin",
  "password": "123"
}
{
  "mensaje": "Autenticación satisfactoria",
  "usuario": "juan_admin",
  "rol": "Administrador"
}