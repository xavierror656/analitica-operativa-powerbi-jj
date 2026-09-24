# Congruencia entre diapositivas, guías y materiales

## Día 1 — revisión del 24 de septiembre de 2026

Alcance: 57 diapositivas (incluida portada y cinco extras), notas del facilitador, guía web y Markdown, 17 recetas compartidas, README del día, criterios de A1, catálogo de entregas y archivos distribuidos. La comprobación de los datos es independiente de Power BI Desktop; no certifica la ejecución del motor M ni un PBIX terminado.

| Diapositivas | Correspondencia en guía/materiales | Comprobación |
|---|---|---|
| 1–14: portada y fundamento | Resultado, ruta del día, fuentes en `datos/README.md` | Datos sintéticos, origen y permisos; aclarado cuándo se necesita gateway |
| 15–23: conexión e inventario | Antes de comenzar, sección 1, recetas de conexión y perfilado | Ocho CSV separados; no combinar estructuras distintas; ejemplo de fecha dentro del calendario |
| 24–31: limpieza | Sección 2 y recetas de duplicados, líneas, horas, turnos, lotes y fechas | Subtotales antes de duplicados; comparación de todas las columnas originales; reglas y controles compatibles |
| 32–42: laboratorio | Secciones de Power Query, recetas de carpeta, parámetro, clasificación y errores | Nulos conservados; consultas auxiliares sin carga; fórmulas compartidas entre slides y guía |
| 43–48: A1 | Bitácora, criterios de aceptación, README de evidencia y catálogo de entregas | PBIX y bitácora; ocho tablas finales; conciliación y revisión cruzada |
| 49–52: cierre | Ruta, criterios y entrega | Dos actualizaciones estables, pendientes documentados y transición al día 2 |
| 53–57: extra Excel | Nueva sección «Extra opcional: mantenimiento en Excel» | Libro, hoja, columnas, 150 registros, tipos y tres visuales; PBIX separado de A1 |

### Conciliación del ZIP distribuido

Archivo: `public/descargas/dataset-planta-sintetico.zip`.

SHA-256: `9948728716b3fc15bfc6d4d89b5ec347eb2d8c601da68afb8bca943f18bc2ce8`.

| Producción | Filas | Piezas |
|---|---:|---:|
| Origen | 7,187 | 6,046,188 |
| Subtotales retirados | 12 | 134,753 |
| Copias exactas retiradas | 108 | 88,554 |
| Salida | 7,067 | 5,822,881 |

Se conservan 208 nulos en horas de paro; 308 turnos se recuperan por hora. Los 144,882 rechazos concilian por lote con producido menos bueno. Todas las fechas del detalle depurado pertenecen al calendario. Los bloques de notas suman 60 + 90 + 90 + 90 + 90 + 30 = 450 minutos; los cronómetros de actividades coinciden con sus notas. Los extras suman 46 minutos adicionales.

El verificador reproducible del repositorio es `python scripts/verificar_dia1.py`. En esta revisión, al no disponer de un intérprete Python operativo, se extrajo nuevamente el ZIP con .NET y se recalcularon los controles anteriores con Node; no se ejecutó ese script Python ni Power BI Desktop.

### Correcciones de congruencia

- Ejemplo D1-M4c: agosto de 2026, dentro del calendario, en lugar de septiembre; lote ajustado al mismo mes.
- Las recetas ya no indican «a la derecha», porque la guía muestra las fórmulas debajo.
- Extra documentado también en la guía y su descarga; se abre en un PBIX separado.
- Disponibilidad del Excel: promedio aritmético didáctico, escala 0–100 y formato decimal. Eliminada la promesa de reconstruir ese indicador sin una fórmula documentada.
- Tarjeta de órdenes: suma de registros, sin presentarla como pendiente actual. Sustituido el ejercicio adelantado de promedio móvil por comprobación contra el Excel.
- Notas: corrección en el siguiente bloque de la mañana; importación previa mediante Texto/CSV; preparación de la demo Carpeta atribuida al README del facilitador.

