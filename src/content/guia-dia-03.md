---
title: Día 3 · Indicadores en DAX y evidencia A3
---

## Resultado del día

Construirás seis indicadores, explicarás cómo los afectan los filtros y comprobarás sus cifras. Continuarás el modelo A2 en Power BI Desktop y entregarás A3 con seis fichas, una matriz de validación y una práctica temporal. Trabaja con el dataset sintético del curso.

## Jornada y materiales

| Horario | Trabajo | Resultado observable |
|---|---|---|
| 08:00–09:00 | Fundamento | Distingues contexto de fila y de filtro antes de escribir fórmulas |
| 09:00–10:30 | Primeras medidas, guiado | Medidas base y prueba de CALCULATE |
| 10:30–10:45 | Pausa | |
| 10:45–12:15 | Indicadores de mi área, menor guía | Seis medidas con definición y alcance |
| 12:15–13:15 | Comida | |
| 13:15–14:45 | Laboratorio temporal | MTD, mes anterior, promedio móvil y variación |
| 14:45–15:00 | Pausa | |
| 15:00–16:30 | Taller A3 | Desarrollo autónomo, revisión cruzada y corrección |
| 16:30–17:00 | Validación | Cifras, explicación y registro individual |

Descarga el [recetario de medidas](../../descargas/medidas-dia-03.dax) y el [calendario completo](../../descargas/calendario-dia-03.pq). El recetario contiene definiciones separadas: **crea una medida cada vez**, no pegues todo como una sola fórmula. Guarda A2 y usa **Guardar como** para crear `A3_Apellido.pbix`.

Antes de empezar, comprueba las ocho tablas, las diez relaciones activas de A2, su dirección dimensión → hecho y las 7,067 filas limpias de producción. Sin filtros, producción suma **5,822,881 piezas**. Si no coincide, corrige A1/A2 antes de continuar.

## 1. Contexto antes de fórmula

Una columna calculada se evalúa para cada fila y se guarda en el modelo. Una medida se calcula en el contexto solicitado por un visual. Un segmentador, una fila de matriz y los filtros de página pueden cambiar ese contexto. Una medida no tiene por sí sola una «fila actual» de producción.

Ejemplo: una tarjeta sin filtros muestra toda la producción; la misma medida con L1 muestra 1,340,826. No necesitas una fórmula por línea. Usa dimensiones para segmentar y respeta las relaciones del Día 2.

En la vista Informe, selecciona `fact_produccion`, elige **Nueva medida**, escribe la expresión y confirma. Los nombres de medidas van entre corchetes; una columna se identifica como `Tabla[columna]`. Si tu configuración usa separadores DAX localizados, adapta comas a punto y coma sin cambiar los nombres ni la lógica.

## 2. Medidas base y una prueba de filtro

Crea en este orden, con formato de número entero y separador de miles:

```dax
Piezas = SUM(fact_produccion[piezas_producidas])
Plan = SUM(fact_produccion[piezas_plan])
Buenas = SUM(fact_produccion[piezas_buenas])
No conformes producción = [Piezas] - [Buenas]
```

Son **cuatro medidas separadas**. Construye una matriz con `dim_linea[nombre_linea]` en filas y las medidas en valores. Añade segmentadores de fecha, área y turno desde sus dimensiones; cambia un filtro por vez y registra la cifra.

```dax
Piezas turno 3 =
CALCULATE([Piezas], dim_turno[nombre] = "3")
```

Selecciona turno 1 usando **esa misma columna** `dim_turno[nombre]`. `[Piezas]` responde al turno 1; `[Piezas turno 3]` sustituye ese filtro por turno 3. CALCULATE modifica el contexto de filtro; dentro de un contexto de fila también puede realizar transición de contexto. No convierte cualquier filtro en algo irrelevante.

Para participación respecto a la planta, usa la medida del recetario con `REMOVEFILTERS(dim_linea)`. Quita tanto línea como área porque ambas pertenecen a esa dimensión; conserva fecha, turno y parte. Explica ese denominador antes de interpretar el porcentaje.

## 3. Los seis indicadores de A3

| Medida | Pregunta | Definición / unidad | Alcance |
|---|---|---|---|
| Piezas | ¿Cuánto se produjo? | Suma de piezas producidas | Fecha, línea, área, turno y parte |
| % Cumplimiento | ¿Qué proporción del plan se produjo? | Piezas / Plan; porcentaje | Mismos filtros de producción |
| % Buenas | ¿Qué proporción se registró como buena? | Buenas / Piezas; porcentaje | No equivale a rendimiento de primera pasada |
| % Rechazo producción | ¿Qué proporción no fue buena? | (Piezas − Buenas) / Piezas; porcentaje | Derivado del registro de producción |
| Eventos correctivos | ¿Cuántas filas de eventos correctivos hay? | Conteo de filas de mantenimiento tipo correctivo | Fecha, línea y área; no turno ni parte |
| Minutos correctivos | ¿Cuántos minutos duran esos eventos? | Suma de duración de correctivos; minutos | Mismo alcance de mantenimiento |

