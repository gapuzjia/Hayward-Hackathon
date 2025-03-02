import React, { useEffect } from "react";
import { StatusBar, Platform } from "react-native";
import { Box } from "../components/ui";
import MobileBottomTabs from "./MobileBottomTabs";
import {
  Home,
  MessageCircle,
  User,
  Folder,
  MapPin,
} from "lucide-react-native";
import MobileProfilePage from "./Profile";
import Explorepage from "./ExplorePage";
import Resources from "./Resources";
import ChatBotScreen from "./ChatBotScreen";
import Map from "./Map";

const bottomTabs = [
  { icon: Home, label: "Home" },
  { icon: MapPin, label: "Map" },
  { icon: MessageCircle, label: "Chat Bot" },
  { icon: Folder, label: "Resources" },
  { icon: User, label: "Profile" },
];

const HomestayPage = () => {
  useEffect(() => {
    if (Platform.OS === "web") {
      document.body.style.overflow = "hidden";
      document.body.style.height = "100%";
    }
  }, []);

  const [activeTab, setActiveTab] = React.useState("Home");

  return (
    <>
      <Box className="flex-1">
        <StatusBar />

        <Box className="flex-1">
          {activeTab === "Profile" && <MobileProfilePage />}
          {activeTab === "Resources" && <Resources />}
          {activeTab === "Chat Bot" && <ChatBotScreen />}
          {activeTab === "Map" && <Map />}
          {activeTab === "Home" && <Explorepage setActiveTab={setActiveTab} activeTab={activeTab} />}
        </Box>

        {/* ✅ Bottom Tabs with Custom Icon Color */}
        <Box className="h-[72px] items-center w-full flex md:hidden border-t border-outline-50">
          <MobileBottomTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            bottomTabs={bottomTabs}
            iconColor="#2c6e46" // ✅ Set icon color to #2c6e46
          />
        </Box>

      </Box>
    </>
  );
};

export default HomestayPage;
