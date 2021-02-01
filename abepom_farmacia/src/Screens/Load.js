import React, { useEffect, useState } from "react";
import { Easing, Animated, Platform } from "react-native";
import { primary } from "./../utils/Style";
import api from "../api";
import StatusBar from "../components/StatusBar";
//import * as Notifications from "expo-notifications";
import { useStore } from "../Data/store";
import useUsuario from "../Data/Usuario";
import useConvenio from "../Data/Convenio";
import Carregando from "../components/Carregando";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
import Updates from "expo-updates";

const Load = (props) => {
	async function updateApp() {
		const { isAvailable } = await Updates.checkForUpdateAsync();

		if (isAvailable) {
			await Updates.fetchUpdateAsync();
			await Updates.reloadAsync(); // depende da sua estratégia
		}
	}
	useEffect(() => {
		updateApp();
	}, []);
	const { navigation } = props;

	const [usuario] = useUsuario();
	const [store] = useStore();
	const [, setConv] = useConvenio();
	useEffect(() => {
		if (!!store.carregouDados) {
			conectar();
		}
	}, [store.carregouDados]);

	const conectar = async () => {
		try {
			if (!usuario) {
				setTimeout(() => {
					return navigation.navigate("Login");
				}, 2000);
			} else {
				const { doc, user, pass } = usuario;
				console.log("tentou login");

				if (!!doc && !!pass) {
					const { data } = await api.post("/Login", {
						doc: doc,
						senha: pass,
						user,
						token: Platform.OS,
					});
					console.log(data);

					let convenio;
					if (!data.erro) {
						convenio = {
							id_gds: data.id_gds,
							nome_parceiro: data.nome_parceiro,
							caminho_logomarca: `${
								data.caminho_logomarca
							}?id=${Math.random()}`,
							efetuarVenda: data.efetuarVenda,
							doc: data.doc,
							usuario: data.usuario,
							nivel: data.nivel,
							token: data.token,
							cd_convenio: data["cd_convênio"],
							primeiro_acesso: data.primeiro_acesso,
						};

						await setConv(convenio);

						setTimeout(() => {
							navigation.navigate("App");
						}, 3000);
					} else {
						setTimeout(() => {
							navigation.navigate(
								"Login",
								{
									...data,
									doc,
									mensagem: "Senha não confere, digite novamene a sua senha",
								},
								3000
							);
						});
					}
					console.log("aaa");
				} else {
					console.log("bbb");
					navigation.navigate("Login", {
						...data,
						doc,
						mensagem: "Senha não confere, digite novamene a sua senha",
					});
				}
			}
		} catch (error) {
			console.log(error);
			navigation.navigate("Login");
		}
	};
	const [mudarCor] = useState(new Animated.Value(0));

	Animated.timing(mudarCor, {
		toValue: 1,
		duration: 3000,
		useNativeDriver: false,
		easing: Easing.linear,
	}).start();

	const spinV = mudarCor.interpolate({
		inputRange: [0, 1],
		outputRange: ["#f1f1f1", primary],
	});

	return (
		<Animated.View
			style={{
				width: "100%",
				height: "100%",
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: spinV,
			}}>
			<StatusBar />
			<Carregando tamanho={150} cor={"white"} />
		</Animated.View>
	);
};

export default Load;