```dax
% Cumplimiento = DIVIDE([Piezas], [Plan])
% Buenas = DIVIDE([Buenas], [Piezas])
% Rechazo producción = DIVIDE([No conformes producción], [Piezas])
```

Crea cada medida por separado y aplica formato **Porcentaje, dos decimales**. DIVIDE devuelve BLANK cuando el denominador es cero o está vacío si no se da resultado alternativo. «Sin datos» no significa desempeño cero. No multipliques por 100 además de aplicar el formato.

Para las dos medidas de mantenimiento, copia sus definiciones separadas del recetario. Seleccionan `tipo = "correctivo"`. Si el usuario filtra otro tipo en esa misma columna, CALCULATE lo sustituye por correctivo; por eso el título debe decir **correctivos**. El conteo representa filas de eventos, no órdenes únicas: no hay identificador de orden en el archivo.

Una tasa global es **suma del numerador / suma del denominador**. Con 5 rechazos entre 100 piezas y 9 entre 900, el rechazo conjunto es 14/1,000 = **1.40 %**; promediar 5 % y 1 % daría 3 %, que no corresponde al total.

`Rechazadas calidad`, también en el recetario, ayuda a conciliar las tablas. El detalle de calidad tiene otra granularidad y no contiene turno. No dividas rechazos filtrados por defecto entre producción como si ambos hechos recibieran ese mismo filtro. No relaciones hechos entre sí para forzar resultados. No presentes suma de horas repetidas por parte como exposición única para OEE, disponibilidad o MTBF.

### Controles sin redondear antes de calcular

| Indicador | Sin filtros | L1 | Ensamble |
|---|---:|---:|---:|
| Piezas | 5,822,881 | 1,340,826 | 2,591,842 |
| % Cumplimiento | 89.19 % | 89.26 % | 89.27 % |
| % Buenas | 97.51 % | 97.53 % | 97.52 % |
| % Rechazo producción | 2.49 % | 2.47 % | 2.48 % |
| Eventos correctivos | 560 | 150 | 276 |
| Minutos correctivos | 71,248 | 18,241 | 35,261 |

Pruebas adicionales obligatorias:

- **01/03/2025 y L1:** 2,301 piezas; 2,715 plan; 2,224 buenas; 84.75 % cumplimiento. No hay eventos correctivos: sus medidas quedan en blanco. Los 21 minutos de mantenimiento de ese corte son preventivos.
- **Solo turno 1:** 1,954,605 piezas; 560 eventos correctivos y 71,248 minutos correctivos permanecen sin filtrar por turno. Etiqueta esa diferencia de alcance.
- **Enero de 2025:** el calendario ampliado sí contiene las fechas, pero los hechos no tienen registros. No conviertas ese vacío en desempeño cero.

Acepta coincidencia exacta en conteos y cantidades; en porcentajes, compara el valor completo y luego el formato a dos decimales. Al fallar, revisa filtros activos, denominador, relaciones y pasos de limpieza, en ese orden.

## 4. Laboratorio de inteligencia de tiempo

### Preparar el calendario sin perder el modelo

1. Guarda una copia de A3. En **Transformar datos**, selecciona la consulta existente `dim_calendario`.
2. En **Editor avanzado**, pega el contenido del calendario descargado. Conserva el nombre de consulta; no agregues una segunda dimensión.
3. **Cerrar y aplicar**. Comprueba 730 fechas únicas y sin vacíos: 01/01/2025–31/12/2026. A2 cubría solo los 549 días del periodo de los datos.
4. Marca `dim_calendario` como tabla de fechas usando `[fecha]`. Comprueba que siga relacionada activamente con producción y calidad por `fecha`, y mantenimiento por `fecha_evento`.
5. Usa la fecha de esta dimensión, no una jerarquía automática de la tabla de hechos. `anio_mes` ordena cronológicamente; `mes_inicio` representa cada mes sin mezclar años. El periodo fiscal es una convención sintética trimestral, no el calendario fiscal de la empresa.

El calendario completo no inventa producción fuera de marzo de 2025–agosto de 2026. MTD y desplazamientos temporales se interpretan dentro de la cobertura disponible.

### Construir y comprobar

Crea las cuatro medidas temporales del recetario en este orden: `Piezas MTD`, `Piezas mes anterior`, `% Variación mensual`, `Promedio móvil 7d`.

