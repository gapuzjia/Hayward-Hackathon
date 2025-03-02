import React from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";

const Resources = () => {
  return (
    <View style={styles.container}>
      {/* First box with local image background */}
      <View style={styles.shadowContainer}>
        <ImageBackground
          source={require("../assets/d848f8abf40fa7aafb32bf3246dd663e.jpg")}
          style={styles.box}
          imageStyle={{ borderRadius: 10 }}
          resizeMode="cover"
        >
          <View style={styles.overlay}>
            <Text style={styles.text}>Sustainability Learning</Text>
          </View>
        </ImageBackground>
      </View>

      {/* Second box with new image */}
      <View style={styles.shadowContainer}>
        <ImageBackground
          source={require("../assets/ccd5b003f0d075b1adec41aee65c517d.jpg")}
          style={styles.box}
          imageStyle={{ borderRadius: 10 }}
          resizeMode="cover"
        >
          <View style={styles.overlay}>
            <Text style={styles.text}>Eco Calculators</Text>
          </View>
        </ImageBackground>
      </View>

      {/* Third box with new image */}
      <View style={styles.shadowContainer}>
        <ImageBackground
          source={require("../assets/f174cc42c5b5044748737f513ce4b088.jpg")}
          style={styles.box}
          imageStyle={{ borderRadius: 10 }}
          resizeMode="cover"
        >
          <View style={styles.overlay}>
            <Text style={styles.text}>Databases</Text>
          </View>
        </ImageBackground>
      </View>

      {/* Fourth box with new image */}
      <View style={styles.shadowContainer}>
        <ImageBackground
          source={require("../assets/55d47a3e6a28f4670fa6629e661e9572.jpg")}
          style={styles.box}
          imageStyle={{ borderRadius: 10 }}
          resizeMode="cover"
        >
          <View style={styles.overlay}>
            <Text style={styles.text}>Join the Movement</Text>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingVertical: 20,
  },
  shadowContainer: {
    width: 300,
    height: 125,
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  box: {
    width: 300,
    height: 125,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  text: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
});

export default Resources;
