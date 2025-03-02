import React, { useState } from "react";
import { View, Text, TextInput, Button, ScrollView, Image, ActivityIndicator, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker"; // ✅ Import image picker
import { Box } from "../components/ui";
import { OPENAI_API_KEY } from "@env";

const ChatbotScreen = () => {
  const [messages, setMessages] = useState<{ role: string; content?: string; imageUri?: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState<"recycle" | "diy" | null>(null); // ✅ Default to no selection

  // ✅ Function to handle mode selection
  const handleModeSelection = (mode: "recycle" | "diy") => {
    setSelectedMode(mode); // ✅ Save user selection
  };

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

  // ✅ Function to analyze an image (For Image Input)
  const analyzeImage = async (base64Image: string) => {
    if (!base64Image || !selectedMode) {
      alert("Please select Recycle or DIY before sending.");
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

  // ✅ Function to handle sending text input (For Text Messages)
  const sendMessage = async () => {
    if (!input.trim()) return; // ✅ Prevent empty messages

    const userMessage = { role: "user", content: input.trim() };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
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

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Caught Error:", error);
      alert("Error communicating with OpenAI. Please try again.");
    }

    setLoading(false);
  };

  return (
    <Box className="flex-1 p-4">
      {/* ✅ Centered Mode Selection (Appears First) */}
      {selectedMode === null ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>Select an Option</Text>

          <TouchableOpacity onPress={() => handleModeSelection("recycle")} style={{ width: 250, height: 100, backgroundColor: "green", justifyContent: "center", alignItems: "center", borderRadius: 15, marginBottom: 15 }}>
            <Text style={{ fontSize: 24, color: "white", fontWeight: "bold" }}>♻️ Recycle</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleModeSelection("diy")} style={{ width: 250, height: 100, backgroundColor: "blue", justifyContent: "center", alignItems: "center", borderRadius: 15 }}>
            <Text style={{ fontSize: 24, color: "white", fontWeight: "bold" }}>🛠️ DIY</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView className="flex-1 mb-4">
            {messages.map((msg, index) => (
              <View key={index} style={{ alignSelf: msg.role === "user" ? "flex-end" : "flex-start", marginBottom: 10 }}>
                {msg.content && <Text style={{ fontWeight: "bold", color: msg.role === "user" ? "blue" : "black" }}>{msg.content}</Text>}
                {msg.imageUri && <Image source={{ uri: msg.imageUri }} style={{ width: 200, height: 200, borderRadius: 10, marginTop: 5 }} />}
              </View>
            ))}
          </ScrollView>

          <TextInput 
            placeholder={selectedMode === "recycle" ? "Hi! What would you like to recycle today?" : "What item do you want to repurpose into something new?"} 
            value={input} 
            onChangeText={setInput} 
            style={{ borderWidth: 1, padding: 10, borderRadius: 5, minHeight: 50, maxHeight: 80, textAlignVertical: "top" }} 
            multiline={true} 
            numberOfLines={3} 
          />
          <Button title="Send" onPress={sendMessage} disabled={loading} />
          <Button title="Upload Image" onPress={pickImage} disabled={loading} />
        </>
      )}
    </Box>
  );
};

export default ChatbotScreen;
