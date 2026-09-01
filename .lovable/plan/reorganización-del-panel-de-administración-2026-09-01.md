# Reorganización del Panel de Administración

Objetivo: que el panel sea claro, sin duplicados, con búsqueda y acciones evidentes.

## Problema actual

- Hay dos pestañas que muestran lo mismo: "Cuentas" y "Usuarios" leen ambas la tabla de perfiles.
- Seis pestañas planas sin agrupación lógica; el admin no sabe por dónde empezar.
- Las tablas no tienen buscador, filtro por estado, ni estados de carga/vacío consistentes.
- Las tarjetas de métricas no llevan a ninguna parte.

## Nueva estructura

Cuatro secciones en lugar de seis:

```text
Resumen      -> métricas + pendientes que requieren acción (companions por aprobar,
                comprobantes pendientes) con atajo a la sección correspondiente
Usuarios     -> una sola tabla unificada (perfil + rol + suscripción + estado de cuenta),
                buscador por nombre/usuario, filtro por rol, acciones en un menú por fila
Companions   -> listado con buscador, filtro por estado (pendiente/aprobada) y plan,
                aprobar/rechazar y cambiar plan desde la misma fila
Pagos        -> subpestañas: Comprobantes manuales | Mercado Pago
Contenido    -> subpestañas: Anuncios | Donaciones
```

## Mejoras transversales

- Barra de herramientas común en cada tabla: buscador, filtros, contador de resultados.
- Estado vacío y skeleton de carga consistentes (reutilizando `EmptyState`).
- Acciones destructivas o sensibles con confirmación.
- Tarjetas de métricas clicables que cambian de pestaña.
- Todo con los tokens del sistema de diseño actual (vidrio oscuro), sin colores crudos.

## Detalle técnico

- `src/pages/AdminPanel.tsx`: pasa a 4 pestañas + subpestañas anidadas; la carga de datos se
  mueve a un hook `useAdminData` para no repetir consultas ni recargar todo tras cada acción.
- Se fusionan `AdminUserManagement` y `AdminAuthUsersManagement` en un solo
  `AdminUsersTable` (se elimina la duplicación de la consulta a perfiles).
- Nuevo `AdminSectionToolbar` (buscador + filtros + contador) reutilizado por usuarios,
  companions y pagos.
- Nuevo `AdminOverview` con métricas y lista de pendientes.
- `AdminCompanionManagement`, `AdminPaymentProofs`, `AdminMercadoPagoTransactions`,
  `AdminAnnouncements` y `AdminDonationSettings` se conservan; se les aplica la nueva
  presentación (tabla shadcn, toolbar, estados vacíos).
- Sin cambios de base de datos ni de reglas de negocio.
