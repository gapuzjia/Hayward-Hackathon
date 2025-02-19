import React, { useState, createContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import HomeScreen from './screens/HomeScreen';
import ResourcesScreen from './screens/ResourcesScreen';
import AboutScreen from './screens/AboutScreen';
import RewardsScreen from './screens/RewardsScreen';

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
            tabBarIcon: ({ color, size }) => {
              let iconName;
              if (route.name === 'Home') iconName = 'home';
              else if (route.name === 'Resources') iconName = 'book';
              else if (route.name === 'About') iconName = 'information-circle';
              else if (route.name === 'Rewards') iconName = 'gift';
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#007AFF',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: { backgroundColor: '#fff', paddingBottom: 5, height: 60 },
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
