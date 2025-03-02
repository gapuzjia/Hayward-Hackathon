import "./global.css";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Resources from "./Resources";
import ResourcesDetails from "./ResourcesDetails"; // ✅ Renamed from AnotherScreen

// ✅ Define navigation types
export type RootStackParamList = {
  Resources: undefined;
  ResourcesDetails: undefined; // ✅ Renamed
};

// Create Stack Navigator
const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* ✅ Default Screen */}
        <Stack.Screen name="Resources" component={Resources} />

        {/* ✅ Renamed Screen */}
        <Stack.Screen name="ResourcesDetails" component={ResourcesDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
