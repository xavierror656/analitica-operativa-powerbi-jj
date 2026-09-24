export default async function () {
  // Evita depender de taskkill para cerrar procesos hijos en Windows.
  await fetch('http://127.0.0.1:4321/__cerrar_pruebas', {method:'POST'});
}
