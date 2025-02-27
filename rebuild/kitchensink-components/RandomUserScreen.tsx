import React, { useState, useEffect } from "react";
import { View, Text, Image, ActivityIndicator, Button } from "react-native";
import { Box } from "../components/ui";

const RandomUserScreen = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch random user data
  const fetchRandomUser = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://randomuser.me/api/");
      const data = await response.json();
      setUser(data.results[0]);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRandomUser(); // Fetch user when component mounts
  }, []);

  return (
    <Box className="flex-1 items-center justify-center p-4">
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        user && (
          <View className="items-center">
            <Image
              source={{ uri: user.picture.large }}
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
            <Text className="text-lg font-bold mt-2">
              {user.name.first} {user.name.last}
            </Text>
            <Text className="text-gray-600">{user.email}</Text>
            <Button title="Get New User" onPress={fetchRandomUser} />
          </View>
        )
      )}
    </Box>
  );
};

export default RandomUserScreen;
