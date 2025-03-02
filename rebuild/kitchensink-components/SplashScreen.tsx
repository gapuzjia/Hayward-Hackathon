import React, { useEffect } from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window"); // ✅ Get screen dimensions

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  useEffect(() => {
    setTimeout(() => {
      onFinish(); // ✅ Move to main app after 2.5 seconds
    }, 2500);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require("../assets/splash.png")} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff", // ✅ Match image background
  },
  image: {
    width: width, // ✅ Full width
    height: height, // ✅ Full height
    resizeMode: "cover", // ✅ Ensure image fills the screen
  },
});

export default SplashScreen;
