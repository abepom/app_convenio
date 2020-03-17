import React, { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { CheckBox } from "react-native-elements";
import Header from "../components/Header";
import styles from "../../assets/stylesheet/Style";
import api from "../services/api";

function LiberarPermissao(props) {
	const { navigation } = props;
	const cont = navigation.getParam("cont");
	const nome = navigation.getParam("nome");
	const imagem = navigation.getParam("imagem");
	const tipo = navigation.getParam("tipo");
	const [areas, setAreas] = useState([]);
	const [todos, setTodos] = useState(false);
	const [carregado, setCarregado] = useState(false);

	async function carregarAreas() {
		const response = await api.get("/listarAreasDependentes", {
			params: {
				cartao: "00000100001",
				dependente: cont
			}
		});

		setAreas([...response.data]);
		setCarregado(true);
	}

	useEffect(() => {
		carregarAreas();
	}, []);

	function mudarCheck(id) {
		let area = areas.find(cod => cod.codigo_area === id);

		areas.find(cod => cod.codigo_area === id).permitido = !areas.find(
			cod => cod.codigo_area === id
		).permitido
			? 1
			: 0;

		salvar(area);
		setAreas([...areas]);
	}

	function marcarTodos() {
		areas.map(area => {
			area.permitido = todos ? 0 : 1;
		});

		alterarTodas();

		setTodos(todos ? false : true);

		setAreas([...areas]);
	}

	async function salvar(area) {
		const response = await api.post("/salvarAreas", {
			area,
			cartao: "00000100001",
			dependente: cont
		});
	}

	async function alterarTodas() {
		const response = await api.post("/alterarTodas", {
			todos,
			cartao: "00000100001",
			dependente: cont
		});
	}

	return (
		<>
			<Header
				titulo={<Text style={{ fontSize: 15 }}>{nome.toUpperCase()}</Text>}
				subtitulo={<Text style={{ fontSize: 12 }}>{tipo}</Text>}
				{...props}
				voltar
				voltarPara="Dependentes"
			/>
			<View
				style={[styles.linha, styles.containerPermissoes, { marginTop: 10 }]}>
				<View style={{ flex: 4, justifyContent: "center" }}>
					<Text style={{ fontSize: 10 }}>APLICAR À TODOS</Text>
				</View>
				<View style={{ flex: 1, alignItems: "center" }}>
					<Text style={{ fontSize: 10 }}>PERMITIDO</Text>
					<CheckBox
						checked={todos}
						checkedIcon="check-circle"
						uncheckedIcon="ban"
						checkedColor="#168405"
						uncheckedColor="#ff0000"
						onPress={() => {
							marcarTodos();
						}}
					/>
				</View>
			</View>
			<View style={{ flex: 4 }}>
				{!carregado ? (
					<View style={[styles.centralizado, { flex: 1 }]}>
						<ActivityIndicator animating={true} size={60} />
					</View>
				) : (
					<ScrollView style={{ marginHorizontal: 20 }}>
						{areas.map((area, index) => (
							<View key={index} style={[styles.linha, styles.areaPermissao]}>
								<View style={{ flex: 4, justifyContent: "center" }}>
									<Text style={{ fontSize: 10 }}>{area.descricao_area}</Text>
								</View>
								<View
									style={{
										flex: 1,
										alignItems: "center",
										justifyContent: "center"
									}}>
									<CheckBox
										key={area.codigo_area}
										checked={area.permitido == 1 ? true : false}
										checkedIcon="check-circle"
										uncheckedIcon="ban"
										checkedColor="#168405"
										uncheckedColor="#ff0000"
										onPress={() => {
											mudarCheck(area.codigo_area);
										}}
									/>
								</View>
							</View>
						))}
					</ScrollView>
				)}
			</View>
		</>
	);
}

export default LiberarPermissao;
