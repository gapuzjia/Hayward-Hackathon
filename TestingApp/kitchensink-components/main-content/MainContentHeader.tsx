import React, { useContext } from "react";
import {
  Box,
  Button,
  ButtonIcon,
  ButtonText,
  Heading,
  HStack,
} from "../../components/ui";
import { List } from "lucide-react-native";
import ListYourPlaceModal from "./ListYourPlaceModal";
import { ThemeContext } from "../../App";

const MainContentHeader = ({ setActiveTab, activeTab }: any) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const { colorMode } = useContext(ThemeContext);

  return (
    <Box className="px-4 md:px-0">
      <HStack className="w-full items-center justify-between">
        {/* Hidden for mobile screens */}
        <Button
          variant="outline"
          action="secondary"
          onPress={() => {
            setModalVisible(true);
          }}
          className="hidden md:flex ml-auto "
        >
          <ButtonIcon
            as={List}
            color={colorMode === "light" ? "#404040" : "#E5E5E5"}
          />
          <ButtonText className="pl-2 text-typography-800">
            List your place
          </ButtonText>
        </Button>
      </HStack>
      {modalVisible && (
        // list your place modal
        <ListYourPlaceModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
        />
      )}
    </Box>
  );
};

export default MainContentHeader;
