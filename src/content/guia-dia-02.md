---
title: Guía de trabajo · Día 2
---

## El resultado que debes demostrar

**C2 · Modelado dimensional:** diseñar un modelo relacional con la granularidad correcta e identificar relaciones que producen cifras infladas o filtros que no propagan. Tu evidencia **A2** es el modelo terminado, auditado por otra persona y corregido a partir de esa revisión.

Esta jornada desarrolla el Día 2 de la propuesta *Analítica Operativa con Power BI*, de Javier A. Flores Flores, septiembre de 2026: sección 3, página impresa 4; competencias y escala en sección 4, página impresa 7. Los ejemplos, controles y actividades detalladas de esta guía implementan esa propuesta sobre el dataset sintético del curso.

Retomamos el PBIX A1. No comenzamos con una tabla plana nueva ni con datos reales de la planta. Las sumas de hoy sirven para comprobar el modelo; las medidas DAX corresponden al Día 3.

## Horario y puntos de control

| Horario | Bloque del PDF | Resultado observable |
|---|---|---|
| 08:00–09:00 | Fundamento del día | Explicas hechos, dimensiones, granularidad, cardinalidad y filtro |
| 09:00–10:30 | Armar el modelo | Construyes en paralelo con el instructor y pruebas las relaciones |
| 10:30–10:45 | Receso | Guarda tu avance |
| 10:45–12:15 | Pregúntale al modelo | Respondes preguntas por fecha, línea y turno con menor guía |
| 12:15–13:15 | Comida | Conserva una copia del PBIX |
| 13:15–14:45 | Laboratorio aplicado | Jerarquías, campos, formato, organización y diagnóstico |
| 14:45–15:00 | Receso | Guarda tu avance |
| 15:00–16:30 | Taller de evidencia | Terminas A2, recibes auditoría y corriges |
| 16:30–17:00 | Validación y cierre | Contrastas cifras, registras evidencia y nivel observado |

Son **450 minutos efectivos**, con 90 minutos de pausas. Las actividades núcleo se realizan en parejas cuando el nivel del grupo lo requiera; cada persona debe poder explicar su archivo.

## 1. Punto de partida: conserva A1

1. Abre tu A1 y guarda como `Apellido_Nombre_A2.pbix`.
2. Ajusta `RutaDatos` si cambiaste de computadora y actualiza.
3. Confirma las ocho tablas separadas, los tipos revisados y la conciliación de A1. Conserva los pendientes documentados; no los escondas para avanzar.
4. En Vista Modelo / Administrar relaciones, registra las relaciones autodetectadas. En la copia A2, corrige las que no correspondan al diseño previsto.

Si A1 no está validada, informa qué falla y retoma la guía del día anterior con apoyo. Una captura de un modelo conectado no compensa un origen sin depurar.

## 2. Define qué representa cada fila

| Tabla | Granularidad del caso | Precaución |
|---|---|---|
| fact_produccion | Día · línea · turno · parte, con lote | Una línea tiene múltiples registros por día |
| fact_calidad | Evento de rechazo o no conformidad | Un lote puede tener varios eventos legítimos |
| fact_mantenimiento | Registro de mantenimiento / orden de trabajo | equipo_id identifica al equipo, no a la orden; el CSV no trae orden_id |
| dim_linea | Una línea | linea_id debe ser único |
| dim_parte | Una parte | parte_id debe ser único |
| dim_turno | Un turno | nombre contiene 1, 2, 3; turno_id contiene T1, T2, T3 |
| dim_defecto | Un tipo de defecto | defecto_id debe ser único |
| dim_calendario | Un día | fecha única y continua |

Las cinco dimensiones describen y agrupan. Los tres hechos conservan sus eventos. En este modelo se usan **dimensiones compartidas** para comparar los hechos al nivel compatible.

### Por qué un cruce puede inflar una cifra

Ejemplo ilustrativo: en una fecha hay dos registros de producción, de 100 y 200 piezas, y dos eventos de mantenimiento. Combinar y expandir ambos hechos por fecha produce cuatro combinaciones; al sumar las piezas repetidas aparecen 600 en lugar de 300.

