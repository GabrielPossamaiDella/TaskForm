import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importando as telas
import Login from './src/screens/Login';
import Home from './src/screens/Home';
import Perfil from './src/screens/Perfil';
import NovoCliente from './src/screens/NovoCliente';
import NovaOSCliente from './src/screens/NovaOSCliente';
import NovaOSEquipamento from './src/screens/NovaOSEquipamento';
import NovaOSServicos from './src/screens/NovaOSServicos';
import NovaOSResumo from './src/screens/NovaOSResumo';
import DetalhesOS from './src/screens/DetalhesOS';

// Importando o Tema e o Provedor de Dados
import { CORES } from './src/styles/temas';
import { AppProvider } from './src/context/AppContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Login"
          // --- ESTA É A ALTERAÇÃO NECESSÁRIA PARA O VISUAL DO FIGMA ---
          screenOptions={{
            headerStyle: {
              backgroundColor: CORES.primaria, // Azul Escuro Profissional
            },
            headerTintColor: CORES.branco, // Texto e Ícones em Branco
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerTitleAlign: 'center',
            contentStyle: { backgroundColor: CORES.fundo } // Fundo padrão cinza claro
          }}
        >
          
          <Stack.Screen 
            name="Login" 
            component={Login} 
            options={{ headerShown: false }} 
          />
          
          <Stack.Screen 
            name="Home" 
            component={Home} 
            options={{ 
              title: 'TECFLEX GESTÃO', 
              headerBackVisible: false // Impede voltar para o Login pelo gesto
            }} 
          />
          
          <Stack.Screen 
            name="Perfil" 
            component={Perfil} 
            options={{ title: 'Meu Perfil' }} 
          />

          <Stack.Screen 
            name="NovoCliente" 
            component={NovoCliente} 
            options={{ title: 'Cadastrar Cliente' }} 
          />

          <Stack.Screen 
            name="NovaOSCliente" 
            component={NovaOSCliente} 
            options={{ title: 'Criação de Atendimento' }} 
          />

          <Stack.Screen 
            name="NovaOSEquipamento" 
            component={NovaOSEquipamento} 
            options={{ title: 'Criação de Atendimento' }} 
          />

          <Stack.Screen 
            name="NovaOSServicos" 
            component={NovaOSServicos} 
            options={{ title: 'Criação de Atendimento' }} 
          />

          <Stack.Screen 
            name="NovaOSResumo" 
            component={NovaOSResumo} 
            options={{ title: 'Criação de Atendimento' }} 
          />

          <Stack.Screen 
            name="DetalhesOS" 
            component={DetalhesOS} 
            options={{ title: 'Ajustes da OS' }} 
          />

        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}