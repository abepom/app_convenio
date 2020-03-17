import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import styles, { tema } from "../../assets/stylesheet/Style";
import { ActivityIndicator } from "react-native-paper";
import Header from "../components/Header";
import api from "../services/api";
import { NavigationActions } from "react-navigation";

function ListarAreas(props) {
	const { navigation } = props;
	const [grupo, setGrupo] = useState(null);
	const [areas, setAreas] = useState([]);
	const [carregado, setCarregado] = useState(false);

	grupo != navigation.state.params.id_grupo && setGrupo(navigation.state.params.id_grupo);

	useEffect(() => {
		setAreas([]);
		listarAreas();
	}, [grupo]);

	async function listarAreas() {
		setCarregado(false);

		const response = await api.get("/listarAreasDoGrupo", {
			params: {
				grupo: navigation.state.params.id_grupo
			}
		});

		if (response.data.length == 1) {
			navigation.replace("ListarConvenios", {
				id_area: response.data[0].codigo,
				nome_area: response.data[0].descricao,
				id_grupo: navigation.state.params.id_grupo,
				nome_grupo: navigation.state.params.nome_grupo,
				voltar_para_grupo: true
			})
		} else {
			setAreas(response.data);
			setCarregado(true)
		}
	}

	return (
		<>
			<Header
				{...props}
				titulo={`${navigation.state.params.nome_grupo}`}
				voltar
			/>
			<View
				style={[
					styles.background,
					{ flex: 1, alignItems: "center", paddingTop: 20 }
				]}
			>
				{!carregado ? (
					<View style={[styles.centralizado, { flex: 1 }]}>
						<ActivityIndicator animating={true} size={60} />
					</View>
				) :
					(

						<FlatList
							style={{ marginHorizontal: 10 }}
							data={areas}
							keyExtractor={item => item.codigo}
							numColumns={2}
							renderItem={({ item }) => {
								return (
									<TouchableOpacity
										style={[
											styles.centralizado,
											{
												backgroundColor: tema.colors.background,
												elevation: 1,
												borderRadius: 6,
												flexGrow: 1,
												margin: 4,
												width: "47%",
												height: 90,
												padding: 10
											}
										]}
										onPress={() => {
											navigation.navigate("ListarConvenios", {
												id_area: item.codigo,
												nome_area: item.descricao,
												id_grupo: navigation.state.params.id_grupo,
												nome_grupo: navigation.state.params.nome_grupo,
												voltar_para_grupo: false
											});
										}}
									>
										<Image
											source={{ uri: item.icone }}
											style={{ width: 35, height: 35 }}
										/>
										<Text style={{ textAlign: "center" }}>{item.descricao}</Text>
									</TouchableOpacity>
								);
							}}
						/>
					)}
			</View>
		</>
	);
}

export default ListarAreas;
