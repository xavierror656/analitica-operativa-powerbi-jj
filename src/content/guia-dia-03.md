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

Descarga el [recetario de medidas](../../descargas/medidas-dia-03.dax) y el [calendario completo](../../descargas/calendario-dia-03.pq). El recetario contiene definiciones separadas: **crea una medida cada vez**, no pegues todo como una sola fórmula. Guarda A2 y usa **Guardar como** para crear `Apellido_Nombre_A3.pbix`. Después, clic derecho sobre la pestaña de tu página **Control_A2** → **Duplicar página** y renombra la copia como **Control_A3** (doble clic en la pestaña). Conserva sus segmentadores y limpia las selecciones: todas las pruebas del día se hacen y se guardan en esa página, y el Día 4 la usa como referencia de auditoría.

Antes de empezar, comprueba las ocho tablas, las diez relaciones activas de A2, su dirección dimensión → hecho y las 7,067 filas limpias de producción. Sin filtros, producción suma **5,822,881 piezas**. Si no coincide, corrige A1/A2 antes de continuar.

## 1. Contexto antes de fórmula

Una columna calculada se evalúa para cada fila y se guarda en el modelo. Una medida se calcula en el contexto solicitado por un visual. Un segmentador, una fila de matriz y los filtros de página pueden cambiar ese contexto. Una medida no tiene por sí sola una «fila actual» de producción.

Ejemplo: una tarjeta sin filtros muestra toda la producción; la misma medida con L1 muestra 1,340,826. No necesitas una fórmula por línea. Usa dimensiones para segmentar y respeta las relaciones del Día 2.

### Qué es DAX y cómo lo usarás hoy

**DAX** (*Data Analysis Expressions*) es el lenguaje de fórmulas de Power BI. Se parece a las fórmulas de Excel, pero en vez de apuntar a celdas (`B2:B100`) apunta a **tablas y columnas del modelo**. Power Query (días 1 y 2) limpia y prepara los datos; DAX **calcula** sobre el modelo ya cargado.

Hoy lo usarás para una sola cosa: **medidas**. Una medida es una fórmula con nombre que se guarda en una tabla y que puedes arrastrar a cualquier visual; Power BI la recalcula según los filtros de ese visual. Tres reglas de escritura:

- `Tabla[columna]` identifica una columna, por ejemplo `fact_produccion[piezas_producidas]`.
- `[Medida]` entre corchetes, sin tabla, llama a otra medida ya creada, por ejemplo `[Piezas]`.
- Cada medida tiene la forma `Nombre = expresión`. Lo que va antes del `=` es el nombre que verás en el panel Datos.

Si tu configuración usa separadores DAX localizados, adapta comas a punto y coma sin cambiar los nombres ni la lógica.

### Tu primera medida, paso a paso

1. Abre `Apellido_Nombre_A3.pbix` en la **vista Informe** (primer icono de la barra izquierda).
2. En el panel **Datos** (derecha), haz clic derecho sobre la tabla `fact_produccion` y elige **Nueva medida**. También puedes seleccionar la tabla y usar **Inicio → Nueva medida**. Crear la medida desde la tabla correcta hace que quede guardada ahí.
3. Aparece la **barra de fórmulas** encima del lienzo con el texto `Medida = `. Borra ese texto y escribe:

   ```dax
   Piezas = SUM(fact_produccion[piezas_producidas])
   ```

   Mientras escribes, Power BI sugiere tablas y columnas; puedes aceptar la sugerencia con **Tab**.

   ![Vista Informe con tres flechas rojas: 1 hacia la tabla fact_produccion en el panel Datos, 2 hacia Nueva medida en su menú contextual y 3 hacia la barra de fórmulas con Piezas = SUM(fact_produccion[piezas_producidas]); la cinta muestra la pestaña Herramientas de medición](/imagenes/capturas/dia-03/a3-nueva-medida-piezas.png)

   *Clic derecho sobre `fact_produccion` (flecha 1), **Nueva medida** (flecha 2) y fórmula escrita en la barra (flecha 3). Al crearla se activa la pestaña **Herramientas de medición**; su campo **Tabla inicial** confirma que la medida quedó en `fact_produccion`.*
4. Confirma con **Enter** o con la palomita (✓) a la izquierda de la barra. Si la fórmula tiene un error, aparece un mensaje debajo de la barra y la medida no se crea hasta corregirlo.

   Si aparece **«El nombre 'Piezas' ya se usa en una medida de la tabla 'fact_produccion'»**, la medida ya existe (por ejemplo, de un intento anterior). Cierra el aviso, cancela con la **X** de la barra de fórmulas y, si quedó una medida sobrante llamada `Medida`, elimínala con clic derecho → **Eliminar del modelo**. Nunca dos medidas pueden tener el mismo nombre, aunque estén en tablas distintas.