Esto describe una **combinación que materializa filas en Power Query**. Una relación del modelo establece una ruta de filtro; no agrega físicamente filas por sí sola. Un diseño de relaciones incorrecto puede producir totales repetidos por categoría, contextos inadecuados o filtros que no llegan. Identifica el mecanismo antes de corregir.

## 3. Comprueba las claves

En Power Query, activa perfilado sobre el conjunto completo. Para cada clave de dimensión:

- Compara número de filas y número de valores distintos. Deben coincidir para el lado 1.
- Confirma que no haya nulos ni cadenas vacías.
- Revisa tipo y valores en ambos extremos de la relación. Igual nombre no garantiza igual contenido.
- Para buscar registros huérfanos, crea una consulta de diagnóstico desde el hecho y usa una combinación **anti izquierda** contra la dimensión por las claves elegidas. La salida muestra claves sin correspondencia.

En esas consultas auxiliares desmarca **Habilitar carga**; conserva su nombre y propósito en la bitácora. Así puedes repetir el diagnóstico sin añadir tablas al modelo base de ocho tablas.

No elimines una clave duplicada del catálogo al azar. Puede ser un error, una versión histórica o una entidad definida con una clave incompleta. Primero aclara su significado.

Referencia: línea tiene 4 claves, parte 5, turno 3, defecto 6 y calendario 549 fechas. Tras las reglas A1 del ZIP de referencia, las diez relaciones de abajo tienen cero claves huérfanas.

## 4. Construye el modelo

En **Vista Modelo → Administrar relaciones → Nueva**, crea una relación a la vez. La ubicación de las opciones puede cambiar entre versiones; comprueba siempre las columnas y propiedades antes de aceptar.

| Dimensión: lado 1 | Hecho: lado * |
|---|---|
| dim_calendario[fecha] | fact_produccion[fecha] |
| dim_calendario[fecha] | fact_calidad[fecha] |
| dim_calendario[fecha] | fact_mantenimiento[fecha_evento] |
| dim_linea[linea_id] | fact_produccion[linea_id] |
| dim_linea[linea_id] | fact_calidad[linea_id] |
| dim_linea[linea_id] | fact_mantenimiento[linea_id] |
| dim_parte[parte_id] | fact_produccion[parte_id] |
| dim_parte[parte_id] | fact_calidad[parte_id] |
| dim_turno[nombre] | fact_produccion[turno] |
| dim_defecto[defecto_id] | fact_calidad[tipo_defecto] |

Para este diseño: **diez relaciones activas, 1:* y dirección única desde dimensión hacia hecho**. Si seleccionas el hecho primero, Desktop puede mostrar *:1: es la misma cardinalidad vista desde el otro extremo. Comprueba las marcas 1 y *.

La lista es la implementación didáctica para estas ocho tablas; el PDF exige un modelo correcto, no un número universal de relaciones. No relaciones directamente los hechos por fecha ni por lote. No actives Ambos para forzar que todas las tarjetas reaccionen.

### La clave de turno

Después de A1, `fact_produccion[turno]` debe contener texto "1", "2" y "3". Se relaciona con **dim_turno[nombre]**, que es única. `turno_id` contiene T1, T2 y T3 y no coincide directamente.

Una alternativa válida sería obtener `turno_id` mediante una búsqueda documentada y usar esa clave. No mantengas dos rutas activas equivalentes para resolver lo mismo. No relaciones los nombres de supervisores: fueron anomalías de captura, no claves del turno.

### El calendario

Comprueba tipo Fecha en las cuatro columnas de fecha relacionadas. El calendario del ZIP contiene **549 días**, del **01/03/2025 al 31/08/2026**, sin huecos ni repetidos. Mantiene domingos aunque no haya producción.

Selecciona `dim_calendario`, utiliza **Marcar como tabla de fechas** y elige `fecha`. Usa sus campos explícitos en los visuales de prueba. Si ya existían visuales basados en jerarquías automáticas de fecha, revísalos después de cambiar esta configuración.

