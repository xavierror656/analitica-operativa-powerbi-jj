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

Hoy no se crean medidas nuevas: se **presentan** las de A3 para que otra persona las entienda sin ti. Por eso esta sección empieza comprobando cifras y termina en papel, antes de tocar el lienzo.

### Guarda A4 y comprueba que A3 sigue bien

1. Abre `Apellido_Nombre_A3.pbix` y usa **Archivo → Guardar como** para crear `Apellido_Nombre_A4.pbix`. Desde aquí trabajas en A4; A3 queda intacto como evidencia del día anterior.
2. Ve a **Control_A3** y borra todas las selecciones de los segmentadores. La fila **Total** de la matriz de indicadores debe mostrar **5,822,881** piezas, **89.19 %** de cumplimiento, **97.51 %** buenas, **2.49 %** de rechazo, **560** eventos y **71,248** minutos correctivos. En la matriz por mes, **2025-05** muestra 337,491 frente a 343,875. Si algo no coincide, corrígelo con la [guía del Día 3](../../dia-03/guia/) antes de seguir: el diseño no corrige una cifra equivocada.
3. **Conserva Control_A3.** No la borres ni la conviertas en la página de diseño: es tu página de auditoría y la usarás hoy para comprobar cada cifra del reporte. Ocultarla de la navegación más adelante no la vuelve segura ni la elimina.

### Decide para quién es el reporte

Completa esta frase antes de abrir un visual: «Una persona de ___ necesita decidir ___; primero necesita saber ___ y después comprobar ___».

Para el caso de clase, la pregunta es **¿cómo cambió el volumen producido y en qué líneas se concentra?** Una frase completa sería: «Una persona de **Operaciones** necesita decidir **qué línea revisar primero**; primero necesita saber **cuánto se produjo y cómo cambió frente al mes anterior**, y después comprobar **en qué líneas y registros se concentra**». El alcance es volumen registrado, no productividad por hora ni causalidad.

Otros lectores posibles, por si tu área es distinta:

| Lector | Pregunta | Qué debe encontrar |
|---|---|---|
| Business Excellence | ¿Qué cambió frente al periodo previo? | Tendencia y comparación válida |
| Operaciones | ¿Qué línea y turno requieren revisión? | Detalle de producción filtrado |
| Ingeniería | ¿Dónde se registraron rechazos? | Eventos por defecto y parte |

Una página no necesita responder todas las preguntas con todos los campos visibles.

### Dibuja las dos páginas en papel

Dibuja con cajas, sin detalles, dónde irá cada cosa. La página **Resumen** sigue este orden de lectura, de arriba abajo:

| Zona | Contenido | Pregunta que responde |
|---|---|---|
| Encabezado | Pregunta, periodo y alcance del dato | ¿Qué estoy leyendo? |
| Fila de tarjetas | Piezas · % Cumplimiento · % Rechazo producción | ¿Cuánto? |
| Izquierda | Tendencia por mes (línea) | ¿Qué cambió? |
| Derecha | Comparación por línea (barras) | ¿Dónde se concentra? |
| Pie | Segmentadores de fecha y línea/área · fuente · botón **Ir al detalle →** | ¿Cómo filtro y dónde compruebo? |

La página **Detalle** lleva los mismos segmentadores, una tabla con los registros que sustentan el total y un botón para volver a Resumen. Máximo una pregunta principal por zona; guarda el boceto y compáralo con la frase del lector antes de insertar visuales.

Usa un orden visual consistente: pregunta y periodo, indicadores, comparación, acceso al detalle. Reserva el color de énfasis para una condición explicada. No dependas solo de rojo/verde: añade texto, símbolo o etiqueta. Emplea el mismo color para la misma categoría en todo el reporte.

| Pregunta | Visual útil | Evita |
|---|---|---|
| ¿Cuánto? | Tarjeta con unidad y periodo | Un número sin contexto |
| ¿Cómo cambia? | Línea por fecha o mes | Meses ordenados alfabéticamente |
| ¿Dónde se concentra? | Barras ordenadas por magnitud | Comparar longitudes en escalas distintas |
| ¿Qué registro sustenta el total? | Tabla o matriz de detalle | Una tabla que duplica hechos al combinarlos |

## 2. Construir Resumen, paso a paso

Trabajas en una **página nueva**; Control_A3 no se toca. Construye primero la estructura y las cifras, y deja colores y detalles para el final.

### Página y encabezado

1. Pulsa **+** junto a las pestañas de página para crear una página nueva. Doble clic en su pestaña y renómbrala **Resumen**. Crea también otra página vacía llamada **Detalle**; la necesitarás en el paso 5 y la llenarás en la sección 3.
2. En Resumen, haz clic en una zona vacía del lienzo. En el panel **Formato** → **Configuración del lienzo**, elige **16:9**. Deja un margen igual en los cuatro bordes y alinea los visuales a él.
3. **Insertar → Cuadro de texto**. Arriba, a todo lo ancho, escribe la pregunta y el alcance, por ejemplo: «¿Cómo cambió el volumen producido y en qué líneas se concentra? Piezas registradas, marzo de 2025 a agosto de 2026, datos sintéticos del curso».

