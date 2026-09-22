---
title: Día 4 · Reporte operativo y evidencia A4
---

## Resultado del día

Convertirás A3 en un reporte de dos niveles: **Resumen** para detectar una situación y **Detalle** para comprobarla. Otra persona de un área distinta debe resolver tres tareas sin que le expliques el reporte. Entregarás A4 con pruebas de cifras, interacción y lectura.

## Jornada

| Horario | Trabajo | Producto |
|---|---|---|
| 08:00–09:00 | Percepción, jerarquía, color y visual por pregunta | Boceto con una pregunta operativa |
| 09:00–10:30 | Página Resumen, construcción guiada | Indicadores, tendencia y comparación |
| 10:30–10:45 | Pausa | |
| 10:45–12:15 | Detalle y trazabilidad, menor guía | Filtros, navegación y comprobación |
| 12:15–13:15 | Comida | |
| 13:15–14:45 | Laboratorio de interacción | Formato condicional, tooltip, marcadores y botones |
| 14:45–15:00 | Pausa | |
| 15:00–16:30 | Taller A4 | Prueba sin explicación del autor y corrección |
| 16:30–17:00 | Validación y cierre | Evidencia y registro individual |

## 1. Preparar el archivo y decidir qué debe entender el lector

Abre A3 y guarda una copia `A4_Apellido.pbix`. Comprueba primero los seis indicadores y sus filtros con la [guía del Día 3](../../dia-03/guia/). El diseño no corrige una cifra equivocada.

Escribe: «Una persona de ___ necesita decidir ___; primero necesita saber ___ y después comprobar ___». Para el caso de clase, usa **¿cómo cambió el volumen producido y en qué líneas se concentra?** El alcance es volumen registrado, no productividad por hora ni causalidad.

Dibuja en papel dos páginas. Usa un orden visual consistente: pregunta y periodo, indicadores, comparación, acceso al detalle. Reserva el color de énfasis para una condición explicada. No dependas solo de rojo/verde: añade texto, símbolo o etiqueta. Emplea el mismo color para la misma categoría en todo el reporte.

| Pregunta | Visual útil | Evita |
|---|---|---|
| ¿Cuánto? | Tarjeta con unidad y periodo | Un número sin contexto |
| ¿Cómo cambia? | Línea por fecha o mes | Meses ordenados alfabéticamente |
| ¿Dónde se concentra? | Barras ordenadas por magnitud | Comparar longitudes en escalas distintas |
| ¿Qué registro sustenta el total? | Tabla o matriz de detalle | Una tabla que duplica hechos al combinarlos |

## 2. Construir Resumen, paso a paso

1. Renombra la página **Resumen**. Define tamaño de página y márgenes consistentes. Añade un cuadro de texto con la pregunta y el alcance.
2. Agrega segmentadores de `dim_calendario[fecha]`, `dim_linea[area]`, `dim_linea[nombre_linea]` y, donde corresponda a producción, `dim_turno[nombre]`. Configura un estado inicial explícito.
3. Coloca tarjetas de `[Piezas]`, `[% Cumplimiento]` y `[% Rechazo producción]`. Muestra unidades y precisión útil; no confundas razón 0.025 con 0.025 %.
4. Crea una línea con `dim_calendario[anio_mes]` y `[Piezas]`, ordenada cronológicamente. Crea barras con `dim_linea[nombre_linea]` y `[Piezas]`.
5. Añade acceso visible a Detalle y un texto que explique cómo filtrar. Configura texto alternativo y orden de tabulación de los elementos significativos; prueba navegación con teclado.
6. Comprueba que un cambio de fecha o línea produzca las cifras de A3. Una tarjeta de mantenimiento debe advertir que turno no la filtra.

Un título de hallazgo válido para una vista fijada en mayo frente a abril es «Mayo registra 1.86 % menos piezas que abril». Si dejas libre el periodo, ese título fijo se vuelve engañoso: usa una pregunta estable o una medida de título que responda al contexto y valida los casos vacíos. No mantengas una conclusión que ya no describe los filtros.

