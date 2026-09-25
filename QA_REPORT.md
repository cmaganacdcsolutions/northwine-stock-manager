# QA Report — North Wine Stock Manager (demo)

**Fecha:** 2026-09-25
**QA:** senior-qa (agente) — Carlos Magaña (CDC Software Solutions)
**Build probado:** `npm run build && npm run preview` (producción), Node 20.17.0, Chromium (Playwright 1.63)
**Alcance:** primera pasada de QA automatizado + exploratorio sobre el demo frontend-only (sin backend, datos mock en `localStorage`). Nadie había visto la app renderizada antes de esta sesión.

## Veredicto

## **PASS (sin P0) — apto para demo mañana, con 2 fixes de P1 recomendados antes de la reunión si hay 15–20 minutos disponibles.**

No se encontró ningún bug que bloquee o rompa el flujo principal de la demo (login → selección de
sucursal → Dashboard → Barriles → Vinos y añejados → Órdenes → Movimientos → Ajustes → logout).
Se encontraron **2 P1** (uno de layout real a 390px, uno de dato de demo faltante) y **2 P2**
(a11y menor, drift de terminología spec-vs-código). Ninguno impide presentar mañana; el de
overflow a 390px solo importa si el CEO va a ver la app en un teléfono/tablet angosto en vivo.

---

## Cómo correr la suite

```bash
npm run test:e2e           # build + preview + Playwright, ambos proyectos (desktop 1440x900, mobile 390x844)
npx playwright show-report # abre el HTML report de la última corrida
```

- Config: `playwright.config.ts` — `webServer` hace `npm run build && npm run preview -- --port 4173 --strictPort`
  (se prueba el **build de producción real**, no el dev server).
- Proyecto **desktop** (1440x900): corre toda la suite funcional + a11y + responsive + screenshots.
- Proyecto **mobile** (390x844): corre **solo** `screenshots.spec.ts` (ver nota de diseño abajo).
- Reportes generados por corrida: `playwright-report/index.html`, `test-results/results.json`,
  screenshots en `tests/e2e/__screenshots__/{desktop,mobile}/`. Todo está en `.gitignore`
  (`tests/e2e/__screenshots__`, `test-results`, `playwright-report`, `blob-report`) — no se subirá al repo.
- **No se modificó nada en `src/`** — solo se agregaron `playwright.config.ts`, `tests/e2e/**`, el script
  `test:e2e` en `package.json`, y las entradas de `.gitignore`.

### Resultado de la última corrida limpia

```
35 passed
1 failed  — [desktop] responsive.spec.ts › sin overflow horizontal en /vinos   (bug real, ver P1-1)
```

Cobertura por archivo: `auth.spec.ts` (7), `branch.spec.ts` (2), `dashboard.spec.ts` (1),
`barrels.spec.ts` (4), `wines.spec.ts` (3), `orders.spec.ts` (4), `movements.spec.ts` (1),
`settings.spec.ts` (1), `responsive.spec.ts` (7), `a11y.spec.ts` (4), `screenshots.spec.ts` (2,
uno por proyecto). Cero flakiness observada tras estabilizar los selectores (ver nota de
mantenimiento al final).

### Accesibilidad (axe-core, `@axe-core/playwright`)

4 pantallas auditadas con `withTags(['wcag2a', 'wcag2aa'])`: **Login, Selección de sucursal,
Dashboard, Barriles (con modal "Nuevo barril" abierto)**.

**0 violaciones serious/critical** en las 4 pantallas. Buen trabajo de `fe-senior-react` en
labels visibles, `aria-invalid`, `role="alert"` en errores, foco visible, tap targets ≥44px y
`aria-label` en iconos/botones — se nota que se siguió el spec al pie de la letra en esto.

---

## P0 — Bloquea la demo

**Ninguno.**

---

## P1 — Importante, arreglar si hay tiempo antes de mañana

### P1-1 — Overflow horizontal real en "Vinos y añejados" a 390px (scroll de página completa)

- **Repro:**
  1. Viewport 390×844 (o un teléfono/tablet angosto real).
  2. Login → seleccionar sucursal → ir a **Vinos y añejados**.
  3. Deslizar/hacer scroll horizontal en cualquier parte de la pantalla (no solo dentro de la
     tabla) — o programáticamente `window.scrollTo(1000, 0)`.
- **Esperado:** la página no debe desplazarse horizontalmente; solo la tabla y el segmented
  control deberían scrollear internamente (`overflow-x: auto` ya está puesto en ambos).
