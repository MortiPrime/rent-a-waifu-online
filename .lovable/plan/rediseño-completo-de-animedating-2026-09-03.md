# Rediseño completo de AnimeDating

Mantenemos la identidad "rosa noche" pero la volvemos más editorial y elegante, con layout tipo bento en toda la plataforma.

## Dirección visual (fija en todas las páginas)

- Paleta: fondo `#160B22`, superficie `#2A1140`, acento rosa `#E8407F`, acento oro `#F5C36B`.
- Tipografía: títulos en Instrument Serif (editorial, con cursiva para las palabras destacadas), textos en Work Sans.
- Layout bento: cuadrículas de piezas de distinto tamaño, esquinas suaves, bordes finos luminosos, tarjetas de vidrio con brillo rosa sutil.
- Movimiento contenido: aparición escalonada, hover con elevación leve y realce del borde. Nada estridente.

## Páginas

**Inicio**
- Hero editorial: título en serif grande a la izquierda, tarjeta de "companion destacada" a la derecha.
- Bento de valor: piezas de distinto tamaño para servicios (chat, videollamada), seguridad, gratuidad actual y CTA.
- Bloque "Cómo funciona" en tres pasos compactos y CTA final ancho.

**Catálogo**
- Cabecera editorial + barra de filtros compacta con chips de filtros activos.
- Grilla bento: la primera companion destacada ocupa el doble de ancho, el resto en tarjetas uniformes.
- Tarjetas con foto en relación fija, degradado legible, badges de plan/verificación y favorito.
- Estados de carga y vacío consistentes.

**Perfil de companion (modal)**
- Galería a la izquierda, información en bloques bento a la derecha (descripción, reglas y precios, disponibilidad, reseñas, contacto).
- Contacto sólo visible con sesión iniciada, con botones de acción destacados.

**Mi perfil**
- Bento con tarjeta de identidad, estado de cuenta, favoritos y accesos rápidos (ser companion, comprobantes).

**Suscripción y Donaciones**
- Suscripción: planes en bento con el plan actual resaltado y mensaje de acceso gratuito.
- Donaciones: tarjeta principal con CLABE y botón copiar, más piezas de agradecimiento y métodos alternativos.

**Auth**
- Pantalla dividida: panel editorial con la marca a un lado, formulario limpio al otro.

**Admin**
- Se mantiene la estructura de pestañas actual; sólo se adapta a la nueva tipografía y tokens (resumen en bento, tablas con el nuevo estilo).

## Detalle técnico

- `src/index.css` y `tailwind.config.ts`: actualizar los tokens HSL a la nueva paleta, añadir las fuentes (Instrument Serif / Work Sans vía Google Fonts) y clases utilitarias `bento-tile`, `surface-card`, `brand-button`, `field-dark`.
- Nuevo componente `src/components/layout/BentoGrid.tsx` (contenedor + `BentoTile` con tamaños `sm | md | lg`) reutilizado por Inicio, Catálogo, Perfil, Suscripción y Donaciones.
- `SectionHeading` pasa a serif con destacado en cursiva.
- Se reescriben las capas de presentación de `Index.tsx`, `Catalog.tsx`, `CompanionCard.tsx`, `CatalogFilters.tsx`, `CompanionProfileModal.tsx`, `Profile.tsx` (+ componentes de `profile/`), `Subscription.tsx`, `Donations.tsx`, `Auth.tsx`, `Navbar.tsx`, `Footer.tsx`, `NotFound.tsx` y los componentes de admin.
- Sin cambios de base de datos, consultas, permisos ni reglas de negocio: sólo diseño y estructura visual.
- Verificación con navegador en escritorio y móvil para inicio, catálogo, perfil, donaciones y admin.
