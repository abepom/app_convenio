import React, { useEffect } from "react";

import { View, Image } from "react-native";
import logo from "../../assets/img/logo_guia_online.png";

import { primary } from "../utils/Style";
import { useStore } from "../Data/store";

const Load = ({ navigation }) => {
  const [, setStore] = useStore();

  useEffect(() => {
    _retrieveData();
  }, []);

  const _retrieveData = () => {
    setStore({ carregouDados: false });
    navigation.navigate("inicio");
  };
  return (
    <View
      style={{
        backgroundColor: primary,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image source={logo} />
    </View>
  );
};

export default Load;
