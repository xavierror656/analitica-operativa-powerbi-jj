# Analítica Operativa con Power BI

Programa de capacitación para Johnson & Johnson (Ciudad Juárez), impartido por Skilling
Center Tecmilenio. 5 días, 37.5 horas, cinco evidencias acumulativas (A1 a A5).
Instructor: Javier A. Flores Flores.

Las guías y las diapositivas muestran los ejemplos de código con encabezado de lenguaje y botón **Copiar código**. Las fórmulas M y DAX usan resaltado de sintaxis; Python permanece en el día 5. La copia conserva el texto y sus saltos de línea. Si el portapapeles está bloqueado, se selecciona el bloque para copiarlo con Ctrl+C. Los controles se ocultan al exportar a PDF. `Codigo.astro` permite incorporar nuevos ejemplos y los bloques Markdown reciben los mismos controles.

Este repo tiene tres partes:

```
src/, public/, astro.config.mjs, package.json   ← slides (Astro + Reveal.js + Tailwind v4)
datos/                                          ← generador del dataset sintético de planta
dia-0X-.../, diagnostico/                       ← guías de contenido y evaluación diagnóstica
pbix/                                           ← archivos .pbix que se arman en clase, día por día
```

El origen de todo el contenido es la propuesta didáctica del programa (PDF entregado a
J&J): duración, horario, contenido día por día, competencias, evaluación diagnóstica y
conjuntos de datos. Ante cualquier duda de contenido, esa propuesta manda.

---

## Arrancar las slides

La interfaz usa Astro, Tailwind CSS 4 y daisyUI 5. La [guía breve de interfaz](docs/ui.md) indica dónde cambiar botones, navegación, recursos y colores sin repetir código.

La portada ofrece **Continuar mi curso** después de abrir una presentación. Las
16 prácticas permiten marcar pendiente, en proceso o terminada desde catálogo y
guía. Ambos avances se guardan en el navegador; no se sincronizan entre equipos.

**Buscar** consulta las cinco guías y las 16 prácticas, permite filtrar por día e
ignora diferencias de acentos y mayúsculas. **Mis entregas** contiene los requisitos
A1–A5 y exporta un registro Markdown de autoevaluación con marcas y notas; no envía
archivos ni sustituye la evaluación del instructor. Si el navegador bloquea el
guardado, la interfaz avisa y permite continuar en la página.

**Modelos de referencia** muestra disponibilidad por día. Los PBIX están pendientes
de incorporación y revisión en Desktop; el procedimiento está en `pbix/README.md`.

Pruebas en navegador (tras instalar dependencias y compilar):

```bash
npx playwright install chromium
npm run build
npm run test:browser
```

