import React, { useEffect, useState } from "react";
import { Text, View, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import api from "../services/api";
import styles, { corPrimaria } from "../../assets/stylesheet/Style";

function SugerirConvenios() {
	const [convenios, setConvenios] = useState([]);

	async function carregarDependentes() {
		const response = await api.get("/carregarSugestoes", {
			params: {
				cartao: "00395900001"
			}
		});

		setConvenios([...response.data]);
	}

	useEffect(() => {
		carregarDependentes();
	}, []);

	return (
		<View style={styles.container}>
			<View style={{ flex: 4, alignItems: "center", marginTop: 10 }}>
				<Text style={styles.textoDependentes}>
					Consulte suas sugestões de convênios abaixo
				</Text>
				<ScrollView style={{ width: "90%", flex: 2, marginTop: 10 }}>
					{convenios.map((convenio, index) => (
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
								padding: 10
							}}>
							<View
								style={{
									flex: 7,
									height: "100%",
									justifyContent: "center"
								}}>
								<Text style={{ fontSize: 13 }}>
									{convenio.nome.toUpperCase()}
								</Text>
								<Text style={{ fontSize: 11 }}>
									<Text style={{ fontWeight: "bold" }}>CIDADE: </Text>
									{convenio.cidade.toUpperCase()}
								</Text>
								<Text style={{ fontSize: 11 }}>
									<Text style={{ fontWeight: "bold" }}>ÁREA: </Text>
									{convenio.area.toUpperCase()}
								</Text>
								<View style={{ flexDirection: "row" }}>
									<Text style={{ fontSize: 11, fontWeight: "bold" }}>
										TELEFONES:{" "}
									</Text>
									<Text style={{ fontSize: 11, marginRight: 10 }}>
										{convenio.telefone}
									</Text>
									<Text style={{ fontSize: 11 }}>{convenio.celular}</Text>
								</View>
								<Text style={{ fontSize: 11, fontWeight: "bold" }}>
									DESCRIÇÃO:
								</Text>
								<Text style={{ fontSize: 11 }}>{convenio.descricao}</Text>
								{convenio.situacao === "N" && convenio.parecer && (
									<>
										<Text style={{ fontSize: 11, fontWeight: "bold" }}>
											PARECER ADM:
										</Text>
										<Text style={{ fontSize: 11 }}>{convenio.parecer}</Text>
									</>
								)}
							</View>
							<View
								style={{
									justifyContent: "center",
									alignItems: "center",
									flex: 2,
									height: "100%",
									alignItems: "center"
								}}>
								<View style={{ flex: 1, alignItems: "center" }}>
									<Text style={{ fontSize: 10 }}>SUGERIDO EM</Text>
									<Text style={{ fontSize: 10 }}>{convenio.data}</Text>
								</View>
								<View
									style={{
										flex: 4,
										alignItems: "center",
										justifyContent: "center"
									}}>
									{convenio.situacao === "E" ? (
										<>
											<Feather name="clock" size={35} color={corPrimaria} />
											<Text style={{ fontSize: 9 }}>EM AVALIAÇÃO</Text>
										</>
									) : convenio.situacao === "A" ? (
										<>
											<Feather name="check-circle" size={35} color="#15a515" />
											<Text style={{ fontSize: 9 }}>APROVADO</Text>
										</>
									) : (
										<>
											<Feather name="x-circle" size={35} color="#c90e0e" />
											<Text style={{ fontSize: 9 }}>NEGADO</Text>
										</>
									)}
								</View>
							</View>
						</View>
					))}
				</ScrollView>
			</View>
		</View>
	);
}

export default SugerirConvenios;
