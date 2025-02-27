import React, { useContext } from "react";
import {
  Box,
  HStack,
  Input,
  InputField,
  InputIcon,
  InputSlot,
  SearchIcon,
} from "../components/ui";
import HomestayInformationFold from "./main-content/HomestayInformationFold";
import { ScrollView } from "react-native";
import { ThemeContext } from "@/App";

const Explorepage = ({ activeTab, setActiveTab }: any) => {
  const { colorMode } = useContext(ThemeContext);
  return (
    <>
      {/*this is the search bar ---------------------*/}
      <Box className={`w-full ${activeTab != "Profile" ? "flex" : "hidden"}`}>
      <Box className="pt-4 pb-0 px-5 md:hidden w-full">
          <Input variant="rounded" size="sm" className="w-full h-10">
            <InputField placeholder="herro" />
            <InputSlot className="bg-primary-500 rounded-full h-6 w-6 m-1.5">
              <InputIcon
                as={SearchIcon}
                color={colorMode === "light" ? "#FEFEFF" : "#171717"}
              />
            </InputSlot>
          </Input>
        </Box>
      </Box>
      {/* end of search bar --------------------------*/}

      {/* mobile */}
      <ScrollView
        className="h-[1px] md:hidden"
      >
        <Box
          className={`${activeTab !== "Profile" ? "flex" : "hidden"} md:hidden`}
        >
          {/* go to to the HomestayInformationFold file to edit the contents ----------------------*/}
          <HomestayInformationFold />
        </Box>
      </ScrollView>
    </>
  );
};

export default Explorepage;
