export const formatarMoeda = (valor) =>
  parseFloat(valor || 0).toFixed(2).replace('.', ',');
