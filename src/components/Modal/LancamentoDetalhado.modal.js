import React, { useLayoutEffect, useState } from "react";
import {
	View,
	Text,
	Modal,
	TouchableOpacity,
	FlatList,
	SafeAreaView,
} from "react-native";
import styles, { primary, sucess, sucessBack } from "../../utils/Style";
import formatCurrency from "currency-formatter";
import api from "../../api";
import Carregando from "../Carregando";
import useConvenio from "../../Data/Convenio";

export default function LancamentoDetalhado({
	visualizar,
	Nr_lancamento,
}) {
	const [carregandoItemVenda, setCarregandoItemVenda] = useState([]);
	const [mostrar, setMostrar] = visualizar;
	const [ItensVenda, setItensVenda] = useState([]);
	const [tipo, setTipo] = useState([]);
	const [{ tipo_lancamento, token }] = useConvenio();

	useLayoutEffect(() => {
		if (mostrar) {
			setCarregandoItemVenda(true);

			api({
				method: "get",
				url: "/ConsultarItemVenda",
				params: { Nr_lancamento, tipo },
				headers: { "x-access-token": token },
			})
				.then(({ data }) => {
					
					if (tipo_lancamento == "3" && data.itens[0].Valor == 0) {
						data.itens[0].Valor = data.valor * data.parcelas;
					}
					setItensVenda(data);
					setCarregandoItemVenda(false);
				})
				.catch(console.log);
		}
	}, [mostrar]);
	return (
		<Modal visible={mostrar} transparent>
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: "rgba(0, 0, 0, 0.5)",
				}}>
				<View
					style={{
						borderTopRightRadius: 4,
						borderTopLeftRadius: 4,
						backgroundColor: `white`,
						paddingVertical: 10,
						paddingHorizontal: 5,
						width: "90%",
					}}>
					{carregandoItemVenda ? (
						<Carregando />
					) : (
						<>
							<View
								style={{
									flexDirection: "row",
									justifyContent: "space-between",
								}}>
								<Text
									style={[
										styles.textoM,
										{ fontWeight: "bold", marginVertical: 2 },
									]}>
									Lançamento:{" "}
									<Text style={{ fontWeight: "100" }}>
										{ItensVenda.Nr_lancamento}
									</Text>
								</Text>
								<Text
									style={[
										styles.textoM,
										{ fontWeight: "bold", marginVertical: 2 },
									]}>
									Matricula:
									<Text style={{ fontWeight: "100" }}>
										{" "}
										{ItensVenda.Matricula}
									</Text>
								</Text>
							</View>
							<Text
								style={[
									styles.textoM,
									{ fontWeight: "bold", marginVertical: 2 },
								]}>
								Associado:{" "}
								<Text style={{ fontWeight: "100" }}>
									{ItensVenda["Nome do dependente"]}
								</Text>
							</Text>

							<View
								style={{
									flexDirection: "row",
									justifyContent: "space-between",
								}}>
								<Text
									style={[
										styles.textoM,
										{ fontWeight: "bold", marginVertical: 2 },
									]}>
									Parcelamento:{" "}
									<Text style={{ fontWeight: "100" }}>
										{`${ItensVenda.parcelas} x ${formatCurrency.format(
											ItensVenda.valor,
											{
												code: "BRL",
											}
										)}`}
									</Text>
								</Text>
								<Text
									style={[
										styles.textoM,
										{ fontWeight: "bold", marginVertical: 2 },
									]}>
									Data:
									<Text style={{ fontWeight: "100" }}> {ItensVenda.Data}</Text>
								</Text>
							</View>
							<>
								<View style={{ flexDirection: "row", marginTop: 20 }}>
									<Text style={{ width: "75%" }}>
										<Text
											style={{
												color: primary,
												fontSize: 10,
												fontWeight: "bold",
											}}>
											Itens
										</Text>
									</Text>
									<Text>
										<Text
											style={{
												color: primary,
												fontSize: 10,
												fontWeight: "bold",
											}}>
											Valor
										</Text>
									</Text>
								</View>
								<View
									style={{
										flex: 1,
										marginVertical: 5,
										borderBottomColor: primary,
										borderBottomWidth: 2,
									}}
								/>
								<SafeAreaView style={{ maxHeight: 500 }}>
									<FlatList
										data={ItensVenda.itens}
										style={{ maxHeight: 400 }}
										keyExtractor={({ index }) => index}
										renderItem={({ item, index }) => {
											return (
												<View key={index}>
													<View key={index} style={{ flexDirection: "row" }}>
														<Text style={{ width: "75%" }}>
															{tipo_lancamento == 5? ItensVenda.Cupom?`Cupom: ${ItensVenda.Cupom}`:"Produtos Farmacêuticos": item.descricao_procedimento}
														</Text>
														<Text>
															{formatCurrency.format(
																item.Valor ?? ItensVenda.valor,
																{
																	code: "BRL",
																}
															)}
														</Text>
													</View>
													<View
														style={{
															flex: 1,
															marginVertical: 5,
															borderBottomColor: primary,
															borderBottomWidth: 2,
														}}
													/>
												</View>
											);
										}}
									/>
								</SafeAreaView>
							</>
						</>
					)}
				</View>
				<TouchableOpacity
					onPress={() => {
						setMostrar(false);
						setItensVenda([]);
					}}
					style={{
						borderBottomRightRadius: 4,
						borderBottomLeftRadius: 4,
						backgroundColor: sucessBack,
						padding: 10,
						width: "90%",
						alignItems: "center",
					}}>
					<Text style={{ color: sucess }}>FECHAR</Text>
				</TouchableOpacity>
			</View>
		</Modal>
	);
}
