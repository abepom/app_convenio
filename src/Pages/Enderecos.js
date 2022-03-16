import React, { useState, useEffect } from "react";
import {
	Text,
	View,
	ScrollView,
	Linking,
	TouchableOpacity,
	Image,
} from "react-native";

import { white, primary } from "../utils/Style";

import api from "../api";

import Retorno from "../Components/Retorno";

import useConvenio from "../Data/Convenio";
import imagens from "../utils/imagens";
const Enderecos = (props) => {
	const [mostrar, setMostrar] = useState(false);
	const [enderecosCadastrados, setEnderecosCadastrados] = useState([]);
	const [convenio] = useConvenio();
	const [retorno, setRetorno] = useState("");

	const getEnderecosCadastrados = async () => {
		const { data } = await api.get(`/user/enderecos`, {
			params: { id_gds: convenio.id_gds },
		});
		setEnderecosCadastrados(data);
	};

	useEffect(() => {
		getEnderecosCadastrados();
	}, []);

	useEffect(() => {
		if (retorno != "") {
			setTimeout(() => {
				setRetorno("");
			}, 3000);
		}
	}, [retorno]);

	return (
		<>
			{!mostrar && (
				<Text
					style={{ color: primary, marginVertical: 20, alignSelf: "center" }}>
					Lista de endereços cadastrados
				</Text>
			)}
			<ScrollView>
				<View style={{ alignItems: "center" }}>
					{retorno != "" ? (
						retorno.retorno ? (
							<View style={{ width: "80%", marginRight: "5%" }}>
								<Retorno type={retorno.tipo} mensagem={retorno.mensagem} />
							</View>
						) : (
							<Retorno type={retorno.tipo} mensagem={Retorno.mensagem} />
						)
					) : null}
					{!mostrar
						? enderecosCadastrados.map((end) => {
								return (
									<View
										key={end.id_end}
										style={{
											flexDirection: "row",
											backgroundColor: primary,
											width: "80%",
											borderRadius: 5,
											padding: 5,
											borderWidth: 1,
											borderColor: "#fff",
										}}>
										<View style={{ width: "90%" }}>
											<Text
												style={{
													backgroundColor: primary,
													color: white,
													fontSize: 11,
												}}>
												<Text style={{ fontWeight: "bold" }}>CEP:</Text>{" "}
												{end.cep}
											</Text>
											<Text
												style={{
													backgroundColor: primary,
													color: white,
													fontSize: 11,
												}}>
												<Text style={{ fontWeight: "bold" }}>Endereço:</Text>{" "}
												{end.logradouro} {end.endereco} - {end.numero}
											</Text>

											<Text style={{ color: "#fff", fontSize: 11 }}>
												<Text style={{ fontWeight: "bold" }}>Bairro:</Text>{" "}
												{end.bairro} - {end.cidade}
											</Text>

											<Text
												style={{
													backgroundColor: primary,
													color: white,
													fontSize: 11,
												}}>
												<Text style={{ fontWeight: "bold" }}>Telefone:</Text>{" "}
												{end.telefone}
											</Text>
										</View>
									</View>
								);
						  })
						: null}
					<View
						style={{
							borderBottomColor: 1,
							borderBottomColor: "#fff",
							height: 5,
							width: "80%",
						}}
					/>
				</View>
			</ScrollView>
			<View style={{ padding: 20 }}>
				<Text>
					Seu endereço mudou? Precisa incluir mais um local de atendimento?
				</Text>
				<Text>Entre em contato com o Setor de Convênios:</Text>
				<TouchableOpacity
					onPress={() => {
						Linking.openURL(`https://wa.me/5548991440708`);
					}}>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "center",
							margin: 10,
						}}>
						<Image
							source={imagens.whatsapp}
							style={{ height: 30, width: 30 }}
						/>
						<Text>(48) 99144-0708</Text>
					</View>
				</TouchableOpacity>
				<Text>Mantenha seu cadastro atualizado.</Text>
			</View>
		</>
	);
};

export default Enderecos;