5. Comprueba el resultado: en el panel Datos, dentro de `fact_produccion`, aparece `Piezas` con icono de **calculadora**. Ese icono distingue una medida de una columna.
6. Con `Piezas` seleccionada, en la cinta **Herramientas de medición**, grupo Formato, elige **Número entero** y activa el **separador de miles** (botón `,`).
7. Prueba rápida: inserta una **Tarjeta**, arrastra `Piezas` y verifica **5,822,881**.

## 2. Medidas base y una prueba de filtro

Ya tienes `Piezas`. Crea las otras tres igual (clic derecho en `fact_produccion` → **Nueva medida**), en este orden y con el mismo formato de número entero y separador de miles:

```dax
Piezas = SUM(fact_produccion[piezas_producidas])
Plan = SUM(fact_produccion[piezas_plan])
Buenas = SUM(fact_produccion[piezas_buenas])
No conformes producción = [Piezas] - [Buenas]
```

Son **cuatro medidas separadas**. Ahora compruébalas en **Control_A3**:

1. **Matriz.** Inserta una **Matriz**. En **Filas** arrastra `dim_linea[nombre_linea]` (Línea 1 a Línea 4); en **Valores**, `Piezas`, `Plan`, `Buenas` y `No conformes producción`, en ese orden. El total debe mostrar 5,822,881 piezas. Si prefieres usar la jerarquía del Día 2 (área → línea) también funciona: expande con **+** para ver cada línea.
2. **Segmentadores.** Un segmentador es un visual cuyo único trabajo es filtrar la página. En el panel **Compilar** busca el icono de embudo con lista cuyo nombre emergente es **Segmentación de datos** (está antes de Tabla y Matriz). Desktop también ofrece *Segmentación de botones*, *de entrada* y *de lista (versión preliminar)*; para este curso usa la clásica, porque con fechas muestra la barra «Entre». Una **Tabla** o **Matriz** con una sola columna no es un segmentador: al hacer clic en ella solo resalta los demás visuales y no tiene botón de borrar selecciones. Control_A3 debe tener al menos estos tres segmentadores (si ya vienen de Control_A2, solo comprueba la columna), cada uno con **una sola columna de su dimensión**:

   | Segmentador | Columna | Cómo se ve |
   |---|---|---|
   | Fecha | `dim_calendario[fecha]` | Barra deslizante con dos fechas («Entre») |
   | Área | `dim_linea[area]` | Lista: Empaque, Ensamble |
   | Turno | `dim_turno[nombre]` | Lista: 1, 2, 3 |

   ![Panel Compilar con el globo Segmentación de datos sobre el icono de embudo con lista, señalado por una flecha roja, junto a Tabla y Matriz; en el lienzo, la matriz por área y línea con Línea 1 en 2,301 y abajo los segmentadores de fecha (01/03/2025 a 01/03/2025), área (Empaque, Ensamble) y turno como lista con casillas 1, 2 y 3](/imagenes/capturas/dia-03/a3-segmentacion-de-datos.png)

   *El icono **Segmentación de datos** está en la misma fila que Tabla y Matriz. Abajo, los tres segmentadores con la prueba del 01/03/2025: la fila **Línea 1** muestra 2,301 piezas, 2,715 de plan y 2,224 buenas. La flecha de la izquierda marca el rango de fechas «Entre» con el mismo día en ambos extremos.*

   Si el segmentador de turno aparece como barra deslizante (1 a 3) en lugar de lista, `dim_turno[nombre]` quedó como **número**. Revisa su tipo en la vista Tabla: debe ser **Texto**, igual que `fact_produccion[turno]`; si no, corrígelo en Power Query. La medida `Piezas turno 3` de abajo compara con el texto `"3"` y fallaría con un número.

   Usa siempre la columna de la **dimensión**, no la del hecho (por ejemplo, no `fact_produccion[turno]`): así el mismo segmentador filtra producción, calidad y mantenimiento a través de las relaciones del Día 2.
