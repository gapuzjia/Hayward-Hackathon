import React, { useEffect } from "react";
import { StatusBar, Platform, View, FlatList, TouchableOpacity } from "react-native";
import { Box, HStack, Pressable, Text } from "../../components/ui";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

// Define valid routes
type RootStackParamList = {
  Home: undefined;
  RewardsScreen: undefined;
};

const tabs = [
  { title: "Home", content: "" }, // Removed the content text here
  { title: "Rewards", content: "Rewards Page Loading..." },
];

const HomestayInformationFold = () => {
  const [activeTab, setActiveTab] = React.useState(tabs[0]);
  const [goals, setGoals] = React.useState([
    { id: "1", goal: "goal 1", isChecked: false, points: 10 },
    { id: "2", goal: "goal 2", isChecked: false, points: 20 },
    { id: "3", goal: "goal 3", isChecked: false, points: 15 },
    { id: "4", goal: "goal 4", isChecked: false, points: 30 },
    { id: "5", goal: "goal 5", isChecked: false, points: 25 },
  ]);

  const [totalPoints, setTotalPoints] = React.useState(0);

  const handleCheckBoxToggle = (id: string) => {
    setGoals((prevGoals) => {
      const updatedGoals = prevGoals.map((goal) => {
        if (goal.id === id) {
          goal.isChecked = !goal.isChecked;
          if (goal.isChecked) {
            setTotalPoints((prevTotal) => prevTotal + goal.points);
          } else {
            setTotalPoints((prevTotal) => prevTotal - goal.points);
          }
        }
        return goal;
      });
      return updatedGoals;
    });
  };

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const renderGoalItem = ({ item }: { item: { id: string; goal: string; isChecked: boolean; points: number } }) => (
    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
      <TouchableOpacity onPress={() => handleCheckBoxToggle(item.id)}>
        <Text style={{ fontSize: 20, marginRight: 10 }}>
          {item.isChecked ? "✔️" : "🟢"} {/* Green circle instead of red */}
        </Text>
      </TouchableOpacity>
      <Text>{item.goal}</Text>
    </View>
  );

  return (
    <Box className="pb-8 px-4 md:px-0">
      {/* Tabs - Full Width */}
      <Box className="border-b border-outline-50">
        <HStack className="flex-row justify-between w-full">
          {tabs.map((tab) => (
            <Pressable
              key={tab.title}
              onPress={() => {
                if (tab.title === "Rewards") {
                  navigation.navigate("RewardsScreen");
                } else {
                  setActiveTab(tab);
                }
              }}
              style={{
                flex: 1, // Ensures equal width for each tab
                paddingVertical: 15,
                alignItems: "center",
                borderBottomWidth: activeTab.title === tab.title ? 3 : 0, // ✅ Active tab indicator
                borderBottomColor: activeTab.title === tab.title ? "#2c6e46" : "transparent", // ✅ Blue highlight
              }}
            >
              <Text
                size="sm"
                className={`${
                  activeTab.title === tab.title ? "text-typography-900 font-bold" : "text-typography-600"
                }`}
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

        {/* Goal Table */}
        <Box
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 10,
            marginTop: 10,
            borderRadius: 8,
            width: "90%",
            alignSelf: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Goals</Text>
          <FlatList
            data={goals}
            renderItem={renderGoalItem}
            keyExtractor={(item) => item.id}
          />
        </Box>

        {/* Point Accumulator */}
        <Box style={{ marginTop: 20, alignItems: "center" }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Total Points: {totalPoints}</Text>
        </Box>
      </Box>
    </Box>
  );
};

export default HomestayInformationFold;
