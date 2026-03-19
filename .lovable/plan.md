

# Mejoras Sugeridas para Rent-a-Waifu

Basado en el análisis del código actual, estas son las mejoras más impactantes organizadas por prioridad:

---

## 1. Sistema de Favoritos / "Me Gusta"
Permitir que los clientes marquen companions como favoritas y las vean en una sección dedicada.

- Nueva tabla `user_favorites` (user_id, companion_id, created_at)
- Botón de corazón en las cards del catálogo
- Sección "Mis Favoritas" en el perfil del cliente

## 2. Búsqueda Mejorada y Filtros Avanzados
El catálogo actual solo filtra por estado, municipio y teléfono.

- Agregar filtros por rango de edad, plan (básico/premium/VIP) y rango de precio
- Barra de búsqueda por nombre
- Ordenar por: más recientes, mejor valoradas, precio

## 3. Sistema de Valoraciones y Reseñas
Permitir que clientes califiquen y dejen reseñas después de una sesión.

- Nueva tabla `reviews` (client_id, companion_id, rating, comment)
- Mostrar rating promedio en las cards del catálogo
- Sección de reseñas en el modal de perfil

## 4. Notificaciones en Tiempo Real
Usar Realtime para notificar a companions cuando reciben mensajes o nuevos clientes.

- Canal de notificaciones por usuario
- Badge con contador en el navbar
- Toast notifications para eventos importantes

## 5. Mejoras de UX/UI
- **Skeleton loaders** en el catálogo mientras cargan los datos
- **Paginación o scroll infinito** para manejar muchos listings
- **Modo oscuro/claro** toggle
- **Animaciones de transición** entre páginas
- **Límite de fotos** por companion con contador visual (ej. 3/10)

## 6. Seguridad y Verificación
- **Verificación de identidad** para companions (subir documento)
- **Reportar perfil** — botón para que clientes reporten contenido inapropiado
- **Bloqueo de usuarios** entre companions y clientes

---

## Implementación Recomendada
Sugiero empezar por el **Sistema de Favoritos** ya que es el de mayor impacto con menor complejidad, seguido de **Filtros Avanzados** para mejorar la experiencia de búsqueda.

