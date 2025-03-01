import React from "react";
import { View, Text } from "react-native";
import NewThisWeekFold from "./main-content/NewThisWeekFold";

const Resources = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>this is Resources Screen</Text>
      <NewThisWeekFold />
    </View>
  );
};

export default Resources;