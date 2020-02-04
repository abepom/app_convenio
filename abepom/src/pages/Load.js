import React, { useEffect } from "react";
import { ImageBackground, AsyncStorage } from "react-native";
import StatusBar from "../components/StatusBar";

import bg from "../assets/img/drawable-port-hdpi-screen.png";

export default function Load({ navigation }) {
  useEffect(() => {
    _retrieveData();
  }, []);

  const _retrieveData = async () => {
    await AsyncStorage.getItem("usuario").then(user => {
      user ? navigation.navigate("drawer") : navigation.navigate("Login");
    });
  };
  return (
    <>
      <StatusBar backgroundColor="#1f4ba4" barStyle="light-content" />
      <ImageBackground source={bg} style={{ width: "100%", height: "100%" }} />
    </>
  );
}
