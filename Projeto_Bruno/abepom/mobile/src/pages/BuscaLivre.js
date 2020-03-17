import React, { useEffect, useState } from "react";
import { TextInput, ActivityIndicator } from "react-native-paper";
import {
	View,
	Text,
	FlatList,
	Image,
	Keyboard,
	TouchableOpacity,
	Picker
} from "react-native";
import styles from "../../assets/stylesheet/Style";
import Convenio from "../components/Convenio";
import Header from "../components/Header";
import imagens from "../utils/imagens";
import api from "../services/api";

function Teste(props) {
	const [pagina, setPagina] = useState(1);
	const [carregando, setCarregando] = useState(false);
	const [cidades, setCidades] = useState([
		{ nome: "TODAS AS CIDADES", codigo: "0000" }
	]);
	const [cidadeEscolhida, setCidadeEscolhida] = useState("0000");
	const [busca, setBusca] = useState("");
	const [convenios, setConvenios] = useState([]);

	async function listarCidades() {
		const response = await api.get("/listarCidades");

		setCidades([...cidades, ...response.data]);
	}

	async function buscaLivre() {
		setConvenios([]);
		setCarregando(true);
		Keyboard.dismiss();

		const response = await api.get("/buscaLivre", {
			params: {
				cidade: cidadeEscolhida,
				busca,
				pagina
			}
		});

		setConvenios([...response.data]);
		setCarregando(false);
	}

	useEffect(() => {
		listarCidades();
		setCarregando(false);
	}, []);

	async function carregarMais() {
		Keyboard.dismiss();

		setCarregando(true);
		setPagina(pagina + 1);

		const response = await api.get("/buscaLivre", {
			params: {
				cidade: cidadeEscolhida,
				busca,
				pagina
			}
		});

		if (response.data.length > 0) {
			setConvenios([...convenios, ...response.data]);
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

	return (
		<>
			<Header
				{...props}
				titulo="Busca Livre"
				voltar
				voltarPara="ListarGrupos"
			/>
			<View style={[styles.background, { flex: 1 }]}>
				<View style={{ padding: 10 }}>
					<TextInput
						label="Digite a sua busca"
						value={busca}
						mode="outlined"
						onChangeText={texto => {
							setBusca(texto);
						}}
						style={{ marginBottom: 10 }}
						maxLength={100}
						returnKeyType="search"
						onSubmitEditing={() => buscaLivre()}
					/>
					<TextInput
						label="Cidade"
						value={cidadeEscolhida}
						mode="outlined"
						onChangeText={texto => setCidadeEscolhida(texto)}
						style={{ marginBottom: 10 }}
						render={props => (
							<Picker
								prompt="Selecione uma Cidade"
								selectedValue={cidadeEscolhida}
								onValueChange={(itemValue, itemIndex) => {
									setCidadeEscolhida(itemValue);
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
					<TouchableOpacity
						onPress={() => {
							busca ? buscaLivre() : alert("Deve preencher");
						}}
						style={[
							styles.botaoBuscarConvenios,
							styles.centralizado,
							styles.linha
						]}
					>
						<Image
							source={imagens.buscar}
							style={{ width: 20, height: 20, marginRight: 10 }}
							tintColor="#fff"
						/>
						<Text style={styles.textoBotaoBuscar}>REALIZAR BUSCA</Text>
					</TouchableOpacity>
				</View>
				<FlatList
					style={{ flex: 1, paddingHorizontal: 10 }}
					data={convenios}
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

export default Teste;
