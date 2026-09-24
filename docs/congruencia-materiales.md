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

## Continuación

La revisión de congruencia de los días 2–5 queda pendiente. Los controles del día 1 no prueban la congruencia del resto del curso.
