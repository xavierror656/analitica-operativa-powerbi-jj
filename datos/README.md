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

## Descarga para participantes

Las slides no piden a nadie correr Python: el dataset ya generado se descarga desde la
presentación misma (slide `D1-M4a2`), como `public/descargas/dataset-planta-sintetico.zip`
(las 8 tablas juntas, ~280 KB). Ese zip **sí se versiona** en el repo, a diferencia de
`salida/`, porque tiene que existir en `dist/` cuando GitHub Pages sirve el sitio.

Para regenerarlo después de tocar el script (nueva semilla, otro reparto de líneas):

```bash
cd scripts
python generar_dataset_sintetico.py --zip ../../public/descargas/dataset-planta-sintetico.zip
```

El flag `--zip` genera `salida/` y empaqueta las 8 tablas en un solo paso. Después de
correrlo, `git add public/descargas/dataset-planta-sintetico.zip` y commit, o el sitio
publicado se queda sirviendo la versión vieja.

## Qué reemplaza cada tabla en una planta real

El dataset genera **archivos CSV** (origen local) a propósito, para que el Día 1 no
dependa de permisos de IT. En una maquila real esos mismos datos casi nunca nacen como
CSV: nacen dentro de sistemas específicos, con su propio conector en Power BI.

| Tabla del curso | Qué reemplaza en planta | Sistema típico (maquila / dispositivos médicos) | Conector de Power BI |
|---|---|---|---|
| `fact_produccion` | Órdenes y reporte de piso | **MES** (Werum PAS-X, Camstar/Opcenter) o **SAP PP** | SQL Server / SAP HANA / SAP BW |
| `fact_calidad` | No conformidades, inspección | **QMS** validado (TrackWise, MasterControl, Veeva) o **SAP QM** | SQL Server / SAP |
| `fact_mantenimiento` | Órdenes de trabajo | **CMMS** (SAP PM, Maximo, eMaint) | SQL Server / SAP |
| `dim_linea`, `dim_turno`, `dim_parte` | Catálogos maestros | Configuración de planta, a veces en el ERP | SQL Server / SAP |
| *(no está en el curso)* | Datos de sensor/máquina en tiempo real | Historian / SCADA (OSIsoft PI, Ignition) | Conector PI, más avanzado que el programa |

**La distinción que importa para el Día 1** no es qué sistema es, es **local vs.
remoto**: un CSV o Excel se conecta directo desde Power BI Desktop; una fuente remota
requiere el conector y los permisos autorizados para esa plataforma. Un MES puede
ofrecer una base de datos, una API o exportaciones, según su configuración. Para
actualizar en el servicio se necesita gateway cuando la fuente no es accesible
directamente desde la nube; una fuente de nube accesible puede no necesitarlo
(tema del Día 5). Esta comparación está en la slide `D1-M3b`
(`src/components/dia-01/M3bLocalVsRemoto.astro`).

⚠️ **Cuál de estos usa J&J en Ciudad Juárez sigue sin confirmarse** (propuesta,
Sección 8: "Origen de datos de práctica"). Cuando se sepa, lo que cambia es el
conector que se enseña en el Día 1 y quién autoriza el acceso, no la lógica del curso.

## Opciones B y C (no implementadas aquí)

La propuesta también contempla fuentes abiertas de referencia (INEGI-EMIM, UCI SECOM,
datasets de muestra de Power BI, datos.gob.mx) y un extracto anonimizado de la propia
planta si J&J lo autoriza. Ninguna de las dos tiene material en este repo todavía: la
Opción C en particular requiere autorización por escrito del área propietaria del dato
antes de tocar nada, según la propia propuesta (Sección 6).