Para el laboratorio de inteligencia de tiempo clásica del Día 3, habrá que extender el calendario a los años completos que se analicen y volver a validarlo. Marcar la tabla no añade fechas faltantes ni datos de producción para esos días.

**Checkpoint 10:30:** claves comprobadas, relaciones intencionales, totales preservados y captura del modelo.

## 5. Pregúntale al modelo

Crea una página llamada `Control_A2` con tres tarjetas sencillas o una tabla de control:

| Campo | Agregación | Unidad |
|---|---|---|
| fact_produccion[piezas_producidas] | Suma | Piezas |
| fact_calidad[piezas_rechazadas] | Suma | Piezas |
| fact_mantenimiento[duracion_min] | Suma | Minutos |

Configura las unidades de visualización para ver el entero completo, sin abreviaturas de miles o millones. Si aparece Recuento cuando esperas Suma, revisa el tipo de dato. No uses `horas_paro` en lugar de `duracion_min`: miden cosas distintas.

Agrega segmentadores desde **dim_linea**, **dim_calendario**, **dim_turno**, **dim_parte** y **dim_defecto**. Usa nombres legibles de las dimensiones; conserva el código en la bitácora para identificar el filtro sin ambigüedad.

Antes de cada prueba, **limpia todos los filtros**, incluyendo selecciones de otros visuales y filtros de página o informe. Predice el resultado, aplica la selección y compáralo con un filtro directo sobre la consulta A1 depurada. Las cifras del cuadro son controles adicionales, no sustituyen ese contraste.

| Prueba independiente | Producidas: piezas | Rechazadas: piezas | Mantenimiento: min |
|---|---:|---:|---:|
| Sin filtros | 5,822,881 | 144,882 | 93,298 |
| Línea L1 | 1,340,826 | 33,170 | 23,409 |
| Fecha 01/03/2025 + línea L1 | 2,301 | 77 | 21 |
| Turno 1 | 1,954,605 | 144,882 | 93,298 |
| Parte P-1001 | 1,189,291 | 29,629 | 93,298 |
| Defecto D01 | 5,822,881 | 24,235 | 93,298 |

Sin filtros, las filas son **7,067 de producción**, **26,825 de calidad** y **1,303 de mantenimiento**. En el corte fecha + L1 son 3, 13 y 1, respectivamente. Las cifras corresponden al ZIP del curso con las reglas de A1 y sin exclusiones adicionales. Si tu A1 documenta otra exclusión, concilia su efecto antes de calificar la relación como incorrecta.

### Un filtro que no aplica no es una falla

| Dimensión | Producción | Calidad | Mantenimiento |
|---|---|---|---|
| Fecha | Filtra | Filtra | Filtra |
| Línea | Filtra | Filtra | Filtra |
| Parte | Filtra | Filtra | No aplica |
| Turno | Filtra | No aplica | No aplica |
| Defecto | No aplica | Filtra | No aplica |

En el modelo base no hay turno en calidad ni en mantenimiento, y no hay parte en mantenimiento. Que el valor de esos hechos se conserve al cambiar esa dimensión es esperado. Rotula el alcance de las tarjetas para que nadie interprete el total como si correspondiera al filtro.

Si presentas piezas producidas por tipo de defecto, el total puede repetirse en cada fila porque defecto no filtra producción. No sumes manualmente esos totales repetidos. Tampoco atribuyas todo el mantenimiento de una línea a cada parte que se fabricó en ella.

**Checkpoint 12:15:** tres preguntas respondidas con filtro, valor, fuente y explicación de alcance.

## 6. Laboratorio: organiza para otra persona

### Jerarquías

- En `dim_calendario`, crea año → mes → fecha usando `anio`, `nombre_mes` y `fecha`.
- Ordena `nombre_mes` por `mes`. Los meses se repiten entre años: incluye `anio` al comparar periodos.
- En `dim_linea`, crea área → nombre de línea con `area` y `nombre_linea`.
- Prueba expandir niveles en una matriz. Una jerarquía facilita navegación; no crea una relación ni corrige una que esté mal.

### Columnas, formato y organización

