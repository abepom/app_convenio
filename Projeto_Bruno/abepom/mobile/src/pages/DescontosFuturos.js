import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image } from "react-native";
import { ActivityIndicator, FAB } from "react-native-paper";
import styles, { tema } from "../../assets/stylesheet/Style";
import Messages from "../components/Messages";
import NumberFormat from "react-number-format";
import Header from "../components/Header";
import api from "../services/api";

function DescontosFuturos(props) {
	const [descontos, setDescontos] = useState([]);
	const [filtro, setFiltro] = useState([]);
	const [carregado, setCarregado] = useState(false);
	const [mesAno, setMesAno] = useState("00/0000");
	const [fabAberto, setFabAberto] = useState(false);
	const [iconeFiltro, setIconeFiltro] = useState(0);
	const [nomeFiltro, setNomeFiltro] = useState("GERAIS");
	let total = 0;

	async function carregarDescontosFuturos() {
		const response = await api.get("/descontosFuturos", {
			params: {
				cartao: "00395900001"
			}
		});

		setDescontos([...response.data]);
		setFiltro([...response.data]);
		setCarregado(true);
	}

	async function carregarMesAno() {
		const { data } = await api.get("/mesAnoParametro");

		setMesAno(data);
	}

	function filtrar(id) {
		setIconeFiltro(id);

		if (id === 0) {
			setFiltro(descontos);
		} else {
			setFiltro(
				descontos.filter(desconto => {
					return desconto.tipo_desconto === id;
				})
			);
		}
	}

	useEffect(() => {
		carregarDescontosFuturos();
		carregarMesAno();
	}, []);

	return (
		<>
			<Header {...props} titulo="Descontos Futuros" voltar />
			<View style={[styles.background, { flex: 1 }]}>
				<View style={{ flex: 1, alignItems: "center", paddingTop: 10 }}>
					{!carregado ? (
						<View style={[styles.centralizado, { flex: 1 }]}>
							<ActivityIndicator animating={true} size={60} />
						</View>
					) : (
						<>
							{filtro.length > 0 && (
								<Text style={{ fontSize: 12 }}>
									DESCONTOS FUTUROS {nomeFiltro}
								</Text>
							)}
							<ScrollView style={styles.containerScroll}>
								{filtro.length > 0 ? (
									filtro.map((desconto, index) => {
										total += desconto.valor;

										return (
											<View
												key={index}
												style={[
													styles.linha,
													styles.centralizado,
													styles.blocoScroll,
													{
														paddingHorizontal: 10
													}
												]}>
												<View style={{ flex: 3 }}>
													<Text style={{ fontSize: 13, fontWeight: "bold" }}>
														{desconto.convenio}
													</Text>
													<Text style={{ fontSize: 12 }}>{desconto.nome}</Text>
													<Text style={{ fontSize: 11 }}>{desconto.data}</Text>
												</View>
												<View style={{ flex: 2, alignItems: "flex-end" }}>
													<NumberFormat
														value={desconto.valor}
														displayType={"text"}
														thousandSeparator="."
														decimalSeparator=","
														decimalScale={2}
														fixedDecimalScale
														prefix={"R$ "}
														renderText={value => (
															<Text style={{ fontSize: 18 }}>{value}</Text>
														)}
													/>
												</View>
											</View>
										);
									})
								) : (
									<Messages
										titulo={`NÃO HÁ DESCONTOS FUTUROS ${nomeFiltro}!`}
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
								<Text style={styles.textoTotal}>DESCONTOS PARA {mesAno}:</Text>
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
										: iconeFiltro == 1 // CONVÊNIOS
										? () => (
												<Image
													source={require("../../assets/img/convenios.png")}
													style={{
														width: 25,
														height: 25
													}}
													tintColor={tema.colors.background}
												/>
										  )
										: iconeFiltro == 2 // HOSPITAL
										? () => (
												<Image
													source={require("../../assets/img/hospital.png")}
													style={{
														width: 25,
														height: 25
													}}
													tintColor={tema.colors.background}
												/>
										  )
										: iconeFiltro == 3 // JURÍDICO
										? () => (
												<Image
													source={require("../../assets/img/juridico.png")}
													style={{
														width: 25,
														height: 25
													}}
													tintColor={tema.colors.background}
												/>
										  )
										: iconeFiltro == 4 // HOTEL
										? () => (
												<Image
													source={require("../../assets/img/hotel.png")}
													style={{
														width: 25,
														height: 25
													}}
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
												style={{ width: 25, height: 25 }}
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
												source={require("../../assets/img/juridico.png")}
												style={{ width: 25, height: 25 }}
											/>
										),
										label: "JURÍDICO",
										onPress: () => {
											setNomeFiltro("DE JURÍDICO");
											filtrar(3);
										}
									},
									{
										icon: () => (
											<Image
												source={require("../../assets/img/hospital.png")}
												style={{ width: 25, height: 25 }}
											/>
										),
										label: "HOSPITAL",
										onPress: () => {
											setNomeFiltro("DE HOSPITAL");
											filtrar(2);
										}
									},
									{
										icon: () => (
											<Image
												source={require("../../assets/img/convenios.png")}
												style={{ width: 25, height: 25 }}
											/>
										),
										label: "CONVÊNIOS",
										onPress: () => {
											setNomeFiltro("DE CONVÊNIOS");
											filtrar(1);
										}
									},
									{
										icon: () => (
											<Image
												source={require("../../assets/img/hotel.png")}
												style={{ width: 25, height: 25 }}
											/>
										),
										label: "HOTÉIS DE TRÂNSITO",
										onPress: () => {
											setNomeFiltro("DE HOTÉIS DE TRÂNSITO");
											filtrar(4);
										}
									}
								]}
								onStateChange={({ open }) => setFabAberto(open)}
							/>
						</>
					)}
				</View>
			</View>
		</>
	);
}

export default DescontosFuturos;
