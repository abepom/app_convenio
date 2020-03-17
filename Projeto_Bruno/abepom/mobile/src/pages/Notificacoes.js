import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import api from "../services/api";
import { Feather } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

const Notificacoes = ({ navigation }) => {
	const [notificacoes, setNotificacoes] = useState([]);
	const [filtro, setFiltro] = useState([]);
	const [carregado, setCarregado] = useState(false);
	const [status, setStatus] = useState({
		atencao: false,
		impo: false,
		info: false
	});

	useEffect(() => {
		async function carregarNotificacoes() {
			const response = await api.get("/listarHistoricoNotificacoes", {
				params: {
					cartao: "00395900001"
				}
			});

			setNotificacoes([...response.data]);
			setFiltro([...response.data]);
			setCarregado(true);
		}

		carregarNotificacoes();
	}, []);

	function filtrar(tipo) {
		if (!status.atencao && !status.impo && !status.info) {
			setFiltro(
				notificacoes.filter(not => {
					return not.tipo === tipo;
				})
			);
		} else {
			setFiltro(notificacoes);
		}
	}

	return (
		<>
			{!carregado ? (
				<View
					style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
					<ActivityIndicator size={70} />
				</View>
			) : (
				<>
					<View
						style={{
							flex: 6,
							justifyContent: "center",
							alignItems: "center",
							marginBottom: 10
						}}>
						<ScrollView style={{ width: "90%", flex: 2, marginTop: 10 }}>
							{filtro.map((notificacao, index) => (
								<View
									key={index}
									style={{
										flexDirection: "row",
										backgroundColor: "#fff",
										justifyContent: "center",
										alignItems: "center",
										marginVertical: 5,
										borderRadius: 4,
										flex: 1,
										elevation: 1,
										paddingVertical: 10
									}}>
									<View
										style={{
											justifyContent: "center",
											flex: 1,
											height: "100%",
											alignItems: "center"
										}}>
										<Feather
											name="alert-circle"
											size={30}
											color={notificacao.tipo == 1 ? "#f9f331" : "#db0d0d"}
										/>
									</View>
									<View
										style={{
											flex: 6,
											height: "100%",
											justifyContent: "center",
											paddingRight: 10
										}}>
										<Text style={{ fontSize: 13, fontWeight: "bold" }}>
											{notificacao.titulo}
										</Text>
										{notificacao.descricao
											? notificacao.descricao
													.split("$$")
													.map((texto, index) => (
														<Text
															style={{
																textAlign: "justify",
																marginBottom: 10,
																fontSize: 10
															}}
															key={index}>
															{texto}
														</Text>
													))
											: null}
										{notificacao.data_lido ? (
											<Text style={{ fontSize: 9, textAlign: "right" }}>
												{notificacao.data_lido}
											</Text>
										) : null}
									</View>
								</View>
							))}
						</ScrollView>
					</View>
					<View
						style={{
							flex: 1,
							flexDirection: "row",
							paddingHorizontal: 20
						}}>
						<View style={{ flex: 1 }}>
							<TouchableOpacity
								onPress={() => {
									filtrar("1");
									setStatus({
										atencao: !status.atencao,
										impo: false,
										info: false
									});
								}}
								style={[
									{
										alignItems: "center",
										backgroundColor: "#fff",
										justifyContent: "center",

										marginVertical: 5,
										marginRight: 3,
										borderRadius: 4,

										elevation: 1,
										paddingVertical: 20
									},
									status.atencao
										? { backgroundColor: "#04254e" }
										: { backgroundColor: "#fff" }
								]}>
								<Feather name="alert-circle" size={30} color="#f9f331" />
								<Text
									style={[
										{ fontSize: 10 },
										status.atencao ? { color: "#fff" } : { color: "#000" }
									]}>
									ATENÇÃO
								</Text>
							</TouchableOpacity>
						</View>
						<View style={{ flex: 1 }}>
							<TouchableOpacity
								onPress={() => {
									filtrar("2");
									setStatus({
										atencao: false,
										impo: !status.impo,
										info: false
									});
								}}
								style={[
									{
										alignItems: "center",
										backgroundColor: "#fff",
										justifyContent: "center",

										marginVertical: 5,
										marginRight: 3,
										borderRadius: 4,

										elevation: 1,
										paddingVertical: 20
									},
									status.impo
										? { backgroundColor: "#04254e" }
										: { backgroundColor: "#fff" }
								]}>
								<Feather name="alert-circle" size={30} color="#db0d0d" />
								<Text
									style={[
										{ fontSize: 10 },
										status.impo ? { color: "#fff" } : { color: "#000" }
									]}>
									IMPORTANTE
								</Text>
							</TouchableOpacity>
						</View>
						<View style={{ flex: 1 }}>
							<TouchableOpacity
								onPress={() => {
									filtrar("3");
									setStatus({
										atencao: false,
										impo: false,
										info: !status.info
									});
								}}
								style={[
									{
										alignItems: "center",
										backgroundColor: "#fff",
										justifyContent: "center",

										marginVertical: 5,
										marginRight: 3,
										borderRadius: 4,

										elevation: 1,
										paddingVertical: 20
									},
									status.info
										? { backgroundColor: "#04254e" }
										: { backgroundColor: "#fff" }
								]}>
								<Feather name="alert-circle" size={30} color="#18c967" />
								<Text
									style={[
										{ fontSize: 10 },
										status.info ? { color: "#fff" } : { color: "#000" }
									]}>
									INFORMAÇÃO
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</>
			)}
		</>
	);
};

export default Notificacoes;
