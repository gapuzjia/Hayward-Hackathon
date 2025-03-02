import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Resources = () => {
  return (
    <View style={styles.container}>
      <View style={[styles.box, { backgroundColor: "red" }]}>
        <Text style={styles.text}>Box 1</Text>
      </View>
      <View style={[styles.box, { backgroundColor: "blue" }]}>
        <Text style={styles.text}>Box 2</Text>
      </View>
      <View style={[styles.box, { backgroundColor: "green" }]}>
        <Text style={styles.text}>Box 3</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    width: 150,
    height: 100,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  text: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Resources;
