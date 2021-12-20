import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import styles, { danger, danverBackground, primary } from "../utils/Style";
import LoginAdm from "../components/LoginAdm";

import api from "../api";

import MenuTop from "../components/MenuTop";
import { ScrollView } from "react-native-gesture-handler";
const Login = (props) => {
	const [carregando, setCarregando] = useState(false);

	const [index, setIndex] = useState(props.navigation.state.params.index);
	const [state, setState] = useState({
		erro: false,
		mensagem: "",
	});

	useEffect(() => {
		if (state.erro) {
			setTimeout(() => {
				setState({ ...state, erro: false });
			}, 6000);
		}
	}, [state.erro]);

	const resetSenha = async (imput) => {
		setCarregando(true);
		const { doc } = imput;
		//setLoad(true);
		if (doc) {
			const { data } = await api({
				url: "/user/resetPass",
				data: { ...imput, convenios: true },
				method: "post",
			});

			data.erro
				? setState({
						...state,
						erro: data.erro,
						mensagem: data.mensagem ?? "Verifique o Usuário.",
				  })
				: props.navigation.navigate("Login", {
						...data,
						resetSenha: true,
						index: imput.user ? 1 : 0,
						imput,
				  });
			setCarregando(false);
		} else {
			setState({
				...state,
				erro: true,
				mensagem: "Informe um usuário e senha.",
			});
		}
		setCarregando(false);
	};

	const [routes] = useState([
		{ key: "1", title: "Administrador" },
		{ key: "2", title: "Ponto de venda" },
	]);

	return (
		<>
			<View
				style={{
					height: 100000,
					backgroundColor: "red",
				}}>
				<MenuTop
					title="Redefinir Senha"
					{...props}
					irpara="Login"
					backgroundColor={primary}>
					<ScrollView style={{ width: "100%" }}>
						<View style={{ width: "80%", alignSelf: "center", marginTop: 20 }}>
							<Text style={[styles.textoG, styles.white]}>
								Informe os dados necessário para efetuar a redefinição de senha.
							</Text>
							<Text style={[styles.textoG, styles.white]}>
								Você receberá um e-mail com a nova senha.
							</Text>
						</View>
						<LoginAdm
							{...props}
							carregando={carregando}
							setState={setState}
							state={state}
							func={resetSenha}
							redefinirSenha
						/>
					</ScrollView>
				</MenuTop>
			</View>
		</>
	);
};

export default Login;
