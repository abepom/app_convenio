import React, { useState, useEffect, useRef } from "react";

import { Camera } from "expo-camera";

import Icone from "@expo/vector-icons/MaterialCommunityIcons";
import {
	Modal,
	View,
	Text,
	Image,
	Alert,
	TextInput as TextInputrn,
	TouchableOpacity,
} from "react-native";
import MenuTop from "../Components/MenuTop";
import { TextInput } from "react-native-paper";
import styles, { primary, danger, danverBackground } from "../utils/Style";
import imagens from "../utils/imagens";
import api from "../api";
import Retorno from "../Components/Retorno";
import useConvenio from "../Data/Convenio";
import Carregando from "../Components/Carregando";
import ProntuarioDetalhado from "../Components/Modal/ProntuarioDetalhado.modal";

export default EfetuarVendas = (props) => {
	const refInput = useRef(null);
	const [state] = useConvenio();

	function focusInput() {
		refInput.current.focus();
	}
	useEffect(() => {
		focusInput();
	}, [props]);
	const vaziu = {
		cartao: "",
		matricula: "",
		dep: "",
	};

	useEffect(() => {

		if (props?.route?.params?.prontuario) {
			console.log(props.route.params.prontuario);
			setProntuario(props.route.params.prontuario);
			setModal(true)

		}

	}, [props?.route?.params?.prontuario]);

	const retornopadrao = { retorno: false, mensagem: "" };
	const [modal, setModal] = useState(false);
	const [prontuario, setProntuario] = useState({});
	const [associado, setassociado] = useState(vaziu);
	const [imput, setImput] = useState("");
	const [dependentes, setDependentes] = useState([]);
	const [mensagem, setMensagem] = useState("");
	const [avancar, setAvancar] = useState(false);
	const [retorno, setRetorno] = useState(retornopadrao);
	const [erro, setErro] = useState("");
	const [carregando, setcarregando] = useState(false);
	const [camera, setCamera] = useState(false);

	const _abrirCamera = () => {
		setImput("");
		setCamera(true);
	};
	useEffect(() => {
		(async () => {
			try {
				const { status } = await Camera.requestCameraPermissionsAsync();
				if (status !== "granted") {
					Alert.alert(
						"Permiss??o negada!",
						"?? necessario conceder permissao para utilizar a camera",
						[
							{
								text: "Solicitar permissao novamente.",
								onPress: async () => {
									await Camera.getCameraPermissionsAsync();
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
				setCamera(false);
			}
		})();
	}, []);
	const consultarCartao = async (cartao) => {
		if (state.tipo_lancamento != "3") {
			let verificaProcedimento = state.procedimentos.filter((item) => {
				if (!item.desabilitado) {
					return true;
				} else {
					return false;
				}
			});
			if (verificaProcedimento.length == 0 && state.tipo_lancamento != "5") {
				Alert.alert(
					"ATEN????O",
					"?? necessario possuir pelo menos um procedimento ativo.\n\nAtive um procedimento no menu procedimento ou solicite ao setor de conv??nios que cadastre pelo menos um procedimento."
				);
				return props.navigation.navigate("Start");
			}
		}
		setAvancar(false);
		setcarregando(true);
		setDependentes([]);
		setMensagem("");

		if (!!cartao) {
			try {
				const validado = await api({
					url: "/ConsultarCartao",
					method: "post",
					data: {
						cartao,
						Cd_da_area: state.cd_da_area,
					},
					headers: { "x-access-token": state.token },
				});

				if (validado.data.length) {
					if (validado.data.retorno == 1) {
						setMensagem(validado.data.mensagem);
					}
					setErro("");
					setDependentes(validado.data);
					setcarregando(false);
				} else {
					if (validado.data.avancar == 1) {
						setErro("");
						setAvancar(true);
						setMensagem(validado.data.mensagem);
						setassociado({
							cartao: imput,
							matricula: imput.substring(0, 6),
							dep: imput.substring(7, 9),
							nome: validado.data.Nome,
							titular: validado.data.titular,
						});
						setcarregando(false);
						return validado;
					} else if (validado.data.retorno == 1) {
						setErro(validado.data.mensagem);
						setcarregando(false);
					} else {
						setAvancar(false);
						setcarregando(false);
					}
					setcarregando(false);
				}
			} catch (error) {
				setErro(
					"Cart??o do associado com inconsist??ncia, favor instru??-lo para entrar em contato com a ABEPOM. Telefone: (48) 2107-0200 ou 0800 725 0200."
				);
				setAvancar(false);
				setcarregando(false);
			}
		} else {
			setErro("Informe um cart??o");
		}
		setcarregando(false);
	};
	return (
		<MenuTop {...props} drawer title="Lan??ar">
			<ProntuarioDetalhado
				visualizar={[modal, setModal]}
				Nr_lancamento={prontuario}
			/>
			<Text
				style={{
					fontWeight: "bold",
					fontSize: 20,
					width: "80%",
					alignSelf: "center",
					color: primary,
					marginVertical: 30,
				}}>
				Informe a matr??cula ou o cart??o do associado para iniciar o lan??amento.
			</Text>

			<View style={{ width: "100%", flexDirection: "row" }}>
				<TextInput
					ref={refInput}
					label="Cart??o / Matricula"
					dense
					mode="outlined"
					value={imput}
					onChangeText={setImput}
					theme={{
						colors: {
							primary: primary,
							background: "white",
							text: primary,
							placeholder: primary,
						},
					}}
					autoFocus={true}
					maxLength={11}
					keyboardType="numeric"
					style={[styles.imput, { width: "70%", fontSize: 26, color: primary }]}
					render={(props) => (
						<>
							<View
								style={{
									width: "100%",
									flexDirection: "row",
									justifyContent: "center",
								}}>
								<TextInputrn {...props} />
								<TouchableOpacity onPress={_abrirCamera}>
									<Icone
										name="camera"
										style={{ width: "100%", color: "#1f4ba4" }}
										size={40}
									/>
								</TouchableOpacity>
							</View>
						</>
					)}
				/>
				{camera ? (
					<View>
						<Modal visible={camera}>
							<Camera
								type={"back"}
								ratio="16:9"
								captureAudio={false}
								onBarCodeScanned={(dados) => {
									let { data } = dados;
									if (data) {
										let dataqrcode =
											data.substr(15, 4) +
											"-" +
											data.substr(13, 2) +
											"-" +
											data.substr(11, 2);
										if (dataqrcode == new Date().toJSON().substr(0, 10)) {
											//setImput(data.substr(0, 11));
											setCamera(false);
											consultarCartao(data.substr(0, 11)).then((dados) => {
												const info = dados.data;
												let assoc = {
													cartao: data.substr(0, 11),
													matricula: data.substr(0, 6),
													dep: data.substr(7, 9),
													nome: info.Nome,
													titular: info.titular,
												};
												setImput("");
												props.navigation.navigate("Cadastrar", {
													...assoc,
													id_gds: state.id_gds,
												});
												setMensagem("");
												setRetorno(retornopadrao);
												setassociado(vaziu);
												setAvancar(false);
											});
										} else {
											setCamera(false);
											setImput("");
											Alert.alert(
												"C??digo Inv??lido",
												"Esse QR code n??o ?? valido, por favor solicite que o associado gere um novo QR code."
											);
										}
									}
								}}
								style={{
									flex: 1,
								}}>
								<View style={styles.conteiner}>
									<Image
										source={imagens.focus}
										style={{ width: 350, height: 350, tintColor: "white" }}
									/>
								</View>
							</Camera>
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

				{!carregando ? (
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
							marginTop: 15,
							marginLeft: 10,
							elevation: 1,
						}}
						onPress={() => {
							consultarCartao(imput);
						}}>
						<Image
							source={imagens.search}
							style={{ width: 30, height: 30, margin: 5, tintColor: "white" }}
						/>
					</TouchableOpacity>
				) : (
					<Carregando style={{ margin: 30 }} size={30} />
				)}
			</View>
			{retorno.retorno && (
				<View style={{ width: "80%", marginTop: 30 }}>
					<Text style={{ fontSize: 11, color: danger }}>
						{retorno.mensagem}
					</Text>
				</View>
			)}
			{erro ? (
				<View style={{ width: "85%", marginTop: 30 }}>
					<Retorno
						type="danger"
						mensagem={erro}
						title="ATEN????O"
						fechar={() => setErro("")}
					/>
				</View>
			) : null}

			{!mensagem ? (
				dependentes && (
					<>
						{dependentes.length > 0 && (
							<Text style={{ marginTop: 30, fontSize: 20, fontWeight: "bold" }}>
								Selecione um Associado
							</Text>
						)}
						<View style={{ width: "80%" }}>
							{dependentes.map((item) => (
								<TouchableOpacity
									key={item.Cd_dependente}
									onPress={() => {
										if (item.permissao != "1") {
											Alert.alert(
												"",
												"Este dependente n??o possui permiss??o para esse tipo de atendimento. ?? necess??rio solicitar ao titular da conta essa permiss??o."
											);
										} else {
											if (item.Cartao_Recebido) {
												Alert.alert(
													"",
													"Este associado j?? possui o CART??O DO ASSOCIADO, ?? indispens??vel a apresenta????o deste para efetuar o lan??amento."
												);
											} else {
												setImput("");
												props.navigation.navigate("Cadastrar", {
													cartao: imput,
													matricula: item.Matricula,
													dep: item.Cd_dependente,
													nome: item.NOME,
													id_gds: state.id_gds,
													titular: item.titular,
												});
												setRetorno(retornopadrao);
												setDependentes([]);
												setassociado(vaziu);
												setAvancar(false);
											}
										}
									}}
									style={{
										marginTop: 20,
										padding: 10,
										width: "100%",
										backgroundColor:
											item.permissao == "1" ? "white" : danverBackground,
										elevation: 2,
										borderRadius: 5,
									}}>
									<Text style={{ fontWeight: "bold", color: primary }}>
										{" "}
										Nome:{" "}
										<Text style={{ fontWeight: "100", color: primary }}>
											{item.NOME}
										</Text>{" "}
									</Text>
									<Text style={{ fontWeight: "bold", color: primary }}>
										Dependencia:{" "}
										<Text style={{ fontWeight: "100", color: primary }}>
											{item.descri}
										</Text>
										{/* Dep: <Text style={{ fontWeight: "100", color: primary }}>{item.Cd_dependente}</Text> */}
									</Text>
								</TouchableOpacity>
							))}
						</View>
					</>
				)
			) : (
				<View
					style={{
						marginTop: 20,
						backgroundColor: "white",
						padding: 15,
						elevation: 2,
						borderRadius: 3,
					}}>
					{associado.titular != associado.nome ? (
						<>
							<Text>
								Dependente:{" "}
								<Text style={{ fontWeight: "bold" }}>{associado.nome}</Text>
							</Text>
							<Text>
								Titular:{" "}
								<Text style={{ fontWeight: "bold" }}>{associado.titular}</Text>
							</Text>
						</>
					) : (
						<Text>
							Associado:{" "}
							<Text style={{ fontWeight: "bold" }}>{associado.nome}</Text>
						</Text>
					)}

					<Text>Cart??o: {mensagem}</Text>
				</View>
			)}
			{avancar && (
				<TouchableOpacity
					onPress={() => {
						setImput("");
						props.navigation.navigate("Cadastrar", {
							...associado,
							id_gds: state.id_gds,
						});
						setMensagem("");
						setRetorno(retornopadrao);
						setassociado(vaziu);
						setAvancar(false);
					}}
					style={[
						{ marginTop: 30 },
						styles.btnDefault,
						{ paddingHorizontal: 30 },
					]}>
					<Text style={styles.btnDefaultText}>EFETUAR LAN??AMENTO</Text>
				</TouchableOpacity>
			)}
		</MenuTop>
	);
};
