# Mantenimiento técnico del material

Estas utilidades son controles internos del repositorio. No son material de clase,
prerrequisitos del participante ni demostraciones del Día 2. El instructor indicó
que Python se presentará a los participantes únicamente el Día 5.

```bash
python scripts/verificar_dia1.py
python scripts/verificar_dia2.py
python scripts/controles_dia3.py
python tests/verificador_dia5_test.py
node --test tests/interacciones.test.mjs
npm run build
node scripts/verificar_curso.mjs
python scripts/verificar_practicas.py
```

El verificador de Día 2 contrasta las diez relaciones, claves únicas y sin huérfanos,
continuidad del calendario, seis filtros y conservación de filas y totales mediante
SQL en memoria. También valida los 450 minutos. No ejecuta el motor de Power BI.

Si cambia deliberadamente el ZIP o el contrato de relaciones, regenerar con
`python scripts/verificar_dia2.py --write`, revisar los resultados y actualizar las
cifras de la guía y de la evidencia. No regenerar para ocultar un resultado inesperado.

`controles_dia3.py` contrasta con SQL los totales por corte y genera las referencias
temporales; `--write` solo se usa ante un cambio deliberado del dataset. Las pruebas
del verificador de Día 5 cubren la interfaz de terminal, fechas inválidas, vacíos,
razón ponderada, alcance de turno y conservación del ZIP.

Después de compilar, `verificar_curso.mjs` comprueba las 102 diapositivas de los días
3–5, sus notas y cronómetros, 450 minutos por día, rutas y descargas, dependencias
de medidas y que la enseñanza de Python aparezca únicamente en Día 5. Son controles
de estructura y contenido, no una prueba visual ni una ejecución del motor DAX/M.

## Plan desglosado de prácticas

`preparar_material_practicas.py` genera consignas y formularios a partir de
`src/data/practicas-plan.json` (transcripción estructurada del Word) y
`practicas-desarrollo.json` (desarrollo de slides y ajustes explícitos).
`datos/scripts/generar_practicas.py` genera el caso y sus 16 ZIP reproducibles;
ejecutarlo después de preparar el material. Los CSV no contienen KPI resueltos.

`verificar_practicas.py` inspecciona los ZIP entregados, limpia de forma independiente,
contrasta totales mediante SQL, verifica claves, conciliación por lote, unidades de
exposición, los cinco patrones narrativos, variantes de fallos y los 90 minutos de
cada presentación compilada. No ejecuta el motor de Power BI.
