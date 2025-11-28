import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Função auxiliar para converter uma string de horários (ex: "10:00, 10:30") em um array de objetos de horário
const parseTimesString = (timesString) => {
  if (!timesString) return [];
  return timesString.split(',').map(time => ({
    time: time.trim(),
    status: 'Previsto', // Status padrão para novos horários
  }));
};

// Componente de Input de Edição de Horário
const TimeEditInput = ({ stop, onSave, onCancel }) => {
  const currentTimesString = stop.times.map(t => t.time).join(', ');
  const [timesInput, setTimesInput] = useState(currentTimesString);

  const handleSave = () => {
    onSave(stop.id, timesInput);
  };

  return (
    <View style={editStyles.container}>
      <Text style={editStyles.header}>Editar Horários para {stop.name}</Text>
      <TextInput
        style={editStyles.input}
        placeholder="Ex: 10:00, 10:30, 11:00"
        placeholderTextColor="#999"
        value={timesInput}
        onChangeText={setTimesInput}
        autoCapitalize="none"
      />
      <View style={editStyles.buttonContainer}>
        <TouchableOpacity style={editStyles.cancelButton} onPress={onCancel}>
          <Text style={editStyles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={editStyles.saveButton} onPress={handleSave}>
          <Text style={editStyles.buttonText}>Salvar Horários</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const editStyles = StyleSheet.create({
  container: {
    backgroundColor: '#333',
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
  },
  header: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    backgroundColor: '#1C1C1E',
    borderRadius: 5,
    paddingHorizontal: 10,
    color: 'white',
    fontSize: 16,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#999',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

// Componente de Item de Ponto de Ônibus
const BusStopItem = ({ stop, onEditTimes }) => {
  return (
    <View style={stopItemStyles.card}>
      <Text style={stopItemStyles.stopName}>{stop.name}</Text>
      <View style={stopItemStyles.timeContainer}>
        {stop.times.length > 0 ? (
          stop.times.map((item, index) => (
            <Text key={index} style={stopItemStyles.timeText}>
              {item.time} - <Text style={{ color: item.status === 'Chegando' ? 'red' : 'white' }}>{item.status}</Text>
            </Text>
          ))
        ) : (
          <Text style={stopItemStyles.noTimeText}>Nenhum horário cadastrado.</Text>
        )}
      </View>
      <TouchableOpacity style={stopItemStyles.editButton} onPress={() => onEditTimes(stop.id)}>
        <Text style={stopItemStyles.editButtonText}>Modificar Horários</Text>
      </TouchableOpacity>
    </View>
  );
};

// Estilos do Item de Ponto de Ônibus
const stopItemStyles = StyleSheet.create({
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 15,
    padding: 20,
    marginVertical: 10,
    width: '100%',
    zIndex: 1,
  },
  stopName: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  timeContainer: {
    marginTop: 5,
    marginBottom: 15,
  },
  timeText: {
    color: '#999',
    fontSize: 16,
    marginBottom: 5,
  },
  noTimeText: {
    color: '#999',
    fontSize: 16,
    fontStyle: 'italic',
  },
  editButton: {
    backgroundColor: '#FF9500', // Laranja para o botão de edição
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    zIndex: 2,
  },
  editButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

// Componente Principal da Tela de Pontos de Ônibus
export default function BusStopScreen({ route, navigation }) {
  const { routeNumber, routeName } = route.params;
  const [newStop, setNewStop] = useState('');
  const [busStops, setBusStops] = useState([
    { id: 's1', name: 'Terminal Central', times: parseTimesString('08:15, 08:45, 09:30') },
    { id: 's2', name: 'Rua Principal', times: [] },
  ]);
  const [editingStopId, setEditingStopId] = useState(null);

  const handleAddStop = () => {
    if (newStop.trim()) {
      const newId = `s${busStops.length + 1}`;
      const newBusStop = {
        id: newId,
        name: newStop.trim(),
        times: [],
      };
      setBusStops([...busStops, newBusStop]);
      setNewStop('');
      Alert.alert('Ponto Adicionado', `O ponto "${newStop.trim()}" foi adicionado à rota. Use "Modificar Horários" para cadastrar os horários.`);
    }
  };

  const handleEditTimes = (stopId) => {
    setEditingStopId(stopId);
  };

  const handleSaveTimes = (stopId, timesString) => {
    const newTimes = parseTimesString(timesString);
    
    const updatedStops = busStops.map(stop => {
      if (stop.id === stopId) {
        return { ...stop, times: newTimes };
      }
      return stop;
    });

    setBusStops(updatedStops);
    setEditingStopId(null); // Fecha o input de edição
    Alert.alert('Sucesso', `Horários atualizados para o ponto.`);
  };

  const handleCancelEdit = () => {
    setEditingStopId(null);
  };

  const stopToEdit = busStops.find(stop => stop.id === editingStopId);

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
          <>
            <BusStopItem stop={item} onEditTimes={handleEditTimes} />
            {editingStopId === item.id && (
              <TimeEditInput
                stop={item}
                onSave={handleSaveTimes}
                onCancel={handleCancelEdit}
              />
            )}
          </>
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
