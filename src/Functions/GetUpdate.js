import { Platform, Alert } from "react-native";
import Constants from "expo-constants";
import * as Updates from "expo-updates";

export default () => {
	console.log("opa");
	if (Constants.isDevice && Platform.OS != "web") {
		Updates.checkForUpdateAsync().then(({ isAvailable }) => {
			if (isAvailable) {
				Updates.fetchUpdateAsync();
				Alert.alert(
					"ATUALIZAÇÃO",
					"O aplicativo ABEPOM Convênios foi atualizado com sucesso, estamos reiniciando o aplicativo.",
					[
						{
							text: "CONFIRMAR",
							onPress: () => Updates.reloadAsync(),
						},
						{
							text: "MANTER ABERTO",
						},
					]
				);
			}
		});
	}
};
