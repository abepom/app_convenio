import React, { useState, useEffect } from "react";
import { View, Picker, Image, Text, ScrollView } from "react-native";
import Header from "../components/Header";
import Messages from "../components/Messages";
import { ActivityIndicator, FAB } from "react-native-paper";
import styles, { tema } from "../../assets/stylesheet/Style";
import NumberFormat from "react-number-format";
import api from "../services/api";

const anos = [];
const meses = [
	{ nome: "Janeiro", valor: 1 },
	{ nome: "Fevereiro", valor: 2 },
	{ nome: "Março", valor: 3 },
	{ nome: "Abril", valor: 4 },
	{ nome: "Maio", valor: 5 },
	{ nome: "Junho", valor: 6 },
	{ nome: "Julho", valor: 7 },
	{ nome: "Agosto", valor: 8 },
	{ nome: "Setembro", valor: 9 },
	{ nome: "Outubro", valor: 10 },
	{ nome: "Novembro", valor: 11 },
	{ nome: "Dezembro", valor: 12 }
];

for (let i = 1993; i <= 2020; i++) {
	anos.push(i);
}

function DescontosEspecificos(props) {
	// new Date().getMonth() + 1
	// ${new Date().getFullYear()}
	const [mes, setMes] = useState(2);
	const [ano, setAno] = useState(`2020`);
	const [descontos, setDescontos] = useState([]);
	const [filtro, setFiltro] = useState([]);
	const [carregado, setCarregado] = useState(false);
	const [fabAberto, setFabAberto] = useState(false);
	const [iconeFiltro, setIconeFiltro] = useState(0);
	const [nomeFiltro, setNomeFiltro] = useState("GERAIS");
	let total = 0;

	async function carregarDescontos() {
		setCarregado(false);

		const response = await api.get("/descontosEspecificos", {
			params: {
				cartao: "00284600001",
				mes,
				ano
			}
		});

		setDescontos([...response.data]);
		filtrar(iconeFiltro, [...response.data]);
		setCarregado(true);
	}

	useEffect(() => {
		carregarDescontos();
	}, [mes, ano]);

	function filtrar(id, data) {
		let array = data ? data : descontos;
		setIconeFiltro(id);

		if (id === 0) {
			setFiltro(array);
		} else {
			setFiltro(
				array.filter(desconto => {
					return desconto.filtro === id;
				})
			);
		}
	}

	return (
		<>
			<Header titulo="Descontos Específicos" {...props} voltar />
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
						onValueChange={(itemValue, itemIndex) => setMes(itemValue)}>
						{meses.map((mes, index) => (
							<Picker.Item
								key={index}
								label={mes.nome.toUpperCase()}
								value={mes.valor}
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
						{filtro.length > 0 && (
							<Text style={{ fontSize: 13, textAlign: "center" }}>
								DESCONTOS ESPECÍFICOS {nomeFiltro}
							</Text>
						)}
						<ScrollView
							style={[styles.containerScroll, { marginHorizontal: 20 }]}>
							{filtro.length > 0 ? (
								filtro.map((desconto, index) => {
									desconto.valor_parcela
										? (total += desconto.valor_parcela)
										: (total += desconto.total);
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
													{desconto.nome_prestador.toUpperCase().trim()}
												</Text>
											</View>
											<View style={styles.linha}>
												<View style={{ flex: 2 }}>
													<Text style={{ fontSize: 12 }}>{desconto.nome}</Text>
													<Text style={{ fontSize: 11 }}>
														{desconto.data_utilizacao}
													</Text>
													{desconto.mesano_primeiro && (
														<Text style={{ fontSize: 11 }}>
															1º DESC.: {desconto.mesano_primeiro}
														</Text>
													)}
													{desconto.procedimento && (
														<Text style={{ fontSize: 11 }}>
															{desconto.procedimento}
														</Text>
													)}
												</View>
												<View
													style={{
														flex: 1,
														alignItems: "flex-end",
														justifyContent: "center"
													}}>
													<NumberFormat
														value={desconto.total}
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
													{desconto.quantidade && (
														<NumberFormat
															value={desconto.valor_parcela}
															displayType={"text"}
															thousandSeparator="."
															decimalSeparator=","
															decimalScale={2}
															fixedDecimalScale
															prefix={"R$ "}
															renderText={value => (
																<Text style={{ fontSize: 11 }}>
																	{desconto.quantidade} x {value}
																</Text>
															)}
														/>
													)}
													{desconto.plano && (
														<Text style={{ fontSize: 11 }}>
															{desconto.plano}
														</Text>
													)}
												</View>
											</View>
										</View>
									);
								})
							) : (
								<Messages
									titulo={`NÃO HÁ DESCONTOS ESPECÍFICOS ${nomeFiltro}!`}
									subtitulo="Não há nenhum desconto para o filtro selecionado."
								/>
							)}
							<View style={{ height: 60 }}></View>
						</ScrollView>
						<View
							style={[
								styles.linha,
								styles.containerTotal,
								styles.centralizado
							]}>
							<Text style={[styles.textoTotal, { fontSize: 12 }]}>
								TOTAL DE DESCONTOS {nomeFiltro}:
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
						<FAB.Group
							style={{ bottom: 50 }}
							open={fabAberto}
							icon={
								fabAberto
									? "close"
									: iconeFiltro == 0
									? "filter"
									: iconeFiltro == 1 // FARMÁCIA
									? () => (
											<Image
												source={require("../../assets/img/farmacia.png")}
												style={styles.imagemFiltro}
												tintColor={tema.colors.background}
											/>
									  )
									: iconeFiltro == 2 // HOSPITALAR
									? () => (
											<Image
												source={require("../../assets/img/hospital.png")}
												style={styles.imagemFiltro}
												tintColor={tema.colors.background}
											/>
									  )
									: iconeFiltro == 3 // RADIOLOGIA
									? () => (
											<Image
												source={require("../../assets/img/radiologia.png")}
												style={styles.imagemFiltro}
												tintColor={tema.colors.background}
											/>
									  )
									: iconeFiltro == 4 // ODONTOLOGIA
									? () => (
											<Image
												source={require("../../assets/img/odontologia.png")}
												style={styles.imagemFiltro}
												tintColor={tema.colors.background}
											/>
									  )
									: iconeFiltro == 5 // EMPRÉSTIMOS
									? () => (
											<Image
												source={require("../../assets/img/emprestimos.png")}
												style={styles.imagemFiltro}
												tintColor={tema.colors.background}
											/>
									  )
									: iconeFiltro == 6 // COPARTICIPAÇÃO
									? () => (
											<Image
												source={require("../../assets/img/coparticipacao.png")}
												style={styles.imagemFiltro}
												tintColor={tema.colors.background}
											/>
									  )
									: null
							}
							theme={{ dark: true }}
							actions={[
								{
									icon: () => (
										<Image
											source={require("../../assets/img/todos.png")}
											style={styles.imagemFiltro}
										/>
									),
									label: "TODOS",
									onPress: () => {
										setNomeFiltro("GERAIS");
										filtrar(0);
									}
								},

								{
									icon: () => (
										<Image
											source={require("../../assets/img/farmacia.png")}
											style={styles.imagemFiltro}
										/>
									),
									label: "FARMÁCIA",
									onPress: () => {
										setNomeFiltro("DE FARMÁCIA");
										filtrar(1);
									}
								},
								{
									icon: () => (
										<Image
											source={require("../../assets/img/hospital.png")}
											style={styles.imagemFiltro}
										/>
									),
									label: "HOSPITALAR",
									onPress: () => {
										setNomeFiltro("DE HOSPITALAR");
										filtrar(2);
									}
								},
								{
									icon: () => (
										<Image
											source={require("../../assets/img/radiologia.png")}
											style={styles.imagemFiltro}
										/>
									),
									label: "RADIOLOGIA",
									onPress: () => {
										setNomeFiltro("DE RADIOLOGIA");
										filtrar(3);
									}
								},
								{
									icon: () => (
										<Image
											source={require("../../assets/img/odontologia.png")}
											style={styles.imagemFiltro}
										/>
									),
									label: "ODONTOLOGIA",
									onPress: () => {
										setNomeFiltro("DE ODONTOLOGIA");
										filtrar(4);
									}
								},
								{
									icon: () => (
										<Image
											source={require("../../assets/img/emprestimos.png")}
											style={styles.imagemFiltro}
										/>
									),
									label: "EMPRÉSTIMOS",
									onPress: () => {
										setNomeFiltro("DE EMPRÉSTIMOS");
										filtrar(5);
									}
								},
								{
									icon: () => (
										<Image
											source={require("../../assets/img/coparticipacao.png")}
											style={[styles.imagemFiltro, { padding: 3 }]}
										/>
									),
									label: "COPARTICIPAÇÃO",
									onPress: () => {
										setNomeFiltro("DE COPARTICIPAÇÃO");
										filtrar(6);
									}
								}
							]}
							onStateChange={({ open }) => setFabAberto(open)}
						/>
					</>
				)}
			</View>
		</>
	);
}

export default DescontosEspecificos;
