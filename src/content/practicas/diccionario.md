# Caso Prácticas 2025–2026

Datos enteramente sintéticos. Capturas del 01/01/2025 al 30/06/2026; calendario de años completos 2025–2026. No sustituir ni anexar estos archivos al dataset anterior del curso: reconstruir las consultas del caso en una copia del PBIX. Todas las actividades continúan esa misma copia.

## Archivos y granularidad

| Tabla | Una fila representa | Claves / cantidades |
|---|---|---|
| fact_produccion | Un bloque de una línea y turno, con una sola parte y lote | registro_id, fecha, linea_id, turno, parte_id, lote; piezas_plan, piezas_producidas, piezas_buenas; minutos_programados, paro_min, operacion_min |
| fact_calidad | Un registro de rechazo de un lote | evento_calidad_id, fecha, fecha_hora, linea_id, turno, parte_id, lote, tipo_defecto, piezas_rechazadas, etapa, inspector_id |
| fact_mantenimiento | Un evento de un equipo | evento_id, fecha operativa, equipo_id, linea_id, tipo, inicio, fin, duracion_min, afecta_produccion (0/1), causa |
| fact_exposicion_equipo | Tiempo de exposición de un equipo en un bloque de fecha/línea/turno | fecha, linea_id, equipo_id, turno, minutos_operacion |
| dim_linea | Una línea | linea_id, nombre_linea, area, celda |
| dim_parte | Una parte | parte_id, descripcion, familia, estandar_hora (piezas/hora) |
| dim_turno | Un turno | turno (texto 1/2/3), nombre, hora_inicio, hora_fin |
| dim_equipo | Un equipo | equipo_id, linea_id, descripcion |
| dim_defecto | Un defecto | defecto_id, descripcion, categoria |
| dim_calendario | Una fecha continua | fecha, anio, trimestre, mes, nombre_mes, anio_mes, semana_iso, anio_iso, dia_semana, es_habil |

Unidades: cantidades enteras, duración y exposición en minutos; las medidas convierten a horas cuando corresponde. Los tiempos de producción NO están repetidos por varias partes: este caso asigna una única parte a cada bloque. Si se amplía a varios productos en un bloque, debe separarse el tiempo de línea en otro hecho antes de sumar.

Cada línea tiene dos equipos en serie. Exposición por equipo suma horas-equipo, no horas únicas de línea. Solo esa exposición alimenta MTBF por equipo/flota; nunca disponibilidad u OEE de línea. Los preventivos están fuera del tiempo programado; los correctivos con afecta_produccion=0 no restan tiempo de línea. Los eventos con paro no se solapan dentro de un bloque.

El turno 3 es 22:00–06:00 del siguiente día. `fecha` es el día operativo; no reemplazarla ciegamente por la fecha natural de una marca horaria. Calidad incluye turno; mantenimiento deliberadamente no lo incluye al inicio. La práctica 3.2 explica cuándo y cómo derivarlo.

## Datos crudos y defectos de captura

Los hechos vienen por mes en carpetas separadas. Incluyen ocho duplicados exactos por tabla de producción, calidad y mantenimiento; espacios al inicio/final de claves y fechas mezcladas ISO / dd/MM/yyyy. No contienen OEE, tasas, promedios ni columnas con la solución del caso. El catálogo de partes contiene un valor que requiere validación con la ficha didáctica de ingeniería; no «arreglarlo» suponiendo una cifra.

No hay valores perdidos inventados como cero. Un día inhábil no tiene producción: el calendario mantiene su fecha. `inspector_id` es un código sintético sin información de personal.

## Metas y fuentes auxiliares

`recursos/metas.csv` usa razones 0–1 para porcentajes, minutos para MTTR y una columna que señala si conviene un valor mayor o menor. Son metas didácticas. Puede permanecer desconectada y consultarse por indicador con SELECTEDVALUE/CALCULATE.

`recursos/estandares_ingenieria.csv` representa una ficha de referencia sintética vigente durante la historia. Se usa en 3.2 para justificar una revisión del estándar; registrar valor anterior, valor de referencia y aprobación didáctica, sin sobrescribir el CSV crudo.
