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
