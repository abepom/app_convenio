/* https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from "react";
import { StatusBar, View, Text, Platform } from "react-native";
import Routes from "./src/Routes";
import { primary } from "./src/utils/Style";
import { StorePrivider } from "./src/Data/store";
import Constants from "expo-constants";
import Updates from "expo-updates";

//Teste
const App = () => {
	useEffect(() => {
		if (Platform.OS != "web") {
			async function updateApp() {
				const { isAvailable } = await Updates.checkForUpdateAsync();
				if (isAvailable) {
					await Updates.fetchUpdateAsync();
					await Updates.reloadAsync(); // depende da sua estratégia
				}
			}
			updateApp();
		}
	}, []);
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
