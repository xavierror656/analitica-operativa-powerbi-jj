# Guía del instructor para las dieciséis prácticas

Fuente: `Plan_Practicas_PowerBI_Dias2-5.docx`, proporcionado por Javier Flores. SHA-256 `b667da9e8a873bf91d49d8b1c2a097f330d3bad2a09815a72228e81550154966`. Se extrajeron en orden los párrafos y tablas, incluyendo propósito, preparación, tiempos, evidencia y ajustes de las 16 actividades. No se modifica ni se publica el Word original.

Las presentaciones se abren en `/practicas/`. Cada actividad tiene su ZIP con datos crudos, consigna, diccionario, montaje y formularios. Se conservan los materiales previos como referencia; esta secuencia usa el nuevo caso y sus cifras. Los cuatro bloques de 90 minutos sustituyen las prácticas correspondientes, no se añaden a las 7.5 horas. Mantener fundamento, pausas y cierre de la jornada original, contextualizando las cifras al caso nuevo.

## Preparación antes de impartir

1. Revisar `src/content/practicas/montaje.md`. Construir y comprobar una copia del modelo en Power BI Desktop; no se entregan PBIX prearmados. La compilación web no ejecuta DAX ni valida relaciones en Desktop.
2. Si el Día 1 se impartió con otro dataset, preparar la transición antes de 2.1: conservar el PBIX anterior y reutilizar el patrón de carpeta con las capturas de este caso. Hay ocho duplicados exactos por hecho principal, claves con espacios y fechas ISO/dd/MM/yyyy. La hoja de control parte de la limpieza reproducible, no de sumar duplicados de captura como si fueran producción real.
3. Repartir solo los ZIP del alumno. Esta guía y `controles.json` contienen resoluciones; no proyectarlas antes de cada investigación. No están en `public/` ni en las descargas, aunque el repositorio no es un sistema de acceso restringido.
4. Montar los cuatro casos de 2.3 en copias aisladas; preparar la página deficiente de 4.1 o usar el espécimen de las slides como punto de partida. Preparar el orden de seis equipos antes de 5.4.

## Clave de 2.2

| Pregunta | Respuesta de referencia |
|---|---|
| 1 | L2, 125 minutos = 2.083333… horas de paro en marzo de 2025 |
| 2 | E31, 39 eventos correctivos en abril–junio de 2026 |
| 3 | Familia Empaque, 2,380,127 piezas en 18 meses |
| 4 | Lunes, 20,255 piezas rechazadas |
| 5 | D01, 21,500 piezas rechazadas en L2 |
| 6 | Turno 2, 82,433 piezas en las semanas ISO de los seis festivos de la hoja |
| 7 | 240,506 piezas en semanas 10–14 del año ISO 2025 |
| 8 | No hay propagación automática de lote entre hechos; una búsqueda manual o una extensión cambia la tarea |
| 9 | A2 no tiene turno en mantenimiento; se deriva y relaciona explícitamente en 3.2 |
| 10 | Línea/equipo no atribuyen un evento a una parte; se requiere asignación o puente con regla de negocio |

Las siete primeras no requieren medidas DAX. Para la sexta puede usarse selección conjunta de año ISO y semana; domingo por sí solo no define el filtro pedido.

## Montaje reservado de 2.3

Usar los archivos `laboratorio/` como sustituciones de la tabla correspondiente en copias del caso. Mantener una copia A2 íntegra. No anexar estas variantes al maestro.

| Caso | Preparación del instructor | Síntoma y reparación |
|---|---|---|
| A | Sustituir calidad por caso-a/calidad.csv; desactivar su relación con calendario | El mes no cambia el total; activar relación tras verificar claves |
| B | Sustituir calidad por caso-b/calidad.csv; conservar fecha como fecha/hora con hora distinta de medianoche y relacionar con calendario | No coinciden fechas; crear fecha sin hora para la relación y conservar marca horaria original |
| C | Sustituir catálogo por caso-c/partes.csv; recortar claves | P001 queda duplicada; inspeccionar ambas filas y retirar el duplicado del catálogo antes de exigir 1:* |
| D | Sustituir calidad por caso-d/calidad.csv, con linea_id numérico 1–4 | Tipo y dominio incompatibles con L1–L4; transformar a texto y anteponer L, comprobar catálogo |

