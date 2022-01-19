import "react-native-gesture-handler";
import * as React from "react";
import RoutesLogin from "./src/Routes.login";
import { StorePrivider } from "./src/Data/store";
import { StatusBar, View, Platform } from "react-native";
import Constants from "expo-constants";
import { primary } from "./src/utils/Style";

export default function App() {
	return (
		<StorePrivider>
			<StatusBar backgroundColor={primary} barStyle="light-content" />
			{Platform.OS == "ios" && (
				<View
					style={{
						height: Constants.statusBarHeight,
						backgroundColor: primary,
					}}
				/>
			)}
			<RoutesLogin />
		</StorePrivider>
	);
}
