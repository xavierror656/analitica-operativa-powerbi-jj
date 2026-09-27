# Preparar y continuar el caso en Power BI Desktop

## Puente desde el Día 1

Guardar el PBIX del Día 1. Crear una copia `Practicas_A2.pbix` y conservar las consultas originales sin carga si corresponden al caso anterior. Estas prácticas usan otro dataset con exposición y estándares; sus totales no deben compararse con 5,822,881 del material anterior.

Si vienes del caso anterior, en esta copia renombra sus consultas finales con el prefijo `Anterior_` y desmarca **Habilitar carga** antes de importar. Conserva sus consultas auxiliares y parámetros si dependen de ellos. Las diez consultas nuevas deben usar exactamente los nombres de la tabla de relaciones, sin sufijos como `(2)`. Usa una página de control nueva: los visuales anteriores pueden perder sus campos al retirar las tablas cargadas. A1 permanece intacta en su archivo original.

1. Extraer el ZIP. Para producción, calidad y mantenimiento, usar **Obtener datos → Carpeta** una vez por subcarpeta. Combinar los CSV de esa misma familia, no toda la raíz.
2. Confirmar delimitador coma y codificación UTF-8. Mantener inicialmente claves y fechas como texto.
3. Quitar duplicados EXACTOS de todas las columnas de negocio, excluyendo `Source.Name` si el asistente lo añadió. Hay ocho copias por cada uno de esos tres hechos. No eliminar registros solo porque comparten fecha o lote.
4. Aplicar Recortar a `linea_id`, `parte_id` y `tipo_defecto` donde existan. Con `fecha` todavía como texto, agregar `fecha_limpia` con la fórmula `if Text.Contains([fecha], "/") then Date.FromText([fecha], [Format="dd/MM/yyyy", Culture="es-MX"]) else Date.FromText([fecha], [Format="yyyy-MM-dd", Culture="en-US"])` y asignar tipo Fecha. Tras comprobarla, renombrar la original a `fecha_original` y `fecha_limpia` a `fecha`. No crear la columna personalizada con un nombre que ya exista.
5. Cantidades y minutos: número entero. Turno y claves: texto. Inicio, fin y fecha_hora: fecha/hora. No borrar la hora del evento; fecha y marca horaria cumplen funciones distintas.
6. Cargar las seis dimensiones y `fact_exposicion_equipo` como CSV individuales. Mantener el calendario de 730 fechas. Marcarlo como tabla de fechas y ordenar `nombre_mes` por `mes`.
7. Validar 5,544 registros de producción, 11,088 de calidad, 708 de mantenimiento y 11,088 de exposición tras limpieza. Producción: **3,761,757 piezas**. Rechazo de calidad: **117,998**, igual a producidas menos buenas.

Si el grupo ya limpió este caso en Día 1, reutilizar esas consultas. Si llega con el caso anterior, el instructor prepara esta transición antes del bloque 2.1 para conservar sus 90 minutos; el participante realiza la conexión y comprueba los pasos. No se entrega un CSV «limpio» como sustituto de la práctica.

**Punto de entrada de 2.1:** las diez consultas de este caso deben estar listas para actualizar y pasar los controles anteriores en una copia por participante. Los tres hechos se combinan por carpeta; seis dimensiones y `fact_exposicion_equipo` son CSV individuales. Los primeros diez minutos sirven para reconectar y comprobar ese trabajo. Si hay que importar y limpiar los 54 CSV de hechos desde cero, completa una sesión de transición antes de empezar; los 90 minutos no incluyen esa preparación. Registra el tiempo real del primer pilotaje antes de prometer esa duración al grupo.

## Relaciones al terminar Día 2

Todas activas, uno a varios, filtro único dimensión → hecho. Cada clave del lado uno debe ser única. Construir estas 16 relaciones:

| Dimensión y columna | Hechos y columnas destino |
|---|---|
| dim_calendario[fecha] | fecha de producción, calidad, mantenimiento y exposición |
| dim_linea[linea_id] | linea_id de los cuatro hechos |
| dim_parte[parte_id] | parte_id de producción y calidad |
| dim_turno[turno] | turno de producción, calidad y exposición |
| dim_defecto[defecto_id] | fact_calidad[tipo_defecto] |
| dim_equipo[equipo_id] | equipo_id de mantenimiento y exposición |

No relacionar hechos entre sí. No relacionar dim_linea con dim_equipo en el modelo base: ya filtran los hechos por rutas directas. `dim_equipo[linea_id]` es descriptiva; ocultarla al lector para que use dim_linea. Equipo no filtra producción ni calidad. Lote e inspector tampoco constituyen dimensiones compartidas.

La jerarquía Año > Trimestre > Mes > Semana puede dividir una semana entre meses; documentar ese límite. Para análisis ISO usar anio_iso + semana_iso, no semana sola. Área > Línea > Celda usa los atributos de dim_linea, aunque en este caso haya una celda por línea.

## Cambio explícito durante 3.2

Mantenimiento no contiene turno y en 2.2 esa pregunta no está sustentada. Al comenzar la validación por turno de 3.2, agregar en Power Query, desde `inicio` ya convertido a fecha/hora:

```powerquery
let h = Time.Hour(DateTime.Time([inicio]))
in if h >= 6 and h < 14 then "1"
   else if h >= 14 and h < 22 then "2" else "3"
```

Nombrar `turno`, tipo texto, y añadir la relación dim_turno[turno] → fact_mantenimiento[turno]. El modelo pasa de 16 a 17 relaciones. Los eventos del caso no cruzan turnos productivos; en un origen real, un evento que cruce el límite exige una regla de asignación o fragmentación adicional. Los preventivos fuera del horario se excluyen de MTTR/MTBF de fallas que afectan producción.

Crear tabla `_Medidas` mediante Introducir datos (una columna auxiliar y una fila), asignar allí las medidas, ocultar la columna y organizar carpetas. No escribir medidas durante 2.2.

## Archivos de práctica que requieren preparación en Desktop

No se incluyen PBIX prearmados ni se simula haber ejecutado el motor de Power BI. El instructor monta en una copia los cuatro fallos de 2.3 siguiendo su guía y el reporte deliberadamente deficiente de 4.1. Los CSV y las instrucciones permiten reproducirlos. Guardar `A2`, `A3`, `A4`, `A5` por separado durante clase.
