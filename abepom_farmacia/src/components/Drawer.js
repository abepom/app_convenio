import React, { useState, useEffect, memo } from "react";
import { View, Text, ScrollView, SafeAreaView, Image } from "react-native";
import { DrawerNavigatorItems } from "react-navigation-drawer";
import styles, { primaryBack, primary, danger } from "../utils/Style";
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
					case "AdministrarUsuarios":
						break;
					default:
						itens.push({ ...item });
						break;
				}
			});
			setMenu({ ...props, items: itens });
		} else {
			setMenu({ ...props });
		}
		console.log("drawer");
	}, [props]);

	return (
		<>
			<ScrollView style={styles.flex}>
				<SafeAreaView style={styles.flex}>
					<View style={[styles.row, styles.center, { marginVertical: 20 }]}>
						{convenio.caminho_logomarca ? (
							<>
								<View>
									<Image
										source={{ uri: convenio.caminho_logomarca }}
										style={[styles.logoP, { resizeMode: "contain" }]}
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
								}}>
								<Image
									source={imagens.camera}
									style={[styles.logoPP, { tintColor: primary }]}
								/>
							</View>
						)}
						<View style={{ marginHorizontal: 10, maxWidth: "60%" }}>
							<Text style={{}}>{[convenio.nome_parceiro]}</Text>
							<Text style={{ fontSize: 10 }}>
								{convenio.doc != ""
									? convenio.doc.length > 15
										? `CNPF: ${convenio.doc}`
										: `CPF: ${convenio.doc}`
									: ""}
							</Text>
						</View>
					</View>
					<DrawerNavigatorItems
						{...menu}
						itensConteinerStyles={{ width: "100%", backgroundColor: "blue" }}
					/>
					<View
						style={{
							alignItems: "center",
							justifyContent: "center",
							flexDirection: "row",
							marginTop: 20,
						}}>
						<Image
							source={imagens.abepom}
							style={{ tintColor: primary, width: 15, height: 15 }}
						/>
						<Text style={{ color: primary, fontSize: 10 }}>
							Versão: {expo.version}
						</Text>
					</View>
				</SafeAreaView>
			</ScrollView>
		</>
	);
};

export default memo(Drawer);
