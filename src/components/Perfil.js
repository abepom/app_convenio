import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import {
	DrawerContentScrollView,
	DrawerItemList,
} from "@react-navigation/drawer";
import styles, { danger, primary } from "../utils/Style";
import useConvenio from "../Data/Convenio";
import imagens from "../utils/imagens";
import SelecionarAreasModal from "./Modal/SelecionarAreas.modal";
import { useStore } from "../Data/store";
import * as Updates from "expo-updates";


// import { Container } from './styles';

const Perfil = (props) => {
	const [convenio] = useConvenio();
	const [, setStore] = useStore();
	const [modalAreas, setModalAreas] = useState(false);

	return (
		<View style={style.drawer}>
			<SelecionarAreasModal
				visible={[modalAreas, setModalAreas]}
				areas={convenio.areas}
				props={props}
			/>
			<View style={{ flexDirection: "row", margin: 20 }}>
				<View style={{ marginHorizontal: 10 }}>
					{convenio.caminho_logomarca ? (
						<>
							<View style={{ elevation: 4, zIndex: 10 }}>
								<Image
									source={{ uri: convenio.caminho_logomarca }}
									style={[
										styles.logoPP,
										{ resizeMode: "contain", borderRadius: 200 },
									]}
								/>
							</View>
						</>
					) : (
						<View
							style={{
								borderWidth: 2,
								borderColor: primary,
								borderRadius: 50,
								padding: 10,
								elevation: 4,
								zIndex: 10,
							}}>
							<Image
								source={imagens.camera}
								style={[
									styles.logoPP,
									{ tintColor: primary, resizeMode: "contain" },
								]}
							/>
						</View>
					)}
				</View>
				<View style={{ marginHorizontal: 10, maxWidth: "60%" }}>
					<Text
						style={{
							color: primary,
							fontWeight: "bold",
							elevation: 4,
							zIndex: 10,
						}}>
						{[convenio.nome_parceiro]}
					</Text>
					<Text
						style={{
							fontSize: 10,
							color: primary,
							fontWeight: "bold",
							elevation: 4,
							zIndex: 10,
						}}>
						{convenio.doc != ""
							? convenio.doc.length > 15
								? `CNPJ: ${convenio.doc}`
								: `CPF: ${convenio.doc}`
							: ""}
					</Text>
					<Text
						style={{
							fontSize: 10,
							color: primary,
							fontWeight: "bold",
							elevation: 4,
							zIndex: 10,
						}}>
						{convenio.nome_area}{" "}

					</Text>
					{convenio.trocar_area ? (
						<TouchableOpacity
							style={{ backgroundColor: primary, borderRadius: 5, padding: 5, marginTop: 10, alignItems: "center" }}
							onPress={() => {
								//Updates.reloadAsync();
								setModalAreas(true);
							}}>
							<Text style={{ color: 'white', paddingHorizontal: 10 }}>Alterar Área</Text>
						</TouchableOpacity>
					) : (
						<Text
							style={{
								fontSize: 10,
								color: primary,
								fontWeight: "bold",
								elevation: 4,
								zIndex: 10,
							}}>
							{convenio.nome_area}
						</Text>
					)}
				</View>
			</View>
			<DrawerContentScrollView {...props}>
				<DrawerItemList {...props} />
			</DrawerContentScrollView>
			<TouchableOpacity
				onPress={() => {
					Alert.alert(
						"Sair",
						"Deseja realmente sair do sistema?",
						[
							{
								text: "Não",
								onPress: () => { },
							},
							{
								text: "Sim",
								onPress: () => {
									props.navigation.reset({
										index: 0,
										routes: [{ name: "AcessoConvenio" }],
									});
									props.navigation.navigate("AcessoConvenio", { deslogar: true });
								},
							},
						])


				}}
				style={{
					height: 50,
					backgroundColor: danger,
					justifyContent: "center",
					alignItems: "center",
				}}>
				<Text style={{ color: "white" }}>Sair</Text>
			</TouchableOpacity>
		</View>
	);
};

export default Perfil;

const style = StyleSheet.create({
	drawer: {
		flex: 1,
		backgroundColor: "#f1f1f1",
	},
});
