import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Dimensions, Modal } from "react-native";
import { TextInput } from "react-native-paper";
import formatCurrency from "currency-formatter";

import styles, { primary } from "../utils/Style";
import { TextInputMask } from "react-native-masked-text";
import { themeLight as theme } from "../utils/theme";
import api from "../api";
import DateTimePicker from "@react-native-community/datetimepicker";
import useLoad from "../Data/Load";
import useConvenio from "../Data/Convenio";
import Carregando from "../components/Carregando";
import MenuTop from "./../components/MenuTop";

const CadastrarVenda = (props) => {
	const {
		matricula,
		dep,
		nome,
		id_gds,
		titular,
	} = props.navigation.state.params;
	const [{ usuario, token }] = useConvenio();
	const [data, setData] = useState(new Date());
	const [show, setShow] = useState(false);
	const [valor, setValor] = useState("");
	const [cupom, setCupom] = useState("");
	const [carregando, setCarregando] = useState(false);
	const [modal, setModal] = useState(false);
	const [limiteAtual, setLimiteAtual] = useState("");
	const [, setLoad] = useLoad();
	const [msnModal, setMsnModal] = useState({
		erro: true,
		mensagem: "",
	});
	const onChange = (event, selectedDate) => {
		const currentDate = selectedDate || data;
		setShow(Platform.OS === "ios");
		setData(currentDate);
	};

	const InformarVenda = async () => {
		setCarregando(true);

		if (valor) {
			const dados = await api({
				url: "/efetuarVendas",
				method: "POST",
				data: { matricula, dep, valor, cupom, data },
				headers: { "x-access-token": token },
			});

			setModal(true);
			setLoad("ConsultarVendas");
			setMsnModal(dados.data);
		} else {
			alert("valor em branco");
			setCarregando(false);
		}
	};

	const consultarLimite = async () => {
		let { data } = await api({
			url: `/limite?cartao=${matricula}`,
			method: "get",
			headers: { "x-access-token": token },
		});

		setLimiteAtual(data.limite);
	};
	refreshing;
	useEffect(() => {
		consultarLimite();
	}, []);

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
							height: msnModal.limite ? 270 : msnModal.data ? 250 : "30%",
							alignItems: "center",

							borderRadius: 5,
							elevation: 2,
						}}>
						<Text
							style={{
								fontSize: 18,
								color: primary,
								paddingHorizontal: 20,
								marginTop: 10,

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

			<MenuTop {...props} title="Cadastrar Venda">
				<View
					style={{
						width: Dimensions.get("screen").width,
						alignItems: "center",
					}}>
					<View
						style={{
							marginTop: 20,
							padding: 20,
							backgroundColor: "white",
							borderRadius: 3,
							elevation: 2,
							width: "80%",
							borderColor: primary,
							borderWidth: 1,
						}}>
						{titular != nome ? (
							<>
								<Text style={{ color: primary }}>Dependente: {nome}</Text>
								<Text style={{ color: primary }}>Associado: {titular}</Text>
							</>
						) : (
							<Text style={{ color: primary }}>Associado: {nome}</Text>
						)}
						<Text style={{ color: primary }}>Matrícula: {matricula}</Text>

						<Text style={{ color: primary }}>
							Limite:{" "}
							{limiteAtual > 150
								? "R$ +150,00"
								: formatCurrency.format(limiteAtual, { code: "BRL" })}
						</Text>
						{/* <Text style={{ color: primary }}>real para teste: {formatCurrency.format(limiteAtual, { code: 'BRL' })}</Text> */}
					</View>
					<TextInput
						label="Data"
						dense
						value={data}
						mode="outlined"
						onChange={onChange}
						theme={theme}
						style={[styles.imput, { height: 55 }]}
						onFocus={() => alert(teste)}
						render={(props) => {
							if (show) {
								return (
									<DateTimePicker
										{...props}
										mode={"date"}
										maximumDate={new Date()}
									/>
								);
							} else {
								return (
									<Text
										onPress={() => setShow(true)}
										style={{
											textAlignVertical: "center",
											flex: 1,
											marginLeft: 10,
										}}>
										{`${data.getDate()}`}/
										{data.getMonth() < 9
											? `0${data.getMonth() + 1}`
											: `${data.getMonth() + 1}`}
										/{`${data.getFullYear()}`}
									</Text>
								);
							}
						}}
					/>
					<TextInput
						label="Valor"
						dense
						mode="outlined"
						keyboardType="numeric"
						theme={theme}
						style={[styles.imput]}
						value={valor}
						onChangeText={setValor}
						render={(props) => (
							<TextInputMask
								type={"money"}
								options={{
									precision: 2,
									separator: ",",
									delimiter: ".",
									unit: "R$",
									suffixUnit: "",
								}}
								{...props}
							/>
						)}
					/>
					<TextInput
						label="Cupom Fiscal"
						dense
						mode="outlined"
						keyboardType="numeric"
						theme={theme}
						style={[styles.imput]}
						value={cupom}
						onChangeText={setCupom}
					/>

					<View style={{ width: "80%" }}>
						{!carregando ? (
							<TouchableOpacity
								style={[styles.btnDefault, { marginTop: 30 }]}
								onPress={() => InformarVenda()}>
								<Text style={{ color: "white" }}>CADASTRAR VENDA</Text>
							</TouchableOpacity>
						) : (
							<Carregando style={{ marginTop: 30 }} />
						)}
					</View>
				</View>
			</MenuTop>
		</>
	);
};

export default CadastrarVenda;