- Organiza las dimensiones y los hechos en la vista Modelo y añade descripciones de propósito, granularidad y límites.
- Oculta claves redundantes de los hechos en la vista de informe para favorecer los campos de las dimensiones. Conserva los datos para las relaciones y la auditoría.
- Deja disponibles las dimensiones necesarias para segmentar. No ocultes las ocho tablas completas.
- Usa **No resumir** para identificadores; formato entero para piezas y minutos. En cada visual confirma la agregación intencional.
- Las horas de producción del generador pueden repetirse por registros de distintas partes en un mismo turno. No se suman hoy como horas únicas de línea ni se usan para calcular disponibilidad.

### Tabla oculta y consulta sin carga no son lo mismo

Ocultar una tabla la conserva en el modelo y mantiene sus relaciones. Deshabilitar la carga de una consulta evita que sea una tabla del modelo. En una copia de demostración, el instructor puede mostrar una tabla auxiliar de diagnóstico oculta; en el modelo base las ocho tablas tienen una función visible para la práctica.

Ocultar campos o tablas organiza la autoría; **no es una medida de seguridad**. La seguridad formal pertenece al Día 5.

## 7. Diagnostica y demuestra la corrección

| Síntoma | Prueba inicial | Qué no hacer automáticamente |
|---|---|---|
| El filtro de línea solo cambia producción | Verifica si el segmentador viene del hecho en lugar de dim_linea | Activar Ambos |
| Una tarjeta ignora la fecha | Revisa relación activa, columna de fecha y tipo compatible | Crear otra relación sin revisar la existente |
| Categoría en blanco | Busca nulos y claves huérfanas mediante anti unión | Borrar la categoría y dar el modelo por corregido |
| Mismo total repetido en cada categoría | Comprueba si esa dimensión tiene ruta hacia ese hecho | Sumar manualmente las filas mostradas |
| Se propone muchos a muchos | Examina duplicados y significado de la clave del catálogo | Aceptarlo solo para cerrar el cuadro de diálogo |
| El total creció frente a A1 | Revisa las consultas, combinaciones, duplicados y la misma selección de filtros | Culpar a una medida sin verificar el origen |

**Falla controlada:** guarda una copia de prueba. Desactiva calendario → mantenimiento; aplica una fecha y registra el síntoma. Sigue la ruta, restaura la relación y repite exactamente el filtro. Nunca entregues como A2 la copia que dejaste deliberadamente con la falla.

Si las relaciones y claves son correctas, revisa filtros del visual, página e informe y sus interacciones. No modifiques varias cosas a la vez: perderías la evidencia de qué corrigió el problema.

**Checkpoint 14:45:** jerarquías operables, campos organizados y una falla con antes, causa, corrección y después.

## 8. Taller A2 y revisión entre áreas

Trabaja de forma autónoma sobre el PBIX del día. Distribuye los primeros 50 minutos en 20 para completar el modelo, 15 para controles y 15 para documentación. Después realiza la auditoría de 20 minutos; los 5 minutos finales del bloque son para registrar la entrega. La rúbrica y la preparación de bitácora ocupan los 15 minutos iniciales del bloque.

1. Comparte una copia del PBIX y la bitácora con una persona de otra área cuando sea posible.
2. El revisor ajusta `RutaDatos`, actualiza y reproduce al menos dos pruebas sin que el autor le dicte los pasos.
3. Registra un hallazgo con tabla, relación o propiedad, filtro y cifra observada. Si no encuentra fallas, registra el resultado de la revisión; no inventa un error.
4. El autor corrige y el revisor repite la prueba. Ambos registran el resultado y cualquier pendiente.

El instructor puede entregar una copia con una falla controlada para observar diagnóstico cuando el archivo revisado no tenga errores. La copia original se conserva.

## 9. Plantilla de bitácora A2

Participante: __________ · Área: __________ · Fecha: __________

PBIX A1 de origen: __________ · PBIX A2: __________ · RutaDatos: __________

### Diccionario del modelo

| Tabla | Qué representa una fila | Clave o columnas del grano | Unidad / límite de uso |
|---|---|---|---|
| | | | |

