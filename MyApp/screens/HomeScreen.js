import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

// First Screen
const FirstRoute = () => (
  <View style={styles.scene}>
    <Text style={styles.text}>more text?!</Text>
  </View>
);

// Second Screen
const SecondRoute = () => (
  <View style={styles.scene}>
    <Text style={styles.text}>text here?</Text>
  </View>
);

export default function HomeScreen() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'yourhealth', title: 'Your Health' },
    { key: 'rewards', title: 'Rewards' },
  ]);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={SceneMap({
        yourhealth: FirstRoute,
        rewards: SecondRoute,
      })}
      onIndexChange={setIndex}
      initialLayout={{ width: Dimensions.get('window').width }}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: 'orange' }} // Line under active tab
          style={styles.tabBar}
          labelStyle={styles.tabLabel}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  tabBar: {
    backgroundColor: '#225378', // Top Tab Background Color
  },
  tabLabel: {
    color: 'white',
    fontSize: 16,
  },
});
