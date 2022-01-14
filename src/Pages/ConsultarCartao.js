import React, { useState, useEffect, useRef } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	TextInput,
	Alert,
	Modal,
	Platform,
} from "react-native";
import { TextInput as Imput } from "react-native-paper";
import Menu from "../Components/MenuTop";
import Icone from "@expo/vector-icons/MaterialCommunityIcons";
import styles, { primary, alertBack } from "../utils/Style";
import api from "../api";
import Retorno from "../Components/Retorno";
import { themeLight } from "../utils/theme";
import useConvenio from "../Data/Convenio";
import { Camera } from "expo-camera";
import Carregando from "../Components/Carregando";
import CartaoAbepom from "../Components/CartaoAbepom";

const Home = (props) => {
	const refInput = useRef(null);

	const [cartao, setCartao] = React.useState("");
	const [erro, setErro] = React.useState(false);
	const [convenio] = useConvenio();
	const [associado, setAssociado] = React.useState(null);
	const [mensagens, setMensagens] = React.useState("");
	const [camera, setCamera] = useState(false);
	const [carregando, setCarregando] = useState(false);

	useEffect(() => {
		focusInput();
	}, []);
	function focusInput() {
		refInput.current.focus();
	}
	useEffect(() => {
		(async () => {
			try {
				const { status } = await Camera.requestCameraPermissionsAsync();
				if (status !== "granted") {
					Alert.alert(
						"Permissão negada!",
						"É necessario conceder permissao para utilizar a camera",
						[
							{
								text: "Solicitar permissao novamente.",
								onPress: async () => {
									await Camera.requestPermissionsAsync();
									if (Platform.OS == "android") {
										await Camera.getAvailableCameraTypesAsync();
									} else {
										await Camera.requestPermissionsAsync();
									}
									setCamera(false);
								},
							},
							{
								text: "Cancel",
								onPress: () => {
									setCamera(false);
								},
							},
						]
					);
				}
			} catch (error) {
				console.log(error);
				setCamera(false);
			}
		})();
	}, [camera == true]);
	useEffect(() => {
		if (erro) {
			setTimeout(() => {
				setErro(false);
			}, 4000);
		}
	}, [erro]);

	const _handlerConsultaCartao = async (card) => {
		setCarregando(true);
		if (!card) {
			card = cartao;
		} else {
			if (card.length < 11) {
				setErro(true);
				setCarregando(false);
				setMensagens({
					descricao: "Cartão deve conter 11 dígitos.",
					tipo: "danger",
				});
				setAssociado("");
				return;
			}
		}
		let req = await api({
			url: "/VerificarCartao",
			params: { cartao: card, id_gds: convenio.id_gds },
			method: "GET",
			headers: { "x-access-token": convenio.token },
		});

		const { erro, socio, mensagem } = req.data;

		if (card.length === 11) {
			if (erro) {
				setCarregando(false);

				setErro(true);
				setMensagens({ descricao: mensagem, tipo: "danger" });
				setAssociado("");
			} else {
				setAssociado("");
				setAssociado(socio);
				setCarregando(false);
			}
		} else {
			setErro(true);
			setCarregando(false);
			setMensagens({
				descricao: "Cartão inválido. Digite novamente.",
				tipo: "danger",
			});
			setAssociado("");
		}
	};
	const _abrirCamera = () => {
		setAssociado("");
		setCartao("");
		setCamera(true);
	};

	return (
		<>
			<Menu {...props} title="Consulta de Cartões">
				<View style={{ alignItems: "center" }}>
					<Text
						style={{
							fontSize: 20,
							marginVertical: 20,
							fontWeight: "bold",
							color: primary,
						}}>
						Informe o cartão do associado
					</Text>

					<View
						style={[styles.input, { borderWidth: 0, backgroundColor: null }]}>
						<Imput
							ref={refInput}
							label="Cartão"
							dense
							mode="outlined"
							theme={themeLight}
							onChangeText={setCartao}
							value={cartao}
							autoFocus={true}
							style={[
								{
									width: "100%",
									fontSize: 26,
									color: primary,
									alignSelf: "flex-start",
								},
							]}
							onSubmitEditing={() => _handlerConsultaCartao()}
							render={(props) => (
								<View style={[{ flexDirection: "row" }]}>
									<TextInput
										{...props}
										keyboardType="numeric"
										maxLength={11}
										value={cartao}
										onChangeText={setCartao}
										onSubmitEditing={() => _handlerConsultaCartao()}
									/>
									<TouchableOpacity
										style={{ width: "15%" }}
										onPress={() => {
											_abrirCamera();
										}}>
										<Icone
											name="camera"
											style={{ width: "100%", color: "#1f4ba4" }}
											size={40}
										/>
									</TouchableOpacity>
								</View>
							)}
						/>
					</View>

					{carregando ? (
						<View style={{ marginTop: 7 }}>
							<Carregando />
						</View>
					) : (
						<TouchableOpacity
							style={[styles.btnDefault, { marginTop: 10 }]}
							onPress={() => _handlerConsultaCartao(cartao)}>
							<Text style={styles.btnDefaultText}> BUSCAR</Text>
						</TouchableOpacity>
					)}
				</View>
				{erro ? (
					<View style={{ width: "80%" }}>
						<Retorno type={mensagens.tipo} mensagem={mensagens.descricao} />
					</View>
				) : associado ? (
					<>
						{associado.Cartao_Recebido ? (
							<CartaoAbepom associado={associado} />
						) : (
							<View
								style={{
									margin: 20,
									padding: 20,
									backgroundColor: associado.Cartao_Recebido
										? primary
										: alertBack,

									elevation: 5,
									borderRadius: 5,
									width: "90%",
									alignSelf: "center",
									bordercolor: "#fff",
								}}>
								<Text
									style={[
										styles.textoM,
										{
											color: associado.Cartao_Recebido ? "white" : primary,
											margin: 5,
										},
									]}>
									<Text style={[styles.textoM, { fontWeight: "bold" }]}>
										Nome:{" "}
									</Text>{" "}
									{associado.dep}
								</Text>
								<Text
									style={[
										styles.textoM,
										{
											color: associado.Cartao_Recebido ? "white" : primary,
											margin: 5,
										},
									]}>
									<Text style={{ fontWeight: "bold" }}>Status: </Text>
									{associado.Cartao_Recebido
										? "Cartão Validado"
										: "Cartão não validado"}
								</Text>
								<Text
									style={[
										styles.textoM,
										{
											color: associado.Cartao_Recebido ? "white" : primary,
											margin: 5,
										},
									]}>
									<Text style={{ fontWeight: "bold" }}>Cartão: </Text>{" "}
									{associado.Nr_Cartao_Abepom}
								</Text>
								{!associado.Cartao_Recebido && (
									<Text
										style={[
											styles.textoM,
											{
												fontWeight: "bold",

												color: primary,
												margin: 5,
											},
										]}>
										Observação:{" "}
										<Text style={{ color: primary, fontWeight: "normal" }}>
											Solicite que o Associado entre na minha abepom e valide o
											seu cartão
										</Text>
									</Text>
								)}
							</View>
						)}
					</>
				) : // <>
				//   <View
				//     style={{
				//       margin: 20,
				//       padding: 20,
				//       backgroundColor: associado.Cartao_Recebido
				//         ? primary
				//         : alertBack,

				//       elevation: 5,
				//       borderRadius: 5,
				//       width: "90%",
				//       alignSelf: "center",
				//       bordercolor: "#fff",
				//     }}
				//   >
				//     <Text
				//       style={[
				//         styles.textoM,
				//         {
				//           color: associado.Cartao_Recebido ? "white" : primary,
				//           margin: 5,
				//         },
				//       ]}
				//     >
				//       <Text style={[styles.textoM, { fontWeight: "bold" }]}>
				//         Nome:{" "}
				//       </Text>{" "}
				//       {associado.dep}
				//     </Text>
				//     <Text
				//       style={[
				//         styles.textoM,
				//         {
				//           color: associado.Cartao_Recebido ? "white" : primary,
				//           margin: 5,
				//         },
				//       ]}
				//     >
				//       <Text style={{ fontWeight: "bold" }}>Status: </Text>
				//       {associado.Cartao_Recebido
				//         ? "Cartão Validado"
				//         : "Cartão não validado"}
				//     </Text>
				//     <Text
				//       style={[
				//         styles.textoM,
				//         {
				//           color: associado.Cartao_Recebido ? "white" : primary,
				//           margin: 5,
				//         },
				//       ]}
				//     >
				//       <Text style={{ fontWeight: "bold" }}>Cartão: </Text>{" "}
				//       {associado.Nr_Cartao_Abepom}
				//     </Text>
				//     {!associado.Cartao_Recebido && (
				//       <Text
				//         style={[
				//           styles.textoM,
				//           {
				//             fontWeight: "bold",

				//             color: primary,
				//             margin: 5,
				//           },
				//         ]}
				//       >
				//         Observação:{" "}
				//         <Text style={{ color: primary, fontWeight: "normal" }}>
				//           Solicite que o Associado entre na minha abepom e valide o
				//           seu cartão
				//         </Text>
				//       </Text>
				//     )}
				//   </View>
				// </>
				null}
				{camera ? (
					<View>
						<Modal visible={camera} style={{ backgroundColor: "blue" }}>
							<Camera
								captureAudio={false}
								onBarCodeScanned={(dados) => {
									if (dados.data) {
										let { data } = dados;
										let dataqrcode =
											data.substr(15, 4) +
											"-" +
											data.substr(13, 2) +
											"-" +
											data.substr(11, 2);

										if (dataqrcode == new Date().toJSON().substr(0, 10)) {
											setCartao(data.substr(0, 11));
											_handlerConsultaCartao(data.substr(0, 11));
											setCamera(false);
										} else {
											setCamera(false);

											setCartao("");

											Alert.alert(
												"Código Inválido",
												"Esse QR code não é valido, por favor solicite que o associado gere um novo QR code."
											);
										}
									}
								}}
								style={{
									flex: 1,
								}}
							/>

							<View
								style={{
									position: "absolute",
									bottom: 10,
									flex: 1,
									alignItems: "center",

									width: "100%",
								}}>
								<TouchableOpacity
									style={{
										backgroundColor: primary,
										padding: 20,
										borderRadius: 30,
									}}
									onPress={() => setCamera(false)}>
									<Icone name="close" style={30} color="#FFF" />
								</TouchableOpacity>
							</View>
						</Modal>
					</View>
				) : null}
			</Menu>
		</>
	);
};

export default Home;
