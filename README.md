# North Wine · Stock Manager (DEMO)

Demo interna frontend-only para la reunión con North Wine. No hay backend: todos
los datos son mock, realistas pero genéricos, y persisten en `localStorage` del
navegador.

## Cómo correr

```bash
npm install
npm run dev
```

Abrí `http://localhost:5173`.

Otros scripts:

```bash
npm run lint        # ESLint
npm run typecheck   # tsc --build (sin emitir)
npm run build       # build de producción (tsc -b && vite build)
npm run preview     # sirve el build de producción
npm run sync:tokens # copia ../brand/tokens.css si senior-uiux-design ya lo publicó
```

## Credenciales demo

- Usuario: `admin`
- Contraseña: `admin123`

Definidas en `src/auth/demoCredentials.ts` (marcado `DEMO-ONLY`, no usar en
producción). La sesión vive en `sessionStorage`.

## Datos demo

Todo el catálogo (sucursales, barriles, vinos/añejados, proveedores, órdenes y
movimientos) se genera en `src/data/seed/` y se graba en `localStorage` la
primera vez que se abre la app. Desde **Ajustes → Restablecer datos demo** se
puede descartar cualquier cambio hecho durante una presentación y volver al
set original.

## Diseño / tokens

Los estilos consumen exclusivamente variables CSS definidas en
`src/styles/tokens.css`. Ese archivo es un placeholder (paleta vino oscuro /
neutro) hasta que `senior-uiux-design` publique `../brand/tokens.css`; en ese
momento corré `npm run sync:tokens` para traerlo. No hay colores, espaciados ni
tipografías hardcodeados fuera de ese archivo.

## Estructura

- `src/auth/` — credenciales demo, contexto de sesión, guard de rutas.
- `src/context/` — sucursal activa (branch) y su guard de rutas.
- `src/data/` — tipos de dominio, seed y repositorios sobre `localStorage`
  (intercambiables por una API real sin tocar las páginas).
- `src/components/` — atoms → molecules → organisms → layout, siguiendo Atomic
  Design.
- `src/pages/` — una carpeta por vista (dashboard, barriles, vinos, órdenes,
  movimientos, ajustes, login, selección de sucursal).

## Notas para la demo

- Frontend-only a propósito: sin animaciones cinematográficas, solo
  microtransiciones de UI (hover, focus, progreso de llenado).
- Todos los datos filtran por la sucursal activa (se elige tras el login y se
  puede cambiar desde el header).
