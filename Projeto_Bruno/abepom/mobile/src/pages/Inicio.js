import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import NumberFormat from "react-number-format";
import styles, { tema } from "../../assets/stylesheet/Style";
import Header from "../components/Header";
import imagens from '../utils/imagens'
import api from "../services/api";

function Inicio(props) {
	const { navigation } = props;
	const [limites, setLimites] = useState({});
	const [limiteVisivel, setLimiteVisivel] = useState(false);

	async function carregarLimites() {
		const response = await api.get("/consultarLimites", {
			params: {
				cartao: "00395900001"
			}
		});

		setLimites(response.data);
	}

	useEffect(() => {
		carregarLimites();
	}, []);

	return (
		<>
			<Header titulo={<Text>&nbsp;&nbsp;Minha ABEPOM</Text>} {...props} />
			<View style={[styles.background, { flex: 1 }]}>
				<ScrollView style={{ flex: 1, marginTop: 10 }}>
					<View style={styles.linha}>
						<TouchableOpacity
							style={styles.botaoMenu}
							onPress={() => {
								navigation.navigate("Mapa");
							}}>
							<Image
								source={imagens.mapa_convenios}
								style={styles.iconeMenu}
							/>
							<Text style={styles.textoBotaoMenu}>CONVÊNIOS</Text>
							<Text style={styles.textoBotaoMenu}>PRÓXIMOS</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.botaoMenu}
							onPress={() => {
								navigation.navigate("PesquisarConvenios");
							}}>
							<Image
								source={imagens.buscar}
								style={styles.iconeMenu}
							/>
							<Text style={styles.textoBotaoMenu}>PESQUISAR</Text>
							<Text style={styles.textoBotaoMenu}>CONVÊNIOS</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.botaoMenu}
							onPress={() => {
								navigation.navigate("SugerirConvenios");
							}}>
							<Image
								source={imagens.sugerir_convenios}
								style={styles.iconeMenu}
							/>
							<Text style={styles.textoBotaoMenu}>SUGERIR</Text>
							<Text style={styles.textoBotaoMenu}>CONVÊNIOS</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.linha}>
						<TouchableOpacity
							style={styles.botaoMenu}
							onPress={() => {
								navigation.navigate("ConsultarDescontos");
							}}>
							<Image
								source={imagens.descontos}
								style={styles.iconeMenu}
							/>
							<Text style={styles.textoBotaoMenu}>CONSULTAR</Text>
							<Text style={styles.textoBotaoMenu}>DESCONTOS</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.botaoMenu}
							onPress={() => {
								navigation.navigate("DescontosEspecificos");
							}}>
							<Image
								source={imagens.descontos_especificos}
								style={styles.iconeMenu}
							/>
							<Text style={styles.textoBotaoMenu}>DESCONTOS</Text>
							<Text style={styles.textoBotaoMenu}>ESPECÍFICOS</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.botaoMenu}
							onPress={() => {
								navigation.navigate("DescontosFuturos");
							}}>
							<Image
								source={imagens.descontos_futuros}
								style={styles.iconeMenu}
							/>
							<Text style={styles.textoBotaoMenu}>DESCONTOS</Text>
							<Text style={styles.textoBotaoMenu}>FUTUROS</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.linha}>
						<TouchableOpacity style={styles.botaoMenu} onPress={() => navigation.navigate("Dependentes")}>
							<Image source={imagens.dependentes} style={styles.iconeMenu} />
							<Text style={styles.textoBotaoMenu}>MEUS</Text>
							<Text style={styles.textoBotaoMenu}>DEPENDENTES</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.botaoMenu}
							onPress={() => {
								navigation.navigate("ConveniosSugeridos");
							}}>
							<Image
								source={imagens.consultar_pontos}
								style={styles.iconeMenu}
							/>
							<Text style={styles.textoBotaoMenu}>CONSULTAR</Text>
							<Text style={styles.textoBotaoMenu}>PONTOS</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.botaoMenu}
							onPress={() => {
								navigation.navigate("Cartao");
							}}>
							<Image
								source={imagens.cartao}
								style={styles.iconeMenu}
							/>
							<Text style={styles.textoBotaoMenu}>CARTÃO</Text>
							<Text style={styles.textoBotaoMenu}>ABEPOM</Text>
						</TouchableOpacity>
					</View>
					{limites && limiteVisivel ? (
						<TouchableOpacity
							style={styles.botaoConsultarLimites}
							onPress={() => {
								setLimiteVisivel(false);
							}}>
							<View style={styles.linha}>
								<View
									style={[
										styles.centralizado,
										{
											flex: 1,
											borderRightWidth: 2,
											borderRightColor: "#f1f1f1"
										}
									]}>
									<NumberFormat
										value={limites.limite}
										displayType={"text"}
										thousandSeparator={true}
										prefix={"R$ "}
										renderText={value => (
											<Text style={styles.valorLimite}>{value}</Text>
										)}
									/>
									<Text style={styles.descricaoLimites}>
										Medicamentos e tratamentos
									</Text>
								</View>
								<View
									style={[
										styles.centralizado,
										{
											flex: 1
										}
									]}>
									<NumberFormat
										value={limites.limite_saude}
										displayType={"text"}
										thousandSeparator={true}
										prefix={"R$ "}
										renderText={value => (
											<Text style={styles.valorLimite}>{value}</Text>
										)}
									/>
									<Text style={styles.descricaoLimites}>
										Hospitalar e Aparelhos Médicos
									</Text>
								</View>
							</View>
						</TouchableOpacity>
					) : (
							<TouchableOpacity
								style={styles.botaoConsultarLimites}
								onPress={() => {
									setLimiteVisivel(true);
								}}>
								<Text style={{ color: tema.colors.primary }}>
									CONSULTE SEUS LIMITES
							</Text>
							</TouchableOpacity>
						)}

					<TouchableOpacity
						style={styles.botaoConsultarBeneficios}
						onPress={() => {
							navigation.navigate("BeneficiosServicos");
						}}>
						<Text style={{ color: tema.colors.background }}>
							CONSULTE SEUS BENEFÍCIOS E SERVIÇOS
						</Text>
					</TouchableOpacity>
				</ScrollView>
			</View>
		</>
	);
}

export default Inicio;
