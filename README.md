# Analítica Operativa con Power BI

Programa de capacitación para Johnson & Johnson (Ciudad Juárez), impartido por Skilling
Center Tecmilenio. 5 días, 37.5 horas, cinco evidencias acumulativas (A1 a A5).
Instructor: Javier A. Flores Flores.

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

```bash
npm install
npm run dev      # http://localhost:4321
```

`npm run build` genera `dist/` estático.

**En clase:** `→` avanza · `S` abre las notas del facilitador en otra ventana ·
`F` pantalla completa · `Esc` vista general de todas las slides.

## Generar el dataset sintético

```bash
cd datos/scripts
python generar_dataset_sintetico.py
```

Produce en `datos/salida/` las 8 tablas de la Opción A del programa (`fact_producción`,
`fact_calidad`, `fact_mantenimiento` y sus dimensiones): 18 meses, 4 líneas, 3 turnos, con
los defectos de captura sembrados a propósito (nombres de línea inconsistentes, fechas en
dos formatos, horas en 12h/24h, ceros perdidos en lote, duplicados, filas de subtotal
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

| Día | Slides | Estado |
|---|---|---|
| **Día 1: Conexión y preparación de datos** | 16 módulos, 17 slides · cubre las 7.5 h completas, con cronómetro real y un quiz interactivo | ✅ Listo |
| Día 2: Modelo de datos | — | ⬜ Pendiente |
| Día 3: Indicadores en DAX | — | ⬜ Pendiente |
| Día 4: Reporte operativo | — | ⬜ Pendiente |
| Día 5: Análisis, publicación y proyecto | — | ⬜ Pendiente |

El contenido día por día completo (horarios, qué evalúa cada evidencia, la evaluación
diagnóstica con clave de respuestas) está en la propuesta didáctica original; cada
carpeta `dia-0X-.../README.md` resume su bloque como referencia rápida al escribir
slides.

### Lo que falta portar de otros talleres, a propósito no incluido todavía

- **Descargas para participantes** (`public/descargas/` + componente `Descarga`): tiene
  sentido en cuanto el dataset sintético esté empaquetado para que cada quien lo baje.
- **Marca** (`public/img/marca/`): vacío. Falta el logo de Skilling Center Tecmilenio y,
  si aplica, el de J&J, en formato recortado al contenido (ver advertencia de otros
  talleres: no fijar alto en px sin antes recortar el margen transparente).

## Versiones fijas

`astro 7.3.3` · `reveal.js 6.0.2` · `tailwindcss 4.3.3` · `@tailwindcss/vite 4.3.3`.
Verificado con `npm run build` al momento de armar el repo.