### Segmentadores

4. Inserta segmentadores (**Segmentación de datos**, igual que en el Día 3) de `dim_calendario[fecha]`, `dim_linea[area]` y `dim_linea[nombre_linea]`. Agrega `dim_turno[nombre]` solo si el resumen muestra medidas de producción, porque turno no filtra mantenimiento. Si copias los segmentadores desde Control_A3 y Power BI pregunta si quieres sincronizarlos, elige **No sincronizar**: así Control_A3 sigue funcionando por su cuenta.
5. **Estado inicial explícito:** Power BI guarda la selección de cada segmentador con el archivo. Antes de guardar, decide cómo debe abrir el lector la página (lo recomendable: todo el periodo y ninguna línea marcada) y déjalo así. El cuadro de texto del encabezado debe describir ese estado.

### Tarjetas

6. Inserta tres **Tarjetas**: `Piezas`, `% Cumplimiento` y `% Rechazo producción`. Usa las medidas de A3, no columnas sumadas automáticamente.
7. Con cada tarjeta seleccionada, en **Formato** → **Objeto visual** → **Valor de globo** (en otras versiones, **Valor de llamada**), pon **Mostrar unidades: Ninguno**. Si insertaste la **tarjeta nueva** (la que muestra varias tarjetas y opciones como *Diseño de múltiples tarjetas*), la ruta es **Formato → Objeto visual → Llamada → Valor → Mostrar unidades: Ninguno**. Sin eso Power BI muestra «5.82 mill.» y el lector no puede comprobar la cifra exacta. Los porcentajes ya traen formato de A3: deben verse como **89.19 %** y **2.49 %**, no como 0.89 ni 0.025.

   ![Página Resumen con el encabezado de la pregunta, los segmentadores y tres tarjetas (2,591,842 piezas, 89.27 % de cumplimiento y 2.48 % de rechazo con Ensamble marcado); la tarjeta de Piezas está seleccionada y en el panel Formato, sección Valor de globo, el menú Mostrar unidades está abierto con una flecha roja en Ninguno](/imagenes/capturas/dia-04/a4-tarjetas-sin-abreviar.png)

   *Formato → Valor de globo → **Mostrar unidades: Ninguno** (flecha). Con Ensamble marcado, las tres tarjetas repiten los controles de A3: 2,591,842, 89.27 % y 2.48 %.*
8. Cambia el título de cada tarjeta para que diga unidad y alcance, por ejemplo «Piezas producidas (pzas)» o «% Rechazo producción (no buenas / producidas)».

### Tendencia y comparación

9. **Tendencia:** inserta un **Gráfico de líneas** con `dim_calendario[anio_mes]` en el **Eje X** y `Piezas` en el **Eje Y**. Usa `anio_mes`, no `nombre_mes`: el nombre del mes solo junta enero de 2025 con enero de 2026. Comprueba el orden: **…** (más opciones) del visual → **Ordenar por** (en otras versiones, **Ordenar eje**) → `anio_mes` y luego **Orden ascendente**. Debe ir de 2025-03 a 2026-08.

    ![Gráfico de líneas Piezas por anio_mes con el menú Más opciones abierto: Ordenar por muestra anio_mes marcado y, abajo, Orden ascendente marcado y señalado con una flecha roja; el eje va de 2025-03 a 2026-08](/imagenes/capturas/dia-04/a4-ordenar-eje-anio-mes.png)

    *Ordenar por → `anio_mes` + **Orden ascendente** (flecha): el eje queda cronológico, de 2025-03 a 2026-08.*

10. **Comparación:** inserta un **Gráfico de barras agrupadas** con `dim_linea[nombre_linea]` en el **Eje Y** y `Piezas` en el **Eje X**. Ordena por `Piezas`, **descendente**, para que la línea con más volumen quede arriba. Deja que el eje empiece en cero.

    ![Gráfico de barras Piezas por nombre_linea con el menú Ordenar por abierto: Piezas marcado y Orden descendente señalado con una flecha roja; las barras quedan Línea 3, Línea 4, Línea 1 y Línea 2](/imagenes/capturas/dia-04/a4-ordenar-barras-piezas.png)

    *Ordenar por → `Piezas` + **Orden descendente** (flecha): la línea con más volumen, Línea 3, queda arriba.*

11. No mezcles piezas y porcentajes en el mismo eje. Si quieres una tasa en el tiempo, haz otro gráfico.

### Acceso al detalle y accesibilidad

