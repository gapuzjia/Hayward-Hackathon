import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Dimensions } from 'react-native';

const resources = [
  { id: '1', title: 'Resource 1', url: 'https://example.com/1' },
  { id: '2', title: 'Resource 2', url: 'https://example.com/2' },
  { id: '3', title: 'Resource 3', url: 'https://example.com/3' },
  { id: '4', title: 'Resource 4', url: 'https://example.com/4' },
  { id: '5', title: 'Resource 5', url: 'https://example.com/5' },
  { id: '6', title: 'Resource 6', url: 'https://example.com/6' },
  { id: '7', title: 'Resource 7', url: 'https://example.com/7' },
  { id: '8', title: 'Resource 8', url: 'https://example.com/8' },
];

export default function ResourcesScreen() {
  const openLink = (url) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📚 Resources Page</Text>
      <View style={styles.gridContainer}>
        {resources.map((item) => (
          <TouchableOpacity key={item.id} style={styles.box} onPress={() => openLink(item.url)}>
            <Text style={styles.boxText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const { width, height } = Dimensions.get('window');
const boxSize = width * 0.4; // Each box is 40% of screen width

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  gridContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around', // Ensures even spacing
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
  },
  box: {
    width: boxSize,
    height: boxSize * 0.8, // Adjust height to be proportional
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginVertical: 10, // Space between rows
  },
  boxText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