## 3. Construir Detalle y conservar el contexto

1. Crea **Detalle** con una tabla de producción: fecha, línea, turno, parte, lote y medidas apropiadas. Muestra los filtros activos y la unidad.
2. Para el ejercicio de **drillthrough**, coloca exactamente `dim_linea[nombre_linea]` en el área de campos de drillthrough del destino. Usa esa misma columna en las barras de Resumen.
3. Configura **Mantener todos los filtros** si necesitas trasladar el resto del contexto. Desde una barra, usa clic derecho → Drillthrough → Detalle. Comprueba línea, fecha y turno; no asumas que se transfirieron solo porque cambió la página.
4. Incluye botón **Atrás** con acción Volver y prueba el retorno. En Desktop, usa Ctrl + clic cuando sea necesario para probar acciones en modo edición.
5. Para navegación normal entre páginas, añade botones con acción **Navegación de página**. Esta acción no transfiere automáticamente la selección de una barra; si quieres mantener segmentadores, configura **Sincronizar segmentadores** y verifica el alcance por página.

### Trazabilidad entre hechos

Producción, calidad y mantenimiento tienen distintas granularidades. El modelo A2 no relaciona directamente los hechos. Una selección de lote de producción **no filtra automáticamente calidad**. Si muestras otra zona con eventos de calidad, indica su alcance y busca explícitamente el mismo lote normalizado en esa tabla para una comprobación puntual. No inventes relaciones de muchos a muchos para hacer coincidir una pantalla.

Calidad no tiene turno; mantenimiento no tiene turno, parte ni lote. Separa y etiqueta esas zonas. El 01/03/2025, L1, sin filtros adicionales, debe mostrar **2,301 piezas**, **77 rechazadas en calidad** y **21 minutos de mantenimiento total**. Las medidas de correctivos de A3 quedan en blanco: esos minutos son preventivos. «Total» y «correctivo» no son nombres intercambiables.

## 4. Laboratorio funcional

### Interacciones

Selecciona cada segmentador o visual y usa **Editar interacciones**. Decide por cada destino si filtra, resalta o no actúa. Registra la intención y pruébala. Cuando una selección de turno no cambia mantenimiento, explica la ausencia de relación; desactivar una interacción no añade una clave inexistente.

### Formato condicional

En una tabla de cumplimiento, aplica reglas al valor numérico de la medida. Por ejemplo, una meta **didáctica** de 95 % se expresa como 0.95; una regla sobre «porcentaje del rango» no es lo mismo que el porcentaje del indicador. Escribe el umbral y aclara que no es una meta aprobada por la empresa. Prueba valores a ambos lados del umbral y vacíos. Evita que un vacío se vea como cumplimiento cero.

### Tooltip de página

Crea una página con tamaño de información sobre herramientas y habilítala como tooltip. Añade las medidas y dimensiones pertinentes, asígnala al visual origen y verifica que cambie al pasar sobre dos líneas. No escondas en ella la única explicación del periodo, unidad o restricción: debe seguir siendo comprensible sin ratón y en una exportación.

### Marcadores y botones

1. Abre los paneles **Selección** y **Marcadores**. Para alternar dos vistas, configura su visibilidad y crea un marcador por estado.
2. Si el marcador solo cambia la presentación, desactiva **Datos** para que no restaure los filtros guardados. Revisa también página actual y visuales seleccionados según su finalidad.
3. Añade botones con acción Marcador y prueba que alternar una vista conserve una fecha elegida por el lector.
4. Crea un marcador separado **Restablecer filtros** con Datos activado y el estado inicial deliberadamente guardado. Ponle un nombre que anuncie que cambiará filtros.
5. Cambia dos filtros, alterna vistas, restablece y vuelve al detalle. Registra lo esperado y lo observado en cada paso.