12. **Insertar → Botones → Flecha derecha** (o **En blanco**). En **Formato del botón** → **Estilo** → **Texto**, escribe «Ir al detalle →». En **Acción**, activa la acción con **Tipo: Navegación de páginas** y **Destino: Detalle**. En Desktop se prueba con **Ctrl + clic**.

    ![Panel Formato del botón con Acción activada, Tipo Navegación de páginas y la lista Destino abierta; una flecha roja señala Detalle entre Ninguno, Página 1, Control_A2, Control_A3 y Detalle](/imagenes/capturas/dia-04/a4-boton-navegacion-detalle.png)

    *Acción → Tipo **Navegación de páginas** → Destino **Detalle** (flecha).*

13. Junto al botón, un cuadro de texto breve: «Filtra por fecha o línea; el botón abre los registros de detalle». No escribas que el detalle «conserva la selección» todavía: un botón de navegación normal **no transmite** los filtros. Eso se resuelve en la sección 3 sincronizando segmentadores o con **Obtener detalles**.
14. **Texto alternativo:** en cada tarjeta y gráfico, **Formato** → **General** → **Texto alternativo**: describe qué muestra, por ejemplo «Piezas producidas por mes, de marzo de 2025 a agosto de 2026».
15. **Orden de tabulación:** **Ver → Selección** → pestaña **Orden de tabulación**. Ordena: encabezado, segmentadores, tarjetas, tendencia, comparación, botón. Prueba recorrer la página con **Tab**.

### Comprobar contra A3

16. Repite dos cortes y compara con Control_A3:

| Corte | Piezas | % Cumplimiento | % Rechazo producción |
|---|---:|---:|---:|
| Sin filtros | 5,822,881 | 89.19 % | 2.49 % |
| 01/03/2025 + Línea 1 | 2,301 | 84.75 % | 3.35 % |

En la tendencia, el punto de **2025-05** debe valer **337,491** (pasa el mouse para ver el valor). Si agregas una tarjeta de mantenimiento, su título debe advertir que el turno no la filtra.

![Página Resumen terminada y sin filtros: encabezado con la pregunta y el alcance; segmentadores de fecha (01/01/2025 a 31/12/2026), área, área y línea, y turno; tarjetas 5,822,881 piezas, 89.19 % de cumplimiento y 2.49 % de rechazo; gráfico de líneas de piezas por anio_mes de 2025-03 a 2026-08; barras de piezas por línea ordenadas Línea 3, Línea 4, Línea 1, Línea 2; texto de ayuda y botón Ir a detalle](/imagenes/capturas/dia-04/a4-resumen-completo.png)

*Resumen sin filtros, en el orden de lectura del boceto: pregunta, filtros, cifras, tendencia, comparación y acceso al detalle. Las tarjetas repiten el control de A3: 5,822,881 · 89.19 % · 2.49 %.*

Un título de hallazgo válido para una vista fijada en mayo frente a abril es «Mayo registra 1.86 % menos piezas que abril». Si dejas libre el periodo, ese título fijo se vuelve engañoso: usa una pregunta estable o una medida de título que responda al contexto y valida los casos vacíos. No mantengas una conclusión que ya no describe los filtros.

## 3. Construir Detalle y conservar el contexto

Detalle responde «¿qué registros sustentan la cifra del Resumen?». Cada hecho va en **su propia tabla**, porque tienen granularidad y filtros distintos; no juntes columnas de producción, calidad y mantenimiento en una sola tabla plana.

### Encabezado y tres zonas

1. Ve a la página **Detalle**. Arriba, un cuadro de texto: «Registros que sustentan el Resumen. Producción admite filtro de turno; calidad y mantenimiento no».
2. **Zona Producción.** Inserta una **Tabla** con, en este orden: `dim_calendario[fecha]`, `dim_linea[nombre_linea]`, `dim_turno[nombre]`, `dim_parte[parte_id]`, `fact_produccion[lote]`, `Piezas`, `Buenas` y `No conformes producción`. Usa las columnas de las **dimensiones** para fecha, línea, turno y parte, no las claves ocultas del hecho. En **Formato → Título** escribe «Producción (piezas)».
3. **Zona Calidad.** Otra **Tabla** con `dim_calendario[fecha]`, `dim_linea[nombre_linea]`, `dim_parte[parte_id]`, `fact_calidad[lote]`, `dim_defecto[descripcion]` y `fact_calidad[piezas_rechazadas]` (con **Suma**). Título: «Calidad: piezas rechazadas (sin filtro de turno)».
4. **Zona Mantenimiento.** Otra **Tabla** con `dim_calendario[fecha]`, `dim_linea[nombre_linea]`, `fact_mantenimiento[equipo_id]`, `fact_mantenimiento[tipo]` y `fact_mantenimiento[duracion_min]` (con **Suma**). Título: «Mantenimiento: minutos, todos los tipos (sin filtro de turno, parte ni lote)».

