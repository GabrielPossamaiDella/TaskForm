// src/styles/temas.js

export const CORES = {
  primaria: '#1A237E',
  secundaria: '#7E57C2',
  lavandaClaro: '#EDE7F6',
  sucessoBg: '#E8F5E9',
  sucessoTexto: '#2E7D32',
  fundo: '#F5F5F7',
  card: '#FFFFFF',
  branco: '#FFFFFF',
  textoPrincipal: '#212121',
  textoSecundario: '#9E9E9E',
  placeholder: '#9E9E9E',
  divisor: '#E0E0E0',
  // aliases usados nas telas
  sucesso: '#E8F5E9',
  textoSucesso: '#2E7D32',
  cinzaLinha: '#E0E0E0',
  lightPurple: '#EDE7F6',
  erro: '#FFEBEE',
  textoErro: '#C62828',
};

export const RAIO = {
  card: 15,
  botao: 10,
  input: 12,
  tag: 20,
};

export const ESTILOS_COMUNS = {
  input: {
    width: '100%',
    backgroundColor: CORES.branco,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: CORES.textoPrincipal,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  // alias para telas que referenciam inputModerno
  get inputModerno() { return this.input; },
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
