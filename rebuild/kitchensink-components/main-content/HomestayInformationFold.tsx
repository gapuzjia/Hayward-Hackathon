import React from "react";
import { Box, HStack, Pressable, Text } from "../../components/ui";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

// Define valid routes
type RootStackParamList = {
  Home: undefined;
  RewardsScreen: undefined;
};

const tabs = [
  { title: "Home", content: "Welcome to Home Page!" },
  { title: "Rewards", content: "Rewards Page Loading..." },
];

const HomestayInformationFold = () => {
  const [activeTab, setActiveTab] = React.useState(tabs[0]);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <Box className="pb-8 px-4 md:px-0">
      {/* Tabs */}
      <Box className="border-b border-outline-50">
        <HStack space="lg" className="mx-0.5 xl:gap-5 2xl:gap-6 justify-center py-5">
          {tabs.map((tab) => (
            <Pressable
              key={tab.title}
              onPress={() => {
                if (tab.title === "Rewards") {
                  navigation.navigate("RewardsScreen"); // Navigate to Rewards screen
                } else {
                  setActiveTab(tab);
                }
              }}
            >
              <Text
                size="sm"
                className={`${
                  activeTab.title === tab.title ? "text-typography-900" : "text-typography-600"
                } font-medium`}
              >
                {tab.title}
              </Text>
            </Pressable>
          ))}
        </HStack>
      </Box>

      {/* Display Tab Content */}
      <Box className="py-5 flex items-center justify-center">
        <Text className="text-lg font-semibold">{activeTab.content}</Text>
      </Box>
    </Box>
  );
};

export default HomestayInformationFold;