### Obtener detalles (drillthrough): llevar una línea del Resumen al Detalle

5. En Detalle, haz clic en una zona vacía del lienzo (ningún visual seleccionado). Abre el panel **Formato** (icono de pincel, que ahora dice formato de **página**) → **Información de la página** → **Tipo de página: Obtención de detalles**. En versiones anteriores este campo estaba en el panel **Compilar**, sección *Obtener detalles*; si no lo encuentras, escribe «detalles» en **Buscar**.
6. Debajo aparecen tres opciones:
    - **Mantener todos los filtros:** actívalo. Así viajan también la fecha y los demás segmentadores del Resumen, no solo la línea.
    - **Obtener detalles desde:** pulsa **Agregar datos** y elige `dim_linea[nombre_linea]`, exactamente la misma columna que tienen las barras del Resumen.
    - **Entre varios informes:** déjalo apagado.

    Power BI agrega solo un botón **←** (Atrás) arriba a la izquierda; déjalo, es el regreso.

    ![Página Detalle con el panel Formato abierto en Información de la página: Tipo de página Obtención de detalles, Mantener todos los filtros activado, Entre varios informes apagado y Obtener detalles desde con nombre_linea; arriba a la izquierda del lienzo aparece el botón azul con flecha de regreso](/imagenes/capturas/dia-04/a4-campo-obtener-detalles.png)

    *Formato de página → Información de la página: **Tipo de página = Obtención de detalles**, **Mantener todos los filtros** activado y `nombre_linea` en **Obtener detalles desde**. El botón ← apareció solo en la esquina superior izquierda.*
7. Vuelve a **Resumen**. Pon el segmentador de fecha del 01/03/2025 al 01/03/2025. Haz **clic derecho sobre la barra de Línea 1** → **Obtener detalles** → **Detalle**.

    ![Página Resumen con la fecha 01/03/2025 y la barra de Línea 1 seleccionada; el menú contextual muestra nombre_linea Línea 1, Piezas 2,301 y la opción Obtener detalles con el submenú Detalle; las tarjetas muestran 2,301 piezas, 84.75 % de cumplimiento y 3.35 % de rechazo](/imagenes/capturas/dia-04/a4-clic-derecho-obtener-detalles.png)

    *Clic derecho sobre la barra de Línea 1 → **Obtener detalles** → **Detalle**. Al hacer clic en la barra, las tarjetas también se filtran a Línea 1: 2,301 · 84.75 % · 3.35 %.*
8. Comprueba en Detalle:

   | Zona | Total esperado | Por qué |
   |---|---:|---|
   | Producción | 2,301 piezas · 77 no conformes | El mismo corte que el Resumen |
   | Calidad | 77 piezas rechazadas | Coincide en este corte; en otros puede diferir |
   | Mantenimiento | 21 minutos, tipo **preventivo** | Es mantenimiento total; los correctivos de A3 quedan en blanco |

   Abre el panel **Filtros**: debe mostrar `nombre_linea` = Línea 1 y el filtro de fecha. No asumas que se transfirieron solo porque cambió la página.

   ![Página Detalle tras Obtener detalles desde Línea 1 el 01/03/2025: Producción con dos registros (turnos 1 y 2, partes P-1001 y P-3001) y total 2,301 piezas, 2,224 buenas y 77 no conformes; Calidad con dos eventos de la parte P-1001 y total 77 rechazadas; Mantenimiento con un evento preventivo de L1-EQ2 de 21 minutos; botón de regreso arriba a la izquierda](/imagenes/capturas/dia-04/a4-detalle-01-03-l1.png)

   *El mismo corte del Resumen, ahora registro por registro: producción 2,301 · 2,224 · 77, calidad 77 rechazadas y mantenimiento 21 minutos preventivos. La fila correctiva de Línea 3 desapareció porque el filtro de línea sí llegó.*
9. Prueba el regreso con **Ctrl + clic** sobre **← Atrás** (en modo edición de Desktop; en lectura basta un clic). Repite con otra línea, por ejemplo Línea 3.

### Navegación normal frente a Obtener detalles

| Acción | Cómo se configura | Qué lleva a la otra página |
|---|---|---|
| Botón «Ir a detalle» | Acción **Navegación de páginas** | Nada: abre Detalle sin la selección de la barra |
| Clic derecho → Obtener detalles | Campo de obtención de detalles en Detalle | La línea elegida y, con **Mantener todos los filtros**, el resto del contexto |
| ← Atrás | Botón de regreso automático | Vuelve a la página anterior |
| Segmentadores compartidos | **Ver → Sincronización de segmentaciones** | La selección de los segmentadores marcados en ambas páginas |

