import React from "react";
import { View, Text, Image } from "react-native";

import imagens from "../utils/imagens";
import { TouchableOpacity } from "react-native-gesture-handler";

export default (props) => {
	const { type } = props;
	let backgroundColor;
	let color;

	switch (type) {
		case "sucess":
			backgroundColor = "#42834f";
			color = "white";
			break;
		case "danger":
			backgroundColor = "#b43938";
			color = "white";
			break;
		case "warning":
			backgroundColor = "#660";

			color = "white";
			break;
		case "info":
			break;

		default:
			backgroundColor = "#fff";
			color = "#000";
			break;
	}

	return (
		<View
			style={{
				backgroundColor: backgroundColor,
				width: "100%",
				alignItems: "center",
				justifyContent: "center",
				padding: 5,
				borderWidth: 2,
				borderRadius: 5,
				borderColor: color,
				padding: 10,
			}}>
			{props.fechar && (
				<View style={{ width: "100%", alignItems: "flex-end" }}>
					<TouchableOpacity onPress={() => props.fechar()}>
						<Image source={imagens.close} style={{ width: 20, height: 20 }} />
					</TouchableOpacity>
				</View>
			)}
			{props.title && (
				<Text style={{ color: color, fontSize: 12, marginTop: -20 }}>
					ATEÇÃO
				</Text>
			)}
			<Text style={{ color: color, fontSize: 12 }}>{props.mensagem}</Text>
		</View>
	);
};
