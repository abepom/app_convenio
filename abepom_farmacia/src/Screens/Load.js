import React, { useEffect, useState } from "react";
import { View, Image, Text, Platform } from "react-native";
import logo from "./../../assets/img/logo_abepom_branca.png";
import styles, { primary } from "./../utils/Style";
import api from "../api";
import StatusBar from "../components/StatusBar";
import * as Notifications from "expo-notifications";
import { useStore } from "../Data/store";
import useUsuario from "../Data/Usuario";
import useConvenio from "../Data/Convenio";
import Carregando from "../components/Carregando";
import * as Permissions from "expo-permissions";
const Load = (props) => {
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
			let token;
			if (Constants.isDevice) {
				const { status: existingStatus } = await Permissions.getAsync(
					Permissions.NOTIFICATIONS
				);
				let finalStatus = existingStatus;
				if (existingStatus !== "granted") {
					const { status } = await Permissions.askAsync(
						Permissions.NOTIFICATIONS
					);
					finalStatus = status;
				}
				if (finalStatus !== "granted") {
					console.log("Ocorreu falha para capturar o push token notification.");
					return;
				}
				token = await Notifications.getExpoPushTokenAsync();
			} else {
				if (Platform.OS == "ios") {
					token = { data: "simuladorIOS" };
				} else {
					token = await (await Notifications.getExpoPushTokenAsync()).data;
				}
			}

			if (usuario === undefined) {
				setTimeout(() => {
					return navigation.navigate("Login");
				}, 2000);
			}

			const { doc, user, pass } = usuario;

			if (!!doc && !!pass) {
				const { data } = await api.post("/Login", {
					doc: doc,
					senha: pass,
					user,
					token,
				});

				let convenio;
				if (!data.erro) {
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

					setTimeout(() => {
						navigation.navigate("App", convenio);
						setConv(convenio);
					}, 2000);
					console.log("data");
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
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<View
			style={{
				width: "100%",
				height: "100%",
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: primary,
			}}>
			<StatusBar />
			<Carregando tamanho={150} cor={"white"} />
		</View>
	);
};

export default Load;