10. Para que el botón «Ir a detalle» también respete la fecha y la línea, sincroniza esos segmentadores: selecciona el de fecha en Resumen, abre **Ver → Sincronización de segmentaciones** y marca **Detalle** en las columnas de sincronizar y visible. Repite con el de línea. Déjalos **visibles** en Detalle: un filtro sincronizado pero oculto es una «selección invisible» que confunde al lector.

### Trazabilidad entre hechos

Producción, calidad y mantenimiento tienen distintas granularidades. El modelo A2 no relaciona directamente los hechos. Una selección de lote de producción **no filtra automáticamente calidad**. Si muestras otra zona con eventos de calidad, indica su alcance y busca explícitamente el mismo lote normalizado en esa tabla para una comprobación puntual. No inventes relaciones de muchos a muchos para hacer coincidir una pantalla.

Calidad no tiene turno; mantenimiento no tiene turno, parte ni lote. Separa y etiqueta esas zonas. El 01/03/2025, L1, sin filtros adicionales, debe mostrar **2,301 piezas**, **77 rechazadas en calidad** y **21 minutos de mantenimiento total**. Las medidas de correctivos de A3 quedan en blanco: esos minutos son preventivos. «Total» y «correctivo» no son nombres intercambiables.

## 4. Laboratorio funcional

Cuatro técnicas, todas sobre el mismo A4. Cada una debe resolver una tarea del lector; no las agregues solo para completar la lista. Registra para cada una qué esperabas y qué observaste.

### Interacciones

Cuando haces clic en un visual, los demás reaccionan. Hay tres reacciones posibles: **filtrar** (solo quedan los datos elegidos), **resaltar** (se ven todos, con lo elegido más oscuro) o **ninguna**.

1. En **Resumen**, selecciona las **barras de piezas por línea**. En la **cinta superior**, abre la pestaña verde **Formato** (aparece junto a *Datos y detalles* solo cuando hay un visual seleccionado) y pulsa **Editar interacciones**, el primer botón de la izquierda. No es el panel **Formato** de la derecha: ese tiene el mismo nombre pero no incluye esta opción.
2. Sobre cada uno de los demás visuales aparecen iconos pequeños: embudo (**filtrar**), gráfico (**resaltar**) y círculo tachado (**ninguna**). Para las tres tarjetas y el gráfico de tendencia elige **filtrar**: el lector quiere ver la tendencia de la línea elegida, no la de toda la planta resaltada.
3. Vuelve a pulsar **Editar interacciones** para salir. Haz clic en la barra de **Línea 1** sin filtros: las tarjetas deben mostrar **1,340,826 · 89.26 % · 2.47 %** y la tendencia solo Línea 1. Clic otra vez en la barra para quitar la selección.

   ![Resumen con Editar interacciones activo en la pestaña Formato de la cinta: sobre cada visual aparecen los iconos de filtrar y de ninguna; la barra de Línea 1 está seleccionada, las tarjetas muestran 1,340,826 piezas, 89.26 % y 2.47 %, y la tendencia muestra solo la curva de Línea 1](/imagenes/capturas/dia-04/a4-editar-interacciones.png)

   *Pestaña **Formato** de la cinta → **Editar interacciones**. Con Línea 1 seleccionada, las tarjetas y la tendencia se **filtran**: 1,340,826 · 89.26 % · 2.47 %, y la curva baja a la escala de una sola línea. Las tarjetas solo ofrecen filtrar o ninguna; resaltar no aplica a un número.*
4. Registra la decisión:

   | Origen | Destino | Interacción | Por qué |
   |---|---|---|---|
   | Barras por línea | Tarjetas | Filtrar | Las cifras deben ser de la línea elegida |
   | Barras por línea | Tendencia | Filtrar | Ver cómo cambió esa línea en el tiempo |

Cuando una selección de turno no cambia mantenimiento, explica la ausencia de relación; desactivar una interacción no añade una clave inexistente, y no la anules para esconder un error de modelo.

### Formato condicional

El color debe tener una regla que puedas explicar con un número. Aquí se usa una **meta didáctica de 90 %**: no es una meta aprobada por la empresa, solo un umbral para practicar. Se eligió 90 % y no 95 % porque los días del caso rondan 86–91 %; con 95 % ningún valor quedaría por encima y no podrías probar ambos lados.

