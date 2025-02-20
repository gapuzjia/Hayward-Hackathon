import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RewardsScreen = () => (
  <View style={styles.scene}>
    <Text style={styles.title}>🎁 Rewards</Text>
    <Text style={styles.text}>Earn points and unlock exclusive rewards by completing your daily health tasks.</Text>
  </View>
);

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
  },
});

export default RewardsScreen;
