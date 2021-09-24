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
import * as Updates from "expo-updates";
import Constants from "expo-constants";
import { WebView } from "react-native-webview";
import Carregando from "../components/Carregando";
import useUsuario from "../Data/Usuario";
export default (props) => {
	const [convenio, setConv] = useConvenio();
	const [user] = useUsuario();

	const [notificacoes] = useState([]);
	const [naoLida] = useState(0);
	const [modal, setModal] = useState(false);
	const [termo, setTermo] = useState({});
	useEffect(() => {
		conectar(user);
		if (Constants.isDevice && Platform.OS != "web") {
			Updates.checkForUpdateAsync().then(({ isAvailable }) => {
				if (isAvailable) {
					Updates.fetchUpdateAsync();
				}
			});
		}
		if (!!convenio?.primeiro_acesso) {
			setModal(true);
			api.get("/termoAdesao", null).then(({ data }) => {
				setTermo(data);
			});
		} else {
			setModal(false);
		}
	}, []);
	const conectar = async (imput) => {
		//setCarregando(true);
		const { doc, user, pass } = imput;
		if (doc.length == 18 && pass) {
			try {
				const { data } = await api.post("/Login", {
					doc: doc,
					senha: pass,
					user,
				});

				let conv;
				if (!data.erro) {
					conv = {
						id_gds: data.id_gds,
						nome_parceiro: data.nome_parceiro,
						caminho_logomarca: data.caminho_logomarca
							? `${data.caminho_logomarca}?id=${Math.random()}`
							: null,
						efetuarVenda: data.efetuarVenda,
						doc: data.doc,
						usuario: data.usuario,
						nivel: data.nivel,
						token: data.token,
						cd_convenio: data["cd_convênio"],
						primeiro_acesso: data.primeiro_acesso,
					};
					await setConv(conv);
				}
			} catch (error) {
				props.navigation.navigate("Sair");
				Alert.alert(
					"ATENÇÃO",
					"Usuário ou Senha incorretos.\n EFETUE NOVAMENTE O LOGIN!!"
				);
			}
		} else {
			props.navigation.navigate("Sair");
			Alert.alert(
				"ATENÇÃO",
				"Usuário ou Senha incorretos.\n EFETUE NOVAMENTE O LOGIN!!"
			);
		}
	};

	const aprovarTermo = async () => {
		await api({
			method: "POST",
			url: "/AceitarTermo",
			data: {
				termo: termo.T_id_termo,
			},
			headers: { "x-access-token": convenio.token },
		});
		setConv({ ...convenio, primeiro_acesso: false });
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
			{modal && (
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
										<Text style={{ fontSize: 24, color: "white" }}>
											ACEITAR
										</Text>
									</TouchableOpacity>
									<TouchableOpacity
										style={{
											backgroundColor: danger,
											padding: 10,
											borderRadius: 5,
											paddingHorizontal: 20,
										}}
										onPress={() => reprovarTermo()}>
										<Text style={{ fontSize: 24, color: "white" }}>
											RECUSAR
										</Text>
									</TouchableOpacity>
								</View>
							</>
						) : (
							<Carregando />
						)}
					</View>
				</Modal>
			)}

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
