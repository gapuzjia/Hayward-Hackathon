import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator 
} from "react-native";
import * as ImagePicker from "expo-image-picker"; // ✅ Image Picker Import
import { Box } from "../components/ui";
import { OPENAI_API_KEY } from "@env";
import { ArrowUp, Camera } from "lucide-react-native"; // ✅ Import Icons

const ChatbotScreen = () => {
  const [messages, setMessages] = useState<{ role: string; content?: string; imageUri?: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState<"recycle" | "diy" | null>(null);

  // ✅ Handle Mode Selection
  const handleModeSelection = (mode: "recycle" | "diy") => {
    setSelectedMode(mode);
  };

  // ✅ Handle Image Selection
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
    });

    if (!result.canceled) {
      const selectedImage = result.assets?.[0]?.base64 || "";
      if (!selectedImage) {
        alert("Failed to retrieve image. Please try again.");
        return;
      }

      // ✅ Show image in chat
      const userMessage = { role: "user", imageUri: result.assets[0].uri };
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      analyzeImage(selectedImage);
    }
  };

  // ✅ Analyze Image with OpenAI
  const analyzeImage = async (base64Image: string) => {
    if (!base64Image || !selectedMode) {
      alert("Please select Recycle or DIY before sending.");
      return;
    }

    setLoading(true);
    const prompt = selectedMode === "recycle"
      ? "Does this image contain a recyclable object? Provide a **short and simple guide** on how to recycle it."
      : "Does this image contain an object that can be used for DIY? Suggest a **simple DIY idea** using it.";

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
              content: `You are an AI that helps users determine if an object is recyclable OR can be used for a DIY project. Provide **short, beginner-friendly** instructions.`,
            },
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
                { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } },
              ],
            },
          ],
          max_tokens: 100,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || `API Error: ${response.status}`);

      // ✅ Extract AI response
      const botMessage = {
        role: "assistant",
        content: data.choices?.[0]?.message?.content?.trim() || "I couldn't determine a response. Try another image.",
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      alert("Error analyzing image. Please try again.");
      console.error("Error:", error);
    }
    setLoading(false);
  };

  // ✅ Handle Text Message
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input.trim() };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setLoading(true);

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
            ...messages.filter((msg) => msg.content && msg.content.trim()),
            { role: "user", content: `${input}. ${prompt}` }
          ],
          max_tokens: 100,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || `API Error: ${response.status}`);

      const botMessage = {
        role: "assistant",
        content: data.choices?.[0]?.message?.content?.trim() || "No response from AI.",
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      alert("Error communicating with OpenAI. Please try again.");
      console.error("Error:", error);
    }
    setLoading(false);
  };

  return (
    <Box className="flex-1 p-4">
      {/* ✅ Mode Selection Screen */}
      {selectedMode === null ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>Select an Option</Text>

          <TouchableOpacity onPress={() => handleModeSelection("recycle")} style={{ width: 250, height: 100, backgroundColor: "#2c6e46", justifyContent: "center", alignItems: "center", borderRadius: 15, marginBottom: 15 }}>
            <Text style={{ fontSize: 24, color: "white", fontWeight: "bold" }}>♻️ Recycle</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleModeSelection("diy")} style={{ width: 250, height: 100, backgroundColor: "#2c6e46", justifyContent: "center", alignItems: "center", borderRadius: 15 }}>
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

          {/* ✅ Input Box with Send Icon */}
          <View style={{ flexDirection: "row", alignItems: "center", borderWidth: 1, borderRadius: 30, height: 60, paddingHorizontal: 20, backgroundColor: "white", borderColor: "#ccc", marginBottom: 10 }}>
            <TextInput placeholder={selectedMode === "recycle" ? "Hi! What would you like to recycle today?" : "Hi! What item do you want to repurpose?"} value={input} onChangeText={setInput} style={{ flex: 1, fontSize: 14, textAlignVertical: "center" }} multiline={false} />
            <TouchableOpacity onPress={sendMessage} disabled={loading || !input.trim()} style={{ marginLeft: 10 }}>
              <ArrowUp size={26} color={input.trim() ? "#2c6e46" : "#ccc"} />
            </TouchableOpacity>
          </View>

          {/* ✅ Upload Image Button */}
          <TouchableOpacity onPress={pickImage} style={{ backgroundColor: "#e0e0e0", padding: 10, alignItems: "center", borderRadius: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>📷 Upload Image</Text>
          </TouchableOpacity>
        </>
      )}
    </Box>
  );
};

export default ChatbotScreen;
