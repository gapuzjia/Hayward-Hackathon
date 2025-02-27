import React, { useState } from "react";
import { View, Text, TextInput, Button, ScrollView, ActivityIndicator } from "react-native";
import { Box } from "../components/ui";
import Constants from "expo-constants";
import { OPENAI_API_KEY } from "@env";

console.log("Loaded OpenAI API Key:", OPENAI_API_KEY); // ✅ Debugging


const ChatbotScreen = () => {
    console.log("Chatbot Screen Rendered");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
  
    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);
  
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`, // ✅ Uses env variable
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [...messages, userMessage], // ✅ Correct formatting
          max_tokens: 100,
        }),
      });
  
      const data = await response.json();
      console.log("OpenAI Response:", data); // ✅ Debugging
  
      if (!response.ok) {
        throw new Error(data.error?.message || `API Error: ${response.status}`);
      }
  
      const botMessage = {
        role: "assistant",
        content: data.choices?.[0]?.message?.content?.trim() || "No response from AI.",
      };
  
      setMessages([...messages, userMessage, botMessage]);
    } catch (error) {
      console.error("Caught Error:", error);
  
      let errorMessage = "An unexpected error occurred.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if (typeof error === "object" && error !== null) {
        errorMessage = JSON.stringify(error);
      }
  
      alert("Error communicating with OpenAI:\n" + errorMessage);
    }
  
    setLoading(false);
  };
  

  return (
    
    <Box className="flex-1 p-4">
      <ScrollView className="flex-1 mb-4">
        {messages.map((msg, index) => (
          <View key={index} style={{ alignSelf: msg.role === "user" ? "flex-end" : "flex-start", marginBottom: 10 }}>
            <Text style={{ fontWeight: msg.role === "user" ? "bold" : "normal", color: msg.role === "user" ? "blue" : "black" }}>
              {msg.content}
            </Text>
          </View>
        ))}
      </ScrollView>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      <TextInput
        placeholder="Ask me anything..."
        value={input}
        onChangeText={setInput}
        style={{ borderWidth: 1, borderColor: "gray", padding: 10, borderRadius: 5, marginBottom: 10 }}
      />
      <Button title="Send" onPress={sendMessage} disabled={loading} />
    </Box>
  );
};

export default ChatbotScreen;
