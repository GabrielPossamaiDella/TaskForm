Alunos:
Jorge Luiz Madeira Pires, 
Davi Duarte Dorschaidt, 
Gabriel Patricio Possamai Della, 
Paulo Henrique de Souza Cândido, 
Lucas Rodrigues Vigarani



Beneficiário 01:
Nome ou empresa: Tecflex
CPF/CNPJ: 13.786.896/0001-17
Endereço: Av. Santos Dumont, 565 - Bairro Pinheirinho, Criciúma - SC
Relato do Problema (o que o cliente relatou): A empresa atua na manutenção de máquinas de costura e equipamentos para o polo têxtil da região e relatou que o seu maior gargalo logístico e administrativo é a gestão de atendimentos em campo feita inteiramente no papel. Como os técnicos trabalham dentro de galpões industriais que frequentemente não possuem sinal de internet, as Ordens de Serviço (OS) são preenchidas à mão. Segundo o cliente, isso causa diversos problemas diários: letras ilegíveis, perda de anotações de peças utilizadas, desgaste físico dos documentos, retrabalho para redigitar tudo no sistema do escritório e, consequentemente, atrasos no faturamento e na cobrança dos serviços prestados.

---

# TaskForm — App de Ordens de Serviço

App mobile (React Native + Expo) **offline-first** para gestão de Ordens de Serviço da Tecflex.
Backend em nuvem (Supabase): autenticação com token, persistência de clientes/OS e sincronização.

## Tecnologias
- React Native + Expo (SDK 54)
- Supabase (PostgreSQL + Auth via RPC + RLS)
- AsyncStorage (cache offline) com fila de sincronização
- expo-location (geolocalização / cálculo de deslocamento)
- expo-print (geração de PDF da OS)

## Como executar

Pré-requisitos: Node.js LTS e o app **Expo Go** no celular.

```bash
git clone https://github.com/GabrielPossamaiDella/TaskForm.git
cd TaskForm
npm install
npx expo start
```

Abra o **Expo Go** no celular e escaneie o QR Code do terminal.
- Se o celular e o computador estiverem na **mesma rede Wi-Fi**, o QR padrão funciona.
- Em rede restrita (ex: Wi-Fi da faculdade), use o modo túnel: `npx expo start --tunnel`.

O backend é em nuvem, então **não precisa configurar nada** — o app já conecta ao Supabase.

### Acesso de demonstração
- E-mail: `gabriel@tecflex.com.br`
- Senha: `admin123`

## Roteiro de demonstração
1. **Login** com o acesso acima (validação real no backend, com token).
2. **Painel**: lista de OS sincronizadas com a nuvem (indicador "Na nuvem"/"Só no celular").
3. **Nova OS**: cliente → equipamento → serviços/peças → resumo → finalizar.
4. **Offline-first**: ative o modo avião, crie uma OS (fica "Só no celular"), volte online e toque em **Sincronizar** (vira "Na nuvem").
5. **PDF**: abra uma OS em Detalhes e compartilhe o PDF profissional.
6. **Configurações** (Perfil): definir local base e regras de **cálculo de deslocamento (KM rodado)**.
7. **Gestão de Clientes**: CRUD completo.