1. En **Detalle**, agrega una **Tabla** «Cumplimiento por día (meta didáctica 90 %)» con `dim_calendario[fecha]`, `Piezas`, `Plan` y `% Cumplimiento`.
2. En el panel **Compilar**, cuadro **Columnas** (en una tabla no se llama Valores), haz clic derecho sobre `% Cumplimiento` o pulsa la flecha **›** a su derecha → **Formato condicional** → **Iconos**. Ruta alternativa: panel **Formato → Objeto visual → Elementos de celda**, serie `% Cumplimiento`, activa **Iconos** y pulsa **fx**.
3. **Estilo de formato: Reglas.** Power BI propone tres reglas en **Porcentaje**; esa es la trampa: «Porcentaje» es la posición dentro del rango de valores, no el % del indicador (con un solo valor en la tabla, cualquier cifra queda «al 100 % del rango» y sale en verde aunque esté debajo de la meta). Borra la tercera regla con la **X** y deja dos, cambiando cada lista a **Número**: *si el valor* **>=** `0` y **<** `0.9` → **triángulo ámbar**; *si el valor* **>=** `0.9` y **<=** `1` → **círculo verde**. Por eso el umbral se escribe `0.9`.

   ![Ventana Iconos con Estilo de formato Reglas sobre % Cumplimiento y dos reglas en Número: si el valor es mayor o igual que 0 y menor que 0.9, triángulo ámbar; si es mayor o igual que 0.9 y menor o igual que 1, círculo verde](/imagenes/capturas/dia-04/a4-formato-condicional-reglas.png)

   *Dos reglas, ambas en **Número**: `0`–`0.9` → triángulo; `0.9`–`1` → círculo. Revisa las cuatro listas antes de **Aceptar**: basta una en «Porcentaje» para que la regla mida otra cosa.*
4. Cambia el título de la tabla para que la leyenda esté en texto: «● ≥ 90 % · ▲ < 90 % (meta didáctica)». El color o el icono complementan el texto, no lo sustituyen.
5. **Prueba ambos lados y el blanco.** Lleva a Detalle la fecha del 01/05/2025 al 07/05/2025. El botón **Ir a detalle** solo la lleva si ya **sincronizaste el segmentador de fecha** (paso 10 de la sección 3); si no, Detalle se abre sin ese filtro. Si quedó un filtro viejo de Obtener detalles (por ejemplo 01/03/2025 + Línea 1), quítalo en el panel **Filtros** de Detalle. Debe haber días con círculo y días con triángulo.
6. **El domingo 04/05 no aparece**: una tabla oculta las filas en que todas las medidas están vacías, y ese día no tiene producción ni plan. Que no aparezca es la comprobación: el vacío no recibe icono ni se presenta como 0 %. Si tu versión ofrece **Mostrar elementos sin datos** (clic derecho o flecha **›** sobre `fecha` en **Columnas**), puedes activarlo para ver la fila vacía; no es obligatorio.

   ![Tabla Cumplimiento por día (meta didáctica 90 %) del 01/05/2025 al 07/05/2025: círculo verde en 01/05 (90.72 %), 03/05 (90.60 %) y 07/05 (90.09 %); triángulo ámbar en 02/05 (89.05 %), 05/05 (88.06 %) y 06/05 (89.05 %); el domingo 04/05 no aparece; total 77,234 piezas, 86,230 de plan y 89.57 %](/imagenes/capturas/dia-04/a4-formato-condicional-mayo.png)

   *Valores a ambos lados de la meta didáctica: círculo en tres días (≥ 90 %) y triángulo en otros tres (< 90 %). El domingo sin producción no aparece, y el total de 77,234 piezas coincide con el MTD del 07/05 del Día 3.*

### Tooltip de página

Un tooltip de página es una mini página que aparece al pasar el mouse sobre un visual y hereda el punto señalado.

1. Crea una página nueva y llámala **Tooltip línea**.
2. Con el lienzo seleccionado, en **Formato** → **Información de la página** → **Tipo de página**, elige **Información sobre herramientas**. En **Configuración del lienzo**, el tipo cambia a tamaño de información sobre herramientas (pequeño).
3. Agrega una **Tarjeta** con `dim_linea[nombre_linea]` y dos más con `Piezas` y `% Cumplimiento` (con **Mostrar unidades: Ninguno**: en la tarjeta nueva está en **Llamada → Valor**). La tarjeta de texto antepone «Primera» al nombre del campo; en **Compilar** haz doble clic sobre el campo y renómbralo «Línea». Nada de tablas diminutas.
4. Vuelve a **Resumen**, selecciona las **barras por línea** → **Formato** → **General** → **Información sobre herramientas** → **Tipo: Página de informe** → **Página: Tooltip línea**.
5. Pasa el mouse, sin filtros, sobre **Línea 1**: debe mostrar Línea 1, **1,340,826** piezas y **89.26 %**. Sobre **Línea 3**: **1,682,162** piezas. Si muestra la planta completa, el tooltip no está heredando el punto.

   ![Resumen con la fecha del 01/05/2025 al 07/05/2025 y el mouse sobre la barra de Línea 3: aparece el tooltip de página con tres tarjetas, Línea 3, 22,237 piezas y 89.85 % de cumplimiento](/imagenes/capturas/dia-04/a4-tooltip-linea.png)

   *Con la fecha del 01/05 al 07/05 y el mouse sobre Línea 3, el tooltip hereda **las dos cosas**: la línea señalada y el periodo del segmentador. No muestra la planta completa ni todo el año.*
