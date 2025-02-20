
import React, { useState, createContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import 'react-native-gesture-handler';
import 'react-native-reanimated';


// Import screens
import HomeScreen from './screens/HomeScreen';
import ResourcesScreen from './screens/ResourcesScreen';
import AboutScreen from './screens/AboutScreen';
import RewardsScreen from './screens/RewardsScreen';
import { useSafeAreaFrame } from 'react-native-safe-area-context';

// Create a context for points
export const PointsContext = createContext();

// Create Bottom Tab Navigator
const Tab = createBottomTabNavigator();

export default function App() {
  const [points, setPoints] = useState(0); // Global points state
  return (
    
    <PointsContext.Provider value={{ points, setPoints }}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: '#007AFF',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: { backgroundColor: '#fff', paddingBottom: 5, height: 60,},
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Resources" component={ResourcesScreen} />
          <Tab.Screen name="About" component={AboutScreen} />
          <Tab.Screen name="Rewards" component={RewardsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </PointsContext.Provider>
  );
}
