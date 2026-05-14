import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useApp } from '../context/AppContext';
import { CORES } from '../styles/temas';

export default function DetalhesOS({ route, navigation }) {
  const { osSelecionada } = route.params;
  const { excluirOS, carregarOSParaEdicao } = useApp(); // Puxando as novas funções

  const gerarECompartilharPDF = async () => {
    try {
      const pecasHtml = osSelecionada.pecas?.map(p => 
        `<tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${p.nome}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">R$ ${parseFloat(p.valor).toFixed(2)}</td>
        </tr>`
      ).join('') || '<tr><td colspan="2" style="padding: 8px;">Nenhuma peça adicionada</td></tr>';

      const htmlContent = `
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <div style="text-align: center; border-bottom: 2px solid ${CORES.primaria}; padding-bottom: 10px; margin-bottom: 20px;">
              <h1 style="color: ${CORES.primaria}; margin: 0;">TECFLEX - Sistemas de Costura</h1>
              <p style="margin: 5px 0;">Comprovante de Ordem de Serviço</p>
            </div>
            <table style="width: 100%; margin-bottom: 20px;">
              <tr>
                <td><strong>OS Número:</strong> ${osSelecionada.os_number || '#N/A'}</td>
                <td style="text-align: right;"><strong>Data:</strong> ${osSelecionada.data}</td>
              </tr>
            </table>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="margin-top: 0; color: ${CORES.secundaria}; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Dados do Cliente</h3>
              <p><strong>Nome:</strong> ${osSelecionada.cliente?.nome || 'N/A'}</p>
            </div>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="margin-top: 0; color: ${CORES.secundaria}; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Equipamento e Serviço</h3>
              <p><strong>Máquina:</strong> ${osSelecionada.maquina}</p>
              <p><strong>Descrição:</strong> ${osSelecionada.servico || osSelecionada.defeito}</p>
            </div>
            <h3 style="color: ${CORES.secundaria};">Materiais Aplicados</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              ${pecasHtml}
            </table>
            <table style="width: 100%; font-size: 18px; font-weight: bold; margin-top: 20px;">
              <tr>
                <td>Mão de Obra:</td>
                <td style="text-align: right;">R$ ${parseFloat(osSelecionada.valorMaoDeObra || 0).toFixed(2)}</td>
              </tr>
              <tr>
                <td style="padding-top: 10px; color: green;">TOTAL GERAL:</td>
                <td style="text-align: right; padding-top: 10px; color: green;">R$ ${parseFloat(osSelecionada.total).toFixed(2)}</td>
              </tr>
            </table>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri);
      
    } catch (error) {
      Alert.alert("Erro", "Não foi possível gerar o PDF da OS.");
    }
  };

  const handleEditar = () => {
    carregarOSParaEdicao(osSelecionada);
    // Navega para a aba 'Nova OS', que abrirá o formulário já preenchido
    navigation.navigate('Nova OS'); 
  };

  const handleExcluir = () => {
    Alert.alert(
      "Excluir Ordem de Serviço",
      "Tem certeza que deseja apagar esta OS permanentemente? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive", 
          onPress: async () => {
            await excluirOS(osSelecionada.id);
            navigation.navigate('Painel');
          } 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        <View style={styles.statusHeader}>
          <View>
            <Text style={styles.labelStatus}>STATUS DA ORDEM</Text>
            <Text style={styles.dataText}>Realizada em {osSelecionada.data}</Text>
          </View>
          <View style={styles.badgeConcluido}>
            <Text style={styles.textoBadge}>CONCLUÍDA</Text>
          </View>
        </View>

        <View style={styles.cardPrincipal}>
          <View style={styles.section}>
            <Text style={styles.labelCard}>CLIENTE</Text>
            <Text style={styles.infoNome}>{osSelecionada.cliente?.nome || "Cliente Avulso"}</Text>
          </View>
          <View style={styles.divisor} />
          <View style={styles.section}>
            <Text style={styles.labelCard}>EQUIPAMENTO</Text>
            <Text style={styles.infoDestaque}>{osSelecionada.maquina}</Text>
            <Text style={styles.labelInterno}>Defeito/Serviço Executado:</Text>
            <Text style={styles.infoTexto}>{osSelecionada.servico || osSelecionada.defeito}</Text>
          </View>
        </View>

        <View style={styles.cardFinanceiro}>
          <View style={styles.linhaFinanceira}>
            <Text style={styles.labelTotal}>TOTAL GERAL</Text>
            <Text style={styles.valorTotal}>R$ {parseFloat(osSelecionada.total).toFixed(2)}</Text>
          </View>
        </View>

        {/* BOTÕES DE AÇÃO BLINDADOS */}
        <TouchableOpacity style={[styles.botaoAcao, { backgroundColor: '#28a745' }]} onPress={gerarECompartilharPDF}>
          <Text style={styles.textoBotaoAcao}>GERAR PDF / COMPARTILHAR</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.botaoAcao, { backgroundColor: '#FF9500' }]} onPress={handleEditar}>
          <Text style={styles.textoBotaoAcao}>EDITAR OS</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.botaoAcao, { backgroundColor: '#DC3545' }]} onPress={handleExcluir}>
          <Text style={styles.textoBotaoAcao}>EXCLUIR OS</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.botaoAcao, { backgroundColor: CORES.primaria, marginTop: 10 }]} onPress={() => navigation.navigate('Painel')}>
          <Text style={styles.textoBotaoAcao}>VOLTAR AO PAINEL</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: CORES.fundo },
  container: { flex: 1, padding: 20 },
  statusHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  labelStatus: { fontSize: 10, fontWeight: 'bold', color: CORES.textoSecundario, letterSpacing: 1 },
  dataText: { fontSize: 14, color: CORES.textoPrincipal, marginTop: 2 },
  badgeConcluido: { backgroundColor: '#D4EDDA', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  textoBadge: { color: '#155724', fontSize: 10, fontWeight: 'bold' },
  cardPrincipal: { backgroundColor: '#fff', borderRadius: 15, padding: 20, elevation: 2 },
  section: { marginVertical: 5 },
  labelCard: { fontSize: 11, fontWeight: 'bold', color: CORES.secundaria, marginBottom: 5 },
  infoNome: { fontSize: 20, fontWeight: 'bold', color: CORES.primaria },
  infoDestaque: { fontSize: 18, fontWeight: '700', color: CORES.textoPrincipal },
  labelInterno: { fontSize: 12, fontWeight: 'bold', color: CORES.textoSecundario, marginTop: 15 },
  infoTexto: { fontSize: 15, color: CORES.textoPrincipal, lineHeight: 22, marginTop: 5 },
  divisor: { height: 1, backgroundColor: CORES.cinzaLinha, marginVertical: 15 },
  cardFinanceiro: { backgroundColor: CORES.primaria, borderRadius: 15, padding: 25, marginTop: 30, elevation: 3, marginBottom: 20 },
  linhaFinanceira: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  labelTotal: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  valorTotal: { color: '#28a745', fontWeight: 'bold', fontSize: 28 },
  botaoAcao: { paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 15 },
  textoBotaoAcao: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15, letterSpacing: 1 }
});