6. Clic derecho en la pestaña **Tooltip línea** → **Ocultar página**, para que el lector no la vea como una página más.

No escondas en el tooltip la única explicación del periodo, la unidad o una restricción: debe seguir siendo comprensible sin mouse y en una exportación.

### Marcadores y botones

Un marcador guarda un **estado** de la página. El riesgo es guardar más de lo que querías, sobre todo los filtros (opción **Datos**).

Vas a alternar la tendencia entre **gráfico** y **tabla**, y a crear un botón para **restablecer filtros**.

1. En **Resumen**, inserta una **Tabla** con `dim_calendario[anio_mes]`, `Piezas`, `Piezas mes anterior` y `% Variación mensual`. Colócala exactamente encima del gráfico de tendencia, del mismo tamaño.
2. **Ver → Selección** y **Ver → Marcadores**. En Selección, oculta la tabla con el ojo (solo se ve el gráfico).

   ![Pestaña Ver con los paneles Marcadores y Selección abiertos; en Selección, la Tabla aparece primera con el ojo tachado (oculta) y el resto de visuales visibles; en el lienzo solo se ve el gráfico de líneas de tendencia](/imagenes/capturas/dia-04/a4-paneles-seleccion-marcadores.png)

   *Panel **Selección**: la Tabla queda oculta (ojo tachado) y en su lugar se ve el gráfico. El panel **Marcadores** todavía está vacío; su botón **Agregar** guarda el estado actual.*
3. En Marcadores, **Agregar** y renómbralo **Vista gráfico**. En sus **…** desmarca **Datos**; deja **Mostrar** y **Página actual**. Sin Datos, el marcador no toca los filtros del lector.
4. En Selección, oculta el gráfico y muestra la tabla, y **comprueba en el lienzo que se ve la tabla**: **Agregar** guarda lo que está visible en ese momento. Luego **Agregar** → **Vista tabla**, también sin **Datos**. Prueba clic en cada marcador: si los dos muestran lo mismo, guardaron el mismo estado; elimínalos y créalos de nuevo en este orden.

   ![Panel Marcadores con Vista gráfico y Vista tabla; el menú de opciones de Vista tabla está abierto con Datos sin marcar y Mostrar, Página actual y Todos los objetos visuales marcados; arriba aparece la opción Actualizar](/imagenes/capturas/dia-04/a4-marcador-sin-datos.png)

   *Menú **…** del marcador: **Datos** sin marcar, **Mostrar** y **Página actual** marcados. Si guardaste un marcador con el estado equivocado (por ejemplo, la tabla todavía oculta), corrige la visibilidad en Selección y usa **Actualizar** en ese mismo menú: sobrescribe el estado sin crear otro marcador.*
5. Inserta dos botones (**Insertar → Botones → En blanco**) con texto «Ver gráfico» y «Ver tabla»; en **Acción**, **Tipo: Marcador** y el marcador correspondiente.
6. **Restablecer:** quita todas las selecciones de los segmentadores y deja visible el gráfico. **Agregar** → **Restablecer filtros**, esta vez **con Datos activado**: es el único marcador que debe cambiar filtros, y su nombre lo anuncia. Crea un botón «Restablecer filtros» con esa acción.
   ![Resumen sin filtros con tres botones bajo el gráfico de tendencia: Ver gráfico, Restablecer filtros y Ver tabla; las tarjetas muestran 5,822,881 piezas, 89.19 % de cumplimiento y 2.49 % de rechazo](/imagenes/capturas/dia-04/a4-botones-marcadores.png)

   *Los tres botones con verbo, junto a la zona que controlan. «Ver gráfico» y «Ver tabla» solo cambian visibilidad; «Restablecer filtros» es el único que limpia selecciones.*
7. **Prueba con Ctrl + clic:**

   | Acción | Esperado |
   |---|---|
   | Fecha en mayo de 2025 y Línea 1 | Las tarjetas cambian |
   | Ver tabla | Aparece la tabla; **la fecha y la línea no cambian** |
   | Ver gráfico | Vuelve el gráfico; filtros intactos |
   | Restablecer filtros | Segmentadores limpios, tarjetas en **5,822,881 · 89.19 % · 2.49 %** |

Los botones llevan verbos («Ver detalle», «Volver al resumen», «Restablecer filtros») y su acción explícita; un icono sin etiqueta puede ser ambiguo para otra área.

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

### Respuestas modelo para quien aplica la prueba

Ten esta tabla a mano, pero **no se la muestres al lector**. Las cifras salen del reporte con los segmentadores indicados.

