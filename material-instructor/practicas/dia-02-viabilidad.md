# Día 2: preparación y prueba de viabilidad

## Dictamen y alcance

Las cuatro prácticas son resolubles con los CSV, el modelo descrito y los formularios distribuidos. Se comprobaron de forma independiente las 16 relaciones (claves únicas y sin huérfanas), las siete respuestas cuantitativas de 2.2 y las reparaciones de datos de 2.3. **La ejecución en Desktop y los tiempos con participantes aún requieren pilotaje**; no hay PBIX prearmados en los ZIP.

No mezclar este caso con el A2 base de ocho tablas y diez relaciones. En Prácticas hay diez tablas y 16 relaciones; los cuatro bloques de 90 minutos sustituyen los bloques prácticos del día. La introducción y el cierre deben usar las cifras de este caso.

## Antes de comenzar los 90 minutos de 2.1

- Conservar A1 y preparar su copia con el puente de `montaje.md`. Las consultas antiguas llevan prefijo `Anterior_` y no se cargan. Las nuevas conservan nombres exactos, sin `(2)`.
- Importar y limpiar los tres hechos por carpeta; cargar dimensiones y exposición por separado. Revisar los pasos automáticos de tipo antes de interpretar fechas mezcladas.
- Comprobar 5,544 filas de producción, 11,088 de calidad, 708 de mantenimiento y 11,088 de exposición. Las otras seis tablas son dimensiones. Auxiliares de combinación sin carga.
- Con filtros limpios: 3,761,757 piezas y 117,998 rechazadas. No comparar con los totales de A1 del caso anterior.
- Guardar el archivo antes de crear relaciones. Si alguien llega sin esta preparación, completar la transición en una sesión previa; diez minutos no representan una estimación de limpieza desde cero.

## 2.1: demostraciones que sí se pueden reproducir

Para la prueba de relación directa, usar una copia aislada con los hechos de producción y mantenimiento, sin rutas activas alternativas. Crear una relación por `fecha`, muchos a muchos, con dirección **mantenimiento → producción**. Filtrar `tipo` desde mantenimiento y observar qué fechas de producción sobreviven. No interpretar esas piezas como producción atribuible a la intervención. Registrar configuración y resultado; eliminar esa relación al volver al modelo de dimensiones compartidas.

El microcaso es otra demostración: importar los dos CSV de `microcaso/`, combinar producción con eventos por fecha y expandir el identificador de evento. Tres registros coinciden con dos eventos: seis filas, 1,200 piezas frente a las 600 iniciales. No anexar esta consulta a los hechos; eliminarla de la copia de entrega o conservarla sin carga y con propósito documentado.

Después construir las 16 relaciones de `montaje.md`. Calendario/línea filtran cuatro hechos; parte filtra producción/calidad; turno filtra producción/calidad/exposición; defecto filtra calidad; equipo filtra mantenimiento/exposición. La suma de filas por cada dimensión compatible debe conservar el total.

## 2.2: consultas sin DAX

| Pregunta | Campos y operación |
|---|---|
| 1 | Filtrar marzo 2025; filas `dim_linea[linea_id]`, suma de producción `paro_min`; ordenar descendente y dividir minutos entre 60 al informar |
| 2 | Abril–junio 2026 y mantenimiento `tipo=correctivo`; filas `dim_equipo[equipo_id]`, recuento de `evento_id` (identificadores presentes y únicos) |
| 3 | Filas `dim_parte[familia]`, suma de `piezas_producidas` |
| 4 | Filas calendario `dia_semana`, suma de calidad `piezas_rechazadas` |
| 5 | Filtrar L2 desde dimensión; filas `dim_defecto[defecto_id]`, suma de rechazos |
| 6 | Identificar año ISO y semana ISO de cada uno de los seis festivos en calendario; usar un segmentador jerárquico año ISO → semana ISO y seleccionar esos pares; filas `dim_turno[turno]`, suma de piezas |
| 7 | Año ISO 2025 y semanas ISO 10–14 inclusive; suma de piezas |

