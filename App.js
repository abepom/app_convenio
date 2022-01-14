import "react-native-gesture-handler";
import * as React from "react";
import Routes from "./src/Routes.app";
import RoutesLogin from "./src/Routes.login";
import { StorePrivider } from "./src/Data/store";
import { StatusBar } from "react-native";
import { primary } from "./src/utils/Style";

export default function App() {
	return (
		<StorePrivider>
			<StatusBar backgroundColor={primary} barStyle="light-content" />
			<RoutesLogin />
		</StorePrivider>
	);
}
