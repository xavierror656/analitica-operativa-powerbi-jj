# Evaluación diagnóstica previa

Instrumento de aplicación previa al Día 1, 20 minutos: 10 reactivos de opción múltiple y
2 tareas prácticas breves. **No es acreditable**, su única función es calibrar el ritmo
del programa. Aplicar por formulario para tener el resultado antes del Día 1. Un solo
acierto por reactivo.

## Reactivos

**01.** ¿Cuál es la razón principal para modelar en esquema estrella en lugar de trabajar
con una sola tabla plana que ya contiene todas las columnas?
A) Permite conectar más de una fuente de datos dentro del mismo reporte.
B) Reduce el tamaño del archivo al eliminar los registros duplicados.
C) Las medidas se filtran de manera consistente desde dimensiones compartidas.
D) Es obligatorio: una tabla plana no admite la creación de medidas DAX.

**02.** Tiene producción por lote y eventos de mantenimiento con fecha y hora. Al
relacionar ambas tablas directamente por fecha, las cifras de producción se inflan.
¿Cuál es la causa más probable?
A) Las tablas provienen de orígenes de datos distintos entre sí.
B) La relación debe pasar por una tabla calendario a nivel de día.
C) Falta activar el filtrado cruzado en ambas direcciones.
D) La tabla de mantenimiento requiere una columna calculada de fecha.

**03.** ¿Cuándo conviene resolver una transformación en Power Query en lugar de con una
columna calculada en DAX?
A) Cuando la transformación es estática y puede aplicarse durante la carga.
B) Cuando el resultado de la transformación es de tipo texto.
C) Nunca: DAX siempre es más eficiente porque se ejecuta en memoria.
D) Solo cuando el origen de los datos es un archivo de Excel.

**04.** Diferencia esencial entre una columna calculada y una medida:
A) La medida solo admite números; la columna admite cualquier tipo de dato.
B) La columna puede usar CALCULATE y la medida no puede hacerlo.
C) No existe diferencia técnica; es una convención de nomenclatura.
D) La columna se evalúa al cargar el modelo; la medida, según el contexto del visual.

**05.** ¿Qué hace `CALCULATE([Piezas], Turno[Turno] = "3")` dentro de un visual que ya
está segmentado por el turno 1?
A) Suma las piezas correspondientes a los turnos 1 y 3 en conjunto.
B) Reemplaza el filtro de turno y devuelve las piezas del turno 3.
C) Devuelve un error porque los dos filtros entran en conflicto.
D) Devuelve un valor en blanco porque la intersección resulta vacía.

**06.** Ventaja de `DIVIDE(Rechazo, Producido)` sobre `Rechazo / Producido` al calcular
porcentaje de scrap:
A) Devuelve blanco o un valor alterno cuando el denominador es cero.
B) Redondea el resultado automáticamente a dos posiciones decimales.
C) Es la única función que permite obtener un valor porcentual.
D) No hay diferencia real; únicamente mejora la legibilidad del código.

**07.** ¿Por qué las funciones de inteligencia de tiempo requieren una tabla de fechas
marcada como tal?
A) Porque el origen suele entregar las fechas en formato de texto.
B) Porque es un requisito para publicar el reporte en el servicio.
C) Porque requieren fechas continuas y una columna de fecha única.
D) Porque sin ella los meses no pueden ordenarse cronológicamente.

**08.** Necesita que una medida muestre el porcentaje que cada línea representa del
total de la planta, sin que el segmentador de línea afecte el denominador. ¿Qué usa?
A) SUMX recorriendo la tabla de producción completa.
B) CALCULATE con ALL(Linea) aplicado en el denominador.
C) RELATED desde la dimensión de línea hacia el hecho.
D) Una columna calculada que almacene el total de la planta.

**09.** Tiene doce archivos mensuales con la misma estructura y un catálogo de números
de parte con columnas adicionales. ¿Qué operaciones usa, en ese orden?
A) Combinar los doce archivos y anexar el catálogo de partes.
B) Crear relaciones en el modelo para resolver ambos casos.
C) Duplicar la consulta doce veces y unirlas mediante DAX.
D) Anexar los doce archivos y combinar el catálogo por número de parte.

**10.** Un reporte publicado se conecta a un archivo alojado en la red interna y debe
actualizarse cada mañana. ¿Qué se requiere?
A) Programar únicamente la actualización dentro del servicio.
B) Volver a publicar el archivo de forma manual cada mañana.
C) Un gateway local configurado más la actualización programada.
D) Cambiar el origen de datos al modo DirectQuery.

## Tareas prácticas (5 minutos cada una)

Se entrega un archivo pequeño junto con el formulario.

| Tarea | Consigna | Qué revela |
|---|---|---|
| **T1 · Depuración** | Hoja con 200 filas de producción con tres problemas de captura. Identificarlos por escrito, sin corregirlos. | Si reconoce datos sucios a simple vista: prerrequisito del Día 1. |
| **T2 · Medida** | Dadas piezas producidas y piezas rechazadas, escribir la medida de porcentaje de rechazo tal como la escribiría en Power BI. | Si ha escrito DAX antes o solo ha arrastrado campos a un visual. |

## Clave de respuestas

| # | Resp. | Qué evalúa |
|---|---|---|
| 01 | C | Modelado dimensional: base del Día 2 |
| 02 | B | Granularidad: el error más costoso y frecuente en datos de planta |
| 03 | A | Criterio Power Query vs. DAX: eficiencia del modelo |
| 04 | D | Columna vs. medida: prerrequisito real para el Día 3 |
| 05 | B | CALCULATE reemplaza el contexto, no lo acumula |
| 06 | A | DIVIDE y manejo de división entre cero |
| 07 | C | Tabla de fechas e inteligencia de tiempo |
| 08 | B | ALL y modificación del contexto de filtro: nivel avanzado |
| 09 | D | Anexar vs. combinar: operación cotidiana con reportes mensuales |
| 10 | C | Publicación, gateway y actualización programada |

Las respuestas correctas están distribuidas entre las cuatro opciones y los distractores
tienen longitud equivalente, para que no sea posible acertar por patrón.

## Interpretación del resultado

| Aciertos | Nivel | Ajuste sugerido |
|---|---|---|
| 0–4 | Básico | Reforzar Días 1 y 2; considerar sesión previa de nivelación en Excel y Power Query |
| 5–7 | Intermedio | Perfil objetivo del programa. Se imparte tal como está diseñado, con acompañamiento cercano en el Día 3 |
| 8–10 | Avanzado | Reducir fundamento del Día 1; agregar grupos de cálculo, optimización del modelo y seguridad a nivel de fila; elevar exigencia del proyecto final |

**Si el grupo resulta muy disparejo:** parejas mixtas en las actividades núcleo,
bifurcar solo el laboratorio de la tarde según el resultado del diagnóstico.
