import React, { useState, useEffect } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-paper";
import api from "../../api";
import { danger, primary } from "../../utils/Style";
import { themeLight } from "../../utils/theme";
import Carregando from "../Carregando";
import useConvenio from "../../Data/Convenio";
// import { Container } from './styles';

const ModalValidarLancamento = (props) => {
	const { modal, setModal, fun, matricula, dep, valor, parcela } = props;
	const [carregando, setCarregando] = useState(false);
	const [erro, setErro] = useState(false);
	const [{ token }] = useConvenio();
	const [cod, setCod] = useState("erro");
	const [codigoAssociado, setCodigoAssociado] = useState("");

	const validar = () => {
		setCarregando(true);
		if (cod == codigoAssociado) {
			setCarregando(true);

			fun();
			setTimeout(() => {
				setCarregando(false);
			}, 4000);
		} else {
			setErro(true);
		}
	};
	const enviarCodigo = async () => {
		setErro(false);

		setCarregando(true);
		try {
			const { data } = await api({
				url: "/enviarAutorizacao",
				method: "POST",
				data: { matricula, dep, valor, parcela },
				headers: { "x-access-token": token },
			});

			setCod(data.token);

			setTimeout(() => {
				setCarregando(false);
			}, 1000);
		} catch (error) {}
	};
	useEffect(() => {
		if (modal) {
			enviarCodigo();
		}
	}, [modal]);

	return (
		<Modal visible={modal} transparent>
			{!carregando ? (
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
							Esse código será enviado atravéz do email, whastsapp e notificação
							do app ABEPOM Mobile
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