- **MTD:** acumulado desde el primer día del mes hasta la fecha del contexto. En una tabla por fecha, el 07/05/2025 debe mostrar **77,234**.
- **Mes anterior:** DATEADD desplaza el conjunto de fechas un mes. En una matriz por `anio_mes`, mayo de 2025 muestra **343,875** del mes anterior frente a **337,491** del mes actual. Usa meses completos para esta comparación; no llames «mes anterior completo» a cualquier selección parcial o discontinua.
- **Variación mensual:** (actual − anterior) / anterior; en mayo **−1.86 %**. Las variables guardan los valores del contexto, facilitan lectura y permiten evitar una comparación cuando falta algún periodo.
- **Promedio móvil:** siete días calendario, incluido el corte. El 07/05/2025 debe mostrar **11,033.43 piezas/día**, promedio de 12,020; 11,269; 12,321; 0; 13,168; 14,324; 14,132. El cero corresponde al domingo conocido sin producción del caso sintético. No apliques esa suposición a fechas fuera de cobertura ni a ausencias sin explicación.

La fórmula de promedio móvil quita los filtros del calendario para recuperar toda la ventana, incluidos días del mes anterior, y conserva los filtros de línea, área, turno y parte. Se recorre una fecha por día; la medida se evalúa para cada fecha. Prueba un corte cercano al inicio de mes y explica la ventana.

**Trabajo diferenciado, 35 minutos:** quienes ya dominan medidas desarrollan los cuatro controles temporales con autonomía y explican la ventana; el instructor refuerza contexto y DIVIDE con quienes lo necesitan y después guía sus controles. No cambia el criterio de A3 ni convierte la velocidad en calificación.

## 5. Fichas, revisión y entrega A3

Copia esta ficha **para cada uno de los seis indicadores principales**:

| Campo | Registro del participante |
|---|---|
| Nombre, pregunta operativa y responsable | |
| Fórmula y unidad | |
| Numerador y denominador, si aplica | |
| Tabla, granularidad y cobertura temporal | |
| Filtros que sí lo afectan / filtros que no | |
| Vacíos, ceros y limitaciones | |
| Valor sin filtros y al menos dos cortes comprobados | |
| Hallazgo del revisor y corrección realizada | |

En el taller: 8 min de rúbrica, 7 de ficha, 50 de trabajo autónomo, 20 de revisión entre áreas y 5 de entrega. El revisor elige una fecha, un turno y un área; solicita explicar qué cambió y qué debía permanecer constante. Registra cifra esperada, observada, resultado, corrección y segunda prueba. Las capturas deben mostrar los filtros, no solo una tarjeta aislada.

Entrega `A3_Apellido.pbix`, seis fichas, matriz de pruebas y registro del laboratorio temporal. Todos observan las cuatro técnicas y documentan al menos un contraste propio; la ruta autónoma comprueba los cuatro controles. Registra el acompañamiento recibido. Conserva A1 y A2. El cierre incluye una explicación individual de un numerador, su denominador y el alcance del filtro; un archivo de equipo no acredita por sí solo a cada integrante.

## Evaluación de C3

Se observa definición correcta, respuesta a filtros, validación numérica y explicación del indicador. Escala de la propuesta:

| Nivel | Evidencia observable |
|---|---|
| 1 | Resuelve los pasos críticos con ayuda |
| 2 | Resuelve de forma autónoma el caso practicado |
| 3 | Transfiere a una variante no vista y justifica sus decisiones |
| 4 | Detecta y corrige un error en trabajo ajeno y justifica la corrección |

Terminar más rápido o copiar otra fórmula no acredita nivel 3. El evaluador reserva la variante y registra la prueba individual. Los cuestionarios de las slides dan retroalimentación; no guardan calificaciones.

## Fuentes y alcance

Base curricular: *Analítica Operativa con Power BI*, propuesta de Javier A. Flores Flores entregada por el instructor, septiembre de 2026; página impresa 5 (física 6), jornada en 3 (4), diferenciación en 6 (7) y evaluación en 7 (8). Los seis nombres y cifras son desarrollo didáctico sobre el ZIP del curso.

Referencias técnicas: [CALCULATE](https://learn.microsoft.com/en-us/dax/calculate-function-dax), [DIVIDE](https://learn.microsoft.com/en-us/dax/divide-function-dax), [DATEADD](https://learn.microsoft.com/en-us/dax/dateadd-function-dax), [DATESINPERIOD](https://learn.microsoft.com/en-us/dax/datesinperiod-function-dax) y [tablas de fechas](https://learn.microsoft.com/en-us/power-bi/guidance/model-date-tables). Los controles numéricos son referencias independientes del dataset; deben comprobarse en el PBIX durante la práctica.