Estos síntomas corrigen dos imprecisiones del Word: una relación inactiva puede repetir totales, no necesariamente devolver blanco; una clave duplicada no multiplica por sí sola la suma física del hecho. Si se desea una quinta falla, en otra copia añadir dim_linea → dim_equipo además de ambas rutas a mantenimiento, y pedir diagnóstico de ruta redundante/ambigua. No obligar a que Power BI acepte una configuración que su versión rechace: el rechazo también es un síntoma válido.

## Clave de 3.1

Celda L3 / turno 1, abril de 2026, modelo de 16 relaciones, antes de derivar turno en mantenimiento:

| Ronda | Resultado |
|---|---:|
| Suma simple | 18,424 |
| CALCULATE turno 3 | 18,366 |
| ALL(dim_linea) | 75,853 |
| KEEPFILTERS turno 3 intersectado con 1 | BLANK |
| FILTER piezas ≥600 | 16,193 |
| Rechazo de producción | 4.6678245766 % |
| Variables, no buenas | 860 |
| MTTR de correctivos que afectan producción | 77.8125 min |

La última cifra no responde al turno aún: ese hecho no recibe su filtro. Media simple de promedios por equipo: 55.1785714286 min; razón ponderada de minutos/eventos: 77.8125. No llamarlas ambas el mismo MTTR sin aclarar ponderación. Ocho rondas de siete son 56; la preparación de cuatro minutos completa los 60 indicados por el Word.

## Control de 3.2 y 3.4

Después de derivar turno, 06/04/2026 L3 turno 1: 592 piezas, plan 767, buenas 512, rechazadas 80, programados 450 min, operación 360 min, un correctivo con paro de 90 min. Dos equipos acumulan 12 horas-equipo. Estándar de P002: 110 piezas/hora. Resultado: cumplimiento 77.183833 %, yield 86.486486 %, scrap 13.513514 %, disponibilidad 80 %, rendimiento 89.696970 %, OEE 62.060606 %, MTTR 90 min y MTBF 12 h-equipo/falla.

El archivo `outputs/practicas-20260922/Control_instructor.xlsx` calcula esas cifras con fórmulas visibles. `controles.json` incluye el total y el corte de todos los turnos, más 72 cortes línea/mes. Su finalidad es contrastar; no entregar como dataset resuelto.

El estándar crudo de P005 es 30 piezas/hora; la referencia didáctica de Ingeniería es 125 vigente desde enero de 2025. La corrección se hace por relación de parte con esa ficha o sustitución condicionada y documentada, nunca recortando OEE. Globalmente, el estándar crudo produce OEE 141.854100 %; con referencia produce 86.834677 %. Guardar captura de ambos y la justificación. El alumno debe detectar la inconsistencia.

Los seis indicadores de ficha son los del Word: cumplimiento, yield, scrap, disponibilidad, OEE y MTTR. MTBF y productividad se construyen en 3.2. Para MTBF de un equipo, filtrar dim_equipo; no usar horas únicas de línea como exposición de toda la flota. Las fallas contadas son correctivos con afecta_produccion=1, no preventivos ni ajustes sin paro.

La expresión de Scrap devuelve BLANK ante filtro directo de lote de cualquiera de los dos hechos. Esa protección hace visible la limitación; para segmentación por defecto se interpreta como contribución al rechazo sobre toda producción del corte, no rendimiento de una población inspeccionada por defecto.

## Resolución temporal y del misterio

