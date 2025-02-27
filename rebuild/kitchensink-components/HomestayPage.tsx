import React, { useEffect } from "react";
import { StatusBar, Platform } from "react-native";
import { Box } from "../components/ui";
import MobileBottomTabs from "./MobileBottomTabs";
import MobileModeChangeButton from "./MobileModeChangeButton";
import {
  Plus,
  Home,
  MessageCircle,
  User,
  SlidersHorizontal,
} from "lucide-react-native";
import MobileProfilePage from "./Profile";
import Explorepage from "./ExplorePage";
import Resources from "./Resources";
import ChatBotScreen from "./ChatBotScreen";
const bottomTabs = [
  {
    icon: Home,
    label: "Home",
  },
  {
    icon: SlidersHorizontal,
    label: "Resources",
  },
  {
    icon: MessageCircle,
    label: "Inbox",
    disabled: true,
  },
  {
    icon: User,
    label: "Profile",
  },
  { 
    icon: User, 
    label: "Chat Bot" 
  },
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
          {activeTab === "Home" && <Explorepage setActiveTab={setActiveTab} activeTab={activeTab} />}
        </Box>


        {/* go to MobileBottomTabs file to edit mobile bottom tabs ---------------------------*/}
        <Box className="h-[72px] items-center w-full flex md:hidden border-t border-outline-50">
          <MobileBottomTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            bottomTabs={bottomTabs}
          />
        </Box>
        {/* bottom tabs ends here---------------------- */}

      </Box>
      {/* )} */}
    </>
  );
};
export default HomestayPage;
