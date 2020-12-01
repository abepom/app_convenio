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
import Constants from "expo-constants";

//Teste
const App = () => {
	return (
		<>
			<StorePrivider>
				<View style={{ flex: 1 }}>
					<StatusBar backgroundColor={primary} barStyle="light-content" />
					{Platform.OS == "ios" && (
						<View
							style={{
								height: Constants.statusBarHeight,
								backgroundColor: primary,
							}}
						/>
					)}

					<Routes />
				</View>
			</StorePrivider>
		</>
	);
};

export default App;
