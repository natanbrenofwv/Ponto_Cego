import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Dados simulados de horários de chegada
const mockArrivalTimes = [
  { time: '08:15', status: 'Chegando' },
  { time: '08:45', status: 'A caminho' },
  { time: '09:30', status: 'Previsto' },
];

// Componente de Item de Ponto de Ônibus
const BusStopItem = ({ stopName, arrivalTimes }) => (
  <View style={stopItemStyles.card}>
    <Text style={stopItemStyles.stopName}>{stopName}</Text>
    <View style={stopItemStyles.timeContainer}>
      {arrivalTimes.map((item, index) => (
        <Text key={index} style={stopItemStyles.timeText}>
          {item.time} - <Text style={{ color: item.status === 'Chegando' ? 'red' : 'white' }}>{item.status}</Text>
        </Text>
      ))}
    </View>
  </View>
);

// Estilos do Item de Ponto de Ônibus
const stopItemStyles = StyleSheet.create({
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 15,
    padding: 20,
    marginVertical: 10,
    width: '100%',
  },
  stopName: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  timeContainer: {
    marginTop: 5,
  },
  timeText: {
    color: '#999',
    fontSize: 16,
    marginBottom: 5,
  },
});

// Componente Principal da Tela de Pontos de Ônibus
export default function BusStopScreen({ route, navigation }) {
  const { routeNumber, routeName } = route.params;
  const [newStop, setNewStop] = useState('');
  const [busStops, setBusStops] = useState([
    { id: 's1', name: 'Terminal Central', times: mockArrivalTimes },
    { id: 's2', name: 'Rua Principal', times: mockArrivalTimes.slice(1) },
  ]);

  const handleAddStop = () => {
    if (newStop.trim()) {
      const newId = `s${busStops.length + 1}`;
      const newBusStop = {
        id: newId,
        name: newStop.trim(),
        times: mockArrivalTimes, // Usando horários simulados
      };
      setBusStops([...busStops, newBusStop]);
      setNewStop('');
      Alert.alert('Ponto Adicionado', `O ponto "${newStop.trim()}" foi adicionado à rota.`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>
        Rota: {routeNumber} - {routeName}
      </Text>

      <View style={styles.addStopContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nome do Ponto de Ônibus"
          placeholderTextColor="#999"
          value={newStop}
          onChangeText={setNewStop}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddStop}>
          <MaterialCommunityIcons name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <Text style={styles.subHeaderText}>Pontos Adicionados e Horários</Text>

      <FlatList
        data={busStops}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BusStopItem stopName={item.name} arrivalTimes={item.times} />
        )}
        contentContainerStyle={styles.listContent}
        style={styles.list}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>Nenhum ponto de ônibus adicionado.</Text>
        )}
      />
    </View>
  );
}

// Estilos da Tela de Pontos de Ônibus
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  headerText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  subHeaderText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  addStopContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    paddingHorizontal: 15,
    color: 'white',
    fontSize: 16,
    marginRight: 10,
  },
  addButton: {
    width: 50,
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
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