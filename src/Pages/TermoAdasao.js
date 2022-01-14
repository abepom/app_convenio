import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	StatusBar,
	Image,
	TouchableOpacity,
	StyleSheet,
} from "react-native";

import { WebView } from "react-native-webview";
import Icone from "@expo/vector-icons/MaterialCommunityIcons";

import styless, { primary } from "./../utils/Style";
import imagens from "../utils/imagens";
import api from "./../api";
import Carregando from "../Components/Carregando";

export default function TermoAdasao(props) {
	const [termo, setTermo] = useState(false);
	useEffect(() => {
		api.get("/termoAdesao", null).then(({ data }) => {
			setTermo(data);
		});
	}, []);
	return (
		<View style={{ flex: 1, backgroundColor: "#f1f1f1" }}>
			<StatusBar backgroundColor={primary} barStyle="light-content" />
			<View style={styles.container}>
				<TouchableOpacity
					style={styles.menu}
					onPress={() => props.navigation.toggleDrawer()}>
					<Icone style={styles.configItem} name={"menu"} size={28} />
				</TouchableOpacity>
				<Image
					source={imagens.abepom}
					style={{ width: 40, height: 40, marginHorizontal: 10 }}
				/>
				<Text style={[styless.textoG, styless.white]}>Termo de utilização</Text>
			</View>
			{termo ? (
				<WebView
					source={{
						html: termo.T_descricao,
					}}
					textZoom={250}
					style={{ height: "100%", borderRadius: 5, margin: 10 }}
				/>
			) : (
				<Carregando />
			)}
			<View style={{ flexDirection: "row", justifyContent: "space-around" }}>
				<Text>Nº Termo: {termo.T_id_termo}</Text>
				<Text>Data da leitura: {termo.ACTU_data_leitura_termo}</Text>
			</View>
		</View>
	);
}
const styles = StyleSheet.create({
	container: {
		height: 50,
		backgroundColor: primary,
		flexDirection: "row",
		paddingHorizontal: 10,
		justifyContent: "center",
		alignItems: "center",
	},
	menu: {
		position: "absolute",
		left: 20,
	},
	menuItem: {
		color: "white",
	},
	config: {
		position: "absolute",
		right: 20,
	},
	configItem: {
		color: "white",
	},
});
