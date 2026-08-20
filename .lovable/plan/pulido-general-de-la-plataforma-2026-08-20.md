# Pulido general de la plataforma

Mantenemos la identidad actual (rosa/púrpura oscuro con tarjetas de vidrio) y la hacemos consistente en toda la app, con mejoras en catálogo, perfiles de companions y panel de administración.

---

## 1. Diseño visual general

- Consolidar la paleta actual en tokens semánticos (fondo, superficie de vidrio, acento rosa, acento oro para donaciones) en lugar de repetir `bg-white/10`, `text-white`, etc. en cada componente.
- Componente reutilizable de fondo de página (gradiente + halos difusos) para que Catálogo, Inicio, Perfil, Suscripción, Donaciones y Admin luzcan iguales.
- Encabezados de sección unificados (título, subtítulo, espaciado) y estilo consistente de tarjetas, badges y botones.
- Navbar: estado activo del enlace actual, mejor contraste al hacer scroll.

## 2. Catálogo y descubrimiento

- Tarjetas rediseñadas: foto con relación fija, gradiente inferior legible, badges de plan/verificación bien jerarquizados y corazón de favorito visible.
- Barra de filtros compacta y ordenada: búsqueda, estado, edad, plan y orden en una sola fila colapsable en móvil, con chips de filtros activos y botón "Limpiar".
- Estado vacío con ilustración y sugerencia de quitar filtros; skeletons ya existentes aplicados de forma consistente.
- Aparición escalonada de tarjetas y "Cargar más" para listados largos.

## 3. Perfiles de companions

- Modal de perfil reorganizado: galería a la izquierda, datos y contacto a la derecha en escritorio; apilado y con scroll correcto en móvil.
- Bloques claros de: descripción, reglas y precios, disponibilidad, reseñas y contacto (contacto sólo para sesión iniciada).
- Botones de acción fijos (favorito, contactar) y navegación por teclado en la galería.
- Panel del companion: contador de fotos, guía rápida de "perfil completo" con pasos pendientes.

## 4. Panel de administración

- Cabecera con tarjetas de métricas más legibles (usuarios, companions activas, pendientes, anuncios activos).
- Reorganizar las secciones en pestañas (Usuarios, Cuentas de acceso, Companions, Pagos, Anuncios) en vez de una página larga.
- Tablas con búsqueda, filtro por estado y estados de carga/vacío consistentes.

---

## Detalle técnico

- Tokens y gradientes nuevos en `src/index.css` y `tailwind.config.ts`; los componentes dejan de usar utilidades de color crudas donde se toquen.
- Nuevos componentes: `PageShell` (fondo + contenedor), `SectionHeading`, `CatalogFilters`, `EmptyState`.
- `src/pages/Catalog.tsx` se reduce extrayendo la barra de filtros y la grilla a componentes; la lógica de datos de `useCompanionListings` no cambia.
- `src/components/CompanionProfileModal.tsx` se reestructura en dos columnas con subcomponentes de galería e información.
- `src/pages/AdminPanel.tsx` pasa a usar `Tabs` de shadcn; los componentes admin existentes se reutilizan tal cual, sólo se ajusta su presentación.
- Sin cambios de base de datos ni de reglas de negocio.
