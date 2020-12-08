import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { primary } from "../utils/Style";
import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";
import useAccess_token from "../Data/access_token";

// import { Container } from './styles';

const apiTeste = axios.create({
	baseURL: "http://192.168.1.61:3334/convenios",
});

apiTeste.interceptors.response.use(
	async (response) => {
		token = JSON.parse(
			await AsyncStorage.getItem("store").then((A) =>
				console.log("entrou aqui")
			)
		);
		return console.log(token.access_token);

		console.log("bbbbb");

		return response;
	},
	async function(error) {
		let token = await AsyncStorage.getItem("store");

		return console.log(token);
		const access_token = await useAccess_token()[0];
		if (error.response.status === 401 && access_token) {
			console.log("rrrr");
			const { data } = await apiTeste.post("/autenticacao", {
				usuario: "thiago",
				senha: "123",
			});

			console.log(data);
			await useAccess_token()[1](data.token);

			console.log(useAccess_token()[0]);
			return data;
		}
	}
);

const Screens = () => {
	const [token, setToken] = useAccess_token();

	return (
		<View style={{ flex: 1, alignItems: "center", paddingVertical: 30 }}>
			<TouchableOpacity
				style={styles.botao}
				onPress={() => {
					apiTeste
						.get("/TermoAdesao", {
							headers: { "x-access-token": token },
							params: { teste: "ok" },
						})
						.then((a) => console.log(a));
				}}>
				<Text>get Termo</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.botao}
				onPress={() => {
					apiTeste
						.post("/autenticacao", {
							usuario: "thiago",
							senha: "123",
						})
						.then(({ data }) => {
							console.log(data.token);
							setToken(data.token);
						});
				}}>
				<Text>get token</Text>
			</TouchableOpacity>
			<TouchableOpacity style={styles.botao} onPress={() => {}}>
				<Text>teste3</Text>
			</TouchableOpacity>
			<TouchableOpacity style={styles.botao} onPress={() => {}}>
				<Text>teste4</Text>
			</TouchableOpacity>
			<TouchableOpacity style={styles.botao} onPress={() => {}}>
				<Text>teste5</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	botao: {
		margin: 20,
		paddingVertical: 20,
		borderColor: primary,
		borderWidth: 2,
		width: "80%",
		alignItems: "center",
		borderRadius: 3,
	},
});
export default Screens;
