import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { TextInput, HelperText } from "react-native-paper";
import { themeLight } from "../utils/theme";
import styles, { primary } from "../utils/Style";
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import api from "../api";
import Retorno from "../Components/Retorno";
import useUsuario from "../Data/Usuario";
import Carregando from "../Components/Carregando";

const AlterarSenha = () => {
	const [state, setstate] = useState({
		senha: false,
		novasenha: false,
		senhaConfirmada: false,
	});
	const [retorno, setRetorno] = useState({
		retorno: 0,
		mensagem: "",
		tipo: "",
	});
	const [carregando, setCarregando] = useState(false);
	const [senha1, setSenha1] = useState("");
	const [senha, setSenha] = useState("");
	const [senhaNova, setSenhaNova] = useState("");
	const [senhaConfirmada, setSenhaConfirmada] = useState("");
	const [user, setUser] = useUsuario();

	useEffect(() => {
		if (retorno.retorno) {
			setTimeout(() => {
				setRetorno({ retorno: 0, mensagem: "", tipo: "" });
			}, 5000);
		}
	}, [retorno]);

	const alterarSenha = () => {
		setCarregando(true);
		if (senha == "") {
			setstate({ senha: true, novasenha: false, senhaConfirmada: false });
			setCarregando(false);
			return;
		}
		if (senhaNova !== senhaConfirmada) {
			setstate({ ...state, senhaConfirmada: true });
			setCarregando(false);
			setRetorno({
				retorno: 0,
				mensagem: "Senhas não coincidem",
				tipo: "danger",
			});
		} else if (senhaNova.length > 5) {
			api
				.put("/user/alterarSenha", {
					doc: user.doc,
					usuario: user.user,
					senha,
					senhaNova,
				})
				.then(({ data }) => {
					if (!!data.retorno) {
						if (data.tipo == "danger") {
							setSenha("");

							setstate({ ...state, senha: true });
							setCarregando(false);
						} else {
							setSenhaNova("");
							setSenhaConfirmada("");
							setSenha("");
							setRetorno(data);
							setstate({
								senha: false,
								novasenha: false,
								senhaConfirmada: false,
							});
							setCarregando(false);

							setSenha1(senhaNova);
							setUser({ ...user, senha: senhaNova });
						}
					}
				})
				.catch((e, b) => {
					setCarregando(false);
					setRetorno({
						tipo: "danger",
						mensagem: "Senha atual está incorreta.",
						retorno: true,
					});
				});
		} else {
			setCarregando(false);

			setstate({ ...state, novasenha: true });
		}
	};
	return (
		<View>
			{retorno.retorno ? (
				<View
					style={{ width: "80%", alignSelf: "center", marginHorizontal: "5%" }}>
					<Retorno type={retorno.tipo} mensagem={retorno.mensagem} />
				</View>
			) : null}
			<ScrollView>
				<TextInput
					label="Informe a sua senha atual"
					dense
					mode="outlined"
					theme={themeLight}
					value={senha}
					onChangeText={setSenha}
					keyboardType="default"
					style={[styles.imput]}
					secureTextEntry
					error={state.senha ? (senha.length <= 2 ? true : false) : false}
				/>

				{state.senha ? (
					senha.length <= 2 ? (
						<HelperText
							type="error"
							visible={true}
							padding="none"
							style={{ width: "80%", marginLeft: "10%" }}>
							Senha incorreta
						</HelperText>
					) : null
				) : null}

				<TextInput
					label="Digite uma nova senha"
					dense
					mode="outlined"
					theme={themeLight}
					value={senhaNova}
					onChangeText={setSenhaNova}
					keyboardType="default"
					style={[styles.imput]}
					secureTextEntry
					error={
						state.novasenha ? (senhaNova.length >= 6 ? false : true) : false
					}
				/>
				{state.novasenha ? (
					senhaNova.length >= 6 ? null : (
						<HelperText
							type="error"
							visible={true}
							padding="none"
							style={{ width: "80%", marginLeft: "10%" }}>
							senha pecisa ser maior ou igual a 6 caracter
						</HelperText>
					)
				) : null}
				<TextInput
					label="Confirme sua nova senha"
					dense
					mode="outlined"
					theme={themeLight}
					value={senhaConfirmada}
					onChangeText={setSenhaConfirmada}
					keyboardType="default"
					style={[styles.imput]}
					secureTextEntry
					error={
						state.senhaConfirmada
							? senhaConfirmada === senhaNova
								? false
								: true
							: false
					}
				/>
				{state.senhaConfirmada ? (
					senhaConfirmada === senhaNova ? null : (
						<HelperText
							type="error"
							visible={senhaConfirmada === senhaNova ? false : true}
							padding="none"
							style={{ width: "80%", marginLeft: "10%" }}>
							Senhas estão diferente.
						</HelperText>
					)
				) : null}
				{carregando ? (
					<View style={{ width: "80%", marginTop: 30, alignSelf: "center" }}>
						<Carregando color={primary} />
					</View>
				) : (
					<TouchableOpacity
						onPress={alterarSenha}
						style={[
							styles.btnDefault,
							{ width: "80%", marginTop: 30, alignSelf: "center" },
						]}>
						<Text style={styles.btnDefaultText}>CONFIRMAR</Text>
					</TouchableOpacity>
				)}

				<View
					style={{
						flex: 1,
						alignItems: "center",
						justifyContent: "center",
						marginTop: 50,
					}}
				/>
			</ScrollView>
		</View>
	);
};

export default AlterarSenha;
