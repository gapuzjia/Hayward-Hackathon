import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';

// First Route: Your Health Tab content
const FirstRoute = () => (
  <View style={styles.scene}>
    <Text style={styles.text}>Track your health goals here!</Text>
  </View>
);

// Second Route: Rewards Tab content
//EVERYONE EDIT HERE. EVERYTHING U ADD WILL BE WITHIN THIS CODE BLOCK------------------
const SecondRoute = () => (
  <View style={styles.scene}>
    <Text style={styles.text}>Earn rewards for completing health tasks!</Text>
  </View>
);

const App = () => {
  const [index, setIndex] = useState(0); // Active tab index
  const [routes] = useState([
    { key: 'yourhealth', title: 'Your Health' },
    { key: 'rewards', title: 'Rewards' },
  ]);

  // Render the correct scene based on the active tab
  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'yourhealth':
        return <FirstRoute />;
      case 'rewards':
        return <SecondRoute />;
      default:
        return null;
    }
  };

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene} // Dynamically render only the active tab
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
};

const styles = StyleSheet.create({
  scene: {
    flex: 1,  // Ensures the scene takes the full screen height
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
    backgroundColor: '#225378', // Tab bar background color
  },
  tabLabel: {
    color: 'white',  // Tab label color
  },
});

export default App;
