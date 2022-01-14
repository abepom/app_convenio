import React from "react";
import { useEffect } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-paper";
import api from "../api";
import Carregando from "../Components/Carregando";
import MenuTop from "../Components/MenuTop";
import useConvenio from "../Data/Convenio";
import styles, { danger, primary, sucess } from "../utils/Style";

// import { Container } from './styles';

const Screens = (props) => {
	const [convenio, setConvenio] = useConvenio();

	const carregarProcedimentos = async () => {
		const { data } = await api({
			method: "POST",
			url: "/procedimentos",
			data: { cd_da_area: convenio.cd_da_area },
			headers: { "x-access-token": convenio.token },
		});
		data.map((item) => {
			item.carregando = false;
		});

		setConvenio({ ...convenio, procedimentos: data });
	};
	useEffect(() => {
		carregarProcedimentos();
	}, []);

	const trocarStatus = async (id) => {
		let carregando = convenio.procedimentos.map((item) => {
			if (item.Value == id) {
				item.carregando = true;
			}
			return item;
		});
		setConvenio({ ...convenio, procedimentos: carregando });
		await api({
			url: "/procedimentos",
			method: "put",
			data: {
				id,
			},
			headers: { "x-access-token": convenio.token },
		});
		await carregarProcedimentos();
	};
	return (
		<MenuTop {...props} drawer title="Procedimentos">
			<View style={{ width: "100%" }}>
				<Text
					style={{
						marginHorizontal: "10%",
						marginTop: 20,
						fontSize: 18,
						color: primary,
					}}>
					Lista de procedimentos cadastrados
				</Text>
				
				<FlatList
					data={convenio.procedimentos}
					renderItem={({ item }) => {
						return (
							<View
								key={item.Value}
								style={{
									backgroundColor: "white",
									marginHorizontal: "10%",
									marginTop: 20,
									borderWidth: 1,
									borderColor: primary,
									borderRadius: 5,
									padding: 10,
								}}>
								<TextInput
									TextInput
									label="NOME PROCEDIMENTO"
									dense
									disableFullscreenUI
									mode="outlined"
									value
									render={() => <Text style={{ padding: 5 }}>{item.Name}</Text>}
								/>
								<View style={{ flexDirection: "row" }}>
									<TextInput
										TextInput
										label="VALOR"
										dense
										disableFullscreenUI
										mode="outlined"
										value
										style={{ flex: 3 }}
										render={() => (
											<Text style={{ padding: 10 }}>
												R$ {item.Valor_convenio.toFixed(2)}
											</Text>
										)}
									/>
									<View
										style={{
											margin: 2,
											marginLeft: 10,
											alignItems: "center",
											width: 50,
										}}>
										{item.carregando ? (
											<Carregando tamanho={30} />
										) : (
											<>
												<Text>
													{" "}
													{!!item.desabilitado ? "Inativo" : "Ativo"}
												</Text>
												<TouchableOpacity
													onPress={() => trocarStatus(item.Value)}>
													<Image
														source={
															!!item.desabilitado
																? require("../../assets/img/unchecked.png")
																: require("../../assets/img/check.png")
														}
														style={[
															styles.imgMenu,
															{
																width: 25,
																height: 25,
																marginHorizontal: 3,
																tintColor: !!item.desabilitado
																	? danger
																	: sucess,
															},
														]}
													/>
												</TouchableOpacity>
											</>
										)}
									</View>
								</View>
							</View>
						);
					}}
					keyExtractor={(item) => item.id}
				/>
			</View>
		</MenuTop>
	);
};

export default Screens;
