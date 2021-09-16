import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import { themeLight } from "../utils/theme";
import { TextInputMask } from "react-native-masked-text";
import styles, {
	danger,
	danverBackground,
	primary,
	sucess,
	background,
} from "../utils/Style";
import Carregando from "./Carregando";
export default function LoginPDV(props) {
	const {
		func,
		redefinirSenha,
		setReset,
		reset,
		state,
		setState,
		carregando,
	} = props;
	const [imput, setImput] = useState(
		props.navigation.state.params
			? props.navigation.state.params.imput &&
			  props.navigation.state.params.index == 1
				? props.navigation.state.params.imput
				: {
						doc: "",
						user: "",
						pass: "",
				  }
			: {
					doc: "",
					user: "",
					pass: "",
			  }
	);

	return (
		<View style={{ marginTop: 20, width: "100%" }}>
			<TextInput
				label="CNPJ da Matriz"
				dense
				mode="flat"
				theme={themeLight}
				value={imput.doc}
				onChangeText={(text) => setImput({ ...imput, doc: text })}
				keyboardType={"numeric"}
				render={(prop) => {
					return <TextInputMask {...prop} type={"cnpj"} />;
				}}
				style={[styles.imput]}
			/>
			<TextInput
				label="Usuário"
				dense
				mode="flat"
				theme={themeLight}
				value={imput.user}
				onChangeText={(text) => setImput({ ...imput, user: text })}
				keyboardType={"default"}
				style={[styles.imput]}
			/>

			{!redefinirSenha && (
				<TextInput
					label="senha"
					dense
					mode="flat"
					theme={themeLight}
					value={imput.pass}
					onChangeText={(text) => setImput({ ...imput, pass: text })}
					keyboardType="default"
					style={[styles.imput]}
					secureTextEntry
				/>
			)}
			{state.erro && (
				<View style={[estilos.retornoBackend, estilos.mensagemErro]}>
					<Text style={{ color: danger }}>{state.mensagem}</Text>
				</View>
			)}
			{reset && (
				<View
					style={[estilos.retornoBackend, estilos.mensagemSucesso]}
					onLayout={() =>
						setTimeout(() => {
							setReset(false);
						}, 6000)
					}>
					<Text style={styles.white}>
						Senha redefinida com sucesso em encaminhada para o e-mail:{" "}
						{props.navigation.state.params.email}
					</Text>
				</View>
			)}

			{carregando ? (
				<View
					style={[
						styles.link,
						{
							marginTop: 20,
						},
					]}>
					<Carregando cor="#fff" />
				</View>
			) : !redefinirSenha ? (
				<View style={{ width: "80%", alignSelf: "center", marginVertical: 10 }}>
					<TouchableOpacity
						style={[
							styles.btnDefault,
							{
								width: "100%",
								padding: 10,
								paddingHorizontal: 20,
								backgroundColor: "#114267",
							},
						]}
						onPress={() => {
							if (imput.doc && imput.user && imput.pass) {
								func(imput);
							} else {
								setState({
									erro: true,
									mensagem: "Informe o CNPJ da Matriz,Usuário e Senha",
								});
							}
						}}>
						<Text style={{ color: "white" }}>ENTRAR</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							props.navigation.navigate("RestartPass", {
								noLogin: true,
								index: 1,
							});
						}}
						style={[
							styles.link,
							{
								marginBottom: 10,
								alignSelf: "flex-start",
							},
						]}>
						<Text style={styles.btnDefaultText}>Esqueceu sua senha?</Text>
					</TouchableOpacity>
				</View>
			) : (
				<View
					style={{
						width: "80%",
						justifyContent: "center",
						alignSelf: "center",
						marginTop: 20,
					}}>
					<TouchableOpacity
						style={[
							styles.btnDefault,
							{
								padding: 10,
								paddingHorizontal: 20,
								backgroundColor: background,
							},
						]}
						onPress={() => {
							if (imput.doc && imput.user) {
								func(imput);
							} else {
								setState({
									erro: true,
									mensagem: "Informe o CNPJ da Matriz e Usuário",
								});
							}
						}}>
						<Text style={{ color: primary }}>REDEFINIR SENHA</Text>
					</TouchableOpacity>
				</View>
			)}
		</View>
	);
}
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