- **Actual:** confirmado con instrumentación (`window.scrollX` pasa de `0` a `221` tras el
  intento de scroll) — la página **completa** se desplaza ~221px a la derecha, revelando el
  fondo/margen vacío y desalineando el sidebar/contenido. `document.documentElement.scrollWidth`
  (611px) excede `clientWidth` (390px) aunque `document.body.scrollWidth` reporta 390px — el
  contenedor `.tableWrap`/`.wrap` internos SÍ están bien recortados individualmente
  (`clientWidth` ≈ 356–358px), pero algo aguas arriba permite que el documento entero scrollee.
  Es el único de los 6 flujos con tabla/segmented-control que falla (`Barriles`, `Dashboard`,
  `Órdenes`, `Movimientos`, `Ajustes` pasan la misma prueba de overflow a 390px).
- **Evidencia:** `tests/e2e/__screenshots__/_bug-evidence/P1-vinos-overflow-390.png` (captura del
  assert fallido — sidebar y tabla desalineados, franja de fondo visible a la derecha). Test
  automatizado: `tests/e2e/responsive.spec.ts:32` ("sin overflow horizontal en /vinos") — falla
  determinísticamente, no es flake.
- **Archivo sospechoso:** `src/pages/WinesPage/WinesPage.module.css` (`.tableWrap`) y
  `src/components/molecules/SegmentedControl/SegmentedControl.module.css` (`.wrap`) — ambos
  tienen `overflow-x: auto` correcto, pero es la **única** pantalla con dos contenedores
  horizontal-scroll apilados (segmented control + tabla ancha de 7 columnas). Sugerencia de
  fix rápido y defensivo, sin tocar la lógica: agregar `overflow-x: hidden` a `html, body` en
  `src/styles/global.css` como red de seguridad, y confirmar que `.tableWrap`/`.wrap` tengan un
  ancho explícito (`width: 100%`, no solo `max-width`) dentro de su contenedor padre.
- **Handoff sugerido:** `fe-senior-react`.

### P1-2 — El dataset demo no tiene ninguna orden "Retrasada" — el estado no es demoable tal cual

- **Repro:** Login → **Órdenes a proveedor**. Todas las órdenes con estado `en_transito`/`enviada`
  en `src/data/seed/orders.ts` tienen `etaDate` en el **futuro** (`isoOffset(3)`, `isoOffset(1)`,
  `isoOffset(6)`, `isoOffset(9)`, `isoOffset(14)`). Ninguna tiene ETA vencida.
- **Esperado:** STOCK_MANAGER_SPEC.md §6 pide explícitamente poder mostrar "orden retrasada (ETA
  vencida sin marcar recibido) → Badge `--nw-danger` + texto 'Retrasada' + ícono reloj" — y la
  tarea de QA de hoy lo pide como flujo a verificar en la demo.
- **Actual:** el badge "Retrasada" y su lógica **funcionan perfectamente** cuando existe el dato
  (lo verifiqué inyectando una orden vencida vía `localStorage` en
  `tests/e2e/orders.spec.ts:18` — badge, texto "Vencida hace N días" y color danger, todo
  correcto) — pero **con el seed de fábrica, ese estado nunca aparece en pantalla**. Si el CEO
  pregunta "¿y si se atrasa un pedido?", no hay nada que mostrarle sin editar datos a mano.
- **Evidencia:** `tests/e2e/orders.spec.ts` test "una orden con ETA vencida sin recibir muestra
  badge 'Retrasada'" (pasa, pero solo tras inyectar el dato manualmente).
- **Archivo sospechoso:** `src/data/seed/orders.ts` — cambiar el `etaDate` de una de las órdenes
  `en_transito`/`enviada` existentes a un offset negativo (ej. `isoOffset(-2)`) es un fix de una
  línea.
- **Handoff sugerido:** `senior-be` o quien mantenga `src/data/seed/*` (no hay backend, pero es
  ese el dueño de los datos mock).

---

## P2 — Menor, no bloquea, dejar como backlog

### P2-1 — "Marcar como recibida" no pide confirmación (contradice el spec)

- STOCK_MANAGER_SPEC.md §6: *"CTA... 'Marcar como recibido' (dispara actualización de stock —
  confirmar con modal antes de ejecutar, no acción destructiva silenciosa)"*.
- **Actual:** `src/components/organisms/OrderCard/OrderCard.tsx` conecta el botón directamente a
  `onMarkReceived` sin modal; `src/pages/OrdersPage/OrdersPage.tsx:handleMarkReceived` marca la
  orden como recibida y, si el proveedor es de categoría `barricas`, **crea barriles nuevos
  automáticamente** — todo en un solo click, sin poder deshacerlo salvo
  Ajustes → Restablecer datos demo.
- **Riesgo para mañana:** un click accidental durante la demo en vivo muta el dataset frente al
  CEO (aparecen barriles nuevos "Sin asignar" en Barriles) sin aviso previo. No rompe nada, pero
  puede generar una pregunta incómoda en vivo.