3. **Un filtro por vez.** Aplica un segmentador, anota el total de `Piezas` y **borra la selección** antes de probar el siguiente: pasa el mouse sobre el segmentador y usa la goma **Borrar selecciones**, junto al icono de filtro. También puedes hacer clic otra vez sobre el valor seleccionado. Si combinas filtros no sabrás cuál cambió la cifra.

   | Prueba | Piezas esperadas |
   |---|---:|
   | Sin filtros | 5,822,881 |
   | Área = Ensamble | 2,591,842 |
   | Turno = 1 | 1,954,605 |
   | Fecha = 01/03/2025 a 01/03/2025, y en la matriz la fila Línea 1 | 2,301 |

   Si una cifra no coincide, revisa primero que no haya otro segmentador con una selección olvidada.

```dax
Piezas turno 3 =
CALCULATE([Piezas], dim_turno[nombre] = "3")
```

**Para qué sirve:** `CALCULATE` evalúa una medida con un filtro que tú fijas en la fórmula. Aquí fija el turno en "3", pase lo que pase en el segmentador de turno.

1. Crea la medida en `fact_produccion`, igual que las anteriores.
2. Inserta una **Tarjeta** con `Piezas turno 3`, junto a la de `Piezas`.
3. En el segmentador de turno (`dim_turno[nombre]`, **esa misma columna**) marca solo el **1**.
4. Compara las dos tarjetas:

   | Tarjeta | Turno 1 marcado | Por qué |
   |---|---:|---|
   | Piezas | 1,954,605 | Respeta el segmentador: muestra el turno 1 |
   | Piezas turno 3 | 1,934,134 | CALCULATE sustituye el turno 1 por el 3 |

5. Contraprueba: marca solo el **3**. Las dos tarjetas deben mostrar 1,934,134.

![Página de prueba con el segmentador de turno en 1: la tarjeta Piezas muestra 1,954,605 y la tarjeta Piezas turno 3 muestra 1,934,134; la matriz por área y línea también refleja solo el turno 1 y el segmentador de fecha abarca 01/03/2025 a 31/08/2026](/imagenes/capturas/dia-03/a3-calculate-turno3.png)

*Con el turno 1 marcado, todo responde al turno 1 (tarjeta Piezas y matriz) excepto `Piezas turno 3`, que sigue mostrando el turno 3.*

CALCULATE solo sustituye filtros sobre la **columna que nombra**; si filtras línea, fecha o área, `Piezas turno 3` sí cambia. Dentro de un contexto de fila también puede realizar transición de contexto, tema que no necesitas hoy.

### Participación de cada línea en la planta

Ahora al revés: en vez de fijar un filtro, **quitarlo**. Se crea igual que `Piezas`: clic derecho sobre `fact_produccion` → **Nueva medida**, borra `Medida = ` y pega el bloque completo en la barra de fórmulas. Las cinco líneas son **una sola medida**; si escribes a mano, usa **Shift + Enter** para saltar de línea (Enter solo confirma). Luego, en **Herramientas de medición**, dale formato **Porcentaje** con **2** decimales:

```dax
% Participación planta =
DIVIDE(
    [Piezas],
    CALCULATE([Piezas], REMOVEFILTERS(dim_linea))
)
```

El numerador son las piezas de la fila (una línea o un área). El denominador quita cualquier filtro de `dim_linea` y devuelve las piezas de **toda la planta**. `dim_linea` contiene línea y área, así que quita las dos; fecha, turno y parte se conservan.

Agrégala a los **Valores** de la matriz, borra todas las selecciones y comprueba:

| Fila | % Participación planta |
|---|---:|
| Línea 1 | 23.03 % |
| Línea 2 | 21.48 % |
| Línea 3 | 28.89 % |
| Línea 4 | 26.60 % |
| Ensamble | 44.51 % |
| Empaque | 55.49 % |
| Total | 100.00 % |

![Matriz de Control_A3 sin filtros, con área y línea en filas y las columnas Piezas, Plan, Buenas, No conformes producción y % Participación planta: Empaque 55.49 % (Línea 3 28.89 %, Línea 4 26.60 %), Ensamble 44.51 % (Línea 1 23.03 %, Línea 2 21.48 %), Total 100.00 %](/imagenes/capturas/dia-03/a3-participacion-planta.png)

*Sin filtros, cada línea muestra su parte de la planta y el total suma 100 %. Las cifras de piezas coinciden con los controles: Línea 1 1,340,826, Ensamble 2,591,842, total 5,822,881.*

Después marca **turno 1**: los porcentajes cambian, porque ahora el denominador es solo la planta en turno 1, y el total sigue en 100 %. En cambio, si marcas **Ensamble** en el segmentador de área, Línea 1 y Línea 2 no suman 100 %: REMOVEFILTERS también quita el filtro de área y el denominador vuelve a ser la planta completa. Explica ese denominador antes de interpretar el porcentaje.

