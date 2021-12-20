import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	RefreshControl,
	Dimensions,
	TouchableOpacity,
	Image,
} from "react-native";
import MenuTop from "./../components/MenuTop";
import useConvenio from "./../Data/Convenio";
import api from "./../api";
import { primary } from "./../utils/Style";
import formatCurrency from "currency-formatter";
import Carregando from "../components/Carregando";
import { FlatList } from "react-native-gesture-handler";
import Mensagem from "./../components/Mensagem";
import Icone from "@expo/vector-icons/MaterialCommunityIcons";
import useLoad from "../Data/Load";
import { TextInput } from "react-native-paper";
import { themeLight } from "../utils/theme";
import PickerModal from "react-native-picker-modal-view";
import imagens from "../utils/imagens";
export default function RepassesFuturos(props) {
	const [refreshing, setRefreshing] = useState(false);
	const [load, setLoad] = useState(false);
	const [{ token }] = useConvenio();
	const [repasses, setRepasses] = useState();
	const [mesano, setMesano] = useState(
		`${new Date().getMonth() + 1}/${new Date().getFullYear()}`
	);
	const [mesanoConsulta, setMesanoConsulta] = useState(``);
	const [carregando, setCarregando] = useLoad();
	const mes = [
		{ Name: "01", Value: "01" },
		{ Name: "02", Value: "02" },
		{ Name: "03", Value: "03" },
		{ Name: "04", Value: "04" },
		{ Name: "05", Value: "05" },
		{ Name: "06", Value: "06" },
		{ Name: "07", Value: "07" },
		{ Name: "08", Value: "08" },
		{ Name: "09", Value: "09" },
		{ Name: "10", Value: "10" },
		{ Name: "11", Value: "11" },
		{ Name: "12", Value: "12" },
	];
	let ano = [];
	let acrecimo = 0;
	if (new Date().getMonth() + 1 > 10) {
		acrecimo = 1;
	}
	for (
		let index = 2017;
		index <= new Date().getFullYear() + acrecimo;
		index++
	) {
		ano.push({ Name: index.toString(), Value: index.toString() });
	}
	useEffect(() => {
		if (carregando !== "ConsultarVendas" && carregando !== "todos") {
			getRepasse();
		}
	}, []);

	useEffect(() => {
		if (carregando == "ConsultarVendas" || carregando == "todos") {
			getRepasse();

			setCarregando(null);
		}
	}, [carregando]);
	const getRepasse = async () => {
		setRepasses(null);
		setMesanoConsulta(mesano);
		const { data } = await api({
			method: "GET",
			url: "/repasses",
			params: { mesano },
			headers: { "x-access-token": token },
		});
		console.log(data);
		let ordenado;
		if (data.length > 0) {
			ordenado = data.sort((a, b) => {
				if (a.Nr_lancamento < b.Nr_lancamento) {
					return 1;
				}
				if (a.Nr_lancamento > b.Nr_lancamento) {
					return -1;
				}
				// a must be equal to b
				return 0;
			});
			setRepasses(ordenado);
		} else {
			setRepasses([{ erro: true }]);
		}
	};
	useEffect(() => {
		getRepasse();
	}, []);
	return (
		<>
			<MenuTop drawer {...props} title={"Repasses"}>
				<View style={{ flexDirection: "row", padding: 10 }}>
					<TextInput
						label="MÊS"
						style={{ flex: 1, margin: 5 }}
						dense
						value
						mode="outlined"
						theme={themeLight}
						render={() => (
							<PickerModal
								renderSelectView={(disabled, selected, showModal) => {
									return (
										<TouchableOpacity
											disabled={disabled}
											style={{
												width: "100%",
												height: 45,
												paddingHorizontal: 10,
												justifyContent: "center",
											}}
											title={"Show me!"}
											onPress={showModal}>
											<Text style={{ fontSize: 18, color: primary }}>
												{mesano.split("/")[0]}
											</Text>
										</TouchableOpacity>
									);
								}}
								onSelected={(item) =>
									setMesano(`${item.Value}/${mesano.split("/")[1]}`)
								}
								onClosed={console.log}
								onBackButtonPressed={console.log}
								items={mes}
								showToTopButton={true}
								selected={console.log}
								showAlphabeticalIndex={true}
								autoGenerateAlphabeticalIndex={true}
								selectPlaceholderText={"Selecione um..."}
								searchPlaceholderText={"Buscar..."}
								requireSelection={true}
								autoSort={false}
								renderListItem={(a, item) => {
									console.log(a);
									return (
										<View
											key={item.Value}
											style={{
												flex: 1,
												flexDirection: "row",
												justifyContent: "space-between",
												padding: 10,
												marginVertical: 5,
												marginHorizontal: 20,
												borderBottomWidth: 1,
											}}>
											<Text style={{ fontSize: 18, width: "70%" }}>
												{item.Name}
											</Text>
										</View>
									);
								}}
							/>
						)}
					/>
					<TextInput
						label="ANO"
						style={{ flex: 1, margin: 5 }}
						dense
						value
						mode="outlined"
						theme={themeLight}
						render={() => (
							<PickerModal
								renderSelectView={(disabled, selected, showModal) => {
									return (
										<TouchableOpacity
											disabled={disabled}
											style={{
												width: "100%",
												height: 45,
												paddingHorizontal: 10,
												justifyContent: "center",
											}}
											title={"Show me!"}
											onPress={showModal}>
											<Text style={{ fontSize: 18, color: primary }}>
												{mesano.split("/")[1]}
											</Text>
										</TouchableOpacity>
									);
								}}
								onSelected={(item) =>
									setMesano(`${mesano.split("/")[0]}/${item.Value}`)
								}
								onClosed={console.log}
								onBackButtonPressed={console.log}
								items={ano}
								showToTopButton={true}
								selected={console.log}
								showAlphabeticalIndex={true}
								autoGenerateAlphabeticalIndex={true}
								selectPlaceholderText={"Selecione um..."}
								searchPlaceholderText={"Buscar..."}
								requireSelection={true}
								autoSort={false}
								renderListItem={(a, item) => {
									console.log(a);
									return (
										<View
											key={item.Value}
											style={{
												flex: 1,
												flexDirection: "row",
												justifyContent: "space-between",
												padding: 10,
												marginVertical: 5,
												marginHorizontal: 20,
												borderBottomWidth: 1,
											}}>
											<Text style={{ fontSize: 18, width: "70%" }}>
												{item.Name}
											</Text>
										</View>
									);
								}}
							/>
						)}
					/>
					{!load ? (
						<TouchableOpacity
							style={{
								backgroundColor: primary,
								height: 45,
								justifyContent: "center",
								alignItems: "center",
								borderRadius: 10,
								borderColor: primary,
								borderWidth: 1,
								paddingHorizontal: 4,
								marginTop: 12,
								marginLeft: 15,
								marginRight: 5,
								elevation: 1,
							}}
							onPress={async () => {
								setLoad(true);
								await getRepasse();

								setLoad(false);
							}}>
							<Image
								source={imagens.search}
								style={{ width: 30, height: 30, margin: 5, tintColor: "white" }}
							/>
						</TouchableOpacity>
					) : (
						<Carregando style={{ margin: 0 }} size={20} />
					)}
				</View>
				<FlatList
					refreshControl={
						<RefreshControl refreshing={refreshing} onRefresh={getRepasse} />
					}
					data={repasses}
					keyExtractor={(item) => item.Nr_lancamento}
					renderItem={({ item }) => {
						if (item.erro) {
							return (
								<View style={{ height: Dimensions.get("screen").height }}>
									<Mensagem tipo="S" mensagem="Nenhum repasse encontrado" />
								</View>
							);
						}

						return (
							<View
								style={{
									padding: 10,
									backgroundColor: "white",
									marginHorizontal: 6,
									marginVertical: 4,
									elevation: 3,
								}}>
								<View style={{ flexDirection: "row" }}>
									<View style={{ width: "29%" }}>
										<Text
											style={{
												fontWeight: "bold",
												fontSize: 10,
												color: primary,
											}}>
											Matrícula:{" "}
										</Text>
										<Text> {item.Matricula}</Text>
										<Text
											style={{
												fontWeight: "bold",
												fontSize: 10,
												color: primary,
											}}>
											Lançamento:{" "}
										</Text>
										<Text> {item.Nr_lancamento}</Text>
										<View>
											<Text
												style={{
													fontWeight: "bold",
													fontSize: 10,
													color: primary,
												}}>
												Data:{" "}
											</Text>
											<Text> {item.Data}</Text>
										</View>
									</View>
									<View
										style={{
											justifyContent: "center",
											marginLeft: 5,
											width: "69%",
										}}>
										{item["NomeTitular"] != item["Nome do dependente"] && (
											<>
												<Text
													style={{
														fontWeight: "bold",
														fontSize: 10,
														color: primary,
													}}>
													Dependente:{" "}
												</Text>
												<Text> {item["Nome do dependente"]}</Text>
											</>
										)}
										<Text
											style={{
												fontWeight: "bold",
												fontSize: 10,
												color: primary,
											}}>
											Associado:{" "}
										</Text>
										<Text> {item["NomeTitular"]}</Text>
										<View style={{ flexDirection: "row" }}>
											<View style={{}}>
												<Text
													style={{
														fontWeight: "bold",
														fontSize: 10,
														color: primary,
													}}>
													Valor:{" "}
												</Text>
												<Text style={{ fontSize: 18 }}>
													{formatCurrency.format(item.subtotal, {
														code: "BRL",
													})}
												</Text>
											</View>
											{item?.parcela && (
												<View style={{ marginLeft: 30 }}>
													<Text
														style={{
															fontWeight: "bold",
															fontSize: 10,
															color: primary,
														}}>
														Percelamento:{" "}
													</Text>
													<Text style={{ fontSize: 18 }}>
														{item?.parcela && item.parcela}
													</Text>
												</View>
											)}
										</View>
									</View>
								</View>
							</View>
						);
					}}
					ListEmptyComponent={(a) => {
						return <Carregando />;
					}}
				/>
			</MenuTop>
			{repasses && !repasses[0].erro && (
				<View
					style={{
						flexDirection: "row",
						alignContent: "space-between",
						width: "95%",
						alignSelf: "center",
						marginVertical: 5,
						marginTop: 10,
					}}>
					<View
						style={{
							width: "20%",
							marginRight: "2%",
							alignItems: "center",
							backgroundColor: primary,
							borderRadius: 50,
							marginBottom: 10,
						}}>
						<Text style={{ fontWeight: "bold", color: "#fff", fontSize: 10 }}>
							VENDAS
						</Text>
						<Text style={{ fontWeight: "bold", color: "#fff", fontSize: 20 }}>
							{repasses ? (repasses[0].Mesano ? repasses.length : "0") : "0"}
						</Text>
					</View>
					<View
						style={{
							width: "33%",
							marginHorizontal: "2%",
							alignItems: "center",
							backgroundColor: primary,
							borderRadius: 50,
							marginBottom: 10,
						}}>
						<Text style={{ fontWeight: "bold", color: "#fff", fontSize: 10 }}>
							MÊS DE REPASSE
						</Text>
						<Text style={{ fontWeight: "bold", color: "#fff", fontSize: 20 }}>
							{mesanoConsulta}
						</Text>
					</View>
					<View
						style={{
							width: "39%",
							marginLeft: "2%",
							alignItems: "center",
							backgroundColor: primary,
							borderRadius: 50,
							marginBottom: 10,
						}}>
						<Text style={{ fontWeight: "bold", color: "#fff", fontSize: 10 }}>
							TOTAL
						</Text>
						<Text style={{ fontWeight: "bold", color: "#fff", fontSize: 20 }}>
							{repasses
								? formatCurrency.format(
										repasses.reduce(
											(total, subtotal) => total + Number(subtotal.subtotal),
											0
										),
										{ code: "BRL" }
								  )
								: "R$ 0,00"}
						</Text>
					</View>
				</View>
			)}
		</>
	);
}
