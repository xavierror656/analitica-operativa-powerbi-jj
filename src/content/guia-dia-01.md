---
title: Guía de trabajo · Día 1
---

## Tu resultado de hoy

Un archivo de Power BI que conecte ocho tablas, aplique reglas de limpieza repetibles y permita explicar qué cambió. La evidencia A1 incluye el **PBIX y una bitácora con conciliación**. Trabajamos con datos sintéticos, no con registros reales de la planta.

Al terminar podrás:

- Conectar y perfilar ocho tablas sin mezclar estructuras.
- Distinguir una corrección sustentada de un dato que necesita revisión.
- Actualizar y justificar las diferencias en filas y piezas.

## Antes de comenzar

1. Abre Power BI Desktop en Windows. Las prácticas de hoy se realizan en Desktop; no requieren publicar en el servicio.
2. Descarga el ZIP desde la presentación y extrae los ocho CSV en una carpeta local que puedas identificar. Conserva los originales sin editarlos.
3. Crea otra carpeta para tus entregas. No guardes copias del mismo CSV dentro de una carpeta que después vayas a combinar.
4. Ten esta guía abierta al lado de Power BI. Si una opción tiene otro nombre en tu versión, busca la función indicada y pide apoyo al facilitador.

## Ruta del día

| Horario | Trabajo | Comprobación al terminar |
|---|---|---|
| 08:00–09:00 | Fundamento | Explicas origen, responsable, granularidad y actualización |
| 09:00–10:30 | Conexión y perfilado | Ocho consultas separadas e inventario de anomalías |
| 10:30–10:45 | Receso | Guarda tu avance |
| 10:45–12:15 | Limpieza en pareja | Líneas, horas, turnos y lotes consistentes |
| 12:15–13:15 | Comida | Guarda una copia del PBIX |
| 13:15–14:45 | Laboratorio | Parámetro, clasificación y excepciones verificadas |
| 14:45–15:00 | Receso | Guarda tu avance |
| 15:00–16:30 | Evidencia A1 | PBIX, bitácora y revisión cruzada |
| 16:30–17:00 | Validación y cierre | Conciliación y dos actualizaciones estables |

Son 450 minutos de trabajo, más 90 minutos de pausas. El extra de mantenimiento queda fuera de este horario y de A1.

## 1. Conecta sin mezclar tablas

En **Obtener datos → Texto/CSV**, elige `fact_produccion.csv`. Comprueba delimitador coma y codificación UTF-8; selecciona **Transformar datos**. Repite para los otros siete archivos. Cada archivo conserva su propia consulta:

| Tabla | Qué representa una fila |
|---|---|
| fact_produccion | Registro de producción por fecha, línea, turno y parte, con lote |
| fact_calidad | Evento de rechazo; un lote puede aparecer varias veces |
| fact_mantenimiento | Evento de mantenimiento |
| dim_linea | Una línea |
| dim_parte | Un número de parte |
| dim_turno | Un turno |
| dim_defecto | Un tipo de defecto |
| dim_calendario | Una fecha |

![Ventana Obtener datos con una flecha roja sobre la opción Texto o CSV](/imagenes/capturas/dia-01/a1-obtener-datos-csv.png)

*En **Obtener datos**, elige **Texto o CSV**.*

![Vista previa de fact_produccion.csv con delimitador coma y UTF-8; horas_operacion aparece como 752 y horas_paro como 48; una flecha señala Transform data](/imagenes/capturas/dia-01/a1-vista-previa-csv.png)

*Vista previa del archivo. Revisa origen UTF-8 y delimitador coma, y elige **Transformar datos** (en algunas instalaciones el botón aparece como **Transform data**). Fíjate en `horas_operacion` y `horas_paro`: muestran `752` y `48` en lugar de `7.52` y `0.48`. La detección automática de tipos leyó el punto decimal como separador de miles. Es lo que explica más abajo la configuración regional.*

**No combines los ocho CSV en una sola tabla.** El conector Carpeta permite combinar archivos de la misma estructura: por ejemplo, varios meses de producción. Calidad, mantenimiento y catálogos permanecen separados.

