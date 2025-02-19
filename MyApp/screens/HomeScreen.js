import React, { useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PointsContext } from '../App';

export default function HomeScreen() {
  const { points, setPoints } = useContext(PointsContext);
  const [tasks, setTasks] = useState([
    { id: '1', text: 'Drink Water 💧', completed: false, points: 10 },
    { id: '2', text: 'Meditate 🧘', completed: false, points: 15 },
    { id: '3', text: 'Exercise 💪', completed: false, points: 20 },
  ]);

  const toggleTask = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id && !task.completed ? { ...task, completed: true } : task
      )
    );

    const completedTask = tasks.find(task => task.id === id);
    if (completedTask && !completedTask.completed) {
      setPoints((prevPoints) => prevPoints + completedTask.points);
    }
  };

  return (
    <LinearGradient
      colors={['#eb7f00', '#225378']} 
      style={styles.container}
    >
      <View style={styles.toDoContainer}> 
        <Text style={styles.header}>Your Daily Health Goals</Text>
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.task, item.completed && styles.completedTask]}
              onPress={() => toggleTask(item.id)}
              disabled={item.completed}
            >
              <Text style={styles.taskText}>{item.text} {item.completed ? '✔️' : ''}</Text>
              <Text style={styles.pointsText}>+{item.points} pts</Text>
            </TouchableOpacity>
          )}
        />
        <Text style={styles.totalPoints}>🎯 Total Points: {points}</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  toDoContainer: {
    backgroundColor: '#225378', // 🌟 Change this to your preferred blue hex code
    padding: 20,
    borderRadius: 15,
    width: '95%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
    postion: 'absolute',
    top: 0,
    borderWidth: 4,
    borderColor: '#eb7f00',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: 'white', // Ensure visibility
  },
  task: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%', // Make tasks stretch across the box
  },
  completedTask: {
    backgroundColor: '#d3f8d3',
  },
  taskText: {
    fontSize: 18,
  },
  pointsText: {
    fontSize: 16,
    color: '#007AFF',
  },
  totalPoints: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    color: 'white',
  },
});