La demo de Carpeta sigue siendo un material preparado por el facilitador: dos CSV de producción de periodos distintos. El README documenta su preparación y la receta explica qué hacer si todavía no fueron proporcionados. No forma parte de los ocho archivos del ZIP base.

Referencias para las aclaraciones: [actualización y gateways](https://learn.microsoft.com/en-us/power-bi/connect-data/refresh-data) y [agregaciones de campos](https://learn.microsoft.com/en-us/power-bi/create-reports/service-aggregates).

## Día 2 — revisión del 24 de septiembre de 2026

Se revisaron las 39 slides y sus notas, la guía, el contrato de diez relaciones, los seis controles, los README del día y de A2, y el catálogo de entregas. Las instrucciones y los criterios coinciden: continuidad desde A1, ocho tablas base, captura y bitácora; diagnóstico y auditoría con pruebas repetibles.

| Slides | Correspondencia | Resultado |
|---|---|---|
| 1–9 | Resultado, granularidad, claves y mapa del modelo | Distinción consistente entre combinar filas y propagar filtros |
| 10–17 | Secciones 1, 3 y 4 | Diez relaciones; claves de turno compatibles; calendario de 549 días |
| 18–24 | Sección 5 y seis casos de control | Mismos filtros, cifras, unidades y límites de atribución |
| 25–31 | Secciones 6 y 7 | Jerarquías, organización, diagnóstico y restauración de la falla |
| 32–39 | Secciones 8–11 y criterios A2 | Auditoría, entrega, escala de dominio y continuidad a DAX |

Se recalcularon los seis casos sobre los tres hechos desde el ZIP depurado: coinciden los 18 conteos y los 18 totales. Las diez relaciones propuestas tienen claves únicas en las dimensiones y cero huérfanas. Se verificaron los 549 días continuos y los ocho equipos con una sola línea por equipo de la variante del instructor. Los cronómetros coinciden con las notas y los bloques suman 60/90/90/90/90/30 minutos. Esta comprobación de datos no ejecuta las relaciones en Desktop.

Corrección: la guía ahora indica deshabilitar carga en las consultas auxiliares de anti unión, para no convertir el diagnóstico en tablas adicionales de A2.

### Prácticas 2.1–2.4 y sus materiales

Se contrastaron las consignas, el montaje, las fichas de actividad, los pasos que generan las slides y la guía del instructor. El caso Prácticas está separado del caso base: diez tablas, 16 relaciones y 730 fechas de calendario; 3,761,757 piezas y 117,998 rechazadas. Sus cuatro bloques de 90 minutos sustituyen los correspondientes bloques del curso, como declara la guía del instructor.

Las siete respuestas cuantitativas de 2.2 se recalcularon desde los CSV: L2/125 minutos, E31/39 correctivos, Empaque/2,380,127 piezas, lunes/20,255 rechazos, D01/21,500 rechazos en L2, turno 2/82,433 piezas en semanas de festivos, y 240,506 piezas en semanas ISO 10–14 de 2025. Coinciden con la clave del instructor. Las tres limitaciones restantes corresponden a las rutas ausentes del modelo: lote compartido, turno de mantenimiento y atribución a parte.

Las cuatro copias con fallas de 2.3 requieren preparación del instructor en Desktop, explícita en guía y montaje; el ZIP no se presenta como un PBIX ya preparado. La auditoría 2.4 usa los mismos ocho criterios del formulario. Se comprobaron los hashes e inventarios de los 16 paquetes y la igualdad de sus 73 documentos/formularios con las fuentes, normalizando únicamente saltos de línea.

## Continuación

La revisión de contenido de los días 3–5 queda pendiente. La igualdad de los archivos empaquetados no demuestra por sí sola la corrección didáctica o numérica de esas jornadas.
