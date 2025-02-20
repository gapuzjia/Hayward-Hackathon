import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';

const FirstRoute = () => (
  <View style={styles.scene}>
    <Text>Your Health Content Here</Text>
    {/* Add more Your Health content here */}
  </View>
);

const SecondRoute = () => (
  <View style={styles.scene}>
    <Text>Rewards Content Here</Text>
    {/* Add more Rewards content here */}
  </View>
);

const App = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'yourhealth', title: 'Your Health' },
    { key: 'rewards', title: 'Rewards' },
  ]);

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
    <View style={{ flex: 1 }}> {/* Parent View MUST have flex: 1 */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: 'orange' }}
            style={styles.tabBar}
            labelStyle={styles.tabLabel}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center',     // Center content horizontally
    padding: 20,              // Add padding around content
    backgroundColor: '#f0f0f0', // Light background for visibility
  },
  tabBar: {
    backgroundColor: '#225378',
  },
  tabLabel: {
    color: 'white',
  },
});

export default App;