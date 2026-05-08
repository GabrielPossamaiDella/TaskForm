import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [clientes, setClientes] = useState([
    { id: '1', nome: 'Fabio Possamai Della', documento: '123.456.789-00' },
    { id: '2', nome: 'Hospital São José', documento: '00.123.456/0001-99' }
  ]);

  const [listaOS, setListaOS] = useState([]);
  
  // Estado inicial da OS com lista de peças vazia
  const [osAtual, setOsAtual] = useState({
    cliente: null,
    maquina: '',
    defeito: '',
    servico: '',
    tempo: '',
    valorMaoDeObra: 120, // Padrão da Tecflex
    pecas: [], // Array de objetos { nome, valor }
    total: 0
  });

  const adicionarCliente = (novo) => setClientes([...clientes, { ...novo, id: Math.random().toString() }]);
  const atualizarOS = (dados) => setOsAtual(prev => ({ ...prev, ...dados }));

  // Função para adicionar peça e já atualizar o total
  const adicionarPecaOS = (novaPeca) => {
    setOsAtual(prev => {
      const novasPecas = [...prev.pecas, novaPeca];
      return { ...prev, pecas: novasPecas };
    });
  };

  const finalizarOS = () => {
    const somaPecas = osAtual.pecas.reduce((acc, p) => acc + parseFloat(p.valor), 0);
    const totalFinal = parseFloat(osAtual.valorMaoDeObra) + somaPecas;

    const novaOS = {
      ...osAtual,
      id: Math.random().toString(),
      data: new Date().toLocaleDateString('pt-BR'),
      status: 'Concluída',
      total: totalFinal
    };
    setListaOS([novaOS, ...listaOS]);
    setOsAtual({ cliente: null, maquina: '', defeito: '', servico: '', tempo: '', valorMaoDeObra: 120, pecas: [], total: 0 });
  };

  return (
    <AppContext.Provider value={{ clientes, adicionarCliente, osAtual, atualizarOS, adicionarPecaOS, listaOS, finalizarOS }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);