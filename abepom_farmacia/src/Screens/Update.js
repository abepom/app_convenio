import React, { useEffect, useState } from "react";
import { Easing, Animated, Text } from "react-native";
import { background, primary } from "../utils/Style";
import StatusBar from "../components/StatusBar";
import Carregando from "../components/Carregando";
import * as Updates from "expo-updates";
import json from "../../app.json";
import Constants from "expo-constants";
const Update = (props) => {
	const [atualizando, setAtualizando] = useState("Verificando atualização");
	const [novaAtualizacao, setNovaAtualizacao] = useState(false);
	const { navigation } = props;
	async function updateApp() {
		if (Constants.isDevice) {
			const { isAvailable, manifest } = await Updates.checkForUpdateAsync();

			if (isAvailable) {
				setNovaAtualizacao(manifest.version);
				setAtualizando("Baixando atualização");

				await Updates.fetchUpdateAsync();
				await Updates.reloadAsync();
			}
		}
		navigation.navigate("Load");
	}
	useEffect(() => {
		updateApp();
	}, []);

	return (
		<Animated.View
			style={{
				width: "100%",
				height: "100%",
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: background,
			}}>
			<StatusBar />
			<Carregando tamanho={150} />
			<Text style={{ color: primary, fontSize: 18, fontWeight: "bold" }}>
				{atualizando}
			</Text>
			{novaAtualizacao && (
				<>
					<Text style={{ color: primary, fontSize: 18, fontWeight: "bold" }}>
						Versão: {json.expo.version} para {novaAtualizacao}
					</Text>
					<Text style={{ color: primary, fontSize: 18, fontWeight: "bold" }}>
						Ao concluir a atualização iremos reiniciar o aplicativo
						automaticamente.
					</Text>
				</>
			)}
		</Animated.View>
	);
};

export default Update;