## 3. Los seis indicadores de A3

| Medida | Pregunta | Definición / unidad | Alcance |
|---|---|---|---|
| Piezas | ¿Cuánto se produjo? | Suma de piezas producidas | Fecha, línea, área, turno y parte |
| % Cumplimiento | ¿Qué proporción del plan se produjo? | Piezas / Plan; porcentaje | Mismos filtros de producción |
| % Buenas | ¿Qué proporción se registró como buena? | Buenas / Piezas; porcentaje | No equivale a rendimiento de primera pasada |
| % Rechazo producción | ¿Qué proporción no fue buena? | (Piezas − Buenas) / Piezas; porcentaje | Derivado del registro de producción |
| Eventos correctivos | ¿Cuántas filas de eventos correctivos hay? | Conteo de filas de mantenimiento tipo correctivo | Fecha, línea y área; no turno ni parte |
| Minutos correctivos | ¿Cuántos minutos duran esos eventos? | Suma de duración de correctivos; minutos | Mismo alcance de mantenimiento |

`Piezas` ya existe desde la sección 2. Faltan cinco medidas: tres de producción y dos de mantenimiento.

### Tres porcentajes de producción

Crea **cada una por separado** en `fact_produccion` (clic derecho → **Nueva medida**) y dale formato **Porcentaje, 2 decimales**:

```dax
% Cumplimiento = DIVIDE([Piezas], [Plan])
```

```dax
% Buenas = DIVIDE([Buenas], [Piezas])
```

```dax
% Rechazo producción = DIVIDE([No conformes producción], [Piezas])
```

DIVIDE devuelve **BLANK** (celda vacía) cuando el denominador es cero o está vacío, en lugar de un error. «Sin datos» no significa desempeño cero. No multipliques por 100: el formato Porcentaje ya lo hace.

### Dos medidas de mantenimiento

Estas cuentan eventos de **mantenimiento**, así que créalas en `fact_mantenimiento` (clic derecho sobre esa tabla → **Nueva medida**), con formato **Número entero** y separador de miles. Cada bloque es una medida; pégalo completo:

```dax
Eventos correctivos =
CALCULATE(
    COUNTROWS(fact_mantenimiento),
    fact_mantenimiento[tipo] = "correctivo"
)
```

```dax
Minutos correctivos =
CALCULATE(
    SUM(fact_mantenimiento[duracion_min]),
    fact_mantenimiento[tipo] = "correctivo"
)
```

`COUNTROWS` cuenta filas; `CALCULATE` fija `tipo = "correctivo"`, igual que en `Piezas turno 3` se fijaba el turno. Si alguien filtra otro tipo en esa misma columna, CALCULATE lo sustituye por correctivo; por eso el título debe decir **correctivos**. El conteo representa filas de eventos, no órdenes únicas: no hay identificador de orden en el archivo.

### Dónde comprobarlos

En **Control_A3**, inserta una segunda **Matriz** con la jerarquía área → línea en **Filas** y los seis indicadores en **Valores**: `Piezas`, `% Cumplimiento`, `% Buenas`, `% Rechazo producción`, `Eventos correctivos` y `Minutos correctivos`. Sin selecciones en los segmentadores, la fila **Total** corresponde a la columna «Sin filtros» de la tabla de controles de abajo, la fila **Línea 1** a «L1» y la fila **Ensamble** a «Ensamble»: una sola matriz comprueba tres columnas.

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

![Matriz de los seis indicadores sin filtros, con área y línea en filas: Ensamble 2,591,842 piezas, 89.27 %, 97.52 %, 2.48 %, 276 eventos y 35,261 minutos; Línea 1 1,340,826, 89.26 %, 97.53 %, 2.47 %, 150 y 18,241; Total 5,822,881, 89.19 %, 97.51 %, 2.49 %, 560 y 71,248](/imagenes/capturas/dia-03/a3-seis-indicadores.png)

*Una sola matriz sin selecciones comprueba las tres columnas: la fila **Total** es «Sin filtros», **Línea 1** es «L1» y **Ensamble** es «Ensamble». Todas las cifras coinciden con la tabla de controles.*

Pruebas adicionales obligatorias:

- **01/03/2025 y L1:** 2,301 piezas; 2,715 plan; 2,224 buenas; 84.75 % cumplimiento. No hay eventos correctivos: sus medidas quedan en blanco. Los 21 minutos de mantenimiento de ese corte son preventivos.
- **Solo turno 1:** 1,954,605 piezas; 560 eventos correctivos y 71,248 minutos correctivos permanecen sin filtrar por turno. Etiqueta esa diferencia de alcance.
- **Enero de 2025 (se hace en la sección 4, paso 11, con el calendario ampliado):** el calendario sí contiene esas fechas, pero los hechos no tienen registros; los seis indicadores deben quedar en blanco. No conviertas ese vacío en desempeño cero.

