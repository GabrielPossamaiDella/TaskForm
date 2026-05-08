// src/styles/temas.js

export const CORES = {
  primaria: '#1A1A2E', // Azul Escuro do Figma
  secundaria: '#3B5998', // Azul de Destaque
  sucesso: '#00A859',   // Verde Tecflex
  fundo: '#F5F5F7',     // Cinza bem claro para o fundo
  branco: '#FFFFFF',
  preto: '#000000',
  cinzaLinha: '#EEEEEE',
  textoPrincipal: '#333333',
  textoSecundario: '#666666',
  placeholder: '#AAAAAA',
};

export const ESTILOS_COMUNS = {
  input: {
    backgroundColor: CORES.branco,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10, // Arredondado igual Figma
    padding: 15,
    fontSize: 16,
    color: CORES.textoPrincipal,
    marginTop: 8,
    // Sombra leve no iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    // Sombra leve no Android
    elevation: 1,
  },
  botaoPadrão: {
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  textoBotao: {
    color: CORES.branco,
    fontSize: 16,
    fontWeight: 'bold',
  }
};