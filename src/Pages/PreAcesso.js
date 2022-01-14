import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";

import { primary } from "../utils/Style";

// import { Container } from './styles';

export default (props) => {
	return (
		<View style={style.fundo}>
			<View style={style.titulo}>
				<Text>{"\n"}</Text>
				<Text>SISTEMA DE LANÇAMENTO ABEPOM</Text>
				<Text>{"\n"}</Text>
				<Text>Seu convenio e do tipo FARMACIA?</Text>
				<View style={style.areaBtn}>
					<TouchableOpacity
						onPress={() => {
							props.navigation.reset({
								index: 0,
								routes: [{ name: "AcessoFarmacia" }],
							});
							props.navigation.navigate("AcessoFarmacia");
						}}>
						<Text>SIM</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							props.navigation.reset({
								index: 0,
								routes: [{ name: "AcessoConvenio" }],
							});
							props.navigation.navigate("AcessoConvenio");
						}}>
						<Text>NÃO</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
};

const style = StyleSheet.create({
	titulo: {
		alignItems: "center",
		marginTop: "50%",
		backgroundColor: "white",
		margin: 15,

		borderRadius: 5,
		height: 200,
	},
	fundo: {
		backgroundColor: primary,
		height: "100%",
	},
	areaBtn: {
		flexDirection: "row",
		position: "absolute",
		bottom: 0,
		width: "100%",
		borderBottomEndRadius: 5,
		borderBottomStartRadius: 5,
		justifyContent: "space-around",
		paddingVertical: 10,
	},
});