![Control_A3 con fecha 01/03/2025 a 01/03/2025 y Línea 1 marcada: la matriz de indicadores muestra 2,301 piezas, 84.75 % de cumplimiento, 96.65 % buenas y 3.35 % de rechazo, con Eventos correctivos y Minutos correctivos vacíos; la matriz superior muestra 2,715 de plan y 2,224 buenas](/imagenes/capturas/dia-03/a3-prueba-01-03-l1.png)

*Prueba del 01/03/2025 con Línea 1. Las columnas de mantenimiento correctivo quedan **vacías**, no en cero: ese día solo hubo mantenimiento preventivo, y COUNTROWS y SUM devuelven BLANK cuando no hay filas que contar o sumar.*

Acepta coincidencia exacta en conteos y cantidades; en porcentajes, compara el valor completo y luego el formato a dos decimales. Al fallar, revisa filtros activos, denominador, relaciones y pasos de limpieza, en ese orden.

## 4. Laboratorio de inteligencia de tiempo

### Preparar el calendario sin perder el modelo

**Por qué:** las funciones de tiempo (MTD, mes anterior) necesitan un calendario de **años completos**. El de A2 empieza el 01/03/2025 y termina el 31/08/2026 (549 días). Lo vas a sustituir por uno del 01/01/2025 al 31/12/2026 (730 días) **sin crear otra tabla**: se reemplaza el código de la consulta `dim_calendario` y se conservan su nombre, sus columnas, sus relaciones y la jerarquía del Día 2.

