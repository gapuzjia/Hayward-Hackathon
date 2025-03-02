import React, { useState } from "react";
import { View, Text, TextInput, Button, ScrollView, Image, ActivityIndicator, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker"; // ✅ Import image picker
import { Box } from "../components/ui";
import { OPENAI_API_KEY } from "@env";

const ChatbotScreen = () => {
  const [messages, setMessages] = useState<{ role: string; content?: string; imageUri?: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState<"recycle" | "diy">("recycle"); // ✅ Default to Recycle Mode

  // ✅ Function to pick an image from the gallery
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true, // ✅ Converts image to base64 for OpenAI API
    });

    if (!result.canceled) {
      const selectedImage = result.assets?.[0]?.base64 || "";

      if (!selectedImage) {
        alert("Failed to retrieve image data. Please try again.");
        return;
      }

      // ✅ Show the image in chat
      const userMessage = { role: "user", imageUri: result.assets[0].uri };
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      // ✅ Send image to OpenAI API based on the selected mode
      analyzeImage(selectedImage);
    }
  };

  // ✅ Function to send image to OpenAI for analysis
  const analyzeImage = async (base64Image: string) => {
    if (!base64Image) {
      alert("Invalid image data. Please try again.");
      return;
    }

    setLoading(true);

    // ✅ Set AI prompt based on user selection (Recycle or DIY)
    const prompt = selectedMode === "recycle"
      ? "Does this image contain a recyclable object? If yes, provide a **short and simple guide** on how to recycle it."
      : "Does this image contain an object that can be repurposed for a DIY project? If yes, suggest a **simple DIY idea** using it.";

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4-turbo",
          messages: [
            { 
              role: "system", 
              content: `You are an AI that helps users determine if an object is recyclable OR can be used for a DIY project. Based on the user's selection, provide **short, beginner-friendly** instructions.`
            },
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
                { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } },
              ],
            },
          ],
          max_tokens: 100, // ✅ Limits response length for conciseness
        }),
      });

      const data = await response.json();
      console.log("OpenAI Response:", data);

      if (!response.ok) {
        throw new Error(data.error?.message || `API Error: ${response.status}`);
      }

      // ✅ Extract AI response
      const botMessage = {
        role: "assistant",
        content: data.choices?.[0]?.message?.content?.trim() || "I couldn't determine a response. Try another image.",
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]); // ✅ Keep all messages
    } catch (error) {
      console.error("Error analyzing image:", error);
      alert("Error analyzing image. Please try again.");
    }
    setLoading(false);
  };

  // ✅ Function to send text messages
  const sendMessage = async () => {
    if (!input.trim()) return; // ✅ Prevent empty messages

    const userMessage = { role: "user", content: input.trim() || " " }; // ✅ Ensure content is always valid
    setMessages((prevMessages) => [...prevMessages, userMessage]); // ✅ Keep all messages
    setInput("");
    setLoading(true);

    // ✅ Set AI prompt based on user selection (Recycle or DIY)
    const prompt = selectedMode === "recycle"
      ? "Give a **short and simple guide** on how to recycle this."
      : "Give a **short and easy DIY project idea** using this.";

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4-turbo",
          messages: [
            ...messages.filter((msg) => msg.content && msg.content.trim()), // ✅ Remove invalid messages
            { role: "user", content: `${input}. ${prompt}` }
          ],
          max_tokens: 100,
        }),
      });

      const data = await response.json();
      console.log("OpenAI Response:", data);

      if (!response.ok) {
        throw new Error(data.error?.message || `API Error: ${response.status}`);
      }

      // ✅ Save AI response in chat
      const botMessage = {
        role: "assistant",
        content: data.choices?.[0]?.message?.content?.trim() || "No response from AI.",
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]); // ✅ Keep all messages
    } catch (error) {
      console.error("Caught Error:", error);
      alert("Error communicating with OpenAI. Please try again.");
    }

    setLoading(false);
  };

  return (
    <Box className="flex-1 p-4">
      <ScrollView className="flex-1 mb-4">
        {messages.map((msg, index) => (
          <View key={index} style={{ alignSelf: msg.role === "user" ? "flex-end" : "flex-start", marginBottom: 10 }}>
            {msg.content && (
              <Text style={{ fontWeight: msg.role === "user" ? "bold" : "normal", color: msg.role === "user" ? "blue" : "black" }}>
                {msg.content}
              </Text>
            )}
            {msg.imageUri && (
              <Image source={{ uri: msg.imageUri }} style={{ width: 200, height: 200, borderRadius: 10, marginTop: 5 }} />
            )}
          </View>
        ))}
      </ScrollView>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {/* ✅ Choice Buttons (Recycle vs DIY) */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
        <TouchableOpacity onPress={() => setSelectedMode("recycle")} style={{ padding: 10, backgroundColor: selectedMode === "recycle" ? "blue" : "gray", borderRadius: 5 }}>
          <Text style={{ color: "white" }}>♻️ Recycle</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedMode("diy")} style={{ padding: 10, backgroundColor: selectedMode === "diy" ? "blue" : "gray", borderRadius: 5 }}>
          <Text style={{ color: "white" }}>🛠️ DIY</Text>
        </TouchableOpacity>
      </View>

      <TextInput placeholder="Enter an item or upload an image..." value={input} onChangeText={setInput} style={{ borderWidth: 1, padding: 10, borderRadius: 5, marginBottom: 10 }} />
      <Button title="Send" onPress={sendMessage} disabled={loading} />
      <Button title="Upload Image" onPress={pickImage} disabled={loading} />
    </Box>
  );
};

export default ChatbotScreen;
