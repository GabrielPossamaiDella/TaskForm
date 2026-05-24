import React from 'react';
import { TouchableOpacity, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import Login from './src/screens/Login';
import Home from './src/screens/Home';
import Perfil from './src/screens/Perfil';
import NovoCliente from './src/screens/NovoCliente';
import NovaOSCliente from './src/screens/NovaOSCliente';
import NovaOSEquipamento from './src/screens/NovaOSEquipamento';
import NovaOSServicos from './src/screens/NovaOSServicos';
import NovaOSResumo from './src/screens/NovaOSResumo';
import DetalhesOS from './src/screens/DetalhesOS';

import { CORES } from './src/styles/temas';
import { AppProvider } from './src/context/AppContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = Platform.OS === 'ios' ? 85 + insets.bottom : 70 + insets.bottom;
  const tabBarPaddingBottom = Platform.OS === 'ios' ? 25 + insets.bottom : 12 + insets.bottom;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: CORES.primaria,
          borderTopWidth: 0,
          height: tabBarHeight,
          paddingBottom: tabBarPaddingBottom,
          paddingTop: 10,
        },
        tabBarActiveTintColor: CORES.sucesso,
        tabBarInactiveTintColor: CORES.placeholder,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Painel') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Nova OS') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
            size = 32;
            color = focused ? CORES.sucesso : CORES.branco;
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
            name="NovoCliente" 
            component={NovoCliente} 
            options={({ navigation }) => ({ 
              title: 'CADASTRAR CLIENTE',
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.navigate('Home', { screen: 'Painel' })} style={{ marginLeft: 5 }}>
                  <Ionicons name="home-outline" size={24} color={CORES.branco} />
                </TouchableOpacity>
              )
            })} 
          />

          <Stack.Screen 
            name="NovaOSEquipamento" 
            component={NovaOSEquipamento} 
            options={({ navigation }) => ({ 
              title: 'EQUIPAMENTO',
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.navigate('Home', { screen: 'Painel' })} style={{ marginLeft: 5 }}>
                  <Ionicons name="home-outline" size={24} color={CORES.branco} />
                </TouchableOpacity>
              )
            })} 
          />

          <Stack.Screen 
            name="NovaOSServicos" 
            component={NovaOSServicos} 
            options={({ navigation }) => ({ 
              title: 'SERVIÇOS',
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.navigate('Home', { screen: 'Painel' })} style={{ marginLeft: 5 }}>
                  <Ionicons name="home-outline" size={24} color={CORES.branco} />
                </TouchableOpacity>
              )
            })} 
          />

          <Stack.Screen 
            name="NovaOSResumo" 
            component={NovaOSResumo} 
            options={({ navigation }) => ({ 
              title: 'RESUMO FINAL',
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.navigate('Home', { screen: 'Painel' })} style={{ marginLeft: 5 }}>
                  <Ionicons name="home-outline" size={24} color={CORES.branco} />
                </TouchableOpacity>
              )
            })} 
          />

          <Stack.Screen 
            name="DetalhesOS" 
            component={DetalhesOS} 
            options={({ navigation }) => ({ 
              title: 'DETALHES DA OS',
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.navigate('Home', { screen: 'Painel' })} style={{ marginLeft: 5 }}>
                  <Ionicons name="home-outline" size={24} color={CORES.branco} />
                </TouchableOpacity>
              )
            })} 
          />

        </Stack.Navigator>
      </NavigationContainer>
      </SafeAreaProvider>
    </AppProvider>
  );
}