1. **Respaldo.** Guarda A3 (**Ctrl + S**) y, en el Explorador de Windows, copia el archivo como `Apellido_Nombre_A3_respaldo.pbix`. Sigue trabajando en el original.
2. **Copia el código.** Abre el [calendario descargado](../../descargas/calendario-dia-03.pq) con el Bloc de notas y copia todo (**Ctrl + A**, **Ctrl + C**). Las líneas que empiezan con `//` son comentarios; pueden ir incluidas.
3. **Abre la consulta.** En Power BI: **Inicio → Transformar datos**. En el panel **Consultas** (izquierda) selecciona `dim_calendario`.
4. **Reemplaza el código.** **Inicio → Editor avanzado**. Selecciona todo el código existente (**Ctrl + A**), pega (**Ctrl + V**) y pulsa **Listo** (o **Aceptar**, según la versión). Abajo debe decir que no se detectaron errores de sintaxis.

   ![Editor avanzado de Power Query con el código del calendario pegado: Inicio = #date(2025, 1, 1), Fin = #date(2026, 12, 31) y los pasos que agregan anio, mes, nombre_mes, semana_iso, dia_semana, es_habil, periodo_fiscal, mes_inicio y anio_mes](/imagenes/capturas/dia-03/a3-editor-avanzado-calendario.png)

   *El código completo reemplaza al anterior. Si los comentarios de las líneas 1, 2 y 18 muestran acentos raros (`cÃ³digo`), es solo la codificación del texto copiado: los comentarios no se ejecutan y no afectan el resultado.*
5. **Revisa la vista previa.** La primera fila es **01/01/2025** y las columnas son `fecha`, `anio`, `mes`, `nombre_mes`, `semana_iso`, `dia_semana`, `es_habil`, `periodo_fiscal` y dos nuevas: `mes_inicio` y `anio_mes`. El nombre de la consulta (panel **Propiedades**, derecha) sigue siendo `dim_calendario`.
6. **Inicio → Cerrar y aplicar.**
7. **Cuenta las fechas.** En la **vista Tabla** selecciona `dim_calendario`: la barra inferior debe decir **730 filas**, del 01/01/2025 al 31/12/2026.

   **Resumir por: Ninguno.** Si junto a `anio`, `mes` o `semana_iso` vuelve a aparecer el símbolo **Σ**, el reemplazo reinició su propiedad del Día 2. Selecciona cada columna y, en **Herramientas de columnas → Resumen**, elige **No resumir**. Si no, al arrastrar `anio` a un visual Power BI sumaría los años (2025 + 2025 + …).

   ![Vista Tabla de dim_calendario con la barra inferior «Tabla: dim_calendario (730 filas)»; una flecha señala el botón Opciones del calendario en la cinta Herramientas de tablas y otra la misma opción en el menú contextual de la tabla](/imagenes/capturas/dia-03/a3-calendario-730-filas.png)

   *La barra inferior confirma las 730 filas (flecha abajo). Las otras dos flechas marcan dónde está **Opciones del calendario**, que se usa en el paso siguiente.*
8. **Tabla de fechas.** En el Día 2 ya la marcaste; el reemplazo de código puede haberla desactivado. Clic derecho sobre `dim_calendario` en el panel Datos → **Opciones del calendario** (o **Herramientas de tablas → Opciones del calendario**) → enlace **Marcar como tabla de fechas**. Activa el interruptor, elige `fecha`, espera **Validación correcta** y pulsa **Guardar**. No uses **Nuevo calendario**: esa función es otra cosa y no la necesitas.

   ![Cuadro Marcar como tabla de fechas (no recomendado) con el interruptor en Activar, la columna fecha elegida y el aviso Validación correcta](/imagenes/capturas/dia-03/a3-marcar-tabla-fechas.png)

   *Las versiones recientes de Desktop marcan esta opción como «no recomendado». Este laboratorio usa las funciones de tiempo clásicas (`TOTALMTD`, `DATEADD`, `DATESINPERIOD`), que se apoyan en una tabla de fechas marcada, así que actívala.*
9. **Relaciones.** En **Vista Modelo → Administrar relaciones**, las tres del calendario siguen activas: `fecha` → `fact_produccion[fecha]`, `fact_calidad[fecha]` y `fact_mantenimiento[fecha_evento]`.
10. **Nada cambió en los hechos.** En Control_A3, sin selecciones, los seis indicadores siguen en 5,822,881 piezas, 560 eventos y 71,248 minutos. El segmentador de fecha ahora va de 01/01/2025 a 31/12/2026.
11. **Prueba de enero de 2025** (pendiente de la sección 3). Pon el segmentador de fecha de 01/01/2025 a 31/01/2025: los seis indicadores quedan **en blanco**. Hay fechas en el calendario, pero ningún registro en los hechos.

Usa la fecha de esta dimensión, no una jerarquía automática de la tabla de hechos. `anio_mes` ordena cronológicamente; `mes_inicio` representa cada mes sin mezclar años. El periodo fiscal es una convención sintética trimestral, no el calendario fiscal de la empresa.

El calendario completo no inventa producción fuera de marzo de 2025–agosto de 2026. MTD y desplazamientos temporales se interpretan dentro de la cobertura disponible.

### Construir y comprobar

Crea las cuatro medidas temporales en `fact_produccion`, **una por una** y en este orden. Cada bloque es una medida completa; pégalo entero en la barra de fórmulas.

```dax
Piezas MTD =
TOTALMTD([Piezas], dim_calendario[fecha])
```

Formato: **Número entero** con separador de miles.

```dax
Piezas mes anterior =
CALCULATE(
    [Piezas],
    DATEADD(dim_calendario[fecha], -1, MONTH)
)
```

Formato: **Número entero** con separador de miles.

```dax
% Variación mensual =
VAR Actual = [Piezas]
VAR Anterior = [Piezas mes anterior]
RETURN
    IF(
        ISBLANK(Actual) || ISBLANK(Anterior),
        BLANK(),
        DIVIDE(Actual - Anterior, Anterior)
    )
```

Formato: **Porcentaje, 2 decimales**. `VAR` guarda un valor con nombre para usarlo después de `RETURN`; aquí evita calcular la variación si falta alguno de los dos meses.

```dax
Promedio móvil 7d =
VAR Corte = MAX(dim_calendario[fecha])
VAR Ventana =
    CALCULATETABLE(
        DATESINPERIOD(dim_calendario[fecha], Corte, -7, DAY),
        REMOVEFILTERS(dim_calendario)
    )
RETURN
    CALCULATE(
        AVERAGEX(
            VALUES(dim_calendario[fecha]),
            COALESCE([Piezas], 0)
        ),
        REMOVEFILTERS(dim_calendario),
        Ventana
    )
```

Formato: **Decimal, 2 decimales**.

**Visual 1 · tabla por día.** En Control_A3 inserta una **Tabla** con `dim_calendario[fecha]`, `Piezas`, `Piezas MTD` y `Promedio móvil 7d`. Pon el segmentador de fecha del **01/05/2025** al **07/05/2025**:

| Fecha | Piezas | Piezas MTD | Promedio móvil 7d |
|---|---:|---:|---:|
| 01/05/2025 | 12,020 | 12,020 | *(sin control)* |
| 04/05/2025 (domingo) | *(en blanco)* | 35,610 | *(sin control)* |
| 07/05/2025 | 14,132 | 77,234 | 11,033.43 |

El MTD reinicia el día 1 y va sumando; el domingo sin producción no suma, pero el acumulado se mantiene. Los primeros días del promedio móvil dependen de fechas de abril, fuera del rango del segmentador: la medida las recupera sola, pero la guía solo controla el día 7.

![Tabla por fecha del 01/05/2025 al 07/05/2025 con Piezas, Piezas MTD y Promedio móvil 7d: el domingo 04 de mayo sin piezas y con MTD 35,610; el miércoles 07 de mayo con 14,132 piezas, MTD 77,234 y promedio móvil 11,033.43; segmentador de fecha abajo con el rango 01/05/2025 a 07/05/2025](/imagenes/capturas/dia-03/a3-tabla-mtd-07-05.png)

*El MTD crece día a día y se reinicia con el mes; el domingo sin producción no suma, pero el acumulado se mantiene. El 07/05 cumple los dos controles: 77,234 y 11,033.43 piezas por día calendario.*

**Visual 2 · matriz por mes.** Inserta una **Matriz** con `dim_calendario[anio_mes]` en **Filas** y `Piezas`, `Piezas mes anterior` y `% Variación mensual` en **Valores**. Limpia el segmentador de fecha. La fila **2025-05** debe mostrar 337,491 · 343,875 · −1.86 %. La fila **2025-03** muestra el mes anterior y la variación **en blanco**: febrero no tiene datos, y la medida no inventa una comparación.

![Matriz por anio_mes con Piezas, Piezas mes anterior y % Variación mensual: 2025-03 con 338,545 y las otras dos columnas vacías; 2025-04 343,875 frente a 338,545 (1.57 %); 2025-05 337,491 frente a 343,875 (−1.86 %); la fila Total muestra 5,822,881 en ambas columnas y 0.00 %](/imagenes/capturas/dia-03/a3-matriz-mes-anterior-mayo.png)

*Mayo de 2025 cumple el control: 337,491 frente a 343,875, −1.86 %. Marzo queda vacío porque no existe febrero con datos.*

**No leas la fila Total de esta matriz.** En el total el contexto son todas las fechas; DATEADD las desplaza un mes y el resultado vuelve a abarcar todo el periodo con datos, así que muestra 5,822,881 y 0.00 %. No es «el mes anterior» de nada. Desactívala (en el panel **Formato** de la matriz escribe «total» en **Buscar** y apaga el total de filas; el nombre exacto cambia entre versiones) o explica por qué no aplica.

Qué significa cada cifra:

- **MTD:** acumulado desde el primer día del mes hasta la fecha del contexto. En una tabla por fecha, el 07/05/2025 debe mostrar **77,234**.
- **Mes anterior:** DATEADD desplaza el conjunto de fechas un mes. En una matriz por `anio_mes`, mayo de 2025 muestra **343,875** del mes anterior frente a **337,491** del mes actual. Usa meses completos para esta comparación; no llames «mes anterior completo» a cualquier selección parcial o discontinua.
- **Variación mensual:** (actual − anterior) / anterior; en mayo **−1.86 %**. Las variables guardan los valores del contexto, facilitan lectura y permiten evitar una comparación cuando falta algún periodo.
- **Promedio móvil:** siete días calendario, incluido el corte. El 07/05/2025 debe mostrar **11,033.43 piezas/día**, promedio de 12,020; 11,269; 12,321; 0; 13,168; 14,324; 14,132. El cero corresponde al domingo conocido sin producción del caso sintético. No apliques esa suposición a fechas fuera de cobertura ni a ausencias sin explicación.

La fórmula de promedio móvil quita los filtros del calendario para recuperar toda la ventana, incluidos días del mes anterior, y conserva los filtros de línea, área, turno y parte. Se recorre una fecha por día; la medida se evalúa para cada fecha. Prueba un corte cercano al inicio de mes y explica la ventana.

**Trabajo diferenciado, 35 minutos:** quienes ya dominan medidas desarrollan los cuatro controles temporales con autonomía y explican la ventana; el instructor refuerza contexto y DIVIDE con quienes lo necesitan y después guía sus controles. No cambia el criterio de A3 ni convierte la velocidad en calificación.

## 5. Fichas, revisión y entrega A3

Una **ficha** es la tarjeta de identidad de un indicador: permite que otra persona lo entienda y lo compruebe sin preguntarte. Hazla en un documento aparte (Word, Excel o la plantilla que indique el instructor) y copia esta tabla **para cada uno de los seis indicadores principales**:

| Campo | Registro del participante |
|---|---|
| Nombre, pregunta operativa y responsable | |
| Fórmula DAX exacta, unidad y formato | |
| Numerador y denominador, si aplica | |
| Tabla, granularidad y cobertura temporal | |
| Filtros que sí lo afectan / filtros que no | |
| Vacíos, ceros y limitaciones | |
| Valor sin filtros y al menos dos cortes: esperado, observado y diferencia | |
| Hallazgo del revisor y corrección realizada | |

### Ejemplo resuelto: % Cumplimiento

Úsalo como modelo; las otras cinco fichas se llenan igual con tus propias cifras.

| Campo | Registro |
|---|---|
| Nombre, pregunta operativa y responsable | **% Cumplimiento.** ¿Qué proporción del plan se produjo? Responsable: supervisión de producción. |
| Fórmula DAX exacta, unidad y formato | `% Cumplimiento = DIVIDE([Piezas], [Plan])`. Porcentaje, 2 decimales. |
| Numerador y denominador | `[Piezas]` = suma de `fact_produccion[piezas_producidas]`. `[Plan]` = suma de `fact_produccion[piezas_plan]`. |
| Tabla, granularidad y cobertura temporal | `fact_produccion`: día · línea · turno · parte. Datos del 01/03/2025 al 31/08/2026. |
| Filtros que sí lo afectan / filtros que no | Sí: fecha, línea, área, turno y parte. No: defecto (no se relaciona con producción). |
| Vacíos, ceros y limitaciones | Sin plan en el periodo → **blanco**, no 0 % ni 100 %. Enero de 2025 queda en blanco: hay fechas, no hay registros. |
| Valor sin filtros y dos cortes | Sin filtros: esperado 89.19 %, observado 89.19 %, diferencia 0. L1: 89.26 % / 89.26 % / 0. 01/03/2025 + L1: 84.75 % / 84.75 % / 0. |
| Hallazgo del revisor y corrección | *(lo llena el revisor en la revisión cruzada)* |

### Matriz de pruebas

Una fila por prueba. Es la «matriz de validación por fecha, turno y área» de la entrega; empieza con las pruebas que ya hiciste en las secciones 2 a 4:

| Prueba (filtros exactos) | Indicador | Esperado | Observado | ¿Coincide? | Corrección y segunda prueba |
|---|---|---:|---:|---|---|
| Sin filtros | Piezas | 5,822,881 | | | |
| Área = Ensamble | Eventos correctivos | 276 | | | |
| Fecha 01/03/2025 + Línea 1 | % Cumplimiento | 84.75 % | | | |
| Fecha 01/03/2025 + Línea 1 | Eventos correctivos | *(blanco)* | | | |
| Turno 1 | Minutos correctivos | 71,248 (no aplica turno) | | | |
| Enero 2025 | % Cumplimiento | *(blanco)* | | | |
| Corte 07/05/2025 | Piezas MTD | 77,234 | | | |
| Mayo 2025 vs. abril | % Variación mensual | −1.86 % | | | |

Escribe los filtros con tabla, columna y valor (por ejemplo, `dim_linea[area] = Ensamble`), no «filtré Ensamble». Así otra persona puede repetir la prueba exactamente.

### Revisión cruzada

El revisor abre **una copia** del PBIX de otra persona. Si al actualizar aparece un error de archivo no encontrado, las rutas apuntan a la carpeta del autor: **Transformar datos → Configuración de origen de datos → Cambiar origen** y selecciona la carpeta del dataset en su propio equipo. Después repite una prueba de la matriz, revisa denominador, fuente, formato y tratamiento del blanco, y anota su hallazgo en la ficha.

En el taller: 8 min de rúbrica, 7 de ficha, 50 de trabajo autónomo, 20 de revisión entre áreas y 5 de entrega. El revisor elige una fecha, un turno y un área; solicita explicar qué cambió y qué debía permanecer constante. Registra cifra esperada, observada, resultado, corrección y segunda prueba. Las capturas deben mostrar los filtros, no solo una tarjeta aislada.

Entrega `Apellido_Nombre_A3.pbix`, seis fichas, matriz de pruebas y registro del laboratorio temporal. Todos observan las cuatro técnicas y documentan al menos un contraste propio; la ruta autónoma comprueba los cuatro controles. Registra el acompañamiento recibido. Conserva A1 y A2. El cierre incluye una explicación individual de un numerador, su denominador y el alcance del filtro; un archivo de equipo no acredita por sí solo a cada integrante.

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
