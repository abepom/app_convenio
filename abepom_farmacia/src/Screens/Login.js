import React, { useState, useEffect } from "react";
import { View, Image, Text, StyleSheet, Dimensions } from "react-native";
import StatusBar from "../components/StatusBar";
import logo from "../../assets/img/logo_abepom_branca.png";
import Constants from "expo-constants";
import styles, {
	danger,
	danverBackground,
	primary,
	sucess,
} from "../utils/Style";
import api from "./../api";
import { ScrollView } from "react-native-gesture-handler";
import useUsuario from "../Data/Usuario";
import useConvenio from "../Data/Convenio";
import LoginAdm from "../components/LoginAdm";
import LoginPDV from "../components/LoginPDV";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
//import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import { expo } from "../../app.json";
const initialLayout = { width: Dimensions.get("window").width };

const Login = (props) => {
	const [index, setIndex] = useState(0);
	const [carregando, setCarregando] = useState(false);

	const [reset, setReset] = useState(
		props.navigation.state.params
			? props.navigation.state.params.resetSenha
			: false
	);
	const [state, setState] = useState({
		erro: false,
		mensagem: "",
	});

	const [, setUsuario] = useUsuario();
	const [, setConv] = useConvenio();
	useEffect(() => {
		if (state.erro) {
			setTimeout(() => {
				setState({ ...state, erro: false });
			}, 6000);
		}
	}, [state.erro]);

	useEffect(() => {
		if (props.navigation.state.params) {
			if (props.navigation.state.params.index) {
				setIndex(props.navigation.state.params.index);
			}

			setState(props.navigation.state.params);
		}
	}, []);

	const getToken = async () => {
		let token;
		if (Constants.isDevice) {
			// const { status: existingStatus } = await Permissions.getAsync(
			// 	Permissions.NOTIFICATIONS
			// );
			let finalStatus = existingStatus;
			// if (existingStatus !== "granted") {
			// 	const { status } = await Permissions.askAsync(
			// 		Permissions.NOTIFICATIONS
			// 	);
			// 	finalStatus = status;
			// }
			if (finalStatus !== "granted") {
				console.log("Ocorreu falha para capturar o push token notification.");
				return;
			}
			token = "push"; //await (await Notifications.getExpoPushTokenAsync()).data;
		} else {
			if (Platform.OS == "ios") {
				token = "simuladorIOS";
			} else {
				token = "push"; //await (await Notifications.getExpoPushTokenAsync()).data;
			}
		}

		return token.data;
	};

	const [routes] = useState([
		{ key: "1", title: "Administrador" },
		{ key: "2", title: "Ponto de venda" },
	]);

	const renderScene = SceneMap({
		2: () => (
			<LoginPDV
				{...props}
				carregando={carregando}
				setState={setState}
				state={state}
				reset={reset}
				func={conectar}
				setReset={setReset}
			/>
		),
		1: () => (
			<LoginAdm
				{...props}
				carregando={carregando}
				setState={setState}
				state={state}
				reset={reset}
				func={conectar}
				setReset={setReset}
			/>
		),
	});

	const conectar = async (imput) => {
		setCarregando(true);

		const { doc, user, pass } = imput;
		let token = await getToken();

		if (doc.length > 1 && pass) {
			try {
				const { data } = await api.post("/Login", {
					doc: doc,
					senha: pass,
					user,
					token,
				});

				let convenio;
				if (!data.erro) {
					setUsuario(imput);
					convenio = {
						id_gds: data.id_gds,
						nome_parceiro: data.nome_parceiro,
						caminho_logomarca: `${data.caminho_logomarca}?id=${Math.random()}`,
						efetuarVenda: data.efetuarVenda,
						doc: data.doc,
						usuario: data.usuario,
						nivel: data.nivel,
						token,
						cd_convenio: data["cd_convênio"],
						primeiro_acesso: data.primeiro_acesso,
					};

					setConv(convenio);
					props.navigation.navigate("App");
				} else {
					setCarregando(false);

					setState({ erro: true, mensagem: "Usuário ou Senha incorretos" });
				}
			} catch (error) {
				alert(`${error}  	`);
			}
		} else {
			setState({ erro: true, mensagem: "Usuário ou Senha incorretos" });
		}
	};

	return (
		<>
			<StatusBar />
			{/* <View style={estilos.conteiner}>
        <Text>teste</Text> */}
			<ScrollView
				style={{ width: "100%", height: "100%", backgroundColor: primary }}>
				<Image
					style={[styles.logo, { marginTop: "10%", alignSelf: "center" }]}
					source={logo}
				/>

				<View style={{ alignItems: "center" }}>
					<Text style={[styles.white, styles.textoGG]}>ABEPOM</Text>
					<Text style={[styles.white, styles.textoM]}>FARMÁCIA</Text>
				</View>

				<TabView
					navigationState={{ index, routes }}
					renderScene={renderScene}
					onIndexChange={setIndex}
					style={{
						marginTop: 20,
						flex: 1,
					}}
					initialLayout={initialLayout}
					renderTabBar={(props) => (
						<TabBar
							{...props}
							indicatorStyle={{ backgroundColor: "white" }}
							style={{ backgroundColor: primary, elevation: 1 }}
							labelStyle={styles.textoM}
						/>
					)}
				/>
				<View
					style={{
						alignItems: "center",

						width: "100%",
						bottom: 0,
					}}>
					<Text style={{ color: "white" }}>Versão: {expo.version}</Text>
				</View>
			</ScrollView>
			{/* </View> */}
		</>
	);
};
const estilos = StyleSheet.create({
	buttonView: {
		position: "relative",
		flex: 1,
		justifyContent: "space-around",

		marginHorizontal: "10%",
		marginVertical: 10,
		flexDirection: "row",
	},
	retornoBackend: {
		width: "80%",
		borderRadius: 5,
		alignItems: "center",
		margin: 5,
		padding: 10,
		alignSelf: "center",
	},
	mensagemErro: {
		backgroundColor: danverBackground,
		borderColor: danger,
	},
	mensagemSucesso: {
		backgroundColor: sucess,
		borderColor: sucess,
	},

	cabecalho: {
		color: "white",
		width: "80%",
		marginTop: 20,
		textAlign: "justify",
	},
	conteiner: {
		flex: 1,
		backgroundColor: primary,
		alignItems: "center",
	},
});

export default Login;
