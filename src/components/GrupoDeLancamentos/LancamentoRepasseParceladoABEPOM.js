import React, { useState, useEffect, useLayoutEffect } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	Modal,
	Image,
	Picker,
} from "react-native";
import { TextInput } from "react-native-paper";
import { themeLight as theme } from "../../utils/theme";
import styles, { primary, danger } from "../../utils/Style";
import PickerModal from "react-native-picker-modal-view";
import useConvenio from "../../Data/Convenio";
import Carregando from "../Carregando";
import api from "../../api";
import formatCurrency from "currency-formatter";
import imagens from "../../utils/imagens";
import useLoad from "../../Data/Load";

const GrupoDeLancamentos = ({ associado, props }) => {
	const { matricula, dep } = associado;
	const [quantidade, setQuantidade] = useState([]);
	const [procedimento, setProcedimento] = useState({
		Name: "",
		Valor_convenio: 0,
		Value: 0,
	});
	const [modal, setModal] = useState(false);
	const [msnModal, setMsnModal] = useState({
		erro: true,
		mensagem: "",
	});
	const [carregando, setCarregando] = useState(false);
	const [parcelar, setParcelar] = useState(false);
	const [selectedValue, setSelectedValue] = useState(1);
	const [, setload] = useLoad();
	const [proceAdd, setProceAdd] = useState([]);

	const [btnvisivel, setBtnvisivel] = useState(false);
	const [convenio, setConvenio] = useConvenio();
	const { procedimentos, tipo_lancamento, cd_da_area, token } = convenio;

	const carregarProcedimentos = async () => {
		const { data } = await api({
			method: "POST",
			url: "/procedimentos",
			data: { cd_da_area: convenio.cd_da_area },
			headers: { "x-access-token": convenio.token },
		});
		const proced = data.filter((item) => {
			if (item.desabilitado) {
				return false;
			} else {
				return true;
			}
		});
		setConvenio({ ...convenio, procedimentos: proced });
	};
	useLayoutEffect(() => {
		carregarProcedimentos();
	}, []);
	useLayoutEffect(() => {
		if (procedimento.Name != "") {
			setBtnvisivel(true);
		} else {
			setBtnvisivel(false);
		}
	}, [procedimento]);
	useLayoutEffect(() => {
		if (proceAdd?.length) {
			let total = proceAdd.reduce(
				(total, item) => total + item.Valor_convenio,
				0
			);
			let parc = [1];

			for (let index = 0; index < (total / 85).toFixed(); index++) {
				if (index) {
					parc.push(index + 1);
				}
			}
			setQuantidade(parc);
		}
	}, [proceAdd]);
	const AdicionarProcedimento = async () => {
		setProceAdd([...proceAdd, procedimento]);
		setProcedimento({
			Name: "",
			Valor_convenio: 0,
			Value: 0,
		});
	};
	const Lancar = async () => {
		setCarregando(true);

		const { data } = await api({
			url: "/LancarVenda",
			method: "POST",

			data: {
				tipo_lancamento,
				matricula,
				dep,
				parcelamento: selectedValue,
				total: proceAdd.reduce((total, item) => total + item.Valor_convenio, 0),
				procedimento: proceAdd.reduce(
					(total, item) => `${total}${item.Value},`,
					""
				),
			},
			headers: { "x-access-token": token },
		});

		setMsnModal(data);
		setload("ConsultarVendas");
		setModal(true);

		setTimeout(() => {
			setCarregando(false);
		}, 2000);
	};

	return (
		<>
			<Modal visible={modal} {...props} transparent collapsable>
				<View
					style={{
						flex: 1,
						alignItems: "center",
						justifyContent: "center",
						backgroundColor: "rgba(0, 0, 0, 0.5)",
					}}>
					<View
						style={{
							backgroundColor: "#fff",
							width: "90%",
							height: msnModal.limite ? 130 : msnModal.data ? 250 : "30%",
							alignItems: "center",

							borderRadius: 5,
							elevation: 2,
						}}>
						<Text
							style={{
								fontSize: 18,
								color: primary,
								paddingHorizontal: 20,
								marginTop: msnModal.limite ? 20 : 10,

								textAlign: "center",
							}}>
							{msnModal.mensagem}
							{msnModal.limite
								? ` \n Limite atual é de ${formatCurrency.format(
										msnModal.limite,
										{
											code: "BRL",
										}
								  )}`
								: null}
						</Text>
						{msnModal.data && (
							<View
								style={{
									backgroundColor: "#f5f4b3",
									width: "90%",

									padding: 10,
								}}>
								<Text
									style={[
										styles.textoG,
										styles.textPrimary,
										{
											alignSelf: "center",
											marginBottom: 5,
											fontWeight: "bold",
										},
									]}>
									Dados da transação
								</Text>

								<Text style={[styles.textoG, styles.textPrimary]}>
									Nº Lançamento: {msnModal.lancamento}
								</Text>
								<Text style={[styles.textoG, styles.textPrimary]}>
									Associado: {msnModal.nome}
								</Text>
								<Text style={[styles.textoG, styles.textPrimary]}>
									Valor:{" "}
									{formatCurrency.format(msnModal.valor, {
										code: "BRL",
									})}
								</Text>
								<Text style={[styles.textoG, styles.textPrimary]}>
									Data: {msnModal.data.split("-")[2]}/
									{msnModal.data.split("-")[1]}/{msnModal.data.split("-")[0]}
								</Text>
							</View>
						)}
						<TouchableOpacity
							style={{
								position: "absolute",
								bottom: 0,
								height: 45,
								width: "100%",
								backgroundColor: primary,
								elevation: 3,
								borderBottomLeftRadius: 5,
								borderBottomRightRadius: 5,
								alignItems: "center",
								justifyContent: "center",
							}}
							onPress={() => {
								setModal(false);

								if (msnModal.retorno) {
									props.navigation.goBack();
								} else {
									setCarregando(false);
								}
							}}>
							<Text style={{ color: "white" }}>FECHAR</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
			<View style={{ width: "100%" }}>
				<TextInput
					label="Procedimentos"
					dense
					mode="outlined"
					keyboardType="numeric"
					theme={theme}
					style={[styles.imput]}
					value={procedimento.Name}
					render={() => {
						return (
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
											title={"Visualizar!"}
											onPress={showModal}>
											<Text style={{ fontSize: 18, color: primary }}>
												{procedimento?.Name?.length > 20
													? procedimento.Name.substr(0, 20) + "..."
													: procedimento.Name}{" "}
												{procedimento.Name
													? "(R$ " +
													  procedimento.Valor_convenio.toFixed(2).toString() +
													  ")"
													: ""}
											</Text>
										</TouchableOpacity>
									);
								}}
								onSelected={(a) => setProcedimento({ ...a })}
								items={procedimentos}
								showToTopButton={true}
								selected={procedimento}
								showAlphabeticalIndex={true}
								autoGenerateAlphabeticalIndex={true}
								selectPlaceholderText={"Selecione um..."}
								searchPlaceholderText={"Buscar..."}
								requireSelection={true}
								autoSort={false}
								renderListItem={(a, item) => {
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
											<Text
												style={{
													textAlignVertical: "center",
												}}>
												R$ {item.Valor_convenio.toFixed(2)}
											</Text>
										</View>
									);
								}}
							/>
						);
					}}
				/>
				<View style={{ width: "100%", paddingHorizontal: "10%" }}>
					{!carregando ? (
						<TouchableOpacity
							disabled={!(procedimento.Name != "")}
							style={[
								styles.btnDefault,
								{
									marginVertical: 10,
									opacity: !(procedimento.Name != "") ? 0.5 : 1,
								},
							]}
							onPress={AdicionarProcedimento}>
							<Text style={{ color: "white" }}>ADICIONAR PROCEDIMENTOS</Text>
						</TouchableOpacity>
					) : (
						<Carregando style={{ marginTop: 30 }} />
					)}
				</View>
				<View style={{ width: "100%", paddingHorizontal: "10%" }}>
					<>
						{proceAdd.map((proced, i) => (
							<View key={i}>
								<View
									style={{
										marginVertical: 2,
										backgroundColor: "white",
										borderTopLeftRadius: 5,
										borderTopRightRadius: 5,
										padding: 10,
										marginTop: 10,
										flexDirection: "row",
									}}>
									<View style={{ width: "70%" }}>
										<Text style={{ fontSize: 10 }}>PROCEDIMENTOS: </Text>
										<Text
											style={{
												fontSize: 10,
												paddingHorizontal: 10,
												paddingBottom: 10,
											}}>
											{proced.Name}
										</Text>
									</View>
									<View
										style={{
											flexDirection: "row",
											justifyContent: "space-between",
											elevation: 5,
											shadowColor: "#ddd",
										}}>
										<Text
											style={{
												fontSize: 16,
												paddingHorizontal: 10,
												paddingBottom: 10,
											}}>
											R$ {proced.Valor_convenio.toFixed(2)}
										</Text>
									</View>
								</View>
								<TouchableOpacity
									onPress={() => {
										let achouUm = 0;
										setProceAdd(
											proceAdd.filter((a) => {
												if (a.Value == proced.Value) {
													achouUm++;
													if (achouUm > 1) {
														return true;
													} else {
														return false;
													}
												} else {
													return true;
												}
											})
										);
									}}
									style={{
										backgroundColor: danger,
										height: 20,
										borderBottomLeftRadius: 5,
										borderBottomRightRadius: 5,
										alignItems: "center",
										justifyContent: "center",
										flexDirection: "row",
									}}>
									<Image
										source={imagens.trash}
										style={{
											width: 15,
											height: 15,
											resizeMode: "contain",
											tintColor: "white",
											paddingHorizontal: 10,
										}}
									/>
									<Text style={{ color: "white", fontSize: 10 }}>EXCLUIR</Text>
								</TouchableOpacity>
							</View>
						))}
						{proceAdd.length > 0 && (
							<>
								{parcelar ? (
									<>
										<TextInput
											label="PARCELAMENTO"
											dense
											mode="outlined"
											keyboardType="numeric"
											theme={theme}
											style={{ flex: 1, marginTop: 30 }}
											value
											render={() => {
												let total = proceAdd.reduce(
													(total, item) => total + item.Valor_convenio,
													0
												);
												return (
													<Picker
														mode="dropdown"
														selectedValue={selectedValue}
														onValueChange={(itemValue, itemIndex) => {
															setSelectedValue(itemValue);
														}}>
														{quantidade.map((a, b) => {
															return (
																<Picker.Item
																	key={b}
																	label={`${a} x R$ ${(total / a).toFixed(2)}`}
																	value={a}
																/>
															);
														})}
													</Picker>
												);
											}}
										/>
										{!carregando ? (
											<TouchableOpacity
												style={[styles.btnDefault, { marginTop: 10 }]}
												onPress={Lancar}>
												<Text style={{ color: "white" }}>
													CADASTRAR LANÇAMENTO
												</Text>
											</TouchableOpacity>
										) : (
											<Carregando style={{ marginTop: 30 }} />
										)}
									</>
								) : (
									<TouchableOpacity
										style={[styles.btnDefault, { marginTop: 30 }]}
										onPress={() => setParcelar(true)}>
										<Text style={{ color: "white" }}>PARCELAR</Text>
									</TouchableOpacity>
								)}
							</>
						)}
					</>
				</View>
			</View>
		</>
	);
};

export default GrupoDeLancamentos;
