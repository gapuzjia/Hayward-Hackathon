import "./global.css";
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaView, View, Image, StyleSheet, StatusBar, Platform } from "react-native";
import { GluestackUIProvider } from "./components/ui";
import { Asset } from "expo-asset";
import HomestayPage from "./kitchensink-components/HomestayPage";
import HomestayInformationFold from "./kitchensink-components/main-content/HomestayInformationFold";
import RewardsScreen from "./kitchensink-components/main-content/Rewards";

import Map from "./kitchensink-components/Map"; 
import * as Linking from "expo-linking";
import { LogBox } from "react-native";

LogBox.ignoreLogs([
  "VirtualizedLists should never be nested inside plain ScrollViews",
  "Encountered two children with the same key",
  "Non-unique keys may cause children to be duplicated", // 🔥 Ignores similar key warnings
]);

LogBox.ignoreAllLogs(); // ❌ Hides ALL warnings (only use if needed)





// ✅ Define Theme Context
export const ThemeContext = React.createContext({
  colorMode: "light",
  toggleColorMode: () => {},
});

const Stack = createStackNavigator();

export default function App() {
  const [colorMode, setColorMode] = useState("light");
  const [headerImage, setHeaderImage] = useState(null);

  const toggleColorMode = () => {
    setColorMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    async function loadAssets() {
      const imageAsset = require("./assets/header-logo.png");
      await Asset.loadAsync(imageAsset);
      setHeaderImage(imageAsset);
    }
    loadAssets();
  }, []);

  // ✅ Dynamic background based on theme
  const backgroundColor = colorMode === "light" ? "#FFFFFF" : "#262626";

  return (
    <ThemeContext.Provider value={{ colorMode, toggleColorMode }}>
      <GluestackUIProvider>
        {/* ✅ SafeAreaView to prevent covering the time/status bar */}
        <SafeAreaView style={{ flex: 1, backgroundColor }}>
          <NavigationContainer>
            {/* ✅ Global Header */}
            <View style={[styles.header, { backgroundColor }]}>
              <StatusBar barStyle={colorMode === "light" ? "dark-content" : "light-content"} />
              {headerImage && <Image source={headerImage} style={styles.headerImage} />}
            </View>

            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Home" component={HomestayPage} />
              <Stack.Screen name="RewardsScreen" component={RewardsScreen} />
              <Stack.Screen name="Map" component={Map} />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </GluestackUIProvider>
    </ThemeContext.Provider>
  );
}

// ✅ Styles for Header
const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: 50, // 🔥 Reduce height to make header smaller
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF", // ✅ Ensures header background is solid
  },
  headerImage: {
    width: 120, // 🔥 Reduce logo size if needed
    height: 40,
    resizeMode: "contain",
  },
});


