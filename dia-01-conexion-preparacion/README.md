# Día 1 · Conexión y preparación de datos

Evidencia **A1** · Competencia C1: conecta y consolida datos de producción, calidad y
mantenimiento de distintas fuentes, y los deja limpios y reproducibles mediante pasos
documentados.

| Horario | Bloque | Contenido |
|---|---|---|
| 08:00 | Fundamento (1h) | Modelo semántico: por qué un reporte confiable empieza en la fuente y no en el gráfico. Arquitectura de Power BI, orígenes de datos en planta, criterios de confiabilidad de una fuente. |
| 09:00 | Núcleo 1 (1.5h) | Conectar las fuentes de piso |
| 10:45 | Núcleo 2 (1.5h) | Turnos, líneas y lotes en orden |
| 13:15 | Laboratorio (1.5h) | Power Query a fondo: perfilado de columnas, conexión a carpeta, parámetros, columnas condicionales anidadas, manejo de errores en la carga |
| 15:00 | Taller (1.5h) | Cada participante depura su propio archivo y documenta los pasos |
| 16:30 | Cierre (0.5h) | Validación de cifras, revisión cruzada, registro de evidencia |

Slides de este día: `src/pages/dia-01.astro`, módulos en `src/components/dia-01/`
(M1 a M14, uno por bloque del horario de arriba). Los seis bloques del horario están
cubiertos; falta portar el cronómetro visual de actividad (ver `README.md` raíz →
Estado) y validar el timing real en una impartición piloto, ya que los minutos por
módulo son estimados a partir del horario de la propuesta, no medidos en vivo.

Dataset de práctica: `../datos/`.
