import React, { memo, useEffect, useState } from "react";
import {
	View,
	Text,
	Image,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
	Alert,
	Modal,
	Platform,
} from "react-native";
import styles, { primary, background, danger } from "../utils/Style";
import Icone from "@expo/vector-icons/MaterialCommunityIcons";

import icone from "../../assets/img/abepom.png";
import imagens, { menu } from "../utils/imagens";
import useConvenio from "../Data/Convenio";
import api from "../api";

import Constants from "expo-constants";
import useLoad from "../Data/Load";
import { WebView } from "react-native-webview";
import Carregando from "../components/Carregando";
export default (props) => {
	const [convenio] = useConvenio();
	const [notificacoes] = useState([]);
	const [naoLida] = useState(0);
	const [modal, setModal] = useState(false);
	const [termo, setTermo] = useState({});
	useEffect(() => {
		if (convenio.primeiro_acesso) {
			setModal(true);
			api.get("/termoAdesao", null).then(({ data }) => {
				setTermo(data);
			});
		}
	}, []);

	const aprovarTermo = async () => {
		await api({
			method: "POST",
			url: "/AceitarTermo",
			data: {
				termo: termo.T_id_termo,
			},
			headers: { "x-access-token": convenio.token },
		});
		setModal(false);
	};
	const reprovarTermo = async () => {
		await api({
			method: "POST",
			url: "/RecusarTermo",
			data: {
				termo: termo.T_id_termo,
			},
			headers: { "x-access-token": convenio.token },
		});

		props.navigation.navigate("Sair");
	};
	return (
		<View>
			<Modal visible={modal} transparent>
				<View
					style={{
						height: "100%",
						width: "100%",
						backgroundColor: "white",
						borderRadius: 5,
						padding: 10,
					}}>
					{termo ? (
						<>
							<WebView
								source={{
									html: termo.T_descricao,
								}}
								textZoom={250}
								style={{ flex: 19, borderRadius: 5 }}
							/>
							<View
								style={{
									flex: 0.1,

									alignItems: "center",
									justifyContent: "space-around",
									flexDirection: "row",
								}}>
								<TouchableOpacity
									style={{
										backgroundColor: primary,
										padding: 10,
										borderRadius: 5,
										paddingHorizontal: 20,
									}}
									onPress={aprovarTermo}>
									<Text style={{ fontSize: 24, color: "white" }}>ACEITAR</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={{
										backgroundColor: danger,
										padding: 10,
										borderRadius: 5,
										paddingHorizontal: 20,
									}}
									onPress={() => reprovarTermo()}>
									<Text style={{ fontSize: 24, color: "white" }}>RECUSAR</Text>
								</TouchableOpacity>
							</View>
						</>
					) : (
						<Carregando />
					)}
				</View>
			</Modal>

			<View
				style={{ width: "100%", height: "100%", backgroundColor: background }}>
				<View style={styless.container}>
					<TouchableOpacity
						style={styless.menu}
						onPress={() => props.navigation.toggleDrawer()}>
						<Icone style={{ color: "white" }} name={"menu"} size={28} />
					</TouchableOpacity>
					<Image
						source={icone}
						style={{ width: 40, height: 40, marginHorizontal: 10 }}
					/>
					<Text style={styless.titulo}>ABEPOM</Text>
					<TouchableOpacity
						style={{ position: "absolute", right: 20 }}
						onPress={() =>
							props.navigation.navigate("Notificacoes", notificacoes)
						}>
						<Image
							source={imagens.bell}
							style={{ tintColor: "white", width: 28, height: 28 }}
						/>
						{naoLida > 0 && (
							<View
								style={{
									backgroundColor: "red",
									borderRadius: 50,
									width: 15,
									height: 15,
									alignItems: "center",
									position: "absolute",
								}}>
								<Text style={{ color: "white", fontSize: 10 }}>
									{`${naoLida > 9 ? "+9" : naoLida}`}
								</Text>
							</View>
						)}
					</TouchableOpacity>
				</View>
				<ScrollView>
					<View style={styles.linhaMenu}>
						<TouchableOpacity
							style={styles.itemMenu}
							onPress={() =>
								props.navigation.navigate("ConsultarCartao", convenio)
							}>
							<Image
								source={require("../../assets/img/pay.png")}
								style={styless.imgMenu}
							/>
							<Text style={styles.textMenu}>Consultar Cartão</Text>
						</TouchableOpacity>
					</View>

					{convenio.efetuarVenda && (
						<View style={styles.linhaMenu}>
							<TouchableOpacity
								style={[styles.itemMenu]}
								onPress={() =>
									props.navigation.navigate("EfetuarVenda", convenio)
								}>
								<Image
									source={require("../../assets/img/money.png")}
									style={styless.imgMenu}
								/>
								<Text style={[styles.textMenu]}>Efetuar Venda</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.itemMenu]}
								onPress={() =>
									props.navigation.navigate("ConsultarVendas", {
										load: new Date(),
									})
								}>
								<Image
									source={require("../../assets/img/bill.png")}
									style={styless.imgMenu}
								/>
								<Text style={[styles.textMenu]}>Consultar Vendas</Text>
							</TouchableOpacity>
						</View>
					)}
					<View style={styles.linhaMenu}>
						<TouchableOpacity
							style={styles.itemMenu}
							onPress={() => {
								props.navigation.navigate("Perfil", {
									id_gds: convenio.id_gds,
								});
							}}>
							<Image
								source={require("../../assets/img/portfolio.png")}
								style={styless.imgMenu}
							/>
							<Text style={styles.textMenu}>Perfil</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.itemMenu}
							onPress={() => {
								props.navigation.navigate("Avaliacao", {
									id_gds: convenio.id_gds,
								});
							}}>
							<Image
								source={require("../../assets/img/review.png")}
								style={styless.imgMenu}
							/>
							<Text style={styles.textMenu}>AVALIAÇÕES</Text>
						</TouchableOpacity>
					</View>
					{convenio.nivel == 1 && (
						<View style={[styles.linhaMenu, { marginBottom: 100 }]}>
							<TouchableOpacity
								style={styles.itemMenu}
								onPress={() =>
									props.navigation.navigate("RepassesFuturos", convenio)
								}>
								<Image
									source={require("../../assets/img/statistics.png")}
									style={styless.imgMenu}
								/>
								<Text style={styles.textMenu}>Repasses Futuros</Text>
							</TouchableOpacity>
						</View>
					)}
				</ScrollView>
			</View>
		</View>
	);
};

const styless = StyleSheet.create({
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

	configItem: {
		color: "white",
	},
	titulo: {
		fontSize: 18,
		color: "white",
	},
	imgMenu: { width: 40, height: 40 },
});