Revisa el paso automático **Tipo cambiado**. Antes de convertir, conserva como texto los identificadores y las columnas que vas a investigar. Si una conversión produjo errores, vuelve al paso anterior para recuperar el texto; convertir un error a texto no recupera el valor original. Los decimales del CSV usan punto: al asignar tipo Decimal, usa una configuración regional que lo interprete correctamente, por ejemplo Inglés (Estados Unidos).

En **Vista**, activa Calidad, Distribución y Perfil de columna. Cambia el perfilado de las primeras 1,000 filas al **conjunto completo**. Un texto puede aparecer como válido aunque sea una línea mal escrita.

![Editor de Power Query con las casillas de calidad, distribución y perfil de columna activas; una flecha señala la opción de generar perfiles sobre el conjunto de datos completo](/imagenes/capturas/dia-01/a1-perfil-conjunto-completo.png)

*Con el perfilado sobre las primeras 1,000 filas la barra de estado dice «999+ filas». Al elegir el conjunto completo aparece el número exacto.*

**Checkpoint:** ocho consultas con los nombres de los archivos; al menos tres anomalías registradas con tabla, columna, ejemplo y posible impacto.

## 2. Decide la regla antes de transformar

Primero registra el número de filas y la suma de `piezas_producidas` del origen. En producción, separa las filas con `turno = "Total día"`; después identifica duplicados exactos comparando **todas las columnas originales**. Hazlo antes de añadir índices o columnas que vuelvan artificialmente única cada fila. Guarda el conteo y las piezas retiradas de cada grupo.

![Menú Inicio, Reducir filas, Quitar filas, con una flecha sobre Quitar duplicados; en la barra de fórmulas se ve el filtro de subtotales ya aplicado](/imagenes/capturas/dia-01/a1-quitar-duplicados.png)

*Quitar duplicados va después de filtrar «Total día». Antes de aplicarlo, selecciona **todas** las columnas de la tabla: si solo queda una seleccionada, se eliminarían filas legítimas. Con las reglas de este curso, la tabla pasa de 7,175 a 7,067 filas.*

Las nueve anomalías del ejercicio tienen estas reglas:

| Anomalía | Tratamiento | Cómo lo compruebas |
|---|---|---|
| Fechas mezcladas | Interpretar con formato explícito y conservar el texto original | Fecha válida en el intervalo del calendario |
| Línea inconsistente | Mapear L1 / Línea 1 / LINEA_1 / linea1 a L1; igual para L2–L4 | Valores finales presentes en dim_linea |
| Horas 12 h / 24 h | Normalizar a tipo Hora, preservando a. m. / p. m. | 6:00 a.m. → 06:00; 2:00 p.m. → 14:00; 10:00 p.m. → 22:00 |
| Lote con ceros perdidos | Separar por guion y completar el sufijo a cuatro dígitos, en producción y calidad | Coinciden los lotes entre ambas tablas |
| Duplicados | Retirar únicamente copias exactas de producción y registrar cuántas | Conteo antes − copias retiradas = conteo después |
| Subtotales | Excluir filas Total día del detalle y conservar su importe de control | No quedan subtotales mezclados con registros |
| Horas de paro vacías | Mantener null y marcar pendiente; no sustituir por cero | Reportas cuántos datos faltan |
| Espacios en defecto | Aplicar Recortar a tipo_defecto | Los códigos coinciden con dim_defecto |
| Supervisor en turno | Recuperar desde hora_inicio normalizada y contrastar con dim_turno | 06:00 → "1"; 14:00 → "2"; 22:00 → "3" |

![Menú contextual de la columna tipo_defecto: Transformar y Recortar, señalado con una flecha roja](/imagenes/capturas/dia-01/a1-recortar-espacios.png)

*Para «Espacios en defecto»: clic derecho en el encabezado de `tipo_defecto` → **Transformar → Recortar**.*

**Estas reglas corresponden al dataset del curso.** Los supervisores se asignaron al azar: su nombre no identifica el turno. Guarda `turno_original` antes de sustituirlo. El turno queda como texto "1", "2" o "3", compatible con `dim_turno[nombre]`; `dim_turno[turno_id]` contiene T1, T2 y T3, que son otra clave. Las relaciones se trabajan en el día 2.

