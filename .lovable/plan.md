

# Mejoras Generales para la Plataforma

Tras analizar todo el código, estas son las mejoras mas impactantes que se pueden implementar:

---

## 1. Sistema de Favoritos
- Tabla `user_favorites` con RLS
- Botón de corazón funcional en cada card del catálogo (actualmente es decorativo)
- Sección "Mis Favoritas" en el perfil del cliente

## 2. Filtros Avanzados en el Catálogo
- Filtro por rango de edad (slider)
- Filtro por tipo de plan (Básico/Premium/VIP)
- Búsqueda por nombre de companion
- Ordenar por: más recientes, mejor valoradas

## 3. Skeleton Loaders y UX
- Reemplazar el spinner genérico del catálogo con skeleton cards
- Animaciones de entrada para las cards (staggered fade-in)
- Paginación o infinite scroll para muchos listings

## 4. Footer
- No existe footer en ninguna página
- Agregar footer con links: Términos, Privacidad, Contacto, Redes Sociales

## 5. Página 404 Mejorada
- Revisar y mejorar la página NotFound con navegación de regreso

## 6. Límite de Fotos con Contador Visual
- Limitar a 10 fotos por companion
- Mostrar contador "3/10 fotos" en el manager

## 7. Responsive y Mobile
- El menú móvil no incluye el link de "Donar"
- Revisar que el modal de perfil se vea bien en móvil

## 8. SEO y Meta Tags
- Agregar meta tags dinámicos (title, description, og:image)
- Mejorar el `index.html` con información relevante

---

## Orden de Implementación Sugerido

| Prioridad | Mejora | Impacto |
|-----------|--------|---------|
| 1 | Sistema de Favoritos | Alto - funcionalidad core |
| 2 | Filtros Avanzados | Alto - mejora descubrimiento |
| 3 | Skeleton Loaders | Medio - mejor percepción de velocidad |
| 4 | Footer | Medio - profesionalismo |
| 5 | Límite de Fotos | Medio - control de contenido |
| 6 | Mobile fixes | Medio - accesibilidad |
| 7 | SEO/Meta tags | Bajo-medio - visibilidad |
| 8 | 404 mejorada | Bajo |

---

## Detalle Técnico

- **Favoritos**: Nueva tabla con FK a `auth.users` (via profiles) y `companion_listings`. Hook `useFavorites` con toggle y lista. RLS para que cada usuario solo vea/modifique sus propios favoritos.
- **Filtros**: Extender `useCompanionListings` con parámetros adicionales de query. UI con Slider de shadcn para edad y chips para plan.
- **Skeletons**: Usar el componente `Skeleton` ya existente en `src/components/ui/skeleton.tsx` para crear `CatalogCardSkeleton`.
- **Footer**: Componente reutilizable `Footer.tsx` agregado en las páginas principales.

