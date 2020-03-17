import React, { useState, useEffect } from "react";
import { View, Picker, Text, ScrollView } from "react-native";
import Header from "../components/Header";
import Messages from "../components/Messages";
import { ActivityIndicator } from "react-native-paper";
import styles from "../../assets/stylesheet/Style";
import NumberFormat from "react-number-format";
import api from "../services/api";

const anos = [];
const meses = [
	"Janeiro",
	"Fevereiro",
	"Março",
	"Abril",
	"Maio",
	"Junho",
	"Julho",
	"Agosto",
	"Setembro",
	"Outubro",
	"Novembro",
	"Dezembro"
];

for (let i = 1993; i <= 2020; i++) {
	anos.push(i);
}

function ConsultarDescontos(props) {
	const [mes, setMes] = useState(new Date().getMonth() + 1);
	const [ano, setAno] = useState(`${new Date().getFullYear()}`);
	const [descontos, setDescontos] = useState([]);
	const [carregado, setCarregado] = useState(false);
	let total = 0;

	async function carregarDescontos() {
		const response = await api.get("/consultarDescontos", {
			params: {
				cartao: "00395900001",
				mes,
				ano
			}
		});

		setDescontos(response.data);
		setCarregado(true);
	}

	useEffect(() => {
		carregarDescontos();
	}, [mes, ano]);

	return (
		<>
			<Header titulo="Consultar Descontos" {...props} voltar />
			<View style={[styles.background, { flex: 1 }]}>
				<View style={[styles.linha, { padding: 20 }]}>
					<Picker
						selectedValue={mes}
						style={{
							height: 50,
							flex: 1,
							backgroundColor: "#fff",
							marginRight: 5
						}}
						mode="dropdown"
						onValueChange={(itemValue, itemIndex) => {
							setMes(itemValue);
							carregarDescontos();
						}}>
						{meses.map((mes, index) => (
							<Picker.Item
								key={index + 1}
								label={mes.toUpperCase()}
								value={index + 1}
							/>
						))}
					</Picker>
					<Picker
						selectedValue={ano}
						style={{
							height: 50,
							flex: 1,
							backgroundColor: "#fff",
							marginLeft: 5,
							borderRadius: 12
						}}
						mode="dropdown"
						onValueChange={(itemValue, itemIndex) => setAno(itemValue)}>
						{anos.map((ano, index) => (
							<Picker.Item key={index} label={`${ano}`} value={`${ano}`} />
						))}
					</Picker>
				</View>
				{!carregado ? (
					<View style={[styles.centralizado, { flex: 1 }]}>
						<ActivityIndicator animating={true} size={60} />
					</View>
				) : (
					<>
						<ScrollView
							style={[styles.containerScroll, { marginHorizontal: 20 }]}>
							{descontos.length > 0 ? (
								descontos.map((desconto, index) => {
									total += desconto.valor;
									return (
										<View
											key={index}
											style={[
												styles.blocoScroll,
												{
													height: "100%",
													padding: 10
												}
											]}>
											<View style={{ flex: 1, marginBottom: 5 }}>
												<Text
													style={{
														fontSize: 16,
														fontWeight: "bold",
														textAlign: "left"
													}}>
													{desconto.nome.toUpperCase().trim()}
												</Text>
											</View>
											<View style={styles.linha}>
												<View style={{ flex: 2 }}>
													<Text style={{ fontSize: 12 }}>{desconto.obs}</Text>
												</View>
												<View
													style={{
														flex: 1,
														alignItems: "flex-end",
														justifyContent: "center"
													}}>
													<NumberFormat
														value={desconto.valor}
														displayType={"text"}
														thousandSeparator="."
														decimalSeparator=","
														decimalScale={2}
														fixedDecimalScale
														prefix={"R$ "}
														renderText={value => (
															<Text
																style={{ fontSize: 16, fontWeight: "bold" }}>
																{value}
															</Text>
														)}
													/>
												</View>
											</View>
										</View>
									);
								})
							) : (
								<Messages
									titulo={`NÃO HÁ DESCONTOS.`}
									subtitulo="Não há nenhum desconto para o filtro selecionado."
								/>
							)}
						</ScrollView>
						<View
							style={[
								styles.linha,
								styles.containerTotal,
								styles.centralizado
							]}>
							<Text style={[styles.textoTotal, { fontSize: 12 }]}>
								TOTAL DE DESCONTOS DE {mes > 9 ? mes : "0" + mes}/{ano}:
							</Text>
							<NumberFormat
								value={total}
								displayType={"text"}
								thousandSeparator="."
								decimalSeparator=","
								decimalScale={2}
								fixedDecimalScale
								prefix={"R$ "}
								renderText={value => (
									<Text
										style={[
											styles.textoTotal,
											{ fontSize: 18, fontWeight: "bold", marginLeft: 10 }
										]}>
										{value}
									</Text>
								)}
							/>
						</View>
					</>
				)}
			</View>
		</>
	);
}

export default ConsultarDescontos;
