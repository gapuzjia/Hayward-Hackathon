import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';

// First Route: Your Health Tab content
//DO ALL CODING HERE!!!!!!!!!!!--------------------------------------------
//all homescreen content is in this codeblock
const YourHealthScreen = ({ isVisible }) => (
  isVisible ? (
    <View style={styles.scene}>
      <Text style={styles.text}>Track your health goals here!</Text>
    </View>
  ) : null
);

// Second Route: Rewards Tab content
const RewardsScreen = ({ isVisible }) => (
  isVisible ? (
    <View style={styles.scene}>
      <Text style={styles.text}>Earn rewards for completing health tasks!</Text>
    </View>
  ) : null
);

const App = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'yourhealth', title: 'Your Health' },
    { key: 'rewards', title: 'Rewards' },
  ]);

  const renderScene = ({ route }) => {
    const isYourHealth = route.key === 'yourhealth';
    const isRewards = route.key === 'rewards';
    
    return (
      <>
        <YourHealthScreen isVisible={isYourHealth && index === 0} />
        <RewardsScreen isVisible={isRewards && index === 1} />
      </>
    );
  };

  return (
    <View style={styles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
        swipeEnabled={true}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={styles.indicator}
            style={styles.tabBar}
            renderLabel={({ route, focused }) => (
              <Text style={{ color: 'black', fontSize: 16, fontWeight: 'bold' }}>
                {route.title}
              </Text>
            )}
          />
        )}    
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 35,
  },
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
    backgroundColor: '#225378', // Background color of the tab bar
  },
  tabLabel: {
    fontSize: 16, 
    fontWeight: 'bold',
    color: 'black', // Ensure default tab label color is black
  },
  indicator: {
    backgroundColor: 'orange',
  },
});


export default App;