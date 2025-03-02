import React, { useContext } from "react";
import { HStack, Icon, Pressable, Text, VStack } from "../components/ui";
import ListYourPlaceModal from "./main-content/ListYourPlaceModal";
import MobileSidebarActionsheet from "./MobileSidebarActionsheet";
import { ThemeContext } from "@/App";

const MobileBottomTabs = ({ bottomTabs, activeTab, setActiveTab }: any) => {
  const { colorMode } = useContext(ThemeContext);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [actionsheetVisible, setActionsheetVisible] = React.useState(false);

  return (
    <>
      <HStack className="content-center absolute bottom-0 justify-between w-full py-3 px-6 md:hidden">
        {bottomTabs.map((tab: any) => {
          const isActive = activeTab === tab.label;
          return (
            <Pressable
              key={tab.label}
              onPress={() => {
                if (tab.label !== "Listing" && tab.label !== "Filter") {
                  setActiveTab(tab.label);
                }
              }}
              disabled={tab.disabled}
            >
              <VStack className="items-center">
                <Icon
                  as={tab.icon}
                  size="lg"
                  className="text-[#2c6e46]" // ✅ Only icon color changed
                />
                <Text size="xs" className={isActive ? "text-typography-900" : "text-typography-400"}>
                  {tab.label}
                </Text>
              </VStack>
            </Pressable>
          );
        })}
      </HStack>

      <ListYourPlaceModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />

      <MobileSidebarActionsheet
        actionsheetVisible={actionsheetVisible}
        setActionsheetVisible={setActionsheetVisible}
      />
    </>
  );
};

export default MobileBottomTabs;
