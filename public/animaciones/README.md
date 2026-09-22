# Animaciones del curso

El curso usa el reproductor oficial `@lottiefiles/dotlottie-web` 0.80.0 de
[LottieFiles](https://lottiefiles.com/es/). El reproductor, su WASM y los recursos
se sirven desde el propio sitio. No requieren inicio de sesión ni un CDN durante la clase.

- `capas.json`: recurso público `fixtures/lottie/down.json` del
  [repositorio oficial de LottieFiles](https://github.com/LottieFiles/dotlottie-web/blob/a08deda3ba399203c9c155fa29a55cfa35eb4946/fixtures/lottie/down.json),
  conservado sin modificaciones. Distribuido con la licencia MIT del repositorio,
  incluida en `LICENSE-LottieFiles.txt`. El nombre local describe su uso didáctico.
- `flujo`, `indicadores`, `reporte`, `actualizacion` y `validacion`: diagramas originales
  de este curso, creados en formato Lottie mediante `scripts/generar_animaciones.mjs`.
  No son animaciones descargadas del catálogo ni capturas de Power BI.
- Los SVG son fotogramas de los mismos JSON, generados por
  `scripts/renderizar_animaciones.mjs`; se usan para impresión, PDF y movimiento reducido.

Los gráficos son ilustraciones conceptuales, sin cifras del dataset. Los créditos
se muestran junto a cada animación. Para la licencia del reproductor, consulta
[LottieFiles/dotlottie-web](https://github.com/LottieFiles/dotlottie-web/blob/main/LICENSE).
