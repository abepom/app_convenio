import React, { useState, useEffect } from "react";
import {
	Modal,
	Text,
	TouchableOpacity,
	View,
	Alert,
	Image,
} from "react-native";
import { TextInput } from "react-native-paper";
import api from "../../api";
import styles, { danger, primary } from "../../utils/Style";
import { themeLight } from "../../utils/theme";
import Carregando from "../Carregando";
import useConvenio from "../../Data/Convenio";
import { TextInputMask } from "react-native-masked-text";
import imagens from "../../utils/imagens";

const ModalValidarLancamento = (props) => {
	const { modal, setModal, fun, matricula, dep, valor, parcela } = props;
	const [carregando, setCarregando] = useState(false);
	const [erro, setErro] = useState(false);
	const [{ token }] = useConvenio();
	const [cod, setCod] = useState("erro");
	const [codigoAssociado, setCodigoAssociado] = useState("");
	const [CelularOK, setCelularOK] = useState(false);
	const [Celular, setCelular] = useState("");
	const [CelularAntigo, setCelularAntigo] = useState("");
	const [CelularBanco, setCelularBanco] = useState("");

	const validar = () => {
		setCarregando(true);
		if (cod == codigoAssociado) {
			setCarregando(true);

			fun();
			setTimeout(() => {
				setCodigoAssociado("");
				setCarregando(false);
			}, 4000);
		} else {
			Alert.alert(
				"Código incorreto!",
				"Solicite novamente o código ao associado caso o problema persistir cancele e pressione CADASTRAR LANÇAMENTO novamente.",
				[{ text: "CANCELAR", onPress: () => setCarregando(false) }]
			);
			setCodigoAssociado("");
		}
	};
	const enviarCodigo = async () => {
		setErro(false);

		setCarregando(true);
		try {
			const { data } = await api({
				url: "/enviarAutorizacao",
				method: "POST",
				data: { matricula, dep, valor, parcela, Celular },
				headers: { "x-access-token": token },
			});

			setCod(`${data.token}`);

			setTimeout(() => {
				setCarregando(false);
			}, 1000);
		} catch (error) {}
	};

	const ContatoPaciente = async () => {
		setCarregando(true);
		try {
			const { data } = await api({
				url: "/contatoPaciente",
				method: "POST",
				data: { matricula, dep },
				headers: { "x-access-token": token },
			});

			if (data.Matricula) {
				if (data.Cont_dependente == data.Cd_dependente) {
					setCelular(`${data.Celular}`);
					setCelularBanco(!!data.Celular);
				} else {
					setCelular(`${data.Telefone_celular}`);
					setCelularBanco(!!data.Telefone_celular);
				}
			}

			setTimeout(() => {
				setCarregando(false);
			}, 1000);
		} catch (error) {}
	};

	useEffect(() => {
		if (modal) {
			ContatoPaciente();
		}
	}, [modal]);

	return (
		<Modal visible={modal} transparent>
			{!carregando ? (
				!CelularOK ? (
					<View
						style={{
							height: "100%",
							width: "100%",
							backgroundColor: "#3333",
							borderRadius: 5,
							padding: 10,
							alignItems: "center",
							justifyContent: "center",
						}}>
						<View
							style={{
								width: "90%",
								paddingTop: 10,
								backgroundColor: "#f1f1f1",

								borderTopLeftRadius: 5,
								borderTopRightRadius: 5,
								alignItems: "center",
								justifyContent: "center",
								padding: 20,
							}}>
							<Text>
								{!!CelularBanco
									? "Verifique se o celular do associado esta correto para encaminha o codigo de autorização."
									: "Solicite o celular do associado para encaminharmos o codigo de autorização."}
							</Text>
							<View style={{ flexDirection: "row" }}>
								{!!CelularBanco ? (
									<>
										<TextInput
											label="Celular"
											dense
											mode="outlined"
											keyboardType="numeric"
											theme={themeLight}
											style={[styles.imput]}
											value={
												Celular.substr(0, 4) +
												"*****-" +
												Celular.substr(Celular.length - 4, Celular.length)
											}
											disabled
										/>
										<TouchableOpacity
											onPress={() => {
												setCelularBanco(false);
												setCelularAntigo(Celular);
												setCelular("");
											}}
											style={{
												backgroundColor: primary,
												marginTop: 15,
												marginLeft: 5,
												padding: 10,
												alignItems: "center",
												borderRadius: 5,
											}}>
											<Image
												source={imagens.edit}
												style={{ width: 25, height: 25, tintColor: "white" }}
											/>
										</TouchableOpacity>
									</>
								) : (
									<>
										<TextInput
											label="Celular"
											dense
											mode="outlined"
											keyboardType="numeric"
											theme={themeLight}
											style={[styles.imput]}
											value={Celular}
											onChangeText={setCelular}
											render={(props) => (
												<TextInputMask type={"cel-phone"} {...props} />
											)}
										/>
										<TouchableOpacity
											onPress={() => {
												if (Celular.length === 15) {
													setCelularOK(true);
													enviarCodigo();
												} else {
													Alert.alert(
														"Atenção",
														`Informe um Celular válido.\nVerifique se o número informado possui o nono digito.`
													);
												}
											}}
											style={{
												backgroundColor: primary,
												marginTop: 15,
												marginLeft: 5,
												padding: 10,
												alignItems: "center",
												borderRadius: 5,
											}}>
											<Image
												source={imagens.check}
												style={{ width: 25, height: 25, tintColor: "white" }}
											/>
										</TouchableOpacity>
									</>
								)}
							</View>
							{!!CelularBanco && (
								<TouchableOpacity
									onPress={() => {
										setCelularBanco(false);
										setCelular(CelularAntigo);
										setCelularOK(true);
										enviarCodigo();
									}}
									style={{
										backgroundColor: primary,
										marginTop: 15,
										marginLeft: 5,
										padding: 10,
										alignItems: "center",

										borderRadius: 5,
									}}>
									<Text style={{ color: "white" }}>Enviar código</Text>
								</TouchableOpacity>
							)}
						</View>
						<TouchableOpacity
							onPress={() => {
								setModal(false);
								setCodigoAssociado("");
							}}
							style={{
								width: "90%",

								backgroundColor: danger,
								padding: 10,
								alignItems: "center",
								position: "relative",
								borderBottomLeftRadius: 5,
								borderBottomRightRadius: 5,
							}}>
							<Text style={{ color: "#fff" }}>CANCELAR</Text>
						</TouchableOpacity>
					</View>
				) : (
					<View
						style={{
							height: "100%",
							width: "100%",
							backgroundColor: "#3333",
							borderRadius: 5,
							padding: 10,
							alignItems: "center",
							justifyContent: "center",
						}}>
						<View
							style={{
								width: "90%",
								paddingTop: 10,
								backgroundColor: "#f1f1f1",

								borderTopLeftRadius: 5,
								borderTopRightRadius: 5,
								alignItems: "center",
								justifyContent: "center",
								padding: 20,
							}}>
							<Text style={{ width: "100%" }}>
								Solicite ao associado o código de autorição do lançamento.
							</Text>
							<Text style={{ width: "100%" }}>
								Esse código será enviado atravéz do email, whastsapp e
								notificação do app ABEPOM Mobile
							</Text>
							<View
								style={{
									width: "100%",
									flexDirection: "row",
									alignItems: "center",
								}}>
								<TextInput
									dense
									mode="outlined"
									theme={themeLight}
									style={{ flex: 1 }}
									keyboardType={"numeric"}
									maxLength={4}
									value={codigoAssociado}
									onChangeText={setCodigoAssociado}
								/>
								<TouchableOpacity
									onPress={validar}
									style={{
										margin: 5,
										backgroundColor: primary,
										padding: 10,

										borderRadius: 5,
									}}>
									<Text style={{ color: "#fff" }}>AUTORIZAR</Text>
								</TouchableOpacity>
							</View>
							<View
								style={{
									width: "100%",
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "center",
									bottom: 0,
								}}></View>
						</View>
						<TouchableOpacity
							onPress={() => {
								setModal(false);
								setCodigoAssociado("");
								setCelularOK(false);
							}}
							style={{
								width: "90%",

								backgroundColor: danger,
								padding: 10,
								alignItems: "center",
								position: "relative",
								borderBottomLeftRadius: 5,
								borderBottomRightRadius: 5,
							}}>
							<Text style={{ color: "#fff" }}>CANCELAR</Text>
						</TouchableOpacity>
					</View>
				)
			) : (
				<View
					style={{
						height: "100%",
						width: "100%",
						backgroundColor: "#3333",
						borderRadius: 5,
						padding: 10,
						alignItems: "center",
						justifyContent: "center",
					}}>
					<View
						style={{
							width: "90%",
							paddingTop: 10,
							backgroundColor: "#f1f1f1",
							borderRadius: 5,
							alignItems: "center",
							justifyContent: "center",
							padding: 20,
						}}>
						<Carregando />
					</View>
				</View>
			)}
		</Modal>
	);
};

export default ModalValidarLancamento;
