// src/services/dataService.js
// Camada de acesso ao Supabase + mapeamento entre o formato do app e o do banco.
//
// No app o cliente tem `id` (string gerada localmente). No banco esse valor vive
// na coluna `local_id`; o `id` do banco e um uuid. Mantemos `serverId` no objeto
// do app para conseguir popular a FK `cliente_id` das ordens de servico.

import { supabase } from './supabase';

// ---------- MAPEADORES ----------

const clienteFromRow = (row) => ({
  id: row.local_id,
  serverId: row.id,
  sincronizada: true, // veio do servidor
  nome: row.nome || '',
  documento: row.documento || '',
  email: row.email || '',
  telefone: row.telefone || '',
  cep: row.cep || '',
  rua: row.rua || '',
  numero: row.numero || '',
  bairro: row.bairro || '',
  cidade: row.cidade || '',
  estado: row.estado || '',
});

const clienteToRow = (c) => ({
  local_id: c.id,
  nome: c.nome || '',
  documento: c.documento || '',
  email: c.email || '',
  telefone: c.telefone || '',
  cep: c.cep || '',
  rua: c.rua || '',
  numero: c.numero || '',
  bairro: c.bairro || '',
  cidade: c.cidade || '',
  estado: c.estado || '',
});

const osFromRow = (row) => ({
  id: row.local_id,
  serverId: row.id,
  sincronizada: true, // veio do servidor
  os_number: row.os_number || '',
  cliente: row.cliente || null,
  maquina: row.maquina || '',
  defeito: row.defeito || '',
  servico: row.servico || '',
  tempo: row.tempo || '',
  valorMaoDeObra: row.valor_mao_de_obra != null ? String(row.valor_mao_de_obra) : '',
  pecas: row.pecas || [],
  total: row.total || 0,
  status: row.status || 'Aberta',
  data: row.data_servico || '',
  latitude: row.latitude ?? null,
  longitude: row.longitude ?? null,
  deslocamentoKm: row.deslocamento_km || 0,
  deslocamentoValor: row.deslocamento_valor || 0,
});

const osToRow = (os) => ({
  local_id: os.id,
  os_number: os.os_number || '',
  cliente: os.cliente || null,
  cliente_id: os.cliente?.serverId || null,
  maquina: os.maquina || '',
  defeito: os.defeito || '',
  servico: os.servico || '',
  tempo: os.tempo || '',
  valor_mao_de_obra: parseFloat(os.valorMaoDeObra || 0) || 0,
  pecas: os.pecas || [],
  total: os.total || 0,
  status: os.status || 'Aberta',
  data_servico: os.data || '',
  latitude: os.latitude ?? null,
  longitude: os.longitude ?? null,
  deslocamento_km: parseFloat(os.deslocamentoKm || 0) || 0,
  deslocamento_valor: parseFloat(os.deslocamentoValor || 0) || 0,
});

// ---------- CLIENTES ----------

export async function fetchClientes() {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data || []).map(clienteFromRow);
}

export async function upsertCliente(cliente) {
  const { data, error } = await supabase
    .from('clientes')
    .upsert(clienteToRow(cliente), { onConflict: 'local_id' })
    .select()
    .single();
  if (error) throw error;
  return clienteFromRow(data);
}

export async function deleteCliente(localId) {
  const { error } = await supabase.from('clientes').delete().eq('local_id', localId);
  if (error) throw error;
}

// ---------- ORDENS DE SERVICO ----------

export async function fetchOS() {
  const { data, error } = await supabase
    .from('ordens_servico')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(osFromRow);
}

export async function upsertOS(os) {
  const { data, error } = await supabase
    .from('ordens_servico')
    .upsert(osToRow(os), { onConflict: 'local_id' })
    .select()
    .single();
  if (error) throw error;
  return osFromRow(data);
}

export async function deleteOS(localId) {
  const { error } = await supabase.from('ordens_servico').delete().eq('local_id', localId);
  if (error) throw error;
}

// ---------- CONFIGURACOES ----------

const configFromRow = (row) => ({
  baseLatitude: row.base_latitude ?? null,
  baseLongitude: row.base_longitude ?? null,
  baseEndereco: row.base_endereco || '',
  raioIsencaoKm: row.raio_isencao_km != null ? Number(row.raio_isencao_km) : 10,
  valorPorKm: row.valor_por_km != null ? Number(row.valor_por_km) : 0,
});

export async function fetchConfig() {
  const { data, error } = await supabase.from('configuracoes').select('*').eq('id', 'app').single();
  if (error) throw error;
  return configFromRow(data);
}

export async function salvarConfig(config) {
  const { data, error } = await supabase
    .from('configuracoes')
    .upsert({
      id: 'app',
      base_latitude: config.baseLatitude ?? null,
      base_longitude: config.baseLongitude ?? null,
      base_endereco: config.baseEndereco || '',
      raio_isencao_km: parseFloat(config.raioIsencaoKm || 0) || 0,
      valor_por_km: parseFloat(config.valorPorKm || 0) || 0,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' })
    .select()
    .single();
  if (error) throw error;
  return configFromRow(data);
}