### Inventario de relaciones

| Dimensión y columna | Hecho y columna | Cardinalidad | Dirección | Activa | Comprobación de claves |
|---|---|---|---|---|---|
| | | | | | |

### Pruebas de filtro

| Filtro y tabla de origen | Hecho / campo agregado | Esperado y fuente | Observado | Diferencia / explicación |
|---|---|---|---|---|
| | | | | |

Incluye un caso donde **sí debe propagarse** el filtro y otro donde **no debe propagarse**. Si cambias la fuente o excluyes registros, anota el efecto sobre la referencia.

### Auditoría y corrección

Revisor y área: __________

Síntoma y evidencia: __________

Causa identificada: __________

Cambio aplicado: __________

Mismo filtro después del cambio y resultado: __________

Pendientes / limitaciones: __________

### Entrega

- [ ] PBIX A2 conserva la secuencia del archivo A1 y actualiza correctamente.
- [ ] Cada hecho tiene granularidad declarada; las claves del lado 1 son únicas.
- [ ] Relaciones y rutas de filtro justificadas; se documentan las diferencias respecto al modelo base.
- [ ] Jerarquías, campos, unidades y descripciones facilitan el uso por otra área.
- [ ] Totales y cortes contrastados contra la fuente; limitaciones explícitas.
- [ ] Auditoría, corrección y repetición de prueba registradas.
- [ ] Entrego `Apellido_Nombre_A2.pbix`, captura del modelo y bitácora en el medio indicado por el instructor.

## 10. Escala de dominio de la propuesta

| Nivel | Evidencia del desempeño |
|---|---|
| 1 · Inicial | Completa con apoyo del instructor en pasos críticos |
| 2 · En desarrollo | Ejecuta autónomamente sobre el caso practicado |
| 3 · Competente | Resuelve una variante no vista y justifica sus decisiones de modelo |
| 4 · Avanzado | Detecta y corrige errores en el trabajo de otro participante y sustenta la corrección |

Explicar el ejemplo ya practicado no basta para demostrar nivel 3. El instructor plantea una variante distinta y observa la transferencia. Para nivel 4 se requiere una corrección sustentada, no solo declarar que revisaste un archivo.

El PDF sugiere nivel 2 o superior en las cinco competencias y al menos dos en nivel 3, con mayor peso para las evidencias finales A4 y A5. **A2 no acredita por sí sola todo el programa**; aquí se registra el nivel observado para C2.

## 11. Cierre y continuidad

Sin abrir tus notas, explica por qué no asignarías mantenimiento a una parte solo porque coinciden en fecha y línea. Después anota una relación que puedas justificar y una pregunta que aún no pueda responder tu modelo.

Guarda PBIX, bitácora y respaldo. Mañana se construyen indicadores sobre este mismo modelo; no avances con diferencias sin explicar.

## Referencias

La estructura, competencia, evaluación y conjunto sintético se basan en el PDF proporcionado por el instructor: *Analítica Operativa con Power BI · Propuesta didáctica, actividades por sesión y evaluación diagnóstica*, septiembre de 2026, secciones 2, 3, 4 y 6. Se respeta su carácter de propuesta de trabajo.

Para las decisiones técnicas:

- [Microsoft Learn: esquema estrella](https://learn.microsoft.com/en-us/power-bi/guidance/star-schema).
- [Microsoft Learn: relaciones del modelo](https://learn.microsoft.com/en-us/power-bi/transform-model/desktop-relationships-understand).
- [Microsoft Learn: filtros bidireccionales](https://learn.microsoft.com/en-us/power-bi/guidance/relationships-bidirectional-filtering).
- [Microsoft Learn: tablas de fechas](https://learn.microsoft.com/en-us/power-bi/transform-model/desktop-date-tables).
- [Microsoft Learn: diagnóstico de relaciones](https://learn.microsoft.com/en-us/power-bi/guidance/relationships-troubleshoot).
- [Microsoft Learn: ordenar una columna por otra](https://learn.microsoft.com/en-us/power-bi/create-reports/desktop-sort-by-column).