Se verifican reanudación, estados, búsqueda, descarga de autoevaluaciones, teclado,
accesibilidad automática y desbordamiento en móvil, laptop y proyector. Las capturas
y trazas se guardan en `test-results/`; el informe está en `playwright-report/`.
Para Chrome ya instalado puede usarse `PLAYWRIGHT_CHANNEL=chrome` (variable de
entorno). Las pruebas no sustituyen una revisión con lector de pantalla o proyector
físico. Configuración basada en la [guía de accesibilidad de Playwright](https://playwright.dev/docs/accessibility-testing).

```bash
npm install
npm run dev      # http://localhost:4321
```

`npm run build` genera `dist/` estático.

Producción: **https://powerbi.floresjavier.com/** (GitHub Pages con dominio propio).
`astro.config.mjs` usa `base: '/'`; no anteponer el nombre del repositorio a las
rutas. `public/CNAME` conserva el dominio en la salida. Después del build, ejecutar
`node scripts/verificar_sitio.mjs` para comprobar los enlaces y recursos de todas
las páginas. Esta comprobación también bloquea la publicación si reaparecen rutas
del antiguo subdirectorio de GitHub Pages.

**En clase:** `→` avanza · `S` abre las notas del facilitador en otra ventana ·
`F` pantalla completa · `Esc` vista general de todas las slides.

La portada agrupa presentación, guía y prácticas por día. Portada, catálogo y las
21 guías usan `CursoLayout.astro` y `src/styles/curso.css`. Las diapositivas tienen
una barra de recursos que mantiene la guía en otra pestaña y permite proyectar
sin navegación superpuesta. Se conserva el lienzo 1920 × 1080 para laptop y proyector.

**PDF:** abre «Exportar PDF» en la barra de una presentación y, al terminar la
preparación, pulsa «Guardar como PDF». En el diálogo del navegador selecciona
Guardar como PDF, horizontal, márgenes ninguno y gráficos de fondo. La vista usa
la [exportación nativa de Reveal](https://revealjs.com/pdf-export/), espera las fuentes,
incluye los fragmentos juntos y excluye notas del instructor y barras de navegación.
La pestaña de presentación queda abierta y su avance no cambia al exportar.

**Continuar la clase:** cada presentación guarda su última diapositiva en
`localStorage` de este navegador. Al abrirla sin un hash explícito retoma esa
posición; un enlace `#/…` tiene prioridad. «Volver al inicio» guarda la portada
como nueva posición. No se sincroniza entre equipos ni guarda respuestas o
cronómetros. Si el almacenamiento está bloqueado, la presentación sigue funcionando
y avisa en la barra.

Las fichas `src/data/practicas-aula.json` definen qué abrir, construir, comprobar y
entregar en cada actividad; alimentan catálogo, diapositivas, guía y consignas del
ZIP. Tras cambiarlas, ejecutar `scripts/preparar_material_practicas.py` y después
`datos/scripts/generar_practicas.py`. No modificar `practicas-plan.json` para resumir
la interfaz: conserva la transcripción del plan de origen.

## Generar el dataset sintético

```bash
cd datos/scripts
python generar_dataset_sintetico.py
```

Produce en `datos/salida/` las 8 tablas de la Opción A del programa (`fact_producción`,
`fact_calidad`, `fact_mantenimiento` y sus dimensiones): 18 meses, 4 líneas, 3 turnos, con
los defectos de captura sembrados a propósito (nombres de línea inconsistentes, fechas en
tres formatos, horas en 12h/24h, ceros perdidos en lote, duplicados, filas de subtotal
embebidas, celdas vacías vs. ceros reales, códigos con espacios, turno capturado con
nombre de supervisor). Esos defectos son el material del Día 1: sin ellos, la actividad de
limpieza no tiene nada que resolver.

Los CSV no se versionan (`.gitignore`): se regeneran con el script. Para cambiar el
reparto (líneas, turnos, partes, meses de historia, tasas de rechazo/paro), edita las
constantes en `CONFIGURACIÓN` al inicio del script.

---

## ⚠️ El estilo es provisional, no viene de un PPTX

A diferencia de otros talleres, este programa **no tiene todavía un deck del que
muestrear colores**: la propuesta que existe es un documento de texto (PDF), no una
presentación. La paleta de `src/styles/global.css` es una aproximación al documento de
Skilling Center Tecmilenio (verde-teal oscuro de portada, acento turquesa, tablas en
gris claro), pensada para arrancar, **no una extracción verificada**.

| | |
|---|---|
| Fondo oscuro | `#0E3B36`. Superficies `#14504A`, `#1C645C` |
| Fondo claro | `#F4F7F6`. Superficies `#E7EFED`, `#DCE8E5` |
| Acento | `#14B8A6` · claro `#4FD1C5` · tenue `#9FE0D6` |
| Cálido (uso único, para lo crítico) | `#F5A623` |
| Títulos | Poppins Bold |
| Cuerpo | Inter |
| Código | Consolas / Courier New |
| Lienzo | 1920 × 1080 |

**Antes de tomar estos valores como definitivos:** pedir a Tecmilenio su guía de marca
(Skilling Center) y, si J&J exige su propia identidad en el material, confirmar con
ellos. Si aparece un PPTX oficial del programa más adelante, se resamplea igual que en
otros talleres del equipo: no a ojo.

---

## Cómo se arma una slide

Vocabulario adaptado del framework usado en otros talleres del equipo (mismo Astro +
Reveal.js + Tailwind), con los tipos de slide que este curso realmente necesita: es
capacitación técnica encadenada (fundamento → práctica guiada → práctica libre →
laboratorio → evidencia), no un pitch ni un bootcamp de IA, así que el set de tipos es
más chico.

| Componente | Cuándo | Fondo |
|---|---|---|
| `Gancho` | Abre un bloque. Afirmación fuerte + pregunta al grupo | Claro |
| `Contexto` | Una frase clave, grande, sin nada más | Claro |
| `Mecanismo` | Cómo funciona. Suele llevar `Pasos` o `Chips` | Claro |
| `EjemploReal` | Un caso concreto de planta. Puede llevar `Comparacion` | Claro |
| `TuTurno` | Actividad individual/guiada en Power BI. Lleva `minutos` | Oscuro |
| `Practica` | Trabajo en pareja o equipo. Lleva `consigna` y `pregunta` | Oscuro |
| `Transicion` | Puente entre bloques. Solo una frase, centrada | Oscuro |
| `Cierre` | Cierre del día: validación de cifras, revisión cruzada, registro de evidencia | Oscuro |

El fondo le dice al participante si está escuchando o trabajando, sin que nadie se lo
diga: mismo principio que otros talleres del equipo, aunque aquí no viene verificado
contra 147 slides, es una convención que se adopta de entrada.

### Piezas de contenido (`src/components/ui/`)

| Componente | Cuándo |
|---|---|
| `Pasos` | Secuencia numerada. Acepta `poco` para revelado uno por uno |
| `Chips` | Conceptos sin orden entre sí |
| `Comparacion` | Dos columnas: antes/después, archivo suelto/fuente confiable |
| `Cita` | Frase para leer en voz alta, o fórmula para copiar (`mono`) |
| `Nota` | Aviso operativo. `tono="alto"` para lo crítico |
| `Notas` | **Notas del facilitador**, van en todas las slides |
| `Acto` | Divisor de día: número + palabra + línea |
| `DiagramaFlujo` | Diagrama propio en SVG: cajas conectadas por flechas, para procesos donde el orden importa. No es una foto (no hay licencia de dónde sacarlas): se dibuja con los tokens de marca |
| `Cronometro` | Cronómetro real, no decorativo. Lo usan `TuTurno` y `Practica` automáticamente vía su prop `minutos` |
| `Quiz` | Chequeo rápido de comprensión: pregunta + opciones, feedback inmediato al hacer clic. No es examen ni queda registrado en ningún lado |
| `Descarga` | Liga de descarga de un archivo (no una página): usada para el dataset sintético y el Excel de mantenimiento |
| `Icono` | Envoltorio sobre `astro-icon` + Lucide (MIT). Un nombre corto (`<Icono nombre="download" />`) en vez de repetir `lucide:` en cada slide |

### Cronómetro de actividad

Cualquier `TuTurno` o `Practica` con `minutos` trae un cronómetro real arriba a la
derecha, no decorativo:

| | |
|---|---|
| **Empezar / pausar** | clic en el número, o tecla `T` |
| **Reiniciar** | doble clic, o tecla `R` |

**No arranca solo, a propósito**: el facilitador casi siempre explica un minuto antes de
decir "va". Cambia de color según el estado (gris listo, acento corriendo, cálido en el
último minuto, cálido parpadeando al llegar a cero; el parpadeo respeta
`prefers-reduced-motion`), y **se reinicia al cambiar de slide**, para que nunca quede
uno corriendo en silencio módulos después. `T`/`R` solo afectan al cronómetro de la
slide activa, y se ignoran si el foco está en un campo de texto.

### Íconos

`astro-icon` + `@iconify-json/lucide` (MIT, más de 1,500 íconos SVG, no fotos de
stock): `Icono.astro` es el envoltorio, `<Icono nombre="download" class="w-8 h-8" />`.
Antes de usar un nombre nuevo, verificar que existe en
[lucide.dev/icons](https://lucide.dev/icons) o correr

```bash
node -e "console.log(Object.keys(require('@iconify-json/lucide/icons.json').icons).includes('nombre-del-icono'))"
```

porque un nombre que no exista en el set no truena el build, simplemente no renderiza
nada, y eso no se nota hasta que alguien mira la slide.

`Nota`, `Quiz`, `Comparacion` (`iconoA`/`iconoB`, opcional), `Mecanismo`, `EjemploReal`,
`Cierre`, `TuTurno` y `Practica` (`icono`, opcional en los tres primeros; `TuTurno` y
`Practica` siempre llevan uno fijo) ya traen soporte de ícono integrado: no hace falta
tocar el componente, solo pasar el nombre.

### Quiz de chequeo rápido

`Quiz` existe porque la slide no tiene Power BI ni Excel real adentro: en vez de solo
describir un concepto, algunas slides lo verifican en el momento. Un clic en una opción
la marca correcta o incorrecta, muestra la explicación, y ya: sin backend, sin
resultado que se guarde en ningún lado, se reinicia solo si se vuelve a esa slide.
Ejemplo en uso: `src/components/dia-01/M8bChequeo.astro`, tomado del mismo criterio que
el reactivo 03 de la evaluación diagnóstica.

### Plantilla de un módulo

```astro
---
import Mecanismo from '../slides/Mecanismo.astro';
import Pasos from '../ui/Pasos.astro';
import Notas from '../ui/Notas.astro';
---

<Mecanismo modulo="D1-M2" titulo="Afirmación concreta, no un rótulo de tema">
  <Pasos items={[
    { t: 'Primero', d: 'Explicación corta' },
    { t: 'Después', d: 'Explicación corta' },
  ]} />
  <Notas slot="notas" minutos={8}
    dice="Qué se dice o se hace en vivo."
    pregunta="Pregunta al grupo, si aplica"
    nota="Lo que el facilitador no debe olvidar." />
</Mecanismo>
```

**Las `Notas` no son opcionales.** Sin ellas otra persona no puede impartir el taller
sabiendo qué decir, ni cuánto dura cada bloque.

### Un archivo por módulo, para trabajar sin pisarse

Igual que en otros talleres del equipo: `src/components/dia-01/M4ConectarFuentes.astro`
es un archivo, un módulo. `src/pages/dia-01.astro` solo importa y ordena. Si dos personas
tocan módulos distintos del mismo día, no hay conflicto de merge; si hay que tocar
`dia-01.astro`, avisarse antes.

---

## Estado

El plan desglosado `Plan_Practicas_PowerBI_Dias2-5.docx` ya tiene una entrada propia
en **`/practicas/`**: 16 presentaciones y 16 ZIP con registros crudos, consignas y
formularios. Utiliza el caso **Prácticas 2025–2026**, con exposición por equipo y
estándares para sostener OEE y MTBF. Cada día conserva cuatro bloques de 90 minutos;
estas prácticas sustituyen los bloques equivalentes, no amplían la jornada.
El caso anterior permanece como referencia y sus cifras no se mezclan con el nuevo.
Preparación, claves y ajustes técnicos en
[guía del instructor](material-instructor/practicas/README.md).

| Día | Slides | Estado |
|---|---|---|
| **Día 1: Conexión y preparación de datos** | 52 slides oficiales (portada + 51 módulos; 450 minutos planificados) + 5 extras, guía imprimible, bitácora A1, cronómetro y tres quiz | ✅ Contenido implementado; pendiente pilotaje en aula |
| **Día 2: Modelo de datos** | 39 slides (portada + 38 módulos; 450 minutos), 4 quiz, guía y bitácora A2, controles de relaciones y filtros | ✅ Implementado con base en la propuesta PDF; pendiente validación en Desktop y pilotaje |
| Día 3: Indicadores en DAX | 34 slides; 450 minutos; guía, controles y evidencia A3 | ✅ Implementado; pendiente pilotaje en Desktop y aula |
| Día 4: Reporte operativo | 34 slides; 450 minutos; guía, controles y evidencia A4 | ✅ Implementado; pendiente pilotaje en Desktop y aula |
| Día 5: Análisis, publicación y proyecto | 34 slides; 450 minutos; guía, controles y evidencia A5 | ✅ Implementado; pendiente pilotaje en Desktop y aula |

El contenido día por día completo (horarios, qué evalúa cada evidencia, la evaluación
diagnóstica con clave de respuestas) está en la propuesta didáctica original; cada
carpeta `dia-0X-.../README.md` resume su bloque como referencia rápida al escribir
slides.

La barra de recursos de las presentaciones se oculta tras 2.5 segundos sin uso.
Se recupera al acercar el puntero al borde superior o al llegar a sus enlaces con
Tab. Permanece visible mientras se usa con mouse o teclado y también funciona
en pantalla completa. Su aparición no redimensiona la diapositiva.

### Animaciones didácticas

Siete diapositivas usan el reproductor oficial de LottieFiles: D1-M3f y D1-M7,
D2-M37, D3-M02, D4-M32, D5-M04 y D5-M30. Los diagramas ocupan una columna lateral;
los pasos de las prácticas permanecen visibles. Cada animación se reproduce una
vez al entrar y tiene pausa/repetición. Fuera de la diapositiva activa se detiene.
PDF, impresión y movimiento reducido muestran un SVG del mismo recurso.

Los JSON, pósteres y créditos están en `public/animaciones/`; el motor y WASM
se compilan como recursos locales y solo se cargan cuando se necesita animación.
Procedencia y licencia: [animaciones](public/animaciones/README.md).
Regeneración: `node scripts/generar_animaciones.mjs` y después
`node scripts/renderizar_animaciones.mjs`. Verificación:
`node --test tests/lottie.test.mjs tests/interacciones.test.mjs`.

### Material y controles del Día 1

La presentación y la portada del sitio enlazan la guía `/dia-01/guia/`. Se puede
imprimir o descargar como Markdown; incluye conexión paso a paso, reglas de limpieza,
ejemplos M, solución de problemas y bitácora. Se mantiene en
`src/content/guia-dia-01.md`. Los 17 procedimientos de `src/data/dia-01-pasos.json`
alimentan la guía, la descarga Markdown y 15 diapositivas con pasos siempre visibles.
Cada diapositiva enlaza directamente a su procedimiento; las recetas de horas y
fechas amplían la guía. Consultar instrucciones y copiar fórmulas está permitido
también en la evaluación: se comprueba aplicación, resultado y explicación.
Los controles del instructor están en
`dia-01-conexion-preparacion/evidencia-A1/README.md`.

`python scripts/verificar_dia1.py` verifica el ZIP distribuido, la conciliación de
producción y calidad por lote y los minutos de cada bloque. `node --test
tests/interacciones.test.mjs` comprueba el reinicio de cuestionarios y el cronómetro
con tiempo real. La compilación no sustituye probar las consultas en Power BI Desktop
ni pilotear los tiempos con participantes.

### Material y controles del Día 2

Presentación `/dia-02/` y guía `/dia-02/guia/`, con descarga Markdown e impresión.
El contenido se basa en el PDF indicado por el instructor; la correspondencia de
secciones y páginas está en `dia-02-modelo-datos/fuente-y-alineacion.md`.

El Día 2 se imparte íntegramente en Power BI Desktop. Por indicación del instructor,
Python se reserva para el Día 5. Los controles de la guía cubren diez relaciones,
claves únicas y sin huérfanos y seis cortes de referencia derivados del ZIP tras A1.
La evidencia A2 incluye rúbrica fiel al PDF, variante reservada de nivel 3 y prueba
de auditoría para nivel 4. Se conserva el archivo A1 para continuar la secuencia.

Las comprobaciones internas del repositorio se documentan en `scripts/README.md`;
no son actividades del curso.

### Lo que falta portar de otros talleres, a propósito no incluido todavía

- **Marca** (`public/img/marca/`): vacío. Falta el logo de Skilling Center Tecmilenio y,
  si aplica, el de J&J, en formato recortado al contenido (ver advertencia de otros
  talleres: no fijar alto en px sin antes recortar el margen transparente).

## Práctica extra con un segundo dataset (mantenimiento)

Además del dataset sintético de planta, el Día 1 incluye un **extra opcional** al
final (`D1-M15` a `D1-M19`, fuera de las 7.5 h oficiales y de la evidencia A1): conectar
y visualizar `Data_Mantenimiento_2025.xlsx` (`public/descargas/`), un archivo Excel
real de mantenimiento (fecha, equipo, tipo de falla, tiempos de reparación y
operación), para practicar la misma técnica de conexión con un archivo que no es el
del curso.

La parte de indicadores (MTTR, MTBF, medidas DAX, dashboard) sobre ese mismo archivo
**no está enlazada a ningún día todavía**: vive en `src/components/extra-mantenimiento/`
(E1 a E8), pendiente de dónde entra en la secuencia del programa, porque requiere DAX
(Día 3) y no encaja en el Día 1. Queda ahí como material listo para cuando se decida.

⚠️ **Origen del dataset:** el Excel viene de una masterclass gratuita de un tercero
(no de Skilling Center Tecmilenio ni de este equipo). Se incluye en el repo porque el
instructor confirmó tener permiso de reuso para este programa; si eso cambia, hay que
sacar `public/descargas/Data_Mantenimiento_2025.xlsx` y los módulos que lo referencian
(`D1-M16` en adelante, y todo `extra-mantenimiento/`) antes de publicar de nuevo. Las
slides de instrucción son contenido original de este repo, no una copia del material
del tercero.

## Versiones fijas

`astro 7.3.3` · `reveal.js 6.0.2` · `tailwindcss 4.3.3` · `@tailwindcss/vite 4.3.3` ·
`astro-icon 1.2.0` · `@iconify-json/lucide 1.2.135`. Verificado con `npm run build` al
momento de armar el repo.

### Material de los días 3–5

Presentaciones y guías disponibles para los cinco días. Los días 3 y 4 se imparten en Power BI Desktop; Python aparece solo en el laboratorio del Día 5. Consulta [la correspondencia con el PDF](fuente-y-alineacion-dias-03-05.md) y las carpetas de evidencia para rúbricas y variantes reservadas. El recetario DAX y el calendario se descargan desde Día 3; el verificador externo se presenta en Día 5.
