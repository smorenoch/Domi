import { defineConfig } from 'vite';

export default defineConfig({
  // Rutas relativas: el /dist resultante se puede servir desde cualquier
  // subcarpeta (o abrir con un servidor estático simple) sin reconfigurar.
  base: './',
  server: {
    host: true, // permite abrirlo desde la tablet en la misma red durante desarrollo
    port: 5173
  },
  build: {
    outDir: 'dist',
    target: 'es2018'
  }
});
