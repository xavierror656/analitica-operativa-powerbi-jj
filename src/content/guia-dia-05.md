---
title: Día 5 · Análisis, publicación y evidencia A5
---

## Resultado del día

Integrarás el proyecto, defenderás un hallazgo y presentarás una recomendación en **siete minutos por equipo**. Definirás cómo entregar, actualizar y controlar el acceso al reporte. **Python se presenta únicamente hoy**, como demostración breve de verificación; no reemplaza el trabajo de Power BI ni añade una competencia obligatoria a la propuesta.

## Jornada

| Horario | Trabajo | Resultado |
|---|---|---|
| 08:00–09:00 | Publicación y gobierno | Workspace, gateway, actualización, RLS y alternativa local |
| 09:00–10:30 | Del dato al hallazgo, guiado | Afirmación verificable con contexto y límites |
| 10:30–10:45 | Pausa | |
| 10:45–12:15 | Reunión de siete minutos, menor guía | Ensayo con decisión solicitada |
| 12:15–13:15 | Comida | |
| 13:15–14:45 | Laboratorio | Depuración de afirmaciones y verificación; demo Python de 12 min |
| 14:45–15:00 | Pausa | |
| 15:00–16:30 | Proyecto y presentación | A5, presentación de equipos y rúbrica |
| 16:30–17:00 | Validación y cierre | Entrega, evaluación individual y seguimiento |

Abre A4, conserva una copia y guarda `A5_Equipo.pbix`. Mantén los datos sintéticos. Solo se contempla sustituirlos por datos de empresa anonimizados si existe autorización formal y están preparados; la sesión puede concluir plenamente con el caso sintético.

## 1. Publicación y gobierno del reporte

El reporte se usa en capacitación y apoyo a decisiones. No es por sí mismo un registro controlado de calidad ni sustituye sistemas validados. Antes de uso formal, acuerda con los responsables internos fuente aprobada, propietario, revisión, acceso, actualización y control de cambios.

### Publicar en un espacio autorizado

1. Identifica propietario y audiencia. Confirma con TI el workspace permitido, licencia o capacidad aplicable y política de acceso.
2. Desde Desktop, guarda y usa **Publicar** hacia ese workspace. Para esta clase, realiza la demostración con datos sintéticos y únicamente si están habilitados los permisos.
3. En el servicio, verifica reporte y modelo semántico, credenciales y origen. Abrir el reporte publicado no demuestra que sus datos puedan actualizarse.
4. Configura el acceso mínimo necesario por los mecanismos aprobados de la organización. Comprueba el resultado con una cuenta de lector autorizada.
5. Registra propietario, ubicación, fecha de corte de datos, última actualización correcta, frecuencia esperada y procedimiento para fallos.

**No uses Publicar en web para resolver un bloqueo de permisos internos:** esa función expone el contenido públicamente. Compartir y publicar dentro de una organización son decisiones distintas.

### Gateway y actualización

Si el servicio debe acceder a archivos o fuentes de una red local, puede requerir un gateway autorizado y disponible, credenciales válidas y rutas accesibles. El gateway no sustituye esas credenciales. Una carpeta sincronizada en la laptop no garantiza acceso desde el servicio.

El instructor demuestra el flujo autorizado o su configuración prevista: fuente → credenciales/gateway cuando aplique → actualización → historial y manejo de errores. Diferencia **fecha del último dato** de **hora de actualización del modelo**. Si falla, informa al propietario y muestra el corte real; no presentes como vigente un resultado sin comprobar.

### RLS: demostrar y comprobar

En Desktop, crea un rol didáctico de área sobre `dim_linea` con la regla:

```dax
[area] = "Ensamble"
```

Usa **Ver como** para comprobar que restringe líneas y hechos relacionados. Después de publicar, la asignación del rol y la prueba con usuario autorizado deben realizarse en el servicio. RLS restringe a usuarios con rol Viewer; no restringe del mismo modo a administradores, miembros o colaboradores del workspace. Un segmentador no es seguridad. Esta regla estática es una demostración; no da acceso real a nadie.

### Si no hay acceso al servicio

Entrega el PBIX local y una exportación de páginas representativas según los permisos disponibles. Documenta la restricción, el responsable de resolverla y el flujo previsto de publicación/actualización. El instructor demuestra o explica el servicio. La alternativa permite evaluar análisis y comunicación sin inventar una publicación exitosa ni permisos inexistentes.

## 2. Del dato al hallazgo defendible