Un `null` en horas de paro significa dato faltante. Cero significa un paro registrado de cero horas. No son equivalentes. Una fila puede conservarse para contar piezas mientras se declara incompleta para analizar horas; no es obligatorio excluir toda la fila por ese nulo.

En calidad, dos eventos parecidos pueden ser legítimos. No apliques automáticamente la deduplicación de producción a esa tabla.

### Fechas: evita adivinar el orden

El generador mezcla tres formatos: `yyyy-MM-dd`, `dd/MM/yyyy` y `MM-dd-yyyy`. Agrega una columna personalizada mientras `fecha` aún sea texto:

```powerquery
let
    t = Text.Trim([fecha]),
    formato = if Text.Contains(t, "/") then "dd/MM/yyyy"
        else if Text.Length(Text.BeforeDelimiter(t, "-")) = 4
        then "yyyy-MM-dd" else "MM-dd-yyyy"
in
    Date.FromText(t, [Format = formato, Culture = "en-US"])
```

Ponle tipo Fecha al resultado. Para este contrato, `03/04/2025` es 3 de abril y `03-04-2025` es 4 de marzo. Si llega otro formato, revisa el error y consulta la especificación del origen. El formato visual que después muestre Power BI no cambia el valor de la fecha.

### Lotes: completa solo el sufijo

En una columna personalizada, con `lote` como texto y después de separar los subtotales:

```powerquery
Text.BeforeDelimiter([lote], "-") & "-" &
Text.PadStart(Text.AfterDelimiter([lote], "-"), 4, "0")
```

`2503-001` queda como `2503-0001`. Verifica cuatro dígitos en el prefijo y cuatro en el sufijo; cualquier otro caso se revisa. Repite la regla en calidad. No uses esta regla sobre identificadores reales sin confirmar su formato.

**Checkpoint:** compara los valores con los catálogos, muestra un antes/después por regla y explica por qué conservaste los nulos.

## 3. Haz que se pueda repetir

### Parametriza la ruta

En **Inicio → Administrar parámetros → Nuevo**, crea `RutaDatos`, tipo Texto, con la ruta a la carpeta que contiene los ocho CSV, sin barra final. En el paso Origen de cada consulta, sustituye únicamente la ruta que recibe `File.Contents`:

```powerquery
File.Contents(RutaDatos & "\fact_produccion.csv")
```

Conserva el `Csv.Document` exterior y sus opciones. Cambia el nombre de archivo para cada consulta. Para listar una carpeta existe `Folder.Contents(RutaDatos)`; no sustituye directamente la lectura del contenido de un CSV. Los nombres de las funciones M se escriben en inglés.

### Combina archivos homogéneos

El facilitador demuestra dos periodos de producción separados, con las mismas columnas y sin fechas superpuestas, en una carpeta de práctica aparte. En el conector Carpeta, elige **Transformar datos**, filtra los archivos esperados y después combina. Comprueba que el conteo combinado sea la suma de ambos archivos. Esto no sustituye tus ocho consultas de A1.

### Clasifica con una salida para lo desconocido

En `fact_calidad`, agrega `categoria_scrap` como columna personalizada:

```powerquery
let d = if [disposicion] = null then ""
        else Text.Lower(Text.Trim([disposicion]))
in if d = "retrabajo" then "Recuperable"
else if d = "desecho" then "Pérdida total"
else if d = "concesión" then "Aceptado con desviación"
else "Revisar"
```

Comprueba `Retrabajo`, `RETRABAJO`, `Desecho`, `Concesión`, un vacío y un valor nuevo en una consulta pequeña de prueba creada con Introducir datos. Los dos últimos deben quedar como **Revisar**. Es una clasificación didáctica, no una autorización de liberación de producto.

### Separa errores y pendientes

Un Error de conversión es distinto de un null o de un valor fuera de catálogo. Para errores de conversión, crea dos consultas por referencia desde el mismo paso que presenta errores: en una **Conservar errores**, y en otra **Quitar errores**, seleccionando las mismas columnas. La primera es tu diagnóstico; no la cargues como tabla al modelo mientras contenga celdas Error. Conserva su conteo y motivo en la bitácora. Para nulos o valores desconocidos, usa un filtro o una columna de estado.