Si un botón «borra» selecciones de forma inesperada, revisa Datos en su marcador antes de cambiar medidas o relaciones.

## 5. Prueba de lectura sin explicación del autor

Durante el taller: rúbrica 8 min; preparar al lector 7; terminar el reporte 40; prueba y corrección 30; entrega 5. Elige un compañero de **otra área**. Entrega el archivo o abre el reporte en su estado inicial. El autor observa en silencio, sin señalar botones ni explicar el dato.

El lector debe resolver:

1. Encontrar las piezas de L1 en mayo de 2025 e identificar los filtros que delimitan la respuesta.
2. Llegar al detalle que sustenta esa cifra y volver a Resumen conservando el contexto previsto.
3. Cambiar a turno 1 y explicar qué indicadores responden, cuáles conservan otro alcance y cómo restablecer la vista.

No se evalúa memorizar una ruta. Registra tiempo, respuesta, duda o bloqueo y evidencia. Distribuye los 30 min: 10 para prueba sin ayuda, 10 para revisar y corregir y 10 para repetir las tareas afectadas.

| Tarea | Tiempo | Respuesta y filtros observados | Duda / bloqueo | Cambio realizado | Resultado al repetir |
|---|---|---|---|---|---|
| 1 | | | | | |
| 2 | | | | | |
| 3 | | | | | |

No inventes una cifra esperada nueva: compruébala en una tabla de control de A3 usando el mismo corte antes de probar al lector. El reporte pasa si puede localizar la cifra correcta, reconocer su alcance y recorrer la navegación sin instrucciones del autor. El tiempo se usa para mejorar, no como umbral de acreditación añadido al PDF.

## 6. Evidencia A4 y evaluación

Entrega `A4_Apellido.pbix`, capturas de Resumen y Detalle con filtros visibles, registro de controles numéricos, tabla de interacciones, prueba del lector y al menos una corrección comprobada. Conserva la versión A3.

| Control funcional | Esperado | Observado / corrección |
|---|---|---|
| Cifras respecto de A3 | Igual valor con igual contexto | |
| Drillthrough y retorno | Línea y filtros previstos; regreso operativo | |
| Segmentadores sincronizados | Solo páginas deliberadamente elegidas | |
| Marcador de vista | Mantiene selecciones | |
| Restablecer | Recupera estado inicial anunciado | |
| Tooltip y formato condicional | Contexto y reglas correctos | |
| Lectura y acceso | Títulos, unidades, contraste, teclado y texto alternativo | |

C4 evalúa un reporte legible de dos niveles, elección de visuales y navegación comprensible. Mantén la escala del PDF: **1**, necesita ayuda en pasos críticos; **2**, resuelve autónomamente el caso practicado; **3**, transfiere a una variante no vista y justifica; **4**, detecta y corrige un error ajeno y lo justifica. La prueba de lector no acredita automáticamente nivel 4: debe existir diagnóstico, corrección y explicación.

El evaluador observa el desempeño individual aunque el reporte se construya en equipo. A4 y A5 tienen el doble de peso que las evidencias intermedias según la propuesta; no se añade aquí una calificación porcentual obligatoria.

## Fuentes

Base curricular: propuesta *Analítica Operativa con Power BI* entregada por el instructor, página impresa 5 (física 6), evaluación en 7 (8). Las tareas y el protocolo concretan la prueba solicitada por el PDF.

Referencias técnicas: [drillthrough](https://learn.microsoft.com/en-us/power-bi/create-reports/desktop-drillthrough), [marcadores](https://learn.microsoft.com/en-us/power-bi/create-reports/desktop-bookmarks) y [tooltips de página](https://learn.microsoft.com/en-us/power-bi/create-reports/desktop-tooltips). La práctica ocurre en Power BI Desktop; comprueba las opciones equivalentes en la versión instalada.
