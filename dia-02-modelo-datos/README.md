# Día 2 · Modelo de datos

Evidencia **A2** · Competencia C2: diseña un modelo relacional con la granularidad
correcta e identifica relaciones que producen cifras infladas o filtros que no
propagan.

| Horario | Bloque | Contenido |
|---|---|---|
| 08:00 | Fundamento (1h) | Modelado dimensional: hechos y dimensiones, granularidad, cardinalidad y dirección del filtro. Por qué una relación mal planteada infla las cifras sin avisar. |
| 09:00 | Núcleo 1 (1.5h) | Armar el modelo |
| 10:45 | Núcleo 2 (1.5h) | Pregúntale al modelo |
| 13:15 | Laboratorio (1.5h) | Jerarquías, tablas ocultas, columnas de dimensión, formato y organización del modelo, diagnóstico de relaciones que no propagan el filtro |
| 15:00 | Taller (1.5h) | Modelo terminado, auditado por un compañero de otra área y corregido a partir de esa revisión |
| 16:30 | Cierre (0.5h) | Validación de cifras, revisión cruzada, registro de evidencia |

## Material implementado

- Presentación: `src/pages/dia-02.astro`, 38 módulos y una portada. Notas del
  facilitador en cada módulo, cronómetros en las prácticas y cuatro cuestionarios.
- [Guía del participante](../src/content/guia-dia-02.md): página `/dia-02/guia/`,
  imprimible y descargable como Markdown desde la propia guía.
- [Criterios y pruebas A2](evidencia-A2/README.md): controles, evaluación y variantes
  reservadas para que el instructor observe transferencia y auditoría.
- [Correspondencia con el PDF](fuente-y-alineacion.md): fuente, páginas y alcance.

Los bloques suman exactamente 60, 90, 90, 90, 90 y 30 minutos. Los recesos son
10:30–10:45 y 14:45–15:00; la comida, 12:15–13:15. El ritmo sigue pendiente de
pilotaje con participantes; no son duraciones medidas en aula.

## Preparación del instructor

Si usarás las actividades 2.1–2.4 del caso Prácticas, consulta también la
[revisión de viabilidad y preparación de copias](../material-instructor/practicas/dia-02-viabilidad.md).
Ese caso usa diez tablas y 16 relaciones; su transición desde A1 debe completarse
antes de los bloques de 90 minutos. Los controles de este README corresponden al
caso base de ocho tablas.

1. Probar el PBIX A1 en Power BI Desktop, conservar un respaldo y guardar una copia
   A2. Este repositorio no contiene un PBIX A2 ya construido.
2. Revisar el mapa de la guía: diez relaciones activas 1:* con filtro único desde
   dimensiones hacia hechos. El mapa corresponde al dataset actual.
3. Reproducir en Desktop los seis casos de la tabla de controles de la guía y
   contrastarlos con las consultas depuradas de A1.
4. Preparar una copia de prueba para desactivar una relación y una variante no vista
   para nivel 3. Nunca sustituir el entregable por la copia defectuosa.
5. Verificar jerarquías, formato, ocultamiento y descripciones con la versión de
   Desktop instalada. El día 2 no exige escribir medidas DAX.

## Herramienta y validación de la jornada

Todo el trabajo del participante y las demostraciones se realizan en Power BI
Desktop: Vista Modelo, Power Query y visuales de control. No se ejecutan comandos
de terminal como parte de la sesión.

El instructor comprueba claves únicas, correspondencia de relaciones, continuidad
del calendario, seis filtros y conservación de totales desde la interfaz. Si cambia
el dataset, hay que volver a contrastar la referencia antes de usarla en clase.
