# TaskForm — Gestão de Ordens de Serviço

> App mobile **offline-first** para técnicos de campo da Tecflex. Criado, aberto, fechado e sincronizado sem depender de sinal — do galpão ao faturamento.

---

## Contexto

A **Tecflex** (CNPJ 13.786.896/0001-17), localizada na Av. Santos Dumont, 565 — Pinheirinho, Criciúma/SC, atua na manutenção de máquinas de costura e equipamentos para o polo têxtil regional.

O principal gargalo relatado pela empresa era a **gestão de atendimentos em campo inteiramente no papel**: técnicos trabalham dentro de galpões industriais que frequentemente não têm sinal de internet, então as Ordens de Serviço eram preenchidas à mão. O resultado: letras ilegíveis, perda de registros de peças utilizadas, documentos danificados, retrabalho de redigitação no escritório e atrasos no faturamento.

O **TaskForm** resolve esse problema do começo ao fim.

---

## Equipe

Projeto desenvolvido por alunos do curso de Análise e Desenvolvimento de Sistemas:

| Aluno |
|---|
| Davi Duarte Dorschaidt |
| Gabriel Patricio Possamai Della |
| Jorge Luiz M. Pires |
| Lucas Rodrigues Vigarani |
| Paulo Henrique de Souza Cândido |

---

## Funcionalidades

- **Criação de OS guiada** — fluxo passo a passo com indicador de progresso: cliente → equipamento → serviços/peças → resumo → finalizar
- **Offline-first real** — cria, edita e consulta OS sem nenhuma conexão; fila de sincronização automática
- **Localização offline** — captura o local do atendimento via GPS mesmo sem internet (com fallback de última posição conhecida)
- **Indicador de status** — cada OS exibe "Na nuvem" ou "Só no celular" em tempo real
- **Sincronização inteligente** — botão Sincronizar envia tudo que está pendente; fica desativado quando não há nada a enviar
- **Máscara de moeda** — valores de mão de obra e peças formatados automaticamente (vírgula e centavos)
- **Notificações visuais** — feedback de sucesso/erro em toasts integrados ao visual do app
- **PDF profissional em A4** — gera e compartilha a OS em PDF, com logo da empresa personalizável
- **Geolocalização e deslocamento** — calcula KM rodado a partir do local base; abre o endereço **no app de mapa preferido do aparelho** (Apple Maps, Google Maps ou Waze)
- **Gestão de clientes** — CRUD completo integrado ao backend, com autocompletar de endereço por CEP (ViaCEP)
- **Autenticação com token** — login validado no Supabase com RLS por usuário

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Mobile | React Native + Expo SDK 54 |
| Navegação | React Navigation (stack + bottom tabs) |
| Backend / Auth | Supabase (PostgreSQL + Auth via RPC + RLS) |
| Cache offline | AsyncStorage com fila de sincronização |
| Geolocalização | expo-location (GPS offline) |
| Mapas | Deep links para Apple Maps / Google Maps / Waze |
| Geração de PDF | expo-print + expo-sharing |
| API externa | ViaCEP (autocompletar endereço por CEP) |
| UI / feedback | react-native-toast-message, expo-image-picker |

---

## Como executar

**Pré-requisitos:** Node.js LTS instalado no computador e o app **Expo Go** no celular.

```bash
git clone https://github.com/GabrielPossamaiDella/TaskForm.git
cd TaskForm
npm install
npx expo start
```

Abra o **Expo Go** no celular e escaneie o QR Code exibido no terminal.

> **Mesma rede Wi-Fi** — o QR padrão funciona normalmente.
> **Rede restrita** (ex: Wi-Fi da faculdade) — use o modo túnel:
> ```bash
> npx expo start --tunnel
> ```

O backend é em nuvem. Não é necessário configurar nada — o app já conecta ao Supabase automaticamente.

---

## Acesso de demonstração

| Campo | Valor |
|---|---|
| E-mail | `gabriel@tecflex.com.br` |
| Senha | `admin123` |

---

## Roteiro de demonstração

1. **Login** — autenticação real no backend com geração de token.
2. **Painel** — lista de OS com indicador "Na nuvem" / "Só no celular".
3. **Nova OS** — percorra o fluxo completo: cliente → equipamento → serviços/peças → resumo → finalizar.
4. **Offline-first** — ative o modo avião, crie uma OS (aparece como "Só no celular"), volte online e toque em **Sincronizar** (passa a "Na nuvem").
5. **PDF** — abra uma OS em Detalhes e compartilhe o PDF gerado.
6. **Perfil / Configurações** — defina o local base e as regras de cálculo de deslocamento por KM rodado.
7. **Clientes** — demonstre o CRUD completo: cadastro, edição e exclusão.
