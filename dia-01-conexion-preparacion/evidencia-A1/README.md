# Evidencia A1 · Datos preparados y reproducibles

Entregar `Apellido_Nombre_A1.pbix` y una bitácora por el medio indicado por el instructor. La plantilla está en la [guía del participante](../../src/content/guia-dia-01.md), disponible también desde la presentación como página imprimible y descarga Markdown.

## Evidencias observables

| Criterio | Cómo comprobarlo |
|---|---|
| Conexión | Ocho consultas finales separadas, con tipos adecuados y RutaDatos parametrizada |
| Limpieza | Nueve anomalías con regla sustentada o excepción declarada; valores originales rastreables |
| Integridad | Filas y piezas conciliadas entre origen, salida y retiradas, sin categorías superpuestas |
| Faltantes | Horas de paro null conservadas y contadas, sin convertirlas en cero |
| Reproducción | Dos actualizaciones estables sobre el mismo origen |
| Transferencia | Un compañero cambia RutaDatos, actualiza y documenta un hallazgo |

La escala existente (1–4) se conserva: apoyo directo, ejecución autónoma, justificación, auditoría sustentada. Estos criterios no añaden ponderaciones ni sustituyen la propuesta didáctica oficial.

## Controles para el facilitador

Referencia calculada sobre el ZIP distribuido, SHA-256:
`9948728716b3fc15bfc6d4d89b5ec347eb2d8c601da68afb8bca943f18bc2ce8`.

Se retiran primero subtotales y después copias exactas de producción, comparando todas las columnas originales. No se excluyen filas adicionales; los nulos de horas se conservan.

| Categoría | Filas | Piezas producidas |
|---|---:|---:|
| Origen | 7,187 | 6,046,188 |
| Subtotales retirados | 12 | 134,753 |
| Copias exactas retiradas | 108 | 88,554 |
| Salida | 7,067 | 5,822,881 |

La salida conserva **208 nulos de horas_paro**. Hay **308 turnos recuperables desde hora_inicio**. Calidad suma **144,882 piezas rechazadas**, iguales a producidas menos buenas en producción depurada; también se comprueba por lote normalizado. Calidad conserva 26,825 eventos; mantenimiento, 1,303. No deduplicar calidad por parecido.

Estos valores corresponden a esta versión del ZIP, no a cualquier semilla. Si el participante excluye otras filas, pedir una conciliación adicional.

Ejecutar `python scripts/verificar_dia1.py` desde la raíz al actualizar contenido o dataset. Comprueba ZIP, reglas recuperables, conciliación por lote y 450 minutos. No ejecuta M ni sustituye la prueba en Power BI Desktop.
