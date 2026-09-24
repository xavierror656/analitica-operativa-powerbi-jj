# Interfaz del curso

## Edición con poco contexto

- **Tecnologías:** Astro estático + Tailwind CSS 4 + daisyUI 5. No hace falta añadir React ni un runtime de componentes.
- **Tema y componentes daisyUI:** `src/styles/ui.css`. Solo se compilan los componentes incluidos en su configuración. No cargar estilos desde CDN.
- **Botón o enlace de acción:** `src/components/ui/Boton.astro`. Usar `href` para enlaces; sin `href` emite un botón. `variante="principal"`, `"normal"` (predeterminada) o `"discreto"`. Admite atributos HTML, `data-*`, `download`, `disabled` y contenido por slot.
- **Navegación del curso:** `NavegacionCurso.astro`; enlaces en una sola lista, con página actual indicada.
- **Recursos de las 21 guías:** `RecursosGuia.astro`, con `dia` y `actividad` opcional; centraliza enlaces, descargas e impresión.
- **Estado de prácticas:** `EstadoPractica.astro`; persistencia en `src/lib/curso-personal.mjs`.
- **Colores de los cinco días:** `src/data/identidad-dias.json`; conservar los pictogramas y etiquetas además del color.
- **Presentaciones:** `RevealDeck.astro` y componentes `slides/`; composiciones en `presentaciones.css`. Mantener lienzo 1920×1080, notas, temporizadores y logos.
- **Contenido:** `src/content/` y `src/data/`; evitar duplicar el contenido en componentes de interfaz.

Ejemplo:

```astro
---
import Boton from '../components/ui/Boton.astro';
---
<Boton href="/practicas/" variante="principal">Abrir prácticas</Boton>
```

Reutilizar estos puntos de entrada reduce código y contexto que hay que leer o generar para cada cambio. No se promete un porcentaje de ahorro de tokens: depende de la tarea y del modelo.

## Verificación

`npm run build`, `node scripts/verificar_sitio.mjs`, `node --test tests/*.test.mjs` y `npm run test:browser`. Playwright comprueba persistencia, búsqueda, exportaciones, teclado, contraste y geometría en tres tamaños. Revisar también capturas de las páginas y de una presentación; los controles automáticos no sustituyen esa revisión.

Documentación oficial: [daisyUI para Astro](https://daisyui.com/docs/install/astro/), [configuración](https://daisyui.com/docs/config/) y [temas](https://daisyui.com/docs/themes/).
