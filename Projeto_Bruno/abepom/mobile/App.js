import React from "react";
import Routes from "./src/routes";
import { Provider as PaperProvider } from "react-native-paper";
import { tema } from "./assets/stylesheet/Style";

export default function App() {
	return (
		<PaperProvider theme={tema}>
			<Routes />
		</PaperProvider>
	);
}
