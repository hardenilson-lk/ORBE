export function calcularMedicaoMapa({ inicio, fim, tamanhoCelula, modoDiagonal, unidade, metrosPorCasa }) {
  if (!inicio || !fim) return { casas: 0, texto: "0 casas" };
  const dx = Math.abs(fim.x - inicio.x) / tamanhoCelula;
  const dy = Math.abs(fim.y - inicio.y) / tamanhoCelula;
  const menor = Math.min(dx, dy);
  const maior = Math.max(dx, dy);
  let casas;

  if (modoDiagonal === "alternada") casas = maior + Math.floor(menor / 2);
  else if (modoDiagonal === "quadrados") casas = maior;
  else casas = Math.sqrt(dx * dx + dy * dy);

  const casasArredondadas = Math.round(casas * 10) / 10;
  const metros = Math.round(casas * metrosPorCasa * 10) / 10;
  return {
    casas: casasArredondadas,
    metros,
    texto: unidade === "metros" ? `${metros} m · ${casasArredondadas} casas` : `${casasArredondadas} casas`,
  };
}