No crees errores artificiales en el origen para cumplir la actividad. Si una regla resuelve todas las conversiones, registra cero errores y prueba el caso límite en tu consulta pequeña. Si excluyes filas, explica el impacto antes de usar los resultados.

## 4. Concilia antes de entregar

**No se espera que el total limpio sea igual al total crudo** cuando el original incluye duplicados y subtotales. Se espera que puedas explicar la diferencia:

```text
Filas origen = filas salida + subtotales retirados
             + copias duplicadas retiradas + excepciones excluidas

Piezas origen = piezas salida + piezas de subtotales
              + piezas de copias retiradas + piezas de excepciones excluidas
```

Cada fila retirada pertenece a una sola categoría. Un nulo que permanece en la salida no se cuenta también como excepción excluida. Aplica los controles a producción; en calidad y mantenimiento, justifica por separado cualquier cambio de filas.

Verifica además una fecha y línea, las piezas buenas contra las producidas, y el total de rechazo de calidad contra `piezas_producidas − piezas_buenas` en producción depurada. Esta última igualdad corresponde a cómo se generó el ejercicio; no es una regla universal para datos de planta.

**Prueba de repetición:** guarda, actualiza, registra cifras, vuelve a actualizar. Con los mismos archivos de origen, las dos ejecuciones deben dar los mismos resultados. No basta con que desaparezca el mensaje de error.

## 5. Bitácora de A1: copia y completa

Participante: __________ · Fecha: __________ · Archivo PBIX: __________

| Tabla / columna | Valor original | Regla y motivo | Filas afectadas | Cómo validé | Pendiente / responsable |
|---|---|---|---|---|---|
| Ejemplo: producción / horas_paro | Vacío | Conservar null: no se conoce el paro | Completar | Conteo de nulos antes/después | Solicitar confirmación al dueño del dato |
| | | | | | |

| Control de producción | Filas | Piezas producidas |
|---|---|---|
| Origen sin transformar | | |
| Subtotales retirados | | |
| Copias exactas retiradas | | |
| Excepciones excluidas | | |
| Salida | | |
| Diferencia sin explicar (debe ser 0) | | |

Horas de paro faltantes que permanecen en la salida: __________

Primera actualización: __________ · Segunda actualización: __________

Revisor: __________ · Hallazgo y evidencia: __________ · Acción o pendiente: __________

### Criterios de aceptación

- [ ] Ocho tablas separadas, con tipos revisados y ruta parametrizada.
- [ ] Nueve anomalías con regla aplicada o excepción justificada; valores originales rastreables.
- [ ] Conteos y piezas conciliados sin diferencias inexplicadas.
- [ ] Nulos y errores declarados; ninguna sustitución por cero sin sustento.
- [ ] Otra persona puede cambiar RutaDatos y actualizar.
- [ ] Dos actualizaciones conservan los resultados.
- [ ] Entrego `Apellido_Nombre_A1.pbix` y `Apellido_Nombre_A1_bitacora` en el medio que indique el instructor.

La escala de dominio se aplica junto con estos controles: 1, con apoyo directo; 2, ejecución en el dataset consultando la guía; 3, justificación de reglas y resultados; 4, auditoría y prueba sustentada de un caso límite. Puedes consultar instrucciones y copiar fórmulas en todos los niveles: evaluamos aplicación, comprobación y explicación, no memoria. Declarar un pendiente con evidencia es mejor que fabricar una corrección.

## Si te atoras

| Síntoma | Revisa primero |
|---|---|
| Todo quedó en una columna | Delimitador coma en la importación |
| Acentos extraños | Codificación UTF-8 del CSV |
| Fechas erróneas o invertidas | Texto original, formato explícito y paso Tipo cambiado |
| Números decimales extraños | Configuración regional al convertir el punto decimal |
| No encuentra el archivo | RutaDatos, nombre exacto y extracción del ZIP |
| Creció mucho el total al combinar | Archivos duplicados, periodos traslapados o tablas distintas |
| Total de piezas bajó al limpiar | Conciliación de duplicados, subtotales y exclusiones |

