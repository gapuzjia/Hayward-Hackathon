import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PointsContext } from '../App';

export default function RewardsScreen() {
  const { points } = useContext(PointsContext);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🎁 Rewards Page</Text>
      <Text style={styles.points}>🏆 Total Points: {points}</Text>
      <Text style={styles.text}>Use your points to unlock rewards!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  points: { fontSize: 24, fontWeight: 'bold', color: '#007AFF' },
  text: { fontSize: 18, textAlign: 'center', marginTop: 10 },
});