En la pregunta 6 no seleccionar por separado un conjunto de años y otro de semanas: eso puede incluir combinaciones no solicitadas. La clave numérica está en el README del instructor. Las preguntas 8–10 evalúan límites, no una fórmula faltante: no existe la ruta compartida de lote, ni turno de mantenimiento en A2, ni atribución de mantenimiento a parte.

## 2.3: cuatro copias guardables y reparables

Preparar cuatro copias del modelo correcto. Sustituir únicamente la tabla indicada; no anexar la muestra al hecho completo. Mantener fechas, claves y nombres finales conforme al caso, excepto la anomalía deliberada. Los casos A, B y D traen **36 filas y 407 piezas rechazadas**, no las 11,088 filas de calidad del maestro. La prueba usa la cifra de la muestra.

| Caso | Cómo dejarlo listo antes de repartir | Reparación que debe demostrar el alumno |
|---|---|---|
| A | Cargar `caso-a/calidad.csv` y desactivar calendario → calidad | Enero y febrero repiten 407 si no hay otro filtro; activar relación: enero 407, febrero sin registros; 02/01/2025 = 273 y 03/01/2025 = 134 |
| B | Cargar `caso-b/calidad.csv` dejando `fecha` como fecha/hora; relación activa al calendario | Conservar marca original y extraer fecha en Power Query, no solo cambiar formato en Modelo; recuperar los controles de A |
| C | Quitar temporalmente las dos relaciones que usan `dim_parte[parte_id]` antes de cargar las seis filas de `caso-c/partes.csv` y recortar la clave. Guardar la copia sin esas relaciones; conservar captura del intento de 1:* | Investigar las dos filas P001: son idénticas tras recortar; retirar la copia exacta, comprobar cinco claves y restaurar ambas relaciones. Totales del maestro conservados |
| D | Quitar temporalmente línea → calidad antes de cargar `caso-d/calidad.csv` con línea numérica. Guardar el estado sin esa relación y registrar el rechazo de tipos si aparece | Convertir a texto y anteponer `L`; comprobar L1–L4 y restaurar 1:*. Rechazos: L1=136, L2=136, L3=70, L4=65; total 407 |

No exigir que Desktop guarde una relación 1:* cuyo lado 1 está duplicado, ni una relación con tipos incompatibles. El rechazo es parte del síntoma. En C y D se entrega una copia cargable con la relación retirada y la evidencia del intento; tras reparar se debe reconstruir la ruta.

En los 50 minutos de diagnóstico, reservar unos 12 minutos por caso y dos para cambiar de archivo. Los 40 minutos de organización se realizan sobre **una copia maestra íntegra**, con controles breves de las cuatro reparaciones; no repetir toda la organización cuatro veces. Si el pilotaje no alcanza, aumentar el tiempo o registrar lo pendiente: no declarar completas cuatro reparaciones por observar solo una demostración.

## 2.4 y puerta de salida

Usar el A2 íntegro de Prácticas, no una muestra de 36 filas. El autor y revisor conservan copias separadas. Aplicar los ocho criterios del checklist, repetir un filtro de cada dimensión y volver al total sin filtros. Guardar `Practicas_A2_Apellido.pbix` y checklist con evidencia, fecha, revisor y pendientes. Registrar si no hubo hallazgos; no inventar una reparación.

Antes de impartir, pilotear en Desktop: apertura sin errores, actualización en otra ruta, microcaso 600→1,200, diez preguntas de 2.2, las cuatro copias de 2.3 y restauración de las 16 relaciones. Medir duración real de transición, conexiones, cambios de archivo y revisión. La comprobación de CSV prueba que los resultados son alcanzables desde los datos; no sustituye ese ensayo de interfaz ni mide el ritmo de aprendizaje.

Soporte técnico: [relaciones, tipos y unicidad en Power BI](https://learn.microsoft.com/en-us/power-bi/transform-model/desktop-relationships-understand) y [combinación de CSV](https://learn.microsoft.com/en-us/power-query/combine-files-csv).
