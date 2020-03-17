import React, { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import styles, { tema } from "../../assets/stylesheet/Style";
import Header from "../components/Header";
import api from "../services/api";

function BeneficiosServicos(props) {
	const [beneficios, setBeneficios] = useState([]);
	const [carregado, setCarregado] = useState(false);

	async function carregarBeneficios() {
		const response = await api.get("/listarBeneficios");
		setBeneficios(response.data);
		setCarregado(true);
	}

	useEffect(() => {
		carregarBeneficios();
	}, []);

	return (
		<>
			<Header titulo="Benefícios e Serviços" {...props} voltar />
			{!carregado ? (
				<View style={[styles.centralizado, { flex: 1 }]}>
					<ActivityIndicator animating={true} size={60} />
				</View>
			) : (
				<View style={[styles.background, { flex: 1, alignItems: "center" }]}>
					<ScrollView>
						{beneficios.map((beneficio, index) => (
							<View key={index} style={{ flex: 1, margin: 10 }}>
								<View style={styles.tituloBeneficio}>
									<Text style={{ color: tema.colors.background }}>
										{beneficio.titulo}
									</Text>
								</View>
								<View style={styles.conteudoBeneficio}>
									{beneficio.descricao.split("$$").map((texto, index) => (
										<Text
											style={{ textAlign: "justify", marginBottom: 10 }}
											key={index}>
											{"\t"}
											{"\t"}
											{"\t"}
											{"\t"}
											{texto}
										</Text>
									))}
								</View>
							</View>
						))}
					</ScrollView>
				</View>
			)}
		</>
	);
}

export default BeneficiosServicos;