- **Archivo sospechoso:** `src/components/organisms/OrderCard/OrderCard.tsx` (botón "Marcar como
  recibida"), `src/pages/OrdersPage/OrdersPage.tsx` (`handleMarkReceived`).
- **Handoff sugerido:** `fe-senior-react`. Sugerencia: reusar el mismo patrón de
  `confirmBox`/`role="alertdialog"` que ya existe en `src/pages/SettingsPage/SettingsPage.tsx`.

### P2-2 — Landmark del sidebar expone `role="complementary"` en vez de `role="navigation"`

- `src/components/layout/Sidebar/Sidebar.tsx:31` usa
  `<aside aria-label="Navegación principal">` envolviendo un `<nav>` sin nombre accesible. Un
  `<aside>` se expone como landmark **"complementary"**, no **"navigation"** — un usuario de
  lector de pantalla que salta por landmarks con la tecla de navegación rápida "navigation" no
  encuentra el menú principal así (tuve que ajustar mi propio test de `getByRole('navigation', …)`
  a `getByRole('complementary', …)` para que pasara).
- **No bloquea nada** (todo sigue siendo operable por teclado/lector con foco secuencial), es una
  mejora de semántica de landmarks.
- **Fix sugerido:** mover `aria-label="Navegación principal"` del `<aside>` al `<nav>` interno (o
  envolver el contenido en `<nav aria-label="Navegación principal">` como elemento raíz del
  sidebar en vez de `<aside>`).
- **Handoff sugerido:** `fe-senior-react` (bajo, no urgente).

### P2-3 — Terminología del spec vs. implementación no coincide ("En crianza" vs. "Añejando")

- STOCK_MANAGER_SPEC.md §4 describe el estado de barril como **"En crianza"**; la implementación
  (`src/pages/BarrelsPage/barrelLabels.ts`) usa **"Añejando"**. Funcionalmente equivalente, cero
  impacto técnico — lo marco solo porque si alguien va a narrar la demo leyendo el spec, el texto
  en pantalla no va a coincidir palabra por palabra.
- **Handoff sugerido:** ninguno urgente; alinear spec o copy si hay tiempo.

---

## Nota — no se filtra como bug (posible flake de entorno, no reproducido)

Durante la sesión de testing capturé una vez una screenshot desktop de Login que salió
completamente sólida en un tono vino oscuro (sin el card visible). Investigué a fondo: los
estilos computados (`data-theme="light"`, `--nw-bg: #FAF7F3`, `background-color` del body
correcto) están bien, y **3 repeticiones limpias consecutivas** del mismo flujo renderizaron el
login correctamente (card centrada, tema claro, fondo con el degradé de marca sutil — ver
`tests/e2e/__screenshots__/desktop/01-login.png`). Lo atribuyo a contención de recursos en la
máquina de pruebas (llegué a tener >10 procesos `node`/preview-server huérfanos corriendo en
paralelo durante el debugging de otro bug). **Sugerencia:** que alguien abra el build de
producción una vez a mano antes de la demo, por las dudas — no encontré causa raíz en el código.

---

## Revisión visual (screenshots desktop 1440x900 + mobile 390x844)

Capturas completas en `tests/e2e/__screenshots__/{desktop,mobile}/01..08-*.png` (8 pantallas ×
2 viewports = 16 imágenes, más el modal de "Nuevo barril"). Revisadas selectivamente:

- **Login, Selección de sucursal, Dashboard, Ajustes** (desktop y mobile): layout correcto, sin
  texto cortado, sin overflow, buen contraste, KPIs y gráfico de recharts renderizan (barras
  Tinto/Blanco/Rosado visibles con sus colores de marca), alertas con ícono+texto como pide el
  spec.
- **Barriles, Vinos y añejados, Órdenes** (desktop): cards/tabla legibles, badges de estado con
  ícono+texto (no solo color), progress bar de llenado correcta.
- **Mobile (390px):** el sidebar off-canvas funciona (colapsa por default, abre con el botón
  hamburguesa, cierra con el botón X o al navegar) — confirmado en
  `responsive.spec.ts`. Las capturas mobile de `screenshots.spec.ts` muestran el sidebar
  ligeramente superpuesto al contenido en el frame exacto de la captura porque el script de
  automatización toma la foto en el mismo instante del click de navegación (antes de que termine
  la transición de 300ms de cierre) — **es un artefacto de timing del script de captura, no un
  bug de producto**; se confirmó por separado que la navegación y el cierre del sidebar funcionan
  bien en `responsive.spec.ts` (que sí espera correctamente).
- No se encontraron estados vacíos feos, texto cortado real (fuera del recorte de columnas por el
  bug P1-1), ni problemas de contraste a simple vista en ninguna pantalla.

---

## Diseño de la suite (para quien la mantenga)

- **`playwright.config.ts`:** dos proyectos. `desktop` (1440x900) corre toda la suite funcional +
  a11y + responsive + screenshots — el sidebar es fijo/visible en ese ancho (breakpoint en
  900px, `Sidebar.module.css`), que es lo que asumen todos los specs funcionales. `mobile`
  (390x844) corre **solo** `screenshots.spec.ts` con `testMatch`, porque a ese ancho el sidebar
  está off-canvas y los specs funcionales no manejan el burger menu — `responsive.spec.ts` ya
  cubre el comportamiento a 390px seteando su propio viewport con `test.use` dentro del describe,
  independiente del proyecto.
- **`tests/e2e/helpers.ts`:** `login()`/`loginAndSelectBranch()` + `trackPageHealth()` (captura
  `console.error`, `pageerror` y `requestfailed` para asserts de "sin errores de consola/requests
  fallidos" en cada spec).
- Selectores por `getByRole`/`getByLabel` con `{ exact: true }` donde el texto del label es
  substring de otro elemento (ej. "Contraseña" vs. el botón "Mostrar/Ocultar contraseña", que
  también contiene la palabra) — evita "strict mode violations" de Playwright.
- Ningún `test.only` quedó en el código; timeouts son los default de Playwright (30s por test,
  suficientes para este flujo); no se usó `page.waitForTimeout` salvo el necesario para el "brief
  loading beat" de 220ms al cambiar de sucursal (`BRANCH_SWITCH_DELAY_MS` en
  `AppLayout.tsx`), y ahí se usa `expect(...).toBeVisible()` con auto-wait, no un sleep ciego.

---

## Resumen ejecutivo

- **Trabajo realizado:** suite Playwright completa desde cero (11 archivos de spec, 34 tests +
  1 de screenshots ×2 proyectos), cubriendo los 8 flujos pedidos: login (válido/inválido/bloqueo
  tras 3 intentos), rutas protegidas, selección/cambio de sucursal, Dashboard (KPIs + gráfico +
  alertas), Barriles (filtros/crear/validar/editar), Vinos (tabs + ajuste de stock → Movimientos),
  Órdenes (en tránsito/retrasada/marcar recibida → stock), Movimientos (solo lectura), Ajustes
  (reset con confirmación), logout. Más: axe-core en 4 pantallas, chequeo de overflow horizontal
  en las 6 pantallas internas a 390px, navegación por teclado en login, y 16+1 screenshots
  full-page para revisión visual.
- **Bugs encontrados:** 0 P0, 2 P1 (overflow real en Vinos a 390px; sin dato demo "Retrasada"),
  2 P2 (falta confirmación en "Marcar recibida"; landmark de sidebar), 1 P2 cosmético (drift de
  copy spec-vs-código). Detalle completo arriba con repro, evidencia y archivo sospechoso.
- **Cobertura:** 100% de los flujos pedidos en el brief tienen al menos un test automatizado
  verde; 0 violaciones a11y serious/critical.
- **Archivos agregados** (ninguno en `src/`): `playwright.config.ts`,
  `tests/e2e/{helpers,auth,branch,dashboard,barrels,wines,orders,movements,settings,responsive,a11y,screenshots}.spec.ts`,
  `tests/e2e/__screenshots__/**` (gitignored), entradas nuevas en `.gitignore`, script `test:e2e`
  y devDependencies `@playwright/test`/`@axe-core/playwright` en `package.json`.

## HANDOFF

- **Veredicto: PASS (sin P0).** Se puede proceder con commit + push del repo según lo acordado.
- **P1 a considerar antes de mañana si hay tiempo** (ambos son fixes chicos, no de arquitectura):
  1. Overflow horizontal en `/vinos` a 390px — `WinesPage.module.css`/`SegmentedControl.module.css`
     (o defensivo: `overflow-x:hidden` en `html,body` de `global.css`). → `fe-senior-react`.
  2. Seed sin orden "Retrasada" demoable — una línea en `src/data/seed/orders.ts`
     (`etaDate: isoOffset(-2)` en alguna orden `en_transito`). → dueño de `src/data/seed/*`.
- **P2 backlog** (no bloquean nada): confirmación antes de "Marcar como recibida"
  (`OrderCard.tsx`/`OrdersPage.tsx`), landmark `role="navigation"` en el sidebar (`Sidebar.tsx`),
  alinear copy "Añejando"/"En crianza" con el spec.
- **UX/fidelidad:** Barriles y Órdenes se ven como grid de cards en desktop en vez del
  `DataTable` que describe el spec §4/§6 (cards también en mobile) — no es un bug, se ve bien y
  cumple los criterios de aceptación, pero si `senior-uiux-design`/`prototype-maker` quieren
  fidelidad estricta al spec, es un punto a revisar con ellos, no conmigo.
- **CI:** la suite y su config quedan listas para que `senior-devops` las cablee en Azure DevOps
  (`npm run test:e2e` ya es el entrypoint); no se tocó ningún pipeline en esta pasada.
