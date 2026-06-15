import React from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import Login from './src/screens/Login';
import Home from './src/screens/Home';
import Perfil from './src/screens/Perfil';
import NovaOSCliente from './src/screens/NovaOSCliente';
import NovaOSEquipamento from './src/screens/NovaOSEquipamento';
import NovaOSServicos from './src/screens/NovaOSServicos';
import NovaOSResumo from './src/screens/NovaOSResumo';
import DetalhesOS from './src/screens/DetalhesOS';
import GestaoClientes from './src/screens/GestaoClientes';
import Configuracoes from './src/screens/Configuracoes';

import Toast from 'react-native-toast-message';
import { CORES } from './src/styles/temas';
import { AppProvider } from './src/context/AppContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = Platform.OS === 'ios' ? 60 + insets.bottom : 56 + insets.bottom;
  const tabBarPaddingBottom = Platform.OS === 'ios' ? 8 + insets.bottom : 6 + insets.bottom;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#F3F4F6',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: tabBarHeight,
          paddingBottom: tabBarPaddingBottom,
          paddingTop: 8,
          overflow: 'visible',
        },
        tabBarActiveTintColor: CORES.primaria,
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Painel') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Nova OS') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
            size = 34;
            color = focused ? CORES.primaria : '#9CA3AF';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Painel" component={Home} />
      <Tab.Screen name="Nova OS" component={NovaOSCliente} />
      <Tab.Screen name="Perfil" component={Perfil} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <AppProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator 
          initialRouteName="Login"
          screenOptions={{
            headerStyle: { backgroundColor: CORES.primaria },
            headerTintColor: CORES.branco,
            headerTitleStyle: { fontWeight: 'bold' },
            headerTitleAlign: 'center',
            contentStyle: { backgroundColor: CORES.fundo }
          }}
        >
          <Stack.Screen 
            name="Login" 
            component={Login} 
            options={{ headerShown: false }} 
          />
          
          <Stack.Screen 
            name="Home" 
            component={HomeTabs} 
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="NovaOSEquipamento"
            component={NovaOSEquipamento}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="NovaOSServicos"
            component={NovaOSServicos}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="NovaOSResumo"
            component={NovaOSResumo}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="DetalhesOS"
            component={DetalhesOS}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="GestaoClientes"
            component={GestaoClientes}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Configuracoes"
            component={Configuracoes}
            options={{ headerShown: false }}
          />

        </Stack.Navigator>
      </NavigationContainer>
      </SafeAreaProvider>
      <Toast />
    </AppProvider>
  );
}