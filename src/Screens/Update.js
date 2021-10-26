import React, { useEffect, useState } from "react";
import { Animated, Text, View, Easing } from "react-native";
import { background, primary } from "../utils/Style";
import StatusBar from "../components/StatusBar";
import Carregando from "../components/Carregando";
import * as Updates from "expo-updates";
import Constants from "expo-constants";

const Update = (props) => {
	const [atualizando, setAtualizando] = useState("Verificando atualização");
	const [novaAtualizacao, setNovaAtualizacao] = useState(false);
	const [description, setDescription] = useState("");

	const { navigation } = props;
	const [load] = useState(new Animated.Value(0));
	let tempo;
	let carregando = load.interpolate({
		inputRange: [0, 1, 2],
		outputRange: ["0%", "80%", "100%"],
	});
	async function updateApp() {
		if (Constants.isDevice) {
			const { isAvailable, manifest } = await Updates.checkForUpdateAsync();
			if (isAvailable) {
				setNovaAtualizacao(manifest.version);
				setAtualizando("Baixando atualização");
				setDescription(manifest.description);
				await Updates.fetchUpdateAsync();

				Animated.sequence([
					Animated.timing(load, {
						toValue: 1,
						duration: 500,
						useNativeDriver: false,
					}),
					Animated.timing(load, {
						toValue: 2,
						duration: 2500,
						useNativeDriver: false,
					}),
				]).start();
				setTimeout(async () => {
					await Updates.reloadAsync();
				}, 3000);
			} else {
				Animated.timing(load, {
					toValue: 2,
					duration: 1000,
					useNativeDriver: false,
				}).start();
				setTimeout(() => {
					navigation.navigate("Load");
				}, 3000);
			}
		} else {
			Animated.timing(load, {
				toValue: 2,
				duration: 1000,
				useNativeDriver: false,
			}).start();

			setTimeout(async () => {
				navigation.navigate("Load");
			}, 1000);
		}
	}
	let teste;
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
			<View style={{ width: "80%", backgroundColor: "red" }}>
				<Animated.View
					style={{
						borderRadius: 15,

						borderColor: primary,
						borderWidth: 1,
						position: "absolute",
						width: "100%",
						height: 20,
						zIndex: 10,
					}}></Animated.View>
				<Animated.View
					style={{
						borderRadius: 15,
						backgroundColor: primary,
						position: "absolute",
						width: carregando,
						height: 20,
						zIndex: 11,
					}}></Animated.View>
				<Animated.View></Animated.View>
			</View>
			{novaAtualizacao && (
				<Text
					style={{
						color: primary,
						fontSize: 16,
						fontWeight: "bold",
						padding: "5%",
					}}>
					{description}
				</Text>
			)}
		</Animated.View>
	);
};

export default Update;
