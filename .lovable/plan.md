# Control admin de los Planes de Promoción

## Objetivo
Que el administrador pueda **ocultar o mostrar** la sección "Planes de Promoción" de la página "Conviértete en Companion" y **editar su contenido** (nombres, precios y beneficios). Por ahora estará oculta porque todo es gratis, y el admin podrá activarla cuando quiera cobrar.

## Cambios

### 1. Nueva tabla `promotion_plans_settings` (base de datos)
- Una sola fila de configuración, siguiendo el patrón de `donation_settings` y `footer_settings`:
  - `is_visible` (booleano, inicia en `false` → sección oculta)
  - `title` (texto, por defecto "Planes de Promoción")
  - `plans` (jsonb): arreglo con los 3 planes (nombre, precio, beneficios, destacado), precargado con los valores actuales de la página
  - `created_at` / `updated_at` con el trigger existente
- Permisos: lectura pública (para que la página la muestre), escritura solo admin vía `has_role(auth.uid(), 'admin')`. Incluye `GRANT`s y RLS.

### 2. Editor en el panel de administración
- Nueva pestaña **Contenido → Planes de promoción** (componente `AdminPromotionPlansSettings.tsx`):
  - Interruptor "Mostrar sección en la página" (activa/oculta)
  - Título de la sección editable
  - Por cada plan: nombre, precio mensual, lista de beneficios (agregar/quitar) y opción "destacar como más popular"
  - Botón guardar con confirmación

### 3. Página "Conviértete en Companion" lee la configuración
- `BecomeCompanion.tsx` consulta `promotion_plans_settings`:
  - Si `is_visible` es falso → no muestra la sección (estado inicial)
  - Si es verdadero → muestra los planes con los textos y precios configurados por el admin
- Mientras carga, la sección no parpadea (se muestra solo al confirmar que está activa).

## Detalles técnicos
- Migración: `lov_database--migration` con `CREATE TABLE`, `GRANT SELECT` a `anon`/`authenticated`, `GRANT ALL` a `service_role`, RLS con política de lectura pública y escritura solo admin, más la fila inicial con los 3 planes actuales.
- Verificación: revisar la página como visitante (sección oculta) y el panel admin (activarla y ver los cambios reflejados).
