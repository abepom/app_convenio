/* https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from "react";
import { StatusBar, View, Text } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import Routes from "./src/Routes";
import { primary } from "./src/utils/Style";
import { StorePrivider } from "./src/Data/store";
const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <>
      <StorePrivider>
        <View style={{ flex: 1 }}>
          <StatusBar backgroundColor={primary} barStyle="light-content" />
          <Routes />
        </View>
      </StorePrivider>
    </>
  );
};

export default App;