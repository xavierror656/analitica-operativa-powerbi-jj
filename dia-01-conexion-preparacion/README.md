# Día 1 · Conexión y preparación de datos

Evidencia **A1** · Competencia C1: conecta y consolida datos de producción, calidad y
mantenimiento de distintas fuentes, y los deja limpios y reproducibles mediante pasos
documentados.

| Horario | Bloque | Contenido |
|---|---|---|
| 08:00 | Fundamento (1h) | Modelo semántico: por qué un reporte confiable empieza en la fuente y no en el gráfico. Arquitectura de Power BI, orígenes de datos en planta, criterios de confiabilidad de una fuente. |
| 09:00 | Práctica bonus de diagnóstico (70 min) | Excel de mantenimiento: conexión, tipos, medidas y filtros para conocer el punto de partida del grupo; PBIX separado de A1 |
| 10:10 | Núcleo 1 (1.5h) | Conectar las fuentes de piso |
| 11:55 | Núcleo 2 (1.5h) | Turnos, líneas y lotes en orden |
| 14:25 | Laboratorio (1.5h) | Power Query a fondo: perfilado de columnas, conexión a carpeta, parámetros, columnas condicionales anidadas, manejo de errores en la carga |
| 16:10 | Taller (1.5h) | Cada participante depura su propio archivo y documenta los pasos |
| 17:40 | Cierre (0.5h) | Validación de cifras, revisión cruzada, registro de evidencia |

Slides: `src/pages/dia-01.astro`. Son 60 módulos de contenido + portada y 11 módulos
bonus de diagnóstico. Los seis bloques del programa suman 60, 90, 90, 90, 90 y 30 minutos:
450 minutos de instrucción. Con la práctica bonus: recesos 11:40–11:55 y
15:55–16:10; comida 13:25–14:25; fin 18:10. Si se omite el bonus, los bloques
del programa conservan el horario base de 09:00 a 17:00. Los tiempos se verifican con
`python scripts/verificar_dia1.py`; siguen siendo estimaciones hasta una impartición piloto.

## Material y preparación del facilitador

- [Guía del participante](../src/content/guia-dia-01.md): instrucciones, reglas,
  ejemplos M, solución de problemas y bitácora. Página `/dia-01/guia/`, con impresión
  y descarga. Abrir al inicio junto a Power BI.
- [Criterios y controles de A1](evidencia-A1/README.md): cifras verificadas y escala
  de dominio con evidencias observables.
- Antes de impartir, probar las consultas M en la versión de Desktop del aula y
  confirmar acceso a una carpeta local. No se requiere conexión a sistemas reales.
- Después del fundamento, usar la práctica bonus de mantenimiento como diagnóstico
  inicial. Pedir un primer intento autónomo y registrar, por participante, si
  conecta el Excel, revisa tipos, crea medidas y comprueba filtros sin apoyo,
  con la guía o con apoyo directo. No calificar este ejercicio ni mezclar su
  PBIX con A1. La guía ofrece la resolución después del intento inicial.
- Para la demo de carpeta, preparar dos CSV de producción con los mismos encabezados
  y periodos disjuntos. Usar marzo y abril de 2025 del dataset, interpretando las
  fechas por su formato; conservar valores originales. Guardar en una carpeta
  aparte y anotar sus conteos. No usar copias idénticas ni incluir catálogos.
- Demostrar una importación durante 10 minutos; después los participantes repiten
  con las siete restantes. Cambiar de operador a mitad de la limpieza en parejas.
- Si hay rezago, priorizar conexión, integridad y bitácora. Si hay avance, pedir
  auditoría y casos límite. No adelantar DAX durante A1.

Las ocho tablas se conectan por separado; la combinación de carpeta se practica
con archivos homogéneos. La conciliación explica las diferencias: no exige que el
total limpio iguale al crudo. Los faltantes no se rellenan por conveniencia.

Dataset de práctica: `../datos/`.
