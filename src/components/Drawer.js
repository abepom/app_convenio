import React, { useState, useEffect, memo } from "react";
import {
	View,
	Text,
	ScrollView,
	SafeAreaView,
	Image,
	TouchableOpacity,
	Modal,
	FlatList,
} from "react-native";
import { DrawerNavigatorItems } from "react-navigation-drawer";
import styles, { primary } from "../utils/Style";
import { expo } from "../../app.json";
import imagens from "../utils/imagens";
import useConvenio from "../Data/Convenio";

const Drawer = (props) => {
	const [convenio, setConv] = useConvenio();
	const [menu, setMenu] = useState(props);
	const [modalAreas, setModalAreas] = useState(false);

	let itens = [];

	//verifica o tipo do usuario
	useEffect(() => {
		if (convenio.nivel != 1) {
			menu.items.map((item) => {
				switch (item.key) {
					case "RepassesFuturos":
					case "Prontuarios":
					case "AdministrarUsuarios":
						break;
					default:
						itens.push({ ...item });
						break;
				}
			});

			setMenu({ ...props, items: itens });
		} else {
			if (convenio.tipo_lancamento == 3) {
				menu.items.map((item) => {
					switch (item.key) {
						case "AdministrarUsuarios":
						case "Procedimentos":
						case "Prontuarios":
							break;
						default:
							itens.push({ ...item });
							break;
					}
				});
			} else {
				if (convenio.tipo_lancamento == 2) {
					menu.items.map((item) => {
						switch (item.key) {
							case "AdministrarUsuarios":
							case "Prontuarios":
								break;
							default:
								itens.push({ ...item });
								break;
						}
					});
				} else {
					menu.items.map((item) => {
						switch (item.key) {
							case "AdministrarUsuarios":
								break;
							default:
								itens.push({ ...item });
								break;
						}
					});
				}
			}
			setMenu({ ...props, items: itens });
		}
	}, [props]);

	return (
		<>
			{modalAreas && (
				<Modal visible={modalAreas} transparent>
					<View
						style={{
							height: "100%",
							width: "100%",
							backgroundColor: "#f1f1f1",
							borderRadius: 5,
							padding: 10,
						}}>
						<Text style={{ alignSelf: "center", marginTop: "10%" }}>
							SELECIONE A ÁREA DE LANÇAMENTO
						</Text>
						<View style={{ marginBottom: "50%", paddingVertical: 5 }}>
							<FlatList
								data={convenio.areas}
								keyExtractor={(item) => item.cd_da_area}
								style={{
									paddingVertical: 5,
								}}
								renderItem={({ item }) => {
									if (item.cd_da_area != "0045")
										return (
											<View
												style={{
													margin: 5,

													padding: 10,
													alignItems: "center",
												}}>
												<TouchableOpacity
													key="entrar"
													style={[
														styles.btnDefault,
														{
															padding: 10,
															paddingHorizontal: 20,
															backgroundColor: "#114267",
															width: "80%",
															height: 100,
														},
													]}
													onPress={() => {
														setConv({
															...convenio,
															tipo_lancamento: item.tipo_lancamento,
															cd_da_area: item.cd_da_area,
															nome_area: `${
																convenio.areas.find(
																	(i) => i.cd_da_area == item.cd_da_area
																)["Descrição"]
															}`,
														});

														setModalAreas(false);
													}}>
													<Image
														source={{ uri: item.caminho_icone }}
														style={{
															width: 50,
															height: 50,
															resizeMode: "contain",
															tintColor: "white",
														}}
													/>
													<Text style={{ color: "white" }}>
														{item["Descrição"]}
													</Text>
												</TouchableOpacity>
											</View>
										);
								}}
							/>
						</View>
					</View>
				</Modal>
			)}
			<View
				style={[
					styles.row,
					styles.center,
					{
						paddingVertical: 20,

						elevation: 4,
						zIndex: 10,
					},
					{
						paddingVertical: 20,
						backgroundColor: "white",
						shadowColor: primary,
						shadowOffset: { width: 0, height: 4 },
						shadowOpacity: 0.8,
						shadowRadius: 4,
					},
				]}>
				{convenio.caminho_logomarca ? (
					<>
						<View style={{ elevation: 4, zIndex: 10 }}>
							<Image
								source={{ uri: convenio.caminho_logomarca }}
								style={[
									styles.logoPP,
									{ resizeMode: "contain", borderRadius: 200 },
								]}
							/>
						</View>
					</>
				) : (
					<View
						style={{
							borderWidth: 2,
							borderColor: primary,
							borderRadius: 50,
							padding: 10,
							elevation: 4,
							zIndex: 10,
						}}>
						<Image
							source={imagens.camera}
							style={[
								styles.logoPP,
								{ tintColor: primary, resizeMode: "contain" },
							]}
						/>
					</View>
				)}
				<View style={{ marginHorizontal: 10, maxWidth: "60%" }}>
					<Text
						style={{
							color: primary,
							fontWeight: "bold",
							elevation: 4,
							zIndex: 10,
						}}>
						{[convenio.nome_parceiro]}
					</Text>
					<Text
						style={{
							fontSize: 10,
							color: primary,
							fontWeight: "bold",
							elevation: 4,
							zIndex: 10,
						}}>
						{convenio.doc != ""
							? convenio.doc.length > 15
								? `CNPJ: ${convenio.doc}`
								: `CPF: ${convenio.doc}`
							: ""}
					</Text>
					{convenio.trocar_area ? (
						<TouchableOpacity
							onPress={() => {
								setModalAreas(true);
							}}>
							<Text
								style={{
									fontSize: 10,
									color: primary,
									fontWeight: "bold",
									elevation: 4,
									zIndex: 10,
								}}>
								{convenio.nome_area}{" "}
								<Image
									source={imagens.loop}
									style={{ width: 10, height: 10 }}
								/>
							</Text>
						</TouchableOpacity>
					) : (
						<Text
							style={{
								fontSize: 10,
								color: primary,
								fontWeight: "bold",
								elevation: 4,
								zIndex: 10,
							}}>
							{convenio.nome_area}
						</Text>
					)}
				</View>
			</View>

			<ScrollView>
				<SafeAreaView>
					<DrawerNavigatorItems
						{...menu}
						itensConteinerStyles={{ width: "100%", backgroundColor: "blue" }}
						labelStyle={{ fontSize: 16 }}
					/>
				</SafeAreaView>
			</ScrollView>
			<View
				style={{
					alignItems: "center",
					justifyContent: "center",
					flexDirection: "row",
					padding: 10,
				}}>
				<Image
					source={imagens.abepom}
					style={{ tintColor: primary, width: 25, height: 25 }}
				/>
				<Text style={{ color: primary, fontWeight: "bold", fontSize: 14 }}>
					Versão: {expo.version}
				</Text>
			</View>
		</>
	);
};

export default memo(Drawer);
