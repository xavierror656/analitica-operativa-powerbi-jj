# Datos

Dataset sintético de planta para las prácticas del programa (Sección 6, Opción A de la
propuesta didáctica). Es la ruta recomendada: no depende de que J&J libere ningún
extracto real, y los errores de captura están controlados, así que todos los
participantes avanzan al mismo ritmo en el Día 1.

## Generarlo

```bash
cd scripts
python generar_dataset_sintetico.py
```

Salida en `salida/` (no se versiona, se regenera):

| Tabla | Granularidad |
|---|---|
| `fact_produccion` | Día · línea · turno · parte |
| `fact_calidad` | Evento de rechazo o no conformidad |
| `fact_mantenimiento` | Orden de trabajo |
| `dim_linea`, `dim_parte`, `dim_turno`, `dim_defecto`, `dim_calendario` | Catálogos |

## Opciones B y C (no implementadas aquí)

La propuesta también contempla fuentes abiertas de referencia (INEGI-EMIM, UCI SECOM,
datasets de muestra de Power BI, datos.gob.mx) y un extracto anonimizado de la propia
planta si J&J lo autoriza. Ninguna de las dos tiene material en este repo todavía: la
Opción C en particular requiere autorización por escrito del área propietaria del dato
antes de tocar nada, según la propia propuesta (Sección 6).