| Tarea | Respuesta esperada | Filtros que debe nombrar |
|---|---|---|
| 1. Piezas de L1 en mayo de 2025 | **80,001** piezas · 89.21 % de cumplimiento · 2.40 % de rechazo | Fecha 01/05/2025–31/05/2025 y Línea 1 (la jerarquía la ubica dentro de Ensamble) |
| 2. Detalle y regreso | Clic derecho en la barra de Línea 1 → **Obtener detalles** → Detalle. El total de producción vuelve a sumar 80,001; con **←** regresa a Resumen con la fecha y la línea intactas | Los mismos de la tarea 1, visibles en el panel Filtros de Detalle |
| 3. Turno 1 y restablecer | Las tarjetas de producción cambian; la tabla de mantenimiento de Detalle **no**, porque no tiene turno. **Restablecer filtros** vuelve a 5,822,881 · 89.19 % · 2.49 % | Turno 1 aplica solo a producción |

Error frecuente: marcar **1** en el segmentador de **turno** en lugar de **Línea 1**. Con mayo de 2025 y turno 1 las tarjetas muestran **107,592** piezas: es una cifra correcta, pero responde otra pregunta. Si el lector la da, registra la duda y revisa si las etiquetas de los segmentadores («nombre», «area, nombre_linea») se entienden sin el autor; renombrarlas a «Turno» y «Área y línea» suele ser la corrección.

![Resumen con la fecha del 01/05/2025 al 31/05/2025 y Línea 1 marcada dentro de Ensamble en el segmentador de área y línea: tarjetas 80,001 piezas, 89.21 % de cumplimiento y 2.40 % de rechazo; la barra muestra solo Línea 1](/imagenes/capturas/dia-04/a4-lector-tarea1-l1-mayo.png)

*Respuesta de la tarea 1: 80,001 piezas de Línea 1 en mayo de 2025, con los dos filtros visibles en sus segmentadores.*

No inventes una cifra esperada nueva: compruébala en una tabla de control de A3 usando el mismo corte antes de probar al lector. El reporte pasa si puede localizar la cifra correcta, reconocer su alcance y recorrer la navegación sin instrucciones del autor. El tiempo se usa para mejorar, no como umbral de acreditación añadido al PDF.

## 6. Evidencia A4 y evaluación

Entrega `Apellido_Nombre_A4.pbix`, capturas de Resumen y Detalle con filtros visibles, registro de controles numéricos, tabla de interacciones, prueba del lector y al menos una corrección comprobada. Conserva la versión A3.

| Control funcional | Esperado | Observado / corrección |
|---|---|---|
| Cifras respecto de A3 | Igual valor con igual contexto | |
| Drillthrough y retorno | Línea y filtros previstos; regreso operativo | |
| Segmentadores sincronizados | Solo páginas deliberadamente elegidas | |
| Marcador de vista | Mantiene selecciones | |
| Restablecer | Recupera estado inicial anunciado | |
| Tooltip y formato condicional | Contexto y reglas correctos | |
| Lectura y acceso | Títulos, unidades, contraste, teclado y texto alternativo | |

### Antes de entregar

- [ ] Pulsa **Restablecer filtros**: el archivo debe abrir en el estado inicial que anuncia el encabezado.
- [ ] La página **Tooltip línea** está oculta (clic derecho en la pestaña → **Ocultar página**).
- [ ] **Control_A3** sigue en el archivo, sin cambios.
- [ ] Los segmentadores tienen nombres que un lector entiende (por ejemplo «Turno», no «nombre»).
- [ ] Guardaste como `Apellido_Nombre_A4.pbix` y conservas A3 aparte.

C4 evalúa un reporte legible de dos niveles, elección de visuales y navegación comprensible. Mantén la escala del PDF: **1**, necesita ayuda en pasos críticos; **2**, resuelve autónomamente el caso practicado; **3**, transfiere a una variante no vista y justifica; **4**, detecta y corrige un error ajeno y lo justifica. La prueba de lector no acredita automáticamente nivel 4: debe existir diagnóstico, corrección y explicación.

El evaluador observa el desempeño individual aunque el reporte se construya en equipo. A4 y A5 tienen el doble de peso que las evidencias intermedias según la propuesta; no se añade aquí una calificación porcentual obligatoria.

## Fuentes

Base curricular: propuesta *Analítica Operativa con Power BI* entregada por el instructor, página impresa 5 (física 6), evaluación en 7 (8). Las tareas y el protocolo concretan la prueba solicitada por el PDF.

Referencias técnicas: [drillthrough](https://learn.microsoft.com/en-us/power-bi/create-reports/desktop-drillthrough), [marcadores](https://learn.microsoft.com/en-us/power-bi/create-reports/desktop-bookmarks) y [tooltips de página](https://learn.microsoft.com/en-us/power-bi/create-reports/desktop-tooltips). La práctica ocurre en Power BI Desktop; comprueba las opciones equivalentes en la versión instalada.
