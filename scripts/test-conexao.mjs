// Teste rapido de conexao com o Supabase usando a chave anonima.
// Uso: node scripts/test-conexao.mjs
import { createClient } from '@supabase/supabase-js';

const URL = 'https://nayrxjoogkrorzfkkpzy.supabase.co';
const KEY = 'sb_publishable_WfokxYxVz97be35UB9yNrQ_2DRlr2v8';
const supabase = createClient(URL, KEY);

const localId = `teste-conexao-${Date.now().toString(36)}`;

try {
  // 1) leitura
  const { data: clientes, error: e1 } = await supabase.from('clientes').select('local_id,nome').limit(5);
  if (e1) throw new Error('SELECT clientes: ' + e1.message);
  console.log('OK leitura clientes:', clientes.length, 'registros');

  // 2) insert (upsert) de teste
  const { error: e2 } = await supabase.from('clientes')
    .upsert({ local_id: localId, nome: 'CONEXAO TESTE' }, { onConflict: 'local_id' });
  if (e2) throw new Error('UPSERT clientes: ' + e2.message);
  console.log('OK escrita (upsert) cliente de teste');

  // 3) delete do teste
  const { error: e3 } = await supabase.from('clientes').delete().eq('local_id', localId);
  if (e3) throw new Error('DELETE clientes: ' + e3.message);
  console.log('OK exclusao cliente de teste');

  const { data: oss, error: e4 } = await supabase.from('ordens_servico').select('local_id,os_number').limit(5);
  if (e4) throw new Error('SELECT os: ' + e4.message);
  console.log('OK leitura ordens_servico:', oss.length, 'registros');

  console.log('\n==> INTEGRACAO FUNCIONANDO (CRUD via chave anon)');
} catch (err) {
  console.error('\nFALHOU:', err.message);
  process.exit(1);
}
