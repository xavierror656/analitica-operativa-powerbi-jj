import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';

export default defineConfig({
  // El dominio de producción sirve páginas y assets desde la raíz.
  site: 'https://powerbi.floresjavier.com',
  base: '/',
  integrations: [icon()],
  vite: {
    plugins: [tailwindcss()],
  },
});
