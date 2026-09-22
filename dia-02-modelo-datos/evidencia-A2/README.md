# Evidencia A2 · Modelo de datos probado y auditado

Competencia C2 de la propuesta: modelo con granularidad correcta e identificación de
relaciones que producen cifras infladas o filtros que no propagan. La evidencia es
acumulativa: se construye sobre A1.

Entregar `Apellido_Nombre_A2.pbix`, captura del modelo y bitácora. La plantilla está
en la [guía del participante](../../src/content/guia-dia-02.md). La captura no sustituye
las pruebas sobre el PBIX.

## Criterios observables

| Criterio | Evidencia que revisa el instructor |
|---|---|
| Granularidad | Describe qué representa una fila en cada hecho y no mezcla niveles de detalle |
| Claves | Dimensiones con claves únicas y tipos compatibles; correspondencias verificadas |
| Relaciones | Justifica cardinalidad, dirección, estado activo y rutas; no conecta hechos por conveniencia |
| Pruebas | Contrasta totales y cortes con la fuente; demuestra un filtro que aplica y uno que no |
| Organización | Jerarquías, meses ordenados, unidades, campos y descripciones útiles para otra área |
| Auditoría | Hallazgo verificable, corrección y repetición de la prueba, o revisión sin hallazgos declarada |

## Escala del PDF, sección 4, página impresa 7

| Nivel | Criterio de corte para A2 |
|---|---|
| 1 · Inicial | Completa con apoyo directo en pasos críticos |
| 2 · En desarrollo | Completa autónomamente el caso practicado |
| 3 · Competente | Resuelve una variante no vista y justifica decisiones |
| 4 · Avanzado | Detecta y corrige un error de otro participante y sustenta la corrección |

Registrar desempeño observado, tipo de apoyo y evidencia. Explicar el modelo
ensayado no demuestra por sí solo transferencia de nivel 3. No se crean porcentajes
ni ponderaciones para A2: el PDF solo sugiere el criterio global de acreditación y
el peso doble de A4/A5 respecto a las evidencias intermedias.

## Controles del dataset de referencia

Se parte del ZIP de SHA-256
`9948728716b3fc15bfc6d4d89b5ec347eb2d8c601da68afb8bca943f18bc2ce8`,
después de las reglas A1, sin exclusiones adicionales. Todas las pruebas empiezan
limpiando filtros. Los minutos corresponden a `duracion_min`.

| Filtro | Producción: piezas | Calidad: piezas rechazadas | Mantenimiento: min |
|---|---:|---:|---:|
| Ninguno | 5,822,881 | 144,882 | 93,298 |
| L1 | 1,340,826 | 33,170 | 23,409 |
| 01/03/2025 + L1 | 2,301 | 77 | 21 |
| Turno 1 | 1,954,605 | 144,882 | 93,298 |
| P-1001 | 1,189,291 | 29,629 | 93,298 |
| D01 | 5,822,881 | 24,235 | 93,298 |

Filas sin filtros: 7,067 / 26,825 / 1,303. Filas en fecha + L1: 3 / 13 / 1.
Calendario: 549 fechas continuas del 01/03/2025 al 31/08/2026. Antes de inteligencia
de tiempo clásica del Día 3, ampliar a años completos para los análisis que lo
necesiten y repetir las pruebas. El modelo base no relaciona turno con calidad o
mantenimiento, ni parte con mantenimiento, ni defecto con producción.

La referencia calculada está en `src/data/controles-dia-02.json`. Si A1 tiene una
exclusión adicional justificada, conciliar el efecto y evaluar el razonamiento; no
obligar a fabricar el mismo total.

## Variante reservada para nivel 3

Aplicarla después del caso guiado, sin mostrar la solución. Si ya se mostró esta
variante al grupo, seleccionar otra realmente nueva y documentarla.

**Consigna:** Ingeniería quiere segmentar mantenimiento por equipo. La tabla tiene
`equipo_id` y `linea_id`, pero no hay dimensión de equipo. En una copia del modelo,
propón e implementa una extensión que no atribuya producción a equipos sin datos
que la respalden. Justifica grano, clave, rutas y dos pruebas.

**Guía del evaluador:** una solución válida es obtener `dim_equipo` de las parejas
distintas equipo_id/linea_id, comprobar que cada equipo pertenece a una sola línea
y que equipo_id es único; relacionarla 1:* a mantenimiento por equipo_id. El ZIP
tiene ocho equipos. En esta variante, mantener la relación directa de línea a
mantenimiento y no añadir además línea → equipo → mantenimiento como segunda ruta
activa. Una solución alternativa debe justificar cómo evita rutas ambiguas.

**Pruebas:** sin filtro se conservan 1,303 eventos y 93,298 minutos; el total de los
ocho equipos reconcilia con ese total. Un segmentador de equipo filtra mantenimiento
y no debe atribuir producción ni calidad al equipo. Registrar evidencia de la
variante por separado; el participante puede conservar el modelo base de ocho
tablas y su copia extendida de nueve.

## Auditoría para nivel 4

Priorizar errores reales encontrados en revisión cruzada. Si no existen, el
instructor entrega una copia preparada por otra persona con uno de estos errores,
sin decir cuál: turno relacionado con turno_id en lugar de nombre; relación de
calendario inactiva; segmentador basado en un hecho; mes en orden alfabético.

El revisor debe observar el síntoma, localizar la causa, corregir y reproducir la
prueba anterior. No basta describir una falla hipotética. Guardar intacto el PBIX
del autor y trabajar en la copia hasta acordar la corrección.

## Cierre

El instructor registra nivel C2, evidencia observada, apoyos y pendientes. Una
captura bonita no acredita el modelo; diferencias sin explicar impiden declarar
validada la prueba correspondiente. Conservar PBIX y bitácora para el Día 3.
