import React, { useState, useEffect } from "react";
import {
	View,
	TouchableOpacity,
	FlatList,
	Image,
	Picker,
} from "react-native";
import { TextInput, ActivityIndicator } from "react-native-paper";
import styles, { tema } from "../../assets/stylesheet/Style";
import compararValores from "../utils/compararValores";
import Convenio from '../components/Convenio';
import Header from "../components/Header";
import imagens from "../utils/imagens";
import api from "../services/api";

function ListarConvenios(props) {
	const { navigation } = props;
	const [area, setArea] = useState(null);
	const [convenios, setConvenios] = useState([]);
	const [filtro, setFiltro] = useState([]);
	const [cidades, setCidades] = useState([
		{ nome: "TODAS AS CIDADES", codigo: "0000" }
	]);
	const [cidadeEscolhida, setCidadeEscolhida] = useState("0000");
	const [pagina, setPagina] = useState(1);
	const [carregando, setCarregando] = useState(false);
	const [alfabeticoCrescente, setAlfabeticoCrescente] = useState(true);
	const [descontoCrescente, setDescontoCrescente] = useState(true);
	const [ordemAlfabetica, setOrdemAlfabetica] = useState(true);

	area != navigation.state.params.id_area && setArea(navigation.state.params.id_area);

	useEffect(() => {
		setConvenios([]);
		setFiltro([]);
		listarConvenios();
		listarCidades();
	}, [area]);

	async function listarCidades() {

		const response = await api.get("/listarCidadesPorArea", {
			params: {
				area: navigation.state.params.id_area
			}
		});

		setCidades([...cidades, ...response.data]);
	}

	async function listarConvenios() {
		setCarregando(true);
		const response = await api.get("/listarConveniosGuia", {
			params: {
				area: navigation.state.params.id_area,
				pagina
			}
		});

		setConvenios(response.data);
		setFiltro(response.data);
		setCarregando(false);
	}

	async function carregarMais() {
		setCarregando(true);

		const response = await api.get("/listarConveniosGuia", {
			params: {
				area: navigation.state.params.id_area,
				pagina: pagina + 1
			}
		});

		setPagina(pagina + 1);

		if (response.data.length > 0) {
			setConvenios([...convenios, ...response.data]);
			setFiltro([...convenios, ...response.data]);
			setCarregando(true);
		} else {
			setCarregando(false);
		}
	}

	const renderFooter = () => {
		return (
			<View style={{ marginTop: 10, alignItems: "center" }}>
				{carregando ? (
					<ActivityIndicator animating={true} size="large" />
				) : null}
			</View>
		);
	};

	function ordenarAlfabetico(ordem) {
		setAlfabeticoCrescente(ordem);
		setOrdemAlfabetica(true);

		setFiltro(
			filtro.sort(compararValores("nome_parceiro", ordem ? "asc" : "desc"))
		);
	}

	function ordenarDesconto(ordem) {
		setDescontoCrescente(ordem);
		setOrdemAlfabetica(false);

		setFiltro(
			filtro.sort(compararValores("desconto", ordem ? "asc" : "desc"))
		);
	}

	function filtrarCidade(cidade) {
		if (cidade === '0000') {
			setFiltro(convenios);
		} else {
			let array = [];

			convenios.filter(convenio => {
				convenio.enderecos.includes(`"cd_cidade":"${cidade}"`) && array.push(convenio);
			});

			setFiltro(array);
		}
	}

	return (
		<>
			<Header
				{...props}
				voltar
				titulo={navigation.state.params.nome_area}
			/>
			<View
				style={[
					styles.background,
					{ flex: 1, paddingVertical: 20, paddingHorizontal: 10 }
				]}
			>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "center",
						alignItems: "center"
					}}
				>
					<View style={[styles.centralizado, { flex: 4 }]}>
						<TextInput
							label="Cidade"
							value={cidadeEscolhida}
							mode="outlined"
							onChangeText={texto => setCidadeEscolhida(texto)}
							style={{
								marginBottom: 10,
								width: "100%",
								paddingHorizontal: 5
							}}
							render={props => (
								<Picker
									prompt="Selecione uma Cidade"
									selectedValue={cidadeEscolhida}
									onValueChange={(itemValue, itemIndex) => {
										setCidadeEscolhida(itemValue);
										filtrarCidade(itemValue);
									}}
								>
									{cidades.map(cidade => (
										<Picker.Item
											key={cidade.codigo}
											value={cidade.codigo}
											label={cidade.nome.toUpperCase()}
										/>
									))}
								</Picker>
							)}
						/>
					</View>
					<View style={[styles.centralizado, { flex: 1 }]}>
						<TouchableOpacity
							onPress={() => {
								ordenarAlfabetico(!alfabeticoCrescente);
							}}
							style={[
								styles.centralizado,
								styles.iconeOrdem,
								{
									backgroundColor: ordemAlfabetica
										? tema.colors.primary
										: tema.colors.background
								}
							]}
						>
							<Image
								source={alfabeticoCrescente ? imagens.oac : imagens.oad}
								tintColor={
									ordemAlfabetica ? tema.colors.background : tema.colors.primary
								}
								style={styles.imagemOrdem}
							/>
						</TouchableOpacity>
					</View>
					<View
						style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
					>
						<TouchableOpacity
							onPress={() => {
								ordenarDesconto(!descontoCrescente);
							}}
							style={[
								styles.centralizado,
								styles.iconeOrdem,
								{
									backgroundColor: ordemAlfabetica
										? tema.colors.background
										: tema.colors.primary
								}
							]}
						>
							<Image
								source={descontoCrescente ? imagens.odc : imagens.odd}
								tintColor={
									ordemAlfabetica ? tema.colors.primary : tema.colors.background
								}
								style={styles.imagemOrdem}
							/>
						</TouchableOpacity>
					</View>
				</View>
				<FlatList
					style={{ flex: 1, paddingHorizontal: 5 }}
					data={filtro}
					renderItem={({ item, index }) => <Convenio {...item} />}
					keyExtractor={(item, index) => index.toString()}
					onMomentumScrollEnd={carregarMais}
					onEndReachedThreshold={0.1}
					ListFooterComponent={renderFooter}
				/>
			</View>
		</>
	);
}
export default ListarConvenios;
