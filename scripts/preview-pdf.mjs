// Gera um HTML de exemplo do PDF da OS (mesmo layout do app) para previsualizacao.
import fs from 'fs';
import path from 'path';

const logoPath = path.resolve('assets/logo.png');
const b64 = fs.readFileSync(logoPath).toString('base64');
const logoDataUri = `data:image/png;base64,${b64}`;

// ----- dados de exemplo -----
const os = {
  os_number: '#495778',
  data: '11/06/2026',
  status: 'Concluída',
  maquina: 'Reta Industrial Singer 191D-30',
  servico: 'Troca do motor e ajuste de tensão',
  valorMaoDeObra: '120.00',
  total: 370,
  latitude: -28.6775,
  longitude: -49.3697,
  cliente: {
    nome: 'Fábio Possamai Della', documento: '023.418.949-50', telefone: '(48) 99999-9999',
    rua: 'Rua Henrique Lage', numero: '120', bairro: 'Centro', cidade: 'Criciúma', estado: 'SC',
  },
  pecas: [
    { nome: 'Motor de costura 550W', valor: '200.00' },
    { nome: 'Correia dentada', valor: '50.00' },
  ],
};
const tecnicoNome = 'Gabriel Possamai';

const pecas = os.pecas || [];
const pecasHtml = pecas.map((p) => `<tr><td>${p.nome}</td><td style="text-align:right;">R$ ${parseFloat(p.valor).toFixed(2)}</td></tr>`).join('');
const totalPecas = pecas.reduce((a, p) => a + parseFloat(p.valor || 0), 0);
const maoDeObra = parseFloat(os.valorMaoDeObra || 0);
const clienteEnd = [os.cliente?.rua, os.cliente?.numero, os.cliente?.bairro, os.cliente?.cidade, os.cliente?.estado].filter(Boolean).join(', ');
const statusTxt = os.status || 'Aberta';
const statusCor = { 'Aberta': '#1565C0', 'Em andamento': '#E65100', 'Concluída': '#2E7D32' }[statusTxt] || '#1565C0';
const statusBg = { 'Aberta': '#E3F2FD', 'Em andamento': '#FFF3E0', 'Concluída': '#E8F5E9' }[statusTxt] || '#E3F2FD';
const temGeo = os.latitude != null && os.longitude != null;
const coordsTxt = temGeo ? `${Number(os.latitude).toFixed(5)}, ${Number(os.longitude).toFixed(5)}` : '';
const mapsUrl = temGeo ? `https://www.google.com/maps/search/?api=1&query=${os.latitude},${os.longitude}` : (clienteEnd ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clienteEnd)}` : '');

const html = `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8"/><meta name="viewport" content="width=794, initial-scale=1.0"/>
<style>
@page { size: A4; margin: 8mm; }
* { margin:0; padding:0; box-sizing:border-box; }
html, body { height:auto; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
body { font-family:'Helvetica Neue','Segoe UI',Arial,sans-serif; background:#fff; color:#1A1A1A; font-size:12px; -webkit-font-smoothing:antialiased; }
.page { width:100%; background:#fff; }
.header { background:linear-gradient(135deg,#1A237E 0%,#283593 100%); padding:16px 24px; color:#fff; border-bottom:3px solid #5A54FF; }
.header-top { display:flex; justify-content:space-between; align-items:center; }
.brand-logo { height:42px; object-fit:contain; display:block; max-width:200px; background:#fff; border-radius:8px; padding:5px 8px; }
.os-badge { background:rgba(255,255,255,0.14); border:1px solid rgba(255,255,255,0.18); border-radius:8px; padding:7px 16px; text-align:right; }
.os-badge-num { font-size:18px; font-weight:800; letter-spacing:0.5px; }
.os-badge-label { font-size:8px; color:rgba(255,255,255,0.65); letter-spacing:2px; }
.header-divider { height:1px; background:rgba(255,255,255,0.18); margin:12px 0; }
.header-meta { display:flex; gap:28px; font-size:11px; align-items:center; }
.meta-label { color:rgba(255,255,255,0.6); display:block; margin-bottom:3px; font-size:8px; letter-spacing:1.2px; text-transform:uppercase; }
.meta-value { color:#fff; font-weight:700; }
.status-pill { display:inline-block; padding:3px 12px; border-radius:20px; font-size:10px; font-weight:800; letter-spacing:0.5px; }
.map-link { color:#5C35A0; font-weight:700; text-decoration:none; }
.body { padding:16px 24px; }
.section { margin-bottom:14px; }
.section-title { font-size:10px; font-weight:800; color:#283593; letter-spacing:1.5px; text-transform:uppercase; margin-bottom:8px; padding-bottom:5px; border-bottom:2px solid #E6E8F0; }
.info-grid { display:grid; grid-template-columns:1fr 1fr; gap:6px; }
.info-item label { font-size:9px; color:#555; font-weight:600; display:block; margin-bottom:1px; }
.info-item span { font-size:12px; color:#111; font-weight:700; }
.info-item.full { grid-column:1/-1; }
table { width:100%; border-collapse:collapse; }
thead tr { background:#1A237E; color:#fff; }
thead th { padding:7px 12px; font-size:10px; text-align:left; font-weight:600; }
thead th:last-child { text-align:right; }
tbody td { padding:6px 12px; border-bottom:1px solid #EEEEEE; font-size:11px; color:#111; }
tbody tr:nth-child(even) td { background:#F7F7F7; }
tbody td:last-child { text-align:right; font-weight:700; color:#1A237E; }
.totals { background:#F7F8FC; border-radius:10px; padding:12px 18px; margin-top:12px; border:1px solid #E6E8F0; }
.total-row { display:flex; justify-content:space-between; align-items:center; padding:4px 0; }
.total-row label { font-size:11px; color:#666; font-weight:600; }
.total-row span { font-size:11px; font-weight:700; color:#1A1A1A; }
.total-main { display:flex; justify-content:space-between; align-items:center; background:linear-gradient(135deg,#1A237E 0%,#283593 100%); color:#fff; border-radius:10px; padding:12px 20px; margin-top:10px; box-shadow:0 4px 10px rgba(26,35,126,0.25); }
.total-main label { font-size:13px; font-weight:800; color:#fff; letter-spacing:0.8px; }
.total-main span { font-size:22px; font-weight:800; color:#fff; }
.assinatura { margin-top:22px; display:grid; grid-template-columns:1fr 1fr; gap:30px; }
.assin-box { border-top:1px solid #999; padding-top:6px; }
.assin-label { font-size:9px; color:#555; font-weight:600; }
.assin-name { font-size:11px; font-weight:700; color:#111; margin-top:2px; }
.footer { margin-top:16px; padding:8px 24px; background:#F5F5F5; border-top:1px solid #E0E0E0; text-align:center; font-size:9px; color:#777; }
</style></head><body>
<div class="page">
  <div class="header">
    <div class="header-top">
      <div><img src="${logoDataUri}" class="brand-logo" /></div>
      <div class="os-badge"><div class="os-badge-num">${os.os_number}</div><div class="os-badge-label">ORDEM DE SERVIÇO</div></div>
    </div>
    <div class="header-divider"></div>
    <div class="header-meta">
      <div><span class="meta-label">Data de Emissão</span><span class="meta-value">${os.data}</span></div>
      <div><span class="meta-label">Status</span><span class="status-pill" style="background:${statusBg};color:${statusCor};">${statusTxt.toUpperCase()}</span></div>
      <div><span class="meta-label">Técnico Responsável</span><span class="meta-value">${tecnicoNome}</span></div>
    </div>
  </div>
  <div class="body">
    <div class="section"><div class="section-title">Dados do Cliente</div>
      <div class="info-grid">
        <div class="info-item full"><label>Nome / Razão Social:</label><span>${os.cliente.nome}</span></div>
        <div class="info-item"><label>CPF / CNPJ:</label><span>${os.cliente.documento}</span></div>
        <div class="info-item"><label>Telefone:</label><span>${os.cliente.telefone}</span></div>
      </div>
    </div>
    <div class="section"><div class="section-title">Equipamento e Serviço</div>
      <div class="info-grid">
        <div class="info-item full"><label>Modelo da Máquina:</label><span>${os.maquina}</span></div>
        <div class="info-item full"><label>Descrição do Serviço:</label><span>${os.servico}</span></div>
      </div>
    </div>
    <div class="section"><div class="section-title">Local do Atendimento</div>
      <div class="info-grid">
        <div class="info-item full"><label>Endereço:</label><span>${clienteEnd}</span></div>
      </div>
    </div>
    <div class="section"><div class="section-title">Peças e Materiais Aplicados</div>
      <table><thead><tr><th>Item</th><th style="text-align:right;">Valor (R$)</th></tr></thead><tbody>${pecasHtml}</tbody></table>
    </div>
    <div class="totals">
      <div class="total-row"><label>Mão de Obra</label><span>R$ ${maoDeObra.toFixed(2)}</span></div>
      <div class="total-row"><label>Peças (${pecas.length} itens)</label><span>R$ ${totalPecas.toFixed(2)}</span></div>
    </div>
    <div class="total-main"><label>TOTAL GERAL</label><span>R$ ${parseFloat(os.total).toFixed(2)}</span></div>
    <div class="assinatura">
      <div class="assin-box"><div class="assin-label">Assinatura do Cliente:</div><div class="assin-name">${os.cliente.nome}</div></div>
      <div class="assin-box"><div class="assin-label">Técnico Responsável:</div><div class="assin-name">${tecnicoNome}</div></div>
    </div>
  </div>
  <div class="footer">Documento gerado pelo <strong>TaskForm</strong> · Técnico responsável: ${tecnicoNome} · ${new Date().getFullYear()}</div>
</div></body></html>`;

fs.writeFileSync(path.resolve('scripts/preview-os.html'), html, 'utf8');
console.log('HTML gerado em scripts/preview-os.html');
