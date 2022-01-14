import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	RefreshControl,
} from "react-native";
import api from "./../api";
import MenuTop from "./../Components/MenuTop";
import { FlatList } from "react-native-gesture-handler";
import useConvenio from "../Data/Convenio";
import { primary } from "./../utils/Style";
import useLoad from "./../Data/Load";
import Carregando from "../Components/Carregando";

export default function Notificacoes(props) {
	const [refreshing, setRefreshing] = useState(false);

	const [convenio, setConvenio] = useConvenio();
	const [load, setLoad] = useLoad();

	const [notificacoes, setNotificacoes] = useState();
	async function getNotificacoes() {
		setNotificacoes([]);
		try {
			const { data } = await api({
				url: "/user/notificacoes",
				params: { cd_convenio: convenio.cd_convenio },
				headers: { "x-access-token": convenio.token },
				method: "GET",
			});
			setNotificacoes(data);
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		getNotificacoes();
	}, []);

	async function lerNotificacao(id) {
		await api({
			url: "/user/LerNotificacoes",
			data: { id },
			headers: { "x-access-token": convenio.token },
			method: "POST",
		});
		getNotificacoes();
	}
	return (
		<View
			style={{
				width: "100%",
				height: "100%",

				justifyContent: "center",
				backgroundColor: "#f1f1f1",
			}}>
			<MenuTop drawer {...props} title={"Notificações"}>
				<FlatList
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={getNotificacoes}
						/>
					}
					ListEmptyComponent={() => (
						<View
							style={{
								flex: 1,
								width: "100%",
								height: "100%",
								alignItems: "center",
								justifyContent: "center",
							}}>
							<Carregando size={48} />
						</View>
					)}
					data={notificacoes}
					style={styles.flatlist}
					keyExtractor={(item) => item.Nr_lancamento}
					renderItem={({ item }) => {
						return (
							<View style={styles.item} key={item.Nr_lancamento}>
								<View
									style={{
										borderTopLeftRadius: 5,
										borderTopRightRadius: 5,
										backgroundColor: primary,
										opacity: item.ACMI_lido ? 0.7 : 1,
										paddingVertical: 5,
										paddingHorizontal: 10,
									}}>
									<Text style={styles.titulo}>{item.ACM_titulo}</Text>
								</View>
								<View style={{ padding: 10 }}>
									<Text style={styles.mensagem}>
										{item.ACM_mensagem.replace(/<[^>]*>?/gm, "").replace(
											/&[^;]*;?/gm,
											""
										)}
									</Text>
								</View>
								{item.ACMI_lido ? (
									<View
										style={{
											width: "100%",
											alignItems: "center",
											padding: 10,
											opacity: item.ACMI_lido ? 0.7 : 1,
											backgroundColor: primary,
											borderRadius: 5,
										}}>
										<Text style={{ color: "white", opacity: 1 }}>
											Lido em {item.ACMI_data_lido}
										</Text>
									</View>
								) : (
									<TouchableOpacity
										style={{
											width: "100%",
											alignItems: "center",
											padding: 10,

											backgroundColor: primary,
											borderRadius: 5,
										}}
										onPress={() => lerNotificacao(item.ACMI_id_itens)}>
										<Text style={{ color: "white" }}>Marcar como lido</Text>
									</TouchableOpacity>
								)}
							</View>
						);
					}}
				/>
			</MenuTop>
		</View>
	);
}
const styles = StyleSheet.create({
	flatlist: { width: "100%", height: "100%", marginBottom: 50 },
	item: {
		marginHorizontal: "3%",
		marginVertical: 10,
		width: "94%",
		backgroundColor: "white",

		borderRadius: 5,
	},
	titulo: {
		fontWeight: "bold",
		marginVertical: 10,
		fontSize: 16,
		color: "white",
	},
	mensagem: {
		color: primary,
	},
});
