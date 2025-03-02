import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "./App"; // ✅ Import navigation types

// ✅ Define navigation prop type
type NavigationProp = StackNavigationProp<RootStackParamList, "ResourcesDetails">;

const ResourcesDetails = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>This is Resources Details</Text>

      {/* ✅ Button to go back */}
      <Button
        title="Go Back to Resources"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default ResourcesDetails;
