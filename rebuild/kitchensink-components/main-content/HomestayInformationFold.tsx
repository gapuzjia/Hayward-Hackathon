import React from "react";
import { Box, HStack, Pressable, Text } from "../../components/ui";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { View, FlatList, TouchableOpacity } from "react-native";

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
  const [goals, setGoals] = React.useState([
    { id: "1", goal: "goal 1", isChecked: false },
    { id: "2", goal: "goal 2", isChecked: false },
    { id: "3", goal: "goal 3", isChecked: false },
    { id: "4", goal: "goal 4", isChecked: false },
    { id: "5", goal: "goal 5", isChecked: false },
  ]);

  const handleCheckBoxToggle = (id: string) => {
    setGoals(prevGoals =>
      prevGoals.map(goal =>
        goal.id === id ? { ...goal, isChecked: !goal.isChecked } : goal
      )
    );
  };

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const renderGoalItem = ({ item }: { item: { id: string; goal: string; isChecked: boolean } }) => (
    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
      <TouchableOpacity onPress={() => handleCheckBoxToggle(item.id)}>
        <Text style={{ fontSize: 20, marginRight: 10 }}>
          {item.isChecked ? "✔️" : "⭕"}
        </Text>
      </TouchableOpacity>
      <Text>{item.goal}</Text>
    </View>
  );

  const renderItem = ({ item }: { item: string }) => (
    <View style={{ flexDirection: "row", marginBottom: 10 }}>
      <Text style={{ marginRight: 200, textDecorationLine: 'underline' }}>{item}</Text>
      <Text>Icon</Text>
    </View>
  );

  // Define your sections in the FlatList data
  const sections = [
    { id: "tabs", type: "tabs" },
    { id: "content", type: "content" },
    { id: "goals", type: "goals" },
  ];

  return (
    <FlatList
      data={sections}
      renderItem={({ item }) => {
        if (item.type === "tabs") {
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
            </Box>
          );
        }

        if (item.type === "content") {
          return (
            <Box className="py-5 flex items-center justify-center">
              <Text className="text-lg font-semibold">{activeTab.content}</Text>
            </Box>
          );
        }

        if (item.type === "goals") {
          return (
            <Box
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 10,
                marginTop: 10,
                borderRadius: 8,
                width: "90%", // Adjust width as needed
                alignSelf: "center", // Centers the box
                justifyContent: "center", // Centers the content vertically
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Goals</Text>
              <FlatList
                data={goals}
                renderItem={renderGoalItem}
                keyExtractor={(item) => item.id}
              />
            </Box>
          );
        }

        return null;
      }}
      keyExtractor={(item) => item.id}
      // Prevent nested FlatList/VirtualizedList rendering by wrapping all content in one FlatList
      ListFooterComponent={<View />}
    />
  );
};

export default HomestayInformationFold;
