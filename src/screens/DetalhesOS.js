import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert, Image } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { CORES, RAIO } from '../styles/temas';

export default function DetalhesOS({ route, navigation }) {
  const { osSelecionada } = route.params;
  const { excluirOS, carregarOSParaEdicao } = useApp();

  const gerarECompartilharPDF = async () => {
    try {
      // Logo: custom do AsyncStorage ou padrão do app via cache
      let logoDataUri = '';
      try {
        const customLogo = await AsyncStorage.getItem('@logo_pdf');
        if (customLogo) {
          logoDataUri = customLogo;
        } else {
          // resolveAssetSource retorna http:// no Expo Go e file:// em produção
          const { uri: assetUri } = Image.resolveAssetSource(require('../../assets/logo.png'));
          const cacheUri = `${FileSystem.cacheDirectory}logo_pdf_default.png`;
          if (assetUri.startsWith('http://') || assetUri.startsWith('https://')) {
            await FileSystem.downloadAsync(assetUri, cacheUri);
          } else {
            await FileSystem.copyAsync({ from: assetUri, to: cacheUri });
          }
          const b64 = await FileSystem.readAsStringAsync(cacheUri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          logoDataUri = `data:image/png;base64,${b64}`;
        }
      } catch (_) {}

      const pecas = osSelecionada.pecas || [];
      const pecasHtml = pecas.length > 0
        ? pecas.map((p) => `
          <tr>
            <td>${p.nome}</td>
            <td style="text-align:right;">R$ ${parseFloat(p.valor).toFixed(2)}</td>
          </tr>`).join('')
        : `<tr><td colspan="2" style="padding:14px;text-align:center;color:#777;font-style:italic;">Nenhuma peça adicionada</td></tr>`;

      const totalPecas = pecas.reduce((a, p) => a + parseFloat(p.valor || 0), 0);
      const maoDeObra = parseFloat(osSelecionada.valorMaoDeObra || 0);
      const clienteEnd = [
        osSelecionada.cliente?.rua, osSelecionada.cliente?.numero,
        osSelecionada.cliente?.bairro, osSelecionada.cliente?.cidade,
        osSelecionada.cliente?.estado,
      ].filter(Boolean).join(', ');

      const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=794, initial-scale=1.0"/>
  <style>
    @page { size: A4; margin: 8mm; }
    * { margin:0; padding:0; box-sizing:border-box; }
    html, body { height:auto; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
    body { font-family:'Helvetica Neue',Arial,sans-serif; background:#fff; color:#111; font-size:12px; }
    .page { width:100%; background:#fff; }

    /* HEADER */
    .header { background:#1A237E; padding:12px 22px; color:#fff; }
    .header-top { display:flex; justify-content:space-between; align-items:center; }
    .brand-logo { height:36px; object-fit:contain; display:block; max-width:200px; }
    .os-badge { background:rgba(255,255,255,0.15); border-radius:6px; padding:6px 14px; text-align:right; }
    .os-badge-num { font-size:17px; font-weight:800; }
    .os-badge-label { font-size:9px; color:rgba(255,255,255,0.6); letter-spacing:1px; }
    .header-divider { height:1px; background:rgba(255,255,255,0.2); margin:8px 0; }
    .header-meta { display:flex; gap:22px; font-size:11px; }
    .meta-label { color:rgba(255,255,255,0.65); display:block; margin-bottom:1px; font-size:9px; }
    .meta-value { color:#fff; font-weight:700; }

    /* BODY */
    .body { padding:12px 22px; }

    /* SECTION */
    .section { margin-bottom:10px; }
    .section-title { font-size:9px; font-weight:700; color:#5C35A0; letter-spacing:1.5px; text-transform:uppercase; margin-bottom:6px; padding-bottom:4px; border-bottom:1.5px solid #EDE7F6; }

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
    .totals { background:#F5F5F5; border-radius:8px; padding:10px 16px; margin-top:10px; border:1px solid #E0E0E0; }
    .total-row { display:flex; justify-content:space-between; align-items:center; padding:3px 0; }
    .total-row.divider { border-top:1px solid #CCC; margin-top:6px; padding-top:8px; }
    .total-row label { font-size:11px; color:#555; font-weight:600; }
    .total-row span { font-size:11px; font-weight:700; color:#111; }
    .total-row.main label { font-size:13px; font-weight:800; color:#1A237E; }
    .total-row.main span { font-size:16px; font-weight:800; color:#1A237E; }

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
        <div class="os-badge-num">${osSelecionada.os_number || '#000000'}</div>
        <div class="os-badge-label">ORDEM DE SERVIÇO</div>
      </div>
    </div>
    <div class="header-divider"></div>
    <div class="header-meta">
      <div><span class="meta-label">Data de Emissão:</span><span class="meta-value">${osSelecionada.data}</span></div>
      <div><span class="meta-label">Status:</span><span class="meta-value">CONCLUÍDA</span></div>
      <div><span class="meta-label">Técnico:</span><span class="meta-value">Tecflex Assistência</span></div>
    </div>
  </div>

  <div class="body">
    <div class="section">
      <div class="section-title">Dados do Cliente</div>
      <div class="info-grid">
        <div class="info-item full"><label>Nome / Razão Social:</label><span>${osSelecionada.cliente?.nome || 'Cliente Avulso'}</span></div>
        ${osSelecionada.cliente?.documento ? `<div class="info-item"><label>CPF / CNPJ:</label><span>${osSelecionada.cliente.documento}</span></div>` : ''}
        ${osSelecionada.cliente?.telefone ? `<div class="info-item"><label>Telefone:</label><span>${osSelecionada.cliente.telefone}</span></div>` : ''}
        ${clienteEnd ? `<div class="info-item full"><label>Endereço:</label><span>${clienteEnd}</span></div>` : ''}
      </div>
    </div>

    <div class="section">
      <div class="section-title">Equipamento e Serviço</div>
      <div class="info-grid">
        <div class="info-item full"><label>Modelo da Máquina:</label><span>${osSelecionada.maquina}</span></div>
        <div class="info-item full"><label>Descrição do Serviço:</label><span>${osSelecionada.servico || osSelecionada.defeito || '—'}</span></div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Peças e Materiais Aplicados</div>
      <table>
        <thead><tr><th>Item</th><th style="text-align:right;">Valor (R$)</th></tr></thead>
        <tbody>${pecasHtml}</tbody>
      </table>
    </div>

    <div class="totals">
      <div class="total-row"><label>Mão de Obra:</label><span>R$ ${maoDeObra.toFixed(2)}</span></div>
      <div class="total-row"><label>Peças (${pecas.length} itens):</label><span>R$ ${totalPecas.toFixed(2)}</span></div>
      <div class="total-row divider main"><label>TOTAL GERAL</label><span>R$ ${parseFloat(osSelecionada.total).toFixed(2)}</span></div>
    </div>

    <div class="assinatura">
      <div class="assin-box">
        <div class="assin-label">Assinatura do Cliente:</div>
        <div class="assin-name">${osSelecionada.cliente?.nome || '___________________________'}</div>
      </div>
      <div class="assin-box">
        <div class="assin-label">Técnico Responsável:</div>
        <div class="assin-name">Tecflex Sistemas de Costura</div>
      </div>
    </div>
  </div>

  <div class="footer">Documento gerado pelo sistema TaskForm · ${new Date().getFullYear()}</div>
</div>
</body>
</html>`;

      const { uri } = await Print.printToFileAsync({ html: htmlContent, base64: false });
      await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Compartilhar OS' });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível gerar o PDF da OS.');
    }
  };

  const handleEditar = () => {
    carregarOSParaEdicao(osSelecionada);
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
            await excluirOS(osSelecionada.id);
            navigation.navigate('Home', { screen: 'Painel' });
          }
        }
      ]
    );
  };

  const InfoRow = ({ label, valor }) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValor}>{valor || '—'}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header status */}
        <View style={styles.statusHeader}>
          <Text style={styles.osNumero}>{osSelecionada.os_number}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeTxt}>CONCLUÍDA</Text>
          </View>
        </View>
        <Text style={styles.dataTexto}>Realizada em {osSelecionada.data}</Text>

        {/* Card Cliente */}
        <View style={styles.card}>
          <View style={styles.cardTituloRow}>
            <Ionicons name="person-outline" size={16} color={CORES.secundaria} />
            <Text style={styles.cardTitulo}>CLIENTE</Text>
          </View>
          <Text style={styles.cardDestaque}>{osSelecionada.cliente?.nome || 'Cliente Avulso'}</Text>
          {osSelecionada.cliente?.telefone ? (
            <Text style={styles.cardSub}>{osSelecionada.cliente.telefone}</Text>
          ) : null}
        </View>

        {/* Card Equipamento */}
        <View style={styles.card}>
          <View style={styles.cardTituloRow}>
            <Ionicons name="settings-outline" size={16} color={CORES.secundaria} />
            <Text style={styles.cardTitulo}>EQUIPAMENTO</Text>
          </View>
          <Text style={styles.cardDestaque}>{osSelecionada.maquina}</Text>
          <Text style={styles.cardSub}>{osSelecionada.servico || osSelecionada.defeito || '—'}</Text>
        </View>

        {/* Card Financeiro */}
        {osSelecionada.pecas?.length > 0 && (
          <View style={styles.card}>
            <View style={styles.cardTituloRow}>
              <Ionicons name="construct-outline" size={16} color={CORES.secundaria} />
              <Text style={styles.cardTitulo}>PEÇAS / MATERIAIS</Text>
            </View>
            {osSelecionada.pecas.map((p, i) => (
              <InfoRow key={i} label={p.nome} valor={`R$ ${parseFloat(p.valor).toFixed(2)}`} />
            ))}
          </View>
        )}

        <View style={styles.cardTotal}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Mão de Obra</Text>
            <Text style={styles.totalValorSub}>R$ {parseFloat(osSelecionada.valorMaoDeObra || 0).toFixed(2)}</Text>
          </View>
          <View style={styles.divisor} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TOTAL GERAL</Text>
            <Text style={styles.totalValor}>R$ {parseFloat(osSelecionada.total).toFixed(2)}</Text>
          </View>
        </View>

        {/* Ações */}
        <TouchableOpacity style={[styles.btnAcao, { backgroundColor: CORES.primaria }]} onPress={gerarECompartilharPDF}>
          <Ionicons name="share-social-outline" size={20} color="#fff" style={styles.btnIcon} />
          <Text style={styles.btnAcaoTxt}>GERAR PDF / COMPARTILHAR</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btnAcao, { backgroundColor: CORES.secundaria }]} onPress={handleEditar}>
          <Feather name="edit-2" size={18} color="#fff" style={styles.btnIcon} />
          <Text style={styles.btnAcaoTxt}>EDITAR OS</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btnAcao, styles.btnExcluir]} onPress={handleExcluir}>
          <Feather name="trash-2" size={18} color="#DC3545" style={styles.btnIcon} />
          <Text style={[styles.btnAcaoTxt, { color: '#DC3545' }]}>EXCLUIR OS</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: CORES.fundo },
  container: { flex: 1, padding: 20 },

  statusHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  osNumero: { fontSize: 20, fontWeight: 'bold', color: CORES.primaria },
  badge: { backgroundColor: CORES.sucesso, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  badgeTxt: { color: CORES.textoSucesso, fontSize: 11, fontWeight: 'bold' },
  dataTexto: { fontSize: 13, color: CORES.textoSecundario, marginBottom: 20 },

  card: {
    backgroundColor: CORES.branco, borderRadius: RAIO.card, padding: 16,
    marginBottom: 12, elevation: 1, borderWidth: 1, borderColor: CORES.divisor,
  },
  cardTituloRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  cardTitulo: { fontSize: 11, fontWeight: 'bold', color: CORES.secundaria, letterSpacing: 1, marginLeft: 6 },
  cardDestaque: { fontSize: 18, fontWeight: 'bold', color: CORES.textoPrincipal },
  cardSub: { fontSize: 14, color: CORES.textoSecundario, marginTop: 4, lineHeight: 20 },

  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  infoLabel: { fontSize: 14, color: CORES.textoSecundario, flex: 1 },
  infoValor: { fontSize: 14, fontWeight: '600', color: CORES.textoPrincipal },

  cardTotal: {
    backgroundColor: CORES.primaria, borderRadius: RAIO.card, padding: 20,
    marginBottom: 20, elevation: 2,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
  totalValorSub: { fontSize: 14, color: CORES.branco, fontWeight: 'bold' },
  divisor: { height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 12 },
  totalValor: { fontSize: 26, fontWeight: 'bold', color: CORES.branco },

  btnAcao: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 14, borderRadius: RAIO.botao, marginBottom: 12, elevation: 1,
  },
  btnExcluir: {
    backgroundColor: CORES.branco, borderWidth: 1, borderColor: '#FFCDD2',
  },
  btnIcon: { marginRight: 8 },
  btnAcaoTxt: { color: '#fff', fontWeight: 'bold', fontSize: 14, letterSpacing: 0.5 },
});
