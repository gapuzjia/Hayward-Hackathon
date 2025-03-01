import "./global.css";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomestayPage from "./kitchensink-components/HomestayPage";
import HomestayInformationFold from "./kitchensink-components/main-content/HomestayInformationFold";
import RewardsScreen from "./kitchensink-components/main-content/Rewards";
import { SafeAreaView, GluestackUIProvider } from "./components/ui";
import * as Linking from "expo-linking";

let defaultTheme: "dark" | "light" = "light";

async function setDefaultTheme() {
  const url = await Linking.getInitialURL();
  if (url) {
    let { queryParams } = Linking.parse(url) as any;
    defaultTheme = queryParams?.iframeMode ?? defaultTheme;
  }
}
setDefaultTheme();



// Define Theme Context
type ThemeContextType = {
  colorMode?: "dark" | "light";
  toggleColorMode?: () => void;
};
export const ThemeContext = React.createContext<ThemeContextType>({
  colorMode: "light",
  toggleColorMode: () => {},
});

// Create a stack navigator
const Stack = createStackNavigator();

export default function App() {
  const [colorMode, setColorMode] = React.useState<"dark" | "light">(defaultTheme);

  const toggleColorMode = async () => {
    setColorMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <>
      {/* Top SafeAreaView */}
      <SafeAreaView
        className={`${colorMode === "light" ? "bg-[#E5E5E5]" : "bg-[#262626]"}`}
      />

      <ThemeContext.Provider value={{ colorMode, toggleColorMode }}>
        <GluestackUIProvider mode={colorMode}>
          {/* Bottom SafeAreaView */}
          <SafeAreaView
            className={`${
              colorMode === "light" ? "bg-white" : "bg-[#171717]"
            } flex-1 overflow-hidden`}
          >
            {/* ✅ Navigation Container to enable navigation */}
            <NavigationContainer>
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                {/* ✅ Main page (shows HomestayPage inside) */}
                <Stack.Screen name="Home">
                  {() => (
                    <HomestayPage>
                      <HomestayInformationFold />
                    </HomestayPage>
                  )}
                </Stack.Screen>

                {/* ✅ Rewards page */}
                <Stack.Screen name="RewardsScreen" component={RewardsScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          </SafeAreaView>
        </GluestackUIProvider>
      </ThemeContext.Provider>
    </>
  );
}