Completa la cadena: **pregunta → dato y filtros → comparación → límite → recomendación → decisión solicitada**.

Ejemplo del dataset, todas las líneas y turnos:

| Medida | Abril 2025 | Mayo 2025 |
|---|---:|---:|
| Piezas | 343,875 | 337,491 |
| Plan | 383,895 | 377,764 |
| Minutos correctivos | 3,930 | 3,298 |

Hallazgo: «En mayo se registraron 6,384 piezas menos que en abril, una variación de −1.86 %, con ambos meses completos». El plan también cambia. Estos totales no prueban una caída de productividad por hora ni que mantenimiento causara el cambio. Los minutos correctivos disminuyeron; aun si ambas series se movieran juntas, la coincidencia no demostraría causa.

Recomendación defendible: «Operaciones revisará por línea el cambio de volumen y plan y documentará capacidad y días disponibles antes de decidir ajustes». Completa responsable, fecha acordada, dato adicional y criterio de éxito. No presentes una hipótesis como hecho ni una fecha propuesta como compromiso ya autorizado.

| Tipo de enunciado | Ejemplo | Tratamiento |
|---|---|---|
| Dato comprobado | Mayo: 337,491 piezas con meses completos | Mostrar medida, filtros y fuente |
| Hipótesis | El calendario operativo pudo influir | Solicitar evidencia adicional |
| Afirmación sin soporte | Los paros causaron la caída | Retirar o reformular |
| Recomendación | Revisar volumen, plan y disponibilidad por línea | Precisar responsable, plazo y prueba |

## 3. Preparar la reunión de siete minutos

| Tiempo | Contenido |
|---|---|
| 0:00–1:00 | Pregunta, contexto y decisión que necesitas |
| 1:00–3:00 | Dos hallazgos con cifras, filtros, comparación y detalle pertinente |
| 3:00–5:00 | Interpretación, límites e hipótesis alternativas |
| 5:00–6:30 | Recomendación, responsable propuesto y verificación |
| 6:30–7:00 | Solicitud concreta y siguiente paso |

Usa el reporte como evidencia; no recorras cada visual. Si una cifra no puede verificarse, reconoce el límite y registra qué falta. En el ensayo, trabaja tres rondas de 14 minutos: 7 de exposición, 5 de retroalimentación y 2 de ajuste. Distribuye los papeles de presentación, lector y observador; cada integrante explica una parte y responde una comprobación.

## 4. Laboratorio: limpiar el argumento

Clasifica cada afirmación como dato, hipótesis o recomendación. Comprueba contexto y cifra; elimina lo que no puedas sustentar. La correlación es una relación observada, no una prueba causal. La decisión puede ser investigar una causa, sin afirmar que ya fue demostrada.

### Python solo en el Día 5: demostración de 12 minutos

El instructor muestra una verificación externa de la misma cifra. No se requiere instalar herramientas en equipos corporativos durante la clase; si no hay entorno autorizado, observa la demostración y contrasta la salida con tu PBIX.

**Minutos 0–3:** calcula una razón ponderada:

```python
piezas = [100, 900]
rechazos = [5, 9]
tasa = sum(rechazos) / sum(piezas)
print(f"Rechazo conjunto: {tasa:.2%}")  # 1.40 %
```

**Minutos 3–7:** descarga [verificar_cifras_dia05.py](../../descargas/verificar_cifras_dia05.py) y el [ZIP del curso](../../descargas/dataset-planta-sintetico.zip) en la misma carpeta. En una terminal situada allí, con Python 3 autorizado, ejecuta:

```text
python verificar_cifras_dia05.py dataset-planta-sintetico.zip --desde 2025-05-01 --hasta 2025-05-31
```

La utilidad usa solo la biblioteca estándar, lee el ZIP, aplica las reglas necesarias de limpieza A1 y no modifica los archivos. No abre PBIX ni ejecuta DAX. Comprueba `dataset_referencia: true`; si dice false, las cifras de esta guía no constituyen una referencia para ese archivo.

**Minutos 7–10:** compara `Piezas: 337491`, `Plan: 377764` y `Minutos correctivos: 3298` con Power BI bajo los mismos filtros. Los porcentajes de la salida están en escala 0–1; `null` significa sin datos o sin denominador.

**Minutos 10–12:** explica por qué concordar no demuestra causalidad. Si difiere, compara primero fecha, línea, área y turno. El parámetro `--turno 1` afecta producción, pero no mantenimiento, igual que el modelo base. No corrijas una cifra «a mano» para hacerla coincidir.

