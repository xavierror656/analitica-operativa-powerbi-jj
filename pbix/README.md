# Archivos .pbix

Reportes de Power BI que se arman en clase, día por día. Vacío hasta la primera impartición; el instructor construye en paralelo con el grupo durante las actividades núcleo y sube el .pbix de referencia al cierre de cada día.

Convención de nombre sugerida: `dia-0X-referencia.pbix`.

## Distribución desde el sitio

La página `/referencias/` muestra los cinco días. Solo habilita una descarga cuando
`src/data/referencias.json` declara el archivo y su revisión. Los cinco modelos aún
están pendientes: este repositorio no contiene PBIX revisados.

Antes de incorporar cada archivo:

1. Abrirlo en Power BI Desktop y comprobar que usa el caso base sintético.
2. Cambiar `RutaDatos`, actualizar y contrastar los controles de su guía. A1 prueba
   limpieza; A2 relaciones; A3 medidas; A4 navegación y cifras; A5 integración.
3. Conservar el original en esta carpeta y copiar el revisado a
   `public/descargas/referencias/dia-0X-referencia.pbix`.
4. Registrar `archivo` y `revision` (fecha, versión de Desktop, responsable y pruebas)
   en la entrada correspondiente de `src/data/referencias.json`.
5. Compilar y ejecutar `node scripts/verificar_sitio.mjs`.

Los controles de datos por sí solos no prueban que un PBIX abre, actualiza o ejecuta
las medidas correctamente. No marcar un modelo como revisado sin esas pruebas.
