export const formatarMoeda = (valor) =>
  parseFloat(valor || 0).toFixed(2).replace('.', ',');

// Máscara de moeda (padrão BR) construída a partir dos centavos digitados.
// Garante a vírgula e o "0" automático: '' -> '', '1' -> '0,01',
// '125' -> '1,25', '1250' -> '12,50'. Ignora qualquer caractere não numérico.
export const aplicarMascaraMoeda = (texto) => {
  const digitos = String(texto ?? '').replace(/\D/g, '');
  if (!digitos) return '';
  const valor = parseInt(digitos, 10) / 100;
  return valor.toFixed(2).replace('.', ',');
};

// Converte texto mascarado ('12,50') em string numérica com ponto ('12.5'),
// pronta para armazenar e usar com parseFloat. Vazio/ inválido -> ''.
export const moedaParaArmazenar = (texto) => {
  if (texto == null || String(texto).trim() === '') return '';
  const n = parseFloat(String(texto).replace(',', '.'));
  return isNaN(n) ? '' : String(n);
};

// Converte um valor armazenado ('12.5' ou number) para exibição mascarada
// ('12,50'). Vazio -> '' (deixa o placeholder aparecer).
export const moedaParaExibicao = (valor) => {
  if (valor == null || valor === '') return '';
  const n = parseFloat(String(valor).replace(',', '.'));
  return isNaN(n) ? '' : n.toFixed(2).replace('.', ',');
};
