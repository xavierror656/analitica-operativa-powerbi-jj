const valor = Number(process.env.CURSO_DIA_ABIERTO ?? 5);

if (!Number.isInteger(valor) || valor < 1 || valor > 5) {
  throw new Error('CURSO_DIA_ABIERTO debe ser un entero entre 1 y 5');
}

export const diaAbierto = valor;
export const diaDisponible = (dia) => dia <= diaAbierto;
