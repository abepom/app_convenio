import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { TextInput } from "react-native-paper";
import { themeLight as theme } from "../../utils/theme";
import styles, { primary } from "../../utils/Style";
import { TextInputMask } from "react-native-masked-text";
import useConvenio from "../../Data/Convenio";
import Carregando from "../Carregando";
import api from "../../api";
import formatCurrency from "currency-formatter";
import useLoad from "../../Data/Load";
import ModalValidarLancamento from "../Modal/ValidarLancamento.modal";
const GrupoDeLancamentos = ({ associado, props, limite }) => {
	const { matricula, dep } = associado;
	const [descricao, setDescricao] = useState("");
	const [quantidade, setQuantidade] = useState(1);
	const [valor, setValor] = useState("0");
	const [modal, setModal] = useState(false);
	const [modalPermissao, setModalPermissao] = useState(false);

	const [msnModal, setMsnModal] = useState({
		erro: true,
		mensagem: "",
	});
	const [, setload] = useLoad();
	const [carregando, setCarregando] = useState(false);

	const [btnvisivel, setBtnvisivel] = useState(false);
	const [convenio] = useConvenio();
	const { tipo_lancamento, cd_da_area, token } = convenio;

	useEffect(() => {
		if (valor != "0,00" && descricao != "") {
			setBtnvisivel(true);
		} else {
			setBtnvisivel(false);
		}
	}, [valor, descricao]);
	const Lancar = async () => {
		setCarregando(true);

		let total = valor
			.replace(/[.]/g, "")
			.replace(/[,]/g, ".")
			.replace("R$ ", "");

		const { data } = await api({
			url: "/LancarVenda",
			method: "POST",

			data: {
				tipo_lancamento,
				cd_da_area,
				matricula,
				dep,
				procedimento: descricao,
				quantidade,
				valor: total,
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
			<ModalValidarLancamento
				modal={modalPermissao}
				setModal={setModalPermissao}
				fun={Lancar}
				matricula={matricula}
				dep={dep}
				valor={valor
					.replace(/[.]/g, "")
					.replace(/[,]/g, ".")
					.replace("R$ ", "")}
				parcela={quantidade}
			/>
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
							// height: msnModal.limite ? 170 : msnModal.data ? 250 : "30%",
							alignItems: "center",

							borderRadius: 5,
							elevation: 2,
						}}>
						<Text
							style={{
								fontSize: 18,
								color: primary,
								paddingHorizontal: 20,
								marginTop: 20,

								textAlign: "center",
							}}>
							{msnModal.mensagem}
							{msnModal.limite
								? ` \n Limite atual ?? de ${formatCurrency.format(
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
									margin: 10,
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
									Dados da transa????o
								</Text>

								<Text style={[styles.textoG, styles.textPrimary]}>
									N?? Lan??amento: {msnModal.lancamento}
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
					label="Descri????o"
					dense
					mode="outlined"
					keyboardType="default"
					theme={theme}
					multiline
					style={[styles.imput]}
					value={descricao.toString()}
					onChangeText={setDescricao}
				/>
				<TextInput
					label="Quantidade de Parcelas"
					dense
					mode="outlined"
					keyboardType="numeric"
					theme={theme}
					style={[styles.imput]}
					value={quantidade.toString()}
					onChangeText={setQuantidade}
					render={(props) => (
						<TextInputMask
							type={"custom"}
							options={{
								mask: "99",
							}}
							{...props}
						/>
					)}
				/>
				<TextInput
					label="Valor da Parcela"
					dense
					mode="outlined"
					keyboardType="numeric"
					theme={theme}
					style={[styles.imput]}
					value={true}
					onChangeText={(a) => {
						setValor(a);
					}}
					render={(props) => (
						<TextInputMask
							type={"money"}
							options={{
								precision: 2,
								separator: ",",
								delimiter: ".",
								unit: "R$ ",
								getRawValue: true,
							}}
							{...props}
							value={Number(valor).toString()}
						/>
					)}
				/>
				<View style={{ width: "100%", paddingHorizontal: "10%" }}>
					{!carregando ? (
						<TouchableOpacity
							disabled={!btnvisivel}
							style={[
								styles.btnDefault,
								{ marginTop: 30, opacity: !btnvisivel ? 0.5 : 1 },
							]}
							onPress={() => {
								let total = valor
									.replace(/[.]/g, "")
									.replace(/[,]/g, ".")
									.replace("R$ ", "");
								console.log(total <= limite);
								if (total > limite) {
									setMsnModal({
										erro: true,
										mensagem:
											"O limite do associado ?? insuficiente.\n",
									});
									setModal(true);
								} else if (total == 0) {
									setMsnModal({
										erro: true,
										mensagem:
											"O valor do lan??amento n??o pode ser igual a zero.",
									});
									setModal(true);
								} else {
									setModalPermissao(true);
								}
							}}>
							<Text style={{ color: "white" }}>CADASTRAR LAN??AMENTO</Text>
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