Si terminas antes, intercambia archivo y bitácora, documenta un hallazgo reproducible y prueba un valor desconocido en tu consulta de prueba. No adelantes DAX a costa de dejar A1 sin validar.

## Extra opcional: mantenimiento en Excel

Corresponde a las once diapositivas Extra (70 minutos). Está fuera de los 450 minutos del día y de la evidencia A1. Guarda A1 y abre un **PBIX nuevo** para este ejercicio. Todos los KPI se calculan dentro de **Power BI con medidas DAX**; el archivo descargado solo es la fuente de datos.

1. Descarga [Data_Mantenimiento_2025.xlsx](https://powerbi.floresjavier.com/descargas/Data_Mantenimiento_2025.xlsx). El libro contiene la hoja `MaintenanceData`, con 150 registros y ocho columnas.
2. En Power BI Desktop elige **Obtener datos → Excel**, selecciona el archivo, marca `MaintenanceData` y pulsa **Transformar datos**.
3. Revisa los tipos: `Fecha`, fecha; `Equipo` y `Tipo_Falla`, texto; `Tiempo_Averia_Horas`, `Tiempo_Reparacion_Horas`, `Horas_Operativas` y `Disponibilidad_Porc`, decimal; `Ordenes_Pendientes`, entero. Comprueba los 150 registros y pulsa **Cerrar y aplicar**.
4. En el panel Datos, selecciona `MaintenanceData`, haz clic derecho → **Nueva medida**, pega la primera fórmula de abajo y pulsa Enter. Repite para las otras tres. Crea medidas, no columnas calculadas.
5. En Vista Informe, agrega cuatro **Tarjetas** y arrastra una medida a cada una. Después agrega un gráfico de líneas: eje X `Fecha` (fecha simple), eje Y **[Disponibilidad reportada %]**. La medida divide el valor de origen entre 100; así puedes asignarle formato **Porcentaje**, dos decimales. Este promedio es didáctico; no sustituye un cálculo operacional ponderado por tiempo.
6. Añade una segmentación por `Equipo`. Limpia los filtros, comprueba los totales y selecciona solo `Extrusora 2`. Las cuatro tarjetas y el gráfico deben responder al filtro.

### Los cuatro indicadores del ejercicio

| Indicador | Cálculo y configuración de la tarjeta | Lectura |
|---|---|---|
| Fallas registradas | Medida `[Fallas registradas]`; formato entero | Número de eventos; cada fila del archivo es una falla |
| MTTR (h) | Medida `[MTTR (h)]`; decimal con dos posiciones | Tiempo medio de reparación registrado; menor es más rápido en condiciones comparables |
| MTBF didáctico (h) | Medida `[MTBF didactico (h)]`; decimal con dos posiciones | Operación media por falla bajo el supuesto del ejercicio; mayor representa más operación por falla |
| Disponibilidad reportada media (%) | Medida `[Disponibilidad reportada %]`; formato **Porcentaje**, dos decimales | Media de los porcentajes proporcionados para los registros visibles |

### Crea estas medidas en Power BI, en este orden

```dax
Fallas registradas =
COUNTROWS(MaintenanceData)
```

```dax
MTTR (h) =
DIVIDE(
    SUM(MaintenanceData[Tiempo_Reparacion_Horas]),
    [Fallas registradas]
)
```

```dax
MTBF didactico (h) =
DIVIDE(
    SUM(MaintenanceData[Horas_Operativas]),
    [Fallas registradas]
)
```

```dax
Disponibilidad reportada % =
DIVIDE(
    AVERAGE(MaintenanceData[Disponibilidad_Porc]),
    100
)
```

Selecciona cada medida y ajusta su formato en **Herramientas de medida**. En las tarjetas, usa **Unidades de visualización: Ninguna**. La disponibilidad devuelve aproximadamente `0.835595`; con formato Porcentaje se ve `83.56 %`. No uses la columna cruda en lugar de la medida ni vuelvas a dividir entre 100.

`DIVIDE` devuelve blanco si no hay denominador válido; no sustituyas automáticamente ese resultado por cero. En esta fuente las duraciones están completas. Si tu Power BI usa separadores DAX localizados, cambia las comas entre argumentos por punto y coma. Las medidas se recalculan con los filtros de Equipo y Fecha.

**Alcance de MTBF:** suponemos que las horas de cada fila corresponden a su evento y no se traslapan. El archivo no acredita exposición completa, incluidos intervalos sin fallas; el resultado es didáctico, no un MTBF operacional certificado ni una predicción de la siguiente falla. Compara el mismo equipo y periodos compatibles.

**Alcance de MTTR:** usamos el tiempo de reparación que registra el archivo. No añadimos tiempos de espera o recuperación que no estén documentados. Los 150 registros tienen duración; con otra fuente hay que revisar nulos y contar las reparaciones correspondientes.

**Disponibilidad:** no se documenta cómo se obtuvo `Disponibilidad_Porc` ni su base de tiempo. No la reconstruyas a partir de las otras columnas ni presentes el promedio por registro como disponibilidad operacional ponderada.

| Filtro independiente | Fallas | MTTR (h) | MTBF didáctico (h) | Disponibilidad reportada media (%) |
|---|---:|---:|---:|---:|
| Sin filtros | 150 | 2.98 | 20.04 | 83.56 |
| Solo Extrusora 2 | 32 | 2.76 | 20.19 | 83.34 |

Controles sin filtros: 446.29 horas de reparación / 150 = 2.98 h; 3,006.44 horas operativas / 150 = 20.04 h; suma de porcentajes 12,533.93 / 150 = 83.56 %. Para Extrusora 2: 88.26 / 32 = 2.76 h; 646.14 / 32 = 20.19 h; 2,666.73 / 32 = 83.34 %. Redondea al mostrar, no antes de calcular.

`Ordenes_Pendientes` queda como dato de apoyo: sumar sus registros de distintas fechas puede contar una misma orden más de una vez y no demuestra cuántas siguen abiertas hoy.

Referencias del extra: [Microsoft Learn: crear medidas en Power BI](https://learn.microsoft.com/en-us/power-bi/transform-model/desktop-tutorial-create-measures), [Microsoft Learn: DIVIDE](https://learn.microsoft.com/en-us/dax/divide-function-dax), [IBM: tiempo medio de reparación](https://www.ibm.com/think/topics/mttr) e [IBM: tiempo medio entre fallas](https://www.ibm.com/think/topics/mtbf). Las cifras de control corresponden a los datos de `MaintenanceData`; los cálculos de la práctica se crean en Power BI.

Guarda este ejercicio como `Apellido_Nombre_Extra_Mantenimiento.pbix`. No agregues su tabla al modelo de ocho tablas de A1.

## Referencias técnicas

- [Microsoft Learn: conector Carpeta y archivos compatibles](https://learn.microsoft.com/en-us/power-query/connectors/folder).
- [Microsoft Learn: perfilado sobre el conjunto completo](https://learn.microsoft.com/en-us/power-query/data-profiling-tools).
- [Microsoft Learn: Date.FromText y formatos explícitos](https://learn.microsoft.com/en-us/powerquery-m/date-fromtext).
- [Microsoft Learn: Text.PadStart](https://learn.microsoft.com/en-us/powerquery-m/text-padstart).
- [Microsoft Learn: Folder.Contents](https://learn.microsoft.com/en-us/powerquery-m/folder-contents).
- [Microsoft Learn: tratamiento de errores](https://learn.microsoft.com/en-us/power-query/dealing-with-errors).
- [Microsoft Learn: agregar una columna personalizada](https://learn.microsoft.com/en-us/power-query/add-custom-column).
- [Microsoft Learn: selección de columnas y duplicados](https://learn.microsoft.com/en-us/power-query/working-with-duplicates).
- [Microsoft Learn: Time.FromText y cultura de horas](https://learn.microsoft.com/en-us/powerquery-m/time-fromtext).
- [Microsoft Learn: duplicar consultas y crear referencias](https://learn.microsoft.com/en-us/power-query/queries-pane).

Las reglas de negocio y los controles del ejercicio se derivan del generador sintético del curso. Las referencias explican el comportamiento de Power Query.
