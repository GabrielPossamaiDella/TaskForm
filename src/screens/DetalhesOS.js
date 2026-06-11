import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image, Linking, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { CORES } from '../styles/temas';
import { LOGO_BASE64 } from '../assets/logoBase64';

const HEADER_BG = '#1A237E';
const ACCENT = '#5A54FF';

const STATUS_CONFIG = {
  'Aberta':        { bg: '#E3F2FD', text: '#1565C0' },
  'Em andamento':  { bg: '#FFF3E0', text: '#E65100' },
  'Concluída':     { bg: '#E8F5E9', text: '#2E7D32' },
};

export default function DetalhesOS({ route, navigation }) {
  const { osSelecionada } = route.params;
  const { excluirOS, carregarOSParaEdicao, listaOS, atualizarStatusOS } = useApp();
  const insets = useSafeAreaInsets();
  useLayoutEffect(() => { navigation.setOptions({ headerShown: false }); }, [navigation]);

  // Usa dados ao vivo do context para refletir mudanças de status em tempo real
  const os = listaOS.find(o => o.id === osSelecionada.id) || osSelecionada;
  const statusConfig = STATUS_CONFIG[os.status] || STATUS_CONFIG['Concluída'];

  const handleAlterarStatus = () => {
    Alert.alert('Alterar Status', 'Selecione o novo status:', [
      { text: 'Aberta',        onPress: () => atualizarStatusOS(os.id, 'Aberta') },
      { text: 'Em andamento',  onPress: () => atualizarStatusOS(os.id, 'Em andamento') },
      { text: 'Concluída',     onPress: () => atualizarStatusOS(os.id, 'Concluída') },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  const gerarECompartilharPDF = async () => {
    try {
      // Logo: usa a personalizada do Perfil se existir, senao a logo TF embutida
      let logoDataUri = LOGO_BASE64;
      try {
        const customLogo = await AsyncStorage.getItem('@logo_pdf');
        if (customLogo) logoDataUri = customLogo;
      } catch (_) {}

      const pecas = os.pecas || [];
      const pecasHtml = pecas.length > 0
        ? pecas.map((p) => `
          <tr>
            <td>${p.nome}</td>
            <td style="text-align:right;">R$ ${parseFloat(p.valor).toFixed(2)}</td>
          </tr>`).join('')
        : `<tr><td colspan="2" style="padding:14px;text-align:center;color:#777;font-style:italic;">Nenhuma peça adicionada</td></tr>`;

      const totalPecas = pecas.reduce((a, p) => a + parseFloat(p.valor || 0), 0);
      const maoDeObra = parseFloat(os.valorMaoDeObra || 0);
      const clienteEnd = [
        os.cliente?.rua, os.cliente?.numero,
        os.cliente?.bairro, os.cliente?.cidade,
        os.cliente?.estado,
      ].filter(Boolean).join(', ');

      // Tecnico = usuario logado (fallback para o nome generico)
      let tecnicoNome = 'Tecflex Assistência';
      try {
        const uStr = await AsyncStorage.getItem('@usuario');
        if (uStr) {
          const u = JSON.parse(uStr);
          if (u?.nome) tecnicoNome = u.nome;
        }
      } catch (_) {}

      // Status com cor
      const statusTxt = os.status || 'Aberta';
      const statusCor = { 'Aberta': '#1565C0', 'Em andamento': '#E65100', 'Concluída': '#2E7D32' }[statusTxt] || '#1565C0';
      const statusBg = { 'Aberta': '#E3F2FD', 'Em andamento': '#FFF3E0', 'Concluída': '#E8F5E9' }[statusTxt] || '#E3F2FD';

      const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=794, initial-scale=1.0"/>
  <style>
    @page { size: A4; margin: 8mm; }
    * { margin:0; padding:0; box-sizing:border-box; }
    html, body { height:auto; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
    body { font-family:'Helvetica Neue','Segoe UI',Arial,sans-serif; background:#fff; color:#1A1A1A; font-size:12px; -webkit-font-smoothing:antialiased; }
    .page { width:100%; background:#fff; }

    /* HEADER */
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

    /* BODY */
    .body { padding:16px 24px; }

    /* SECTION */
    .section { margin-bottom:14px; }
    .section-title { font-size:10px; font-weight:800; color:#283593; letter-spacing:1.5px; text-transform:uppercase; margin-bottom:8px; padding-bottom:5px; border-bottom:2px solid #E6E8F0; }

    /* INFO GRID */
    .info-grid { display:grid; grid-template-columns:1fr 1fr; gap:6px; }
    .info-item label { font-size:9px; color:#555; font-weight:600; display:block; margin-bottom:1px; }
    .info-item span { font-size:12px; color:#111; font-weight:700; }
    .info-item.full { grid-column:1/-1; }

    /* TABLE */
    table { width:100%; border-collapse:collapse; }
    thead tr { background:#1A237E; color:#fff; }
    thead th { padding:7px 12px; font-size:10px; text-align:left; font-weight:600; }
    thead th:last-child { text-align:right; }
    tbody td { padding:6px 12px; border-bottom:1px solid #EEEEEE; font-size:11px; color:#111; }
    tbody tr:nth-child(even) td { background:#F7F7F7; }
    tbody td:last-child { text-align:right; font-weight:700; color:#1A237E; }
    .empty-td { padding:10px; text-align:center; color:#777; font-style:italic; }

    /* TOTALS */
    .totals { background:#F7F8FC; border-radius:10px; padding:12px 18px; margin-top:12px; border:1px solid #E6E8F0; }
    .total-row { display:flex; justify-content:space-between; align-items:center; padding:4px 0; }
    .total-row label { font-size:11px; color:#666; font-weight:600; }
    .total-row span { font-size:11px; font-weight:700; color:#1A1A1A; }
    .total-main { display:flex; justify-content:space-between; align-items:center; background:linear-gradient(135deg,#1A237E 0%,#283593 100%); color:#fff; border-radius:10px; padding:12px 20px; margin-top:10px; box-shadow:0 4px 10px rgba(26,35,126,0.25); }
    .total-main label { font-size:13px; font-weight:800; color:#fff; letter-spacing:0.8px; }
    .total-main span { font-size:22px; font-weight:800; color:#fff; }

    /* ASSINATURA */
    .assinatura { margin-top:18px; display:grid; grid-template-columns:1fr 1fr; gap:30px; }
    .assin-box { border-top:1px solid #999; padding-top:6px; }
    .assin-label { font-size:9px; color:#555; font-weight:600; }
    .assin-name { font-size:11px; font-weight:700; color:#111; margin-top:2px; }

    /* FOOTER */
    .footer { margin-top:14px; padding:8px 22px; background:#F5F5F5; border-top:1px solid #E0E0E0; text-align:center; font-size:9px; color:#777; }
  </style>
</head>
<body>
<div class="page">
  <div class="header">
    <div class="header-top">
      <div>
        ${logoDataUri ? `<img src="${logoDataUri}" class="brand-logo" />` : '<div style="font-size:20px;font-weight:800;color:#fff;">OS</div>'}
      </div>
      <div class="os-badge">
        <div class="os-badge-num">${os.os_number || '#000000'}</div>
        <div class="os-badge-label">ORDEM DE SERVIÇO</div>
      </div>
    </div>
    <div class="header-divider"></div>
    <div class="header-meta">
      <div><span class="meta-label">Data de Emissão</span><span class="meta-value">${os.data}</span></div>
      <div><span class="meta-label">Status</span><span class="status-pill" style="background:${statusBg};color:${statusCor};">${statusTxt.toUpperCase()}</span></div>
      <div><span class="meta-label">Técnico Responsável</span><span class="meta-value">${tecnicoNome}</span></div>
    </div>
  </div>

  <div class="body">
    <div class="section">
      <div class="section-title">Dados do Cliente</div>
      <div class="info-grid">
        <div class="info-item full"><label>Nome / Razão Social:</label><span>${os.cliente?.nome || 'Cliente Avulso'}</span></div>
        ${os.cliente?.documento ? `<div class="info-item"><label>CPF / CNPJ:</label><span>${os.cliente.documento}</span></div>` : ''}
        ${os.cliente?.telefone ? `<div class="info-item"><label>Telefone:</label><span>${os.cliente.telefone}</span></div>` : ''}
        ${clienteEnd ? `<div class="info-item full"><label>Endereço:</label><span>${clienteEnd}</span></div>` : ''}
      </div>
    </div>

    <div class="section">
      <div class="section-title">Equipamento e Serviço</div>
      <div class="info-grid">
        <div class="info-item full"><label>Modelo da Máquina:</label><span>${os.maquina}</span></div>
        <div class="info-item full"><label>Descrição do Serviço:</label><span>${os.servico || os.defeito || '—'}</span></div>
      </div>
    </div>

    ${clienteEnd ? `
    <div class="section">
      <div class="section-title">Local do Atendimento</div>
      <div class="info-grid">
        <div class="info-item full"><label>Endereço:</label><span>${clienteEnd}</span></div>
      </div>
    </div>` : ''}

    <div class="section">
      <div class="section-title">Peças e Materiais Aplicados</div>
      <table>
        <thead><tr><th>Item</th><th style="text-align:right;">Valor (R$)</th></tr></thead>
        <tbody>${pecasHtml}</tbody>
      </table>
    </div>

    <div class="totals">
      <div class="total-row"><label>Mão de Obra</label><span>R$ ${maoDeObra.toFixed(2)}</span></div>
      <div class="total-row"><label>Peças (${pecas.length} ${pecas.length === 1 ? 'item' : 'itens'})</label><span>R$ ${totalPecas.toFixed(2)}</span></div>
      ${parseFloat(os.deslocamentoValor || 0) > 0 ? `<div class="total-row"><label>Deslocamento (${os.deslocamentoKm} km)</label><span>R$ ${parseFloat(os.deslocamentoValor).toFixed(2)}</span></div>` : ''}
    </div>
    <div class="total-main"><label>TOTAL GERAL</label><span>R$ ${parseFloat(os.total).toFixed(2)}</span></div>

    <div class="assinatura">
      <div class="assin-box">
        <div class="assin-label">Assinatura do Cliente:</div>
        <div class="assin-name">${os.cliente?.nome || '___________________________'}</div>
      </div>
      <div class="assin-box">
        <div class="assin-label">Técnico Responsável:</div>
        <div class="assin-name">${tecnicoNome}</div>
      </div>
    </div>
  </div>

  <div class="footer">Documento gerado pelo <strong>TaskForm</strong> · Técnico responsável: ${tecnicoNome} · ${new Date().getFullYear()}</div>
</div>
</body>
</html>`;

      const { uri } = await Print.printToFileAsync({ html: htmlContent, base64: false });

      // Nome de arquivo amigavel: OS-<numero>-<cliente>.pdf
      const semAcento = (s) => (s || '')
        .replace(/[áàâãä]/gi, 'a').replace(/[éèêë]/gi, 'e').replace(/[íìîï]/gi, 'i')
        .replace(/[óòôõö]/gi, 'o').replace(/[úùûü]/gi, 'u').replace(/ç/gi, 'c');
      const slug = (s) => semAcento(s)
        .replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
      const numero = (os.os_number || '').replace(/[^0-9]/g, '') || 'sem-numero';
      const nomeArquivo = `OS-${numero}-${slug(os.cliente?.nome) || 'cliente'}.pdf`;

      let arquivoFinal = uri;
      try {
        const destino = FileSystem.cacheDirectory + nomeArquivo;
        await FileSystem.copyAsync({ from: uri, to: destino });
        arquivoFinal = destino;
      } catch (_) { /* se a copia falhar, compartilha o arquivo original */ }

      await Sharing.shareAsync(arquivoFinal, {
        mimeType: 'application/pdf',
        dialogTitle: 'Compartilhar Ordem de Serviço',
        UTI: 'com.adobe.pdf',
      });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível gerar o PDF da OS.');
    }
  };

  const abrirNoMapa = () => {
    const enderecoTxt = [
      os.cliente?.rua, os.cliente?.numero, os.cliente?.bairro,
      os.cliente?.cidade, os.cliente?.estado,
    ].filter(Boolean).join(', ');

    const temCoords = os.latitude != null && os.longitude != null;
    if (!temCoords && !enderecoTxt) {
      Alert.alert('Sem localização', 'Esta OS não possui coordenadas nem endereço do cliente.');
      return;
    }

    const query = temCoords ? `${os.latitude},${os.longitude}` : enderecoTxt;
    const appUrl = Platform.select({
      ios: `maps:0,0?q=${encodeURIComponent(query)}`,
      android: `geo:0,0?q=${encodeURIComponent(query)}`,
    });
    const webUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

    Linking.openURL(appUrl).catch(() => Linking.openURL(webUrl));
  };

  const handleEditar = () => {
    carregarOSParaEdicao(os);
    navigation.navigate('Home', { screen: 'Nova OS' });
  };

  const handleExcluir = () => {
    Alert.alert(
      'Excluir Ordem de Serviço',
      'Tem certeza que deseja apagar esta OS permanentemente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir', style: 'destructive',
          onPress: async () => {
            await excluirOS(os.id);
            navigation.navigate('Home', { screen: 'Painel' });
          }
        }
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F0F2F8' }}>

      {/* Top Bar customizada */}
      <View style={[styles.topBar, { paddingTop: 12 + insets.top }]}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Home', { screen: 'Painel' })}
          style={styles.topBarBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>

        <View style={styles.topBarCenter}>
          <Text style={styles.topBarTitle}>AJUSTES DA OS</Text>
        </View>

        <View style={styles.topBarAcoes}>
          <TouchableOpacity
            style={[styles.topBarIconBtn, { backgroundColor: '#22C55E' }]}
            onPress={gerarECompartilharPDF}
          >
            <Ionicons name="share-social-outline" size={16} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.topBarIconBtn, { backgroundColor: ACCENT }]}
            onPress={handleEditar}
          >
            <Feather name="edit-2" size={14} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.topBarIconBtn, { backgroundColor: 'rgba(255,255,255,0.18)' }]}
            onPress={handleExcluir}
          >
            <Feather name="trash-2" size={14} color="rgba(255,255,255,0.85)" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 24 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        {/* OS número + status */}
        <View style={styles.osStatusRow}>
          <Text style={styles.osNumero}>{os.os_number}</Text>
          <TouchableOpacity
            style={[styles.badge, { backgroundColor: statusConfig.bg }]}
            onPress={handleAlterarStatus}
            activeOpacity={0.75}
          >
            <Ionicons name="swap-horizontal-outline" size={11} color={statusConfig.text} style={{ marginRight: 4 }} />
            <Text style={[styles.badgeTxt, { color: statusConfig.text }]}>{(os.status || 'Aberta').toUpperCase()}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.dataTexto}>Realizada em {os.data}</Text>

        {/* Card Cliente */}
        <View style={styles.card}>
          <View style={styles.cardTituloRow}>
            <View style={styles.cardIcone}>
              <Ionicons name="person" size={13} color={ACCENT} />
            </View>
            <Text style={styles.cardTitulo}>CLIENTE</Text>
          </View>
          <Text style={styles.cardDestaque}>{os.cliente?.nome || 'Cliente Avulso'}</Text>
          {os.cliente?.documento ? (
            <Text style={styles.cardSub}>{os.cliente.documento}</Text>
          ) : null}
          {os.cliente?.telefone ? (
            <Text style={styles.cardSub}>{os.cliente.telefone}</Text>
          ) : null}

          <TouchableOpacity style={styles.btnMapa} onPress={abrirNoMapa} activeOpacity={0.8}>
            <Ionicons name="location-outline" size={16} color={ACCENT} />
            <Text style={styles.btnMapaTxt}>
              {os.latitude != null ? 'Ver local do atendimento no mapa' : 'Ver endereço no mapa'}
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#BBB" />
          </TouchableOpacity>
        </View>

        {/* Card Equipamento */}
        <View style={styles.card}>
          <View style={styles.cardTituloRow}>
            <View style={styles.cardIcone}>
              <Ionicons name="settings-outline" size={13} color={ACCENT} />
            </View>
            <Text style={styles.cardTitulo}>EQUIPAMENTO</Text>
          </View>
          <Text style={styles.cardDestaque}>{os.maquina}</Text>
          <Text style={styles.cardSub}>{os.servico || os.defeito || '—'}</Text>
        </View>

        {/* Card Peças */}
        {os.pecas?.length > 0 && (
          <View style={styles.card}>
            <View style={styles.cardTituloRow}>
              <View style={styles.cardIcone}>
                <Ionicons name="construct-outline" size={13} color={ACCENT} />
              </View>
              <Text style={styles.cardTitulo}>PEÇAS / MATERIAIS</Text>
            </View>
            {os.pecas.map((p, i) => (
              <View
                key={i}
                style={[styles.pecaRow, i === os.pecas.length - 1 && { borderBottomWidth: 0 }]}
              >
                <Text style={styles.pecaNome}>{p.nome}</Text>
                <Text style={styles.pecaValor}>R$ {parseFloat(p.valor).toFixed(2)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Card Financeiro — fundo escuro */}
        <View style={styles.cardTotal}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Mão de Obra</Text>
            <Text style={styles.totalValorSub}>
              R$ {parseFloat(os.valorMaoDeObra || 0).toFixed(2)}
            </Text>
          </View>
          {os.pecas?.length > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                Peças ({os.pecas.length} {os.pecas.length === 1 ? 'item' : 'itens'})
              </Text>
              <Text style={styles.totalValorSub}>
                R$ {os.pecas.reduce((a, p) => a + parseFloat(p.valor || 0), 0).toFixed(2)}
              </Text>
            </View>
          )}
          {parseFloat(os.deslocamentoValor || 0) > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Deslocamento ({os.deslocamentoKm} km)</Text>
              <Text style={styles.totalValorSub}>
                R$ {parseFloat(os.deslocamentoValor || 0).toFixed(2)}
              </Text>
            </View>
          )}
          <View style={styles.totalDivisor} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabelMain}>TOTAL GERAL</Text>
            <Text style={styles.totalValorMain}>
              R$ {parseFloat(os.total).toFixed(2)}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    backgroundColor: HEADER_BG, flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingBottom: 14, gap: 10,
  },
  topBarBtn: { padding: 4 },
  topBarCenter: { flex: 1, alignItems: 'center' },
  topBarTitle: { fontSize: 13, fontWeight: '800', color: '#fff', letterSpacing: 1 },
  topBarSub: { fontSize: 9, color: 'rgba(255,255,255,0.45)', letterSpacing: 1.5, marginTop: 2 },
  topBarAcoes: { flexDirection: 'row', gap: 8 },
  topBarIconBtn: { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },

  scroll: { flex: 1, backgroundColor: '#F0F2F8' },
  scrollContent: { padding: 20 },

  osStatusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  osNumero: { fontSize: 20, fontWeight: '800', color: ACCENT },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  badgeTxt: { fontSize: 10, fontWeight: '700' },
  dataTexto: { fontSize: 12, color: '#888', marginBottom: 18 },

  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  cardTituloRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  cardIcone: {
    width: 26, height: 26, borderRadius: 8, backgroundColor: '#EEEEFF',
    justifyContent: 'center', alignItems: 'center', marginRight: 8,
  },
  cardTitulo: { fontSize: 10, fontWeight: '800', color: ACCENT, letterSpacing: 1.2 },
  cardDestaque: { fontSize: 17, fontWeight: '700', color: '#111', marginBottom: 4 },
  cardSub: { fontSize: 13, color: '#666', marginTop: 2, lineHeight: 20 },
  btnMapa: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12,
    paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F0F0F0',
  },
  btnMapaTxt: { flex: 1, fontSize: 13, fontWeight: '600', color: ACCENT },

  pecaRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  pecaNome: { fontSize: 13, color: '#333', flex: 1 },
  pecaValor: { fontSize: 13, fontWeight: '700', color: ACCENT },

  cardTotal: {
    backgroundColor: HEADER_BG, borderRadius: 16, padding: 20, marginBottom: 8,
    shadowColor: HEADER_BG, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 14, elevation: 6,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  totalLabel: { fontSize: 13, color: 'rgba(255,255,255,0.55)', fontWeight: '500' },
  totalValorSub: { fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: '700' },
  totalDivisor: { height: 1, backgroundColor: 'rgba(255,255,255,0.15)', marginVertical: 12 },
  totalLabelMain: { fontSize: 14, fontWeight: '800', color: '#fff' },
  totalValorMain: { fontSize: 26, fontWeight: '800', color: '#fff' },
});