- **L2:** scrap alrededor de 3.4 % hasta septiembre de 2025, alrededor de 1.2 % desde octubre hasta junio de 2026. El descenso permanece en los nueve meses siguientes.
- **L4:** alrededor de 0.4 % en mayo de 2026, regresa a aproximadamente 3.4 % en junio. Comparar mayo aislado oculta el rebote. La media móvil es promedio simple de tres tasas mensuales; no confundir con la razón ponderada conjunta.
- **L3:** E31 acumula 38 eventos por «Desajuste de alimentación» y un correctivo por otra causa en el segundo trimestre de 2026. Los 38 paros recurrentes duran 90 minutos y los rechazos de arranque ocurren 10 y 25 minutos después del fin del evento, dentro del mismo bloque operativo. La baja de OEE respecto a Q1 se concentra allí. El 1 de mayo es inhábil y no hay evento sembrado ese día.
- **Pista del turno 3:** su tiempo programado aumenta de 330 a 450 minutos en Q2 en todas las líneas. La carga coincide en el tiempo, mientras el problema de equipo aparece en L3 y se reparte entre turnos. Contrastar líneas de control y tasas, no solo conteos brutos. Esto refuta culpar al turno por coincidencia; no demuestra una causalidad empresarial real.

La causalidad del equipo se conoce porque el instructor diseñó la simulación. En un origen observado sería una hipótesis con secuencia temporal y evidencia compatible, sujeta a prueba operativa. No presentar la revelación del generador como una prueba estadística de causalidad.

## 4.1 y 4.3

El espécimen de las slides muestra un pastel de doce meses, seis medidores compactos, colores sin convención, títulos genéricos y un eje de OEE que empieza en 70 %. Es deliberadamente deficiente. Si se reproduce en Desktop, añadir una tabla larga de registros para observar la pérdida de jerarquía, además de las mismas tarjetas y escalas. La página del alumno debe rediseñarse, no copiar el espécimen.

Para el tooltip de 30 días, usar un corte del calendario y comprobar que la ventana responda al filtro de línea; no suponer que un filtro relativo a «hoy» mostrará la historia de 2025–2026. Para un marcador de vista, Datos desactivado; para Restablecer, Datos activado de forma deliberada. La meta incluye sentido mayor/menor y unidad para evitar semáforos invertidos.

## Clave de 5.3 y evaluación final

Categorías sugeridas de las ocho frases: 1 sustentada después de comprobar la cifra; 2 solo correlación; 3 no sustentable (sin datos de capacitación); 4 uso indebido como registro de calidad; 5 sustentada como estimación descriptiva de exposición/fallas con alcance explícito; 6 proyección no sustentable; 7 incompleta/no sustentable sin definir eficiencia; 8 uso como evidencia formal que el tablero no acredita. Aceptar matices razonados; no convertir categorías en respuestas memorizadas.

Python se presenta solo en 5.3: 20 individual + 20 parejas + 18 plenaria + 12 demostración + 20 reescritura = 90. Ejecutar desde la carpeta extraída: `python actividad/verificar_practicas.py ../actividad-5-3.zip` ajustando la ruta real del ZIP, o usar rutas absolutas. El script contrasta piezas y rechazos, no interpreta el PBIX.

5.4: 43 integración + 42 exposición + 5 registro. Hasta seis equipos, siete minutos por turno incluyendo preguntas breves. Los cinco criterios del Word no equivalen literalmente a C1–C5: preparación C1 se comprueba con A1 y la reproducibilidad del origen; conservar el registro de cinco competencias previo y usar además la rúbrica de presentación. Escala 1 ayuda, 2 autonomía en caso practicado, 3 transferencia no vista, 4 diagnóstico/corrección ajena justificada.

## Fuentes técnicas y límites de validación

[Relaciones del modelo](https://learn.microsoft.com/en-us/power-bi/transform-model/desktop-relationships-understand), [muchos a muchos](https://learn.microsoft.com/en-us/power-bi/guidance/relationships-many-to-many), [KEEPFILTERS](https://learn.microsoft.com/en-us/dax/keepfilters-function-dax), [SUMX](https://learn.microsoft.com/en-us/dax/sumx-function-dax), [RELATED](https://learn.microsoft.com/en-us/dax/related-function-dax), [DATESBETWEEN](https://learn.microsoft.com/en-us/dax/datesbetween-function-dax) y [TOTALYTD](https://learn.microsoft.com/en-us/dax/totalytd-function-dax).

Se verifican aritmética, filas, patrones, paquetes y rutas mediante controles automatizados. Excel se recalcula y se inspecciona visualmente con la herramienta de hojas de cálculo. Las fórmulas DAX y las interacciones deben pilotearse en Power BI Desktop antes de impartir; no se afirma que hayan sido ejecutadas allí.
