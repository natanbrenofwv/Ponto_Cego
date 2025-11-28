import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importa a nova tela de pontos de ônibus
import BusStopScreen from './BusStopScreen';

// Cria o Stack Navigator
const Stack = createNativeStackNavigator();

// --- Componente da Tela de Pesquisa de Rotas (RouteSearchScreen) ---

// Dados de rotas de ônibus simulados
const initialRoutes = [
  { id: '1', number: '431', name: 'Palhoça/Biguaçu' },
  { id: '2', number: '666', name: 'São Sebastião' },
  { id: '3', number: '101', name: 'Centro - Via Expressa' },
  { id: '4', number: '205', name: 'Trindade - UFSC' },
  { id: '5', number: '847', name: 'Rio Tavares - Carianos' },
];

// Componente de Item da Rota
const RouteItem = ({ route, onSelect }) => {
  const handlePress = () => {
    console.log('Botão Selecionar Pressionado para Rota:', route.number);
    onSelect(route);
  };

  return (
    <View style={routeItemStyles.card}>
      <Text style={routeItemStyles.routeText}>{route.number} - {route.name}</Text>
      <TouchableOpacity style={routeItemStyles.button} onPress={handlePress}>
        <Text style={routeItemStyles.buttonText}>Selecionar</Text>
      </TouchableOpacity>
    </View>
  );
};

// Estilos do Item da Rota
const routeItemStyles = StyleSheet.create({
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 15,
    padding: 20,
    marginVertical: 10,
    width: '100%',
  },
  routeText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

// Componente da Tela de Pesquisa
function RouteSearchScreen({ navigation }) {
  const [searchText, setSearchText] = useState('');
  const [filteredRoutes, setFilteredRoutes] = useState(initialRoutes);

  const handleSearch = (text) => {
    setSearchText(text);
    if (text) {
      const filtered = initialRoutes.filter(route =>
        route.number.includes(text) || route.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredRoutes(filtered);
    } else {
      setFilteredRoutes(initialRoutes);
    }
  };

  const handleSelectRoute = (route) => {
    console.log('Iniciando Navegação para Rota:', route.number);
    navigation.navigate('BusStops', {
      routeNumber: route.number,
      routeName: route.name,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>
        Digite ou fale o número do ônibus
      </Text>

      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={24} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Digite ou fale o número"
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={handleSearch}
          keyboardType="numeric"
        />
        {/* Ícone de microfone para simular a funcionalidade de "falar" */}
        <TouchableOpacity onPress={() => Alert.alert('Microfone', 'Funcionalidade de voz ativada.')}>
          <MaterialCommunityIcons name="microphone" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredRoutes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RouteItem route={item} onSelect={handleSelectRoute} />}
        contentContainerStyle={styles.listContent}
        style={styles.list}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>Nenhuma rota encontrada.</Text>
        )}
      />
    </View>
  );
}

// Estilos da Tela de Pesquisa
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  headerText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    height: '100%',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
  }
});

// --- Componente Principal (App) ---

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: 'black',
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: 'black',
          }
        }}
      >
        <Stack.Screen
          name="RouteSearch"
          component={RouteSearchScreen}
          options={{ title: 'Pesquisa de Rotas' }}
        />
        <Stack.Screen
          name="BusStops"
          component={BusStopScreen}
          options={({ route }) => ({ title: `Rota ${route.params.routeNumber}` })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}