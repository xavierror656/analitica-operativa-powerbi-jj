import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // GitHub Pages sirve el sitio en /analitica-operativa-powerbi-jj/, no en la raíz.
  // Si algún día se conecta un dominio propio (o se pasa a Netlify), quitar site/base.
  site: 'https://xavierror656.github.io',
  base: '/analitica-operativa-powerbi-jj',
  vite: {
    plugins: [tailwindcss()],
  },
});
