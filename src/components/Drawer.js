import React, { useState, useEffect, memo } from "react";
import { View, Text, ScrollView, SafeAreaView, Image } from "react-native";
import { DrawerNavigatorItems } from "react-navigation-drawer";
import styles, { primary } from "../utils/Style";
import { expo } from "../../app.json";
import imagens from "../utils/imagens";
import useConvenio from "../Data/Convenio";

const Drawer = (props) => {
	const [convenio] = useConvenio();
	const [menu, setMenu] = useState(props);
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
