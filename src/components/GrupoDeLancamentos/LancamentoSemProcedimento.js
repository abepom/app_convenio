import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { TextInput } from "react-native-paper";
import { themeLight as theme } from "../../utils/theme";
import styles, { primary } from "../../utils/Style";
import { TextInputMask } from "react-native-masked-text";
import PickerModal from "react-native-picker-modal-view";
import useConvenio from "../../Data/Convenio";
import DateTimePicker from "@react-native-community/datetimepicker";
import Carregando from "../Carregando";
import api from "../../api";
import formatCurrency from "currency-formatter";
import useLoad from "../../Data/Load";

const GrupoDeLancamentos = ({ associado, props }) => {
	const { matricula, dep } = associado;
	const [, setload] = useLoad();
	const [modal, setModal] = useState(false);
	const [msnModal, setMsnModal] = useState({
		erro: true,
		mensagem: "",
	});
	const [valor, setValor] = useState(0);
	const [cupom, setCupom] = useState('');
	const [carregando, setCarregando] = useState(false);
	const [dataSel, setData] = useState(new Date());
	const [show, setShow] = useState(false);

	const [convenio] = useConvenio();
	const { tipo_lancamento,  token } = convenio;

	const onChange = (event, selectedDate) => {
		const currentDate = selectedDate || data;
		setShow(Platform.OS === "ios");
		setData(currentDate);
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
				data: dataSel,
				cupom,
				valor,
			},
			headers: { "x-access-token": token },
		});

		setMsnModal(data);

		setModal(true);
		setload("ConsultarVendas");
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
								marginTop: msnModal.limite ? 30 : 10,

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
					label="Data"
					dense
					value={dataSel}
					mode="outlined"
					onChange={onChange}
					theme={theme}
					style={[styles.imput, { height: 55, color: primary }]}
					onFocus={() => alert(teste)}
					render={(props) => {
						if (show) {
							return (
								<DateTimePicker
									{...props}
									textColor={primary}
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
									{`${dataSel.getDate()}`}/
									{dataSel.getMonth() < 9
										? `0${dataSel.getMonth() + 1}`
										: `${dataSel.getMonth() + 1}`}
									/{`${dataSel.getFullYear()}`}
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
					value
					onChangeText={setValor}
					render={(props) => (
						<TextInputMask
							type={"money"}
							options={{
								precision: 2,
								separator: ",",
								delimiter: ".",
								unit: "R$ ",
								suffixUnit: "",
							}}
							{...props}
							value={valor}
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
				<View style={{ width: "100%", paddingHorizontal: "10%" }}>
					{!carregando ? (
						<TouchableOpacity
							style={[styles.btnDefault, { marginTop: 30 }]}
							onPress={Lancar}>
							<Text style={{ color: "white" }}>CADASTRAR LANÇAMENTO</Text>
						</TouchableOpacity>
					) : (
						<Carregando style={{ marginTop: 30 }} />
					)}
				</View>
			</View>
		</>
	);
};

export default GrupoDeLancamentos;