La demostración es una ampliación solicitada por el instructor; el PDF no exige programar. La evaluación principal sigue siendo interpretar, recomendar y defender la evidencia.

### Bitácora de afirmaciones

| Afirmación inicial | Dato / hipótesis / recomendación | Medida, filtros y cifra comprobada | Límite | Redacción corregida |
|---|---|---|---|---|
| | | | | |
| | | | | |
| | | | | |

## 5. Proyecto A5 y presentaciones

Forma hasta **seis equipos mixtos de tres o cuatro personas**, según el cupo de 18–22 participantes. Mantén un registro individual de contribución y competencias. La organización no implica 22 exposiciones individuales en el mismo bloque.

El taller de 90 minutos se distribuye en **8 de rúbrica + 16 de integración + 66 de presentaciones**. Cada equipo dispone de **7 minutos de exposición, 3 de preguntas y rúbrica y 1 de transición**. Si hay menos equipos, usa el tiempo restante para revisar y corregir hallazgos.

Entrega:

- `A5_Equipo.pbix` con preparación, modelo, medidas y reporte acumulados; conserva las evidencias previas.
- Una ficha de hallazgo con pregunta, medida, filtros, comparación, límite y recomendación.
- Guion de siete minutos y registro de preguntas con respuestas o pendientes.
- Ficha de operación: propietario, audiencia, origen, corte de datos, actualización, acceso/RLS y ubicación autorizada o alternativa local.
- Bitácora de afirmaciones corregidas y aportación observable de cada integrante.

| Criterio de C5 | Comprobación |
|---|---|
| Interpretación | Distingue dato, comparación, hipótesis y causa |
| Sustento | Puede reconstruir la cifra y declarar filtros y límites |
| Recomendación | Es proporcional a la evidencia y permite una acción verificable |
| Comunicación | Resuelve la pregunta, muestra detalle pertinente y respeta siete minutos |
| Integración | Conserva coherencia de A1–A4 y una entrega operable |

Escala del PDF: **1**, resuelve pasos críticos con ayuda; **2**, resuelve autónomamente el caso practicado; **3**, transfiere a una variante no vista y justifica; **4**, detecta y corrige un error ajeno y justifica. El evaluador reserva la variante y registra el desempeño individual. Una exposición fluida sin sustento no acredita transferencia.

La propuesta sugiere acreditar con **nivel 2 o superior en las cinco competencias y nivel 3 o superior en al menos dos**. A4 y A5 tienen doble peso respecto de las evidencias intermedias. Conserva ambos criterios sin inventar un promedio o porcentaje obligatorio. El registro final debe permitir identificar las cinco competencias y las pruebas que las sostienen.

| Participante | C1 | C2 | C3 | C4 | C5 | Evidencias y apoyos pendientes |
|---|---|---|---|---|---|---|
| | | | | | | |

## 6. Entrega y seguimiento a 30 días

En el cierre, comprueba que otra persona pueda abrir el archivo y localizar el corte de datos, el responsable y las restricciones. Registra lo publicado realmente o la alternativa local, sin marcar como realizadas configuraciones solo planeadas.

Propón el seguimiento previsto por el PDF a los 30 días; su aplicación queda con los responsables del programa. Recoge: **si se usa el reporte, horas estimadas de trabajo manual ahorradas y un ejemplo de decisión apoyada**. Declara que las horas son estimadas y pide explicar cómo se calcularon. No prometas ahorros ni resultados no medidos.

## Fuentes y decisiones didácticas

Base curricular: propuesta *Analítica Operativa con Power BI* entregada por el instructor, página impresa 5 (física 6); evaluación y acreditación sugerida en 7 (8); riesgos, alternativas y seguimiento en 13 (14); equipos mixtos en 14 (15). Python se añadió solo a este día por instrucción expresa del usuario y ocupa 12 minutos dentro del laboratorio existente.

Referencias técnicas: [roles del workspace](https://learn.microsoft.com/en-us/power-bi/collaborate-share/service-roles-new-workspaces), [actualización](https://learn.microsoft.com/en-us/power-bi/connect-data/refresh-data), [seguridad de nivel de fila](https://learn.microsoft.com/en-us/fabric/security/service-admin-row-level-security) y [Publicar en web](https://learn.microsoft.com/en-us/power-bi/collaborate-share/service-publish-to-web). Revisa con TI la configuración y los permisos vigentes del entorno; el material no realiza ninguna publicación ni asignación de acceso.
