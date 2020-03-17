import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, Picker, ScrollView } from "react-native";
import { TextInput } from "react-native-paper";
import { TextInputMask, MaskService } from "react-native-masked-text";
import { Feather } from "@expo/vector-icons";
import api from "../services/api";

function SolicitarAuxilio() {
	const [parametros, setParametros] = useState({
		indice: 0,
		taxa: 0,
		valorMinimo: 0
	});
	const [parcelamento, setParcelamento] = useState(null);
	const [cidades, setCidades] = useState([]);
	const [inputs, setInputs] = useState({
		nomeEmpresa: "",
		telefone: "",
		endereco: "",
		numero: "",
		bairro: "",
		cidade: "0000",
		valor: "",
		valorMasked: "",
		parcelamentoEscolhido: {}
	});

	useEffect(() => {
		async function listarCidades() {
			const response = await api.get("/listarCidades");

			setCidades([...response.data]);
		}

		listarCidades();
	}, []);

	async function gerarSimulacao(valor) {
		const response = await api.get("/variaveisParcelamento");
		const { indice, taxa, valorMinimo } = response.data;
		let parcelas = [];
		let parcela = { quantidade: 1, valorParcela: valor };
		parcelas.push(parcela);

		setInputs({ ...inputs, parcelamentoEscolhido: parcela });

		setParametros({
			indice,
			taxa,
			valorMinimo
		});

		let quantidadeMaxima =
			Math.round(valor / valorMinimo) > 24
				? 24
				: Math.round(valor / valorMinimo);

		for (let i = 2; i <= quantidadeMaxima; i++) {
			let valorParcela = Math.round(valor / i);

			let parcela = {
				quantidade: i,
				valorParcela
			};

			parcelas.push(parcela);
		}

		setParcelamento(parcelas);
	}

	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				paddingHorizontal: 20
			}}>
			<ScrollView style={{ paddingTop: 20 }}>
				<TextInput
					label="Nome da Empresa"
					value={inputs.nomeEmpresa}
					mode="outlined"
					onChangeText={texto => setInputs({ nomeEmpresa: texto })}
					style={{ marginBottom: 10 }}
				/>
				<TextInput
					label="Telefone"
					value={inputs.telefone}
					mode="outlined"
					onChangeText={texto => setInputs({ telefone: texto })}
					style={{ marginBottom: 10 }}
					render={props => (
						<TextInputMask
							{...props}
							type={"cel-phone"}
							options={{
								maskType: "BRL",
								withDDD: true,
								dddMask: "(99) "
							}}
						/>
					)}
				/>
				<TextInput
					label="Endereço"
					value={inputs.endereco}
					mode="outlined"
					onChangeText={texto => setInputs({ endereco: texto })}
					style={{ marginBottom: 10 }}
				/>
				<View style={{ flexDirection: "row" }}>
					<View style={{ flex: 1, marginRight: 5 }}>
						<TextInput
							label="Número"
							value={inputs.numero}
							mode="outlined"
							onChangeText={texto => setInputs({ numero: texto })}
							style={{ marginBottom: 10 }}
						/>
					</View>
					<View style={{ flex: 2, marginLeft: 5 }}>
						<TextInput
							label="Bairro"
							value={inputs.bairro}
							mode="outlined"
							onChangeText={texto => setInputs({ bairro: texto })}
							style={{ marginBottom: 10 }}
						/>
					</View>
				</View>
				<TextInput
					label="Cidade"
					value={inputs.cidade}
					mode="outlined"
					onChangeText={texto => setInputs({ cidade: texto })}
					style={{ marginBottom: 10 }}
					render={props => (
						<Picker
							prompt="Selecione uma Cidade"
							selectedValue={inputs.cidade}
							onValueChange={(itemValue, itemIndex) => {
								setInputs({ cidade: itemValue });
							}}>
							{cidades.map(cidade => (
								<Picker.Item
									key={cidade.codigo}
									value={cidade.codigo}
									label={cidade.nome}
								/>
							))}
						</Picker>
					)}
				/>
				<View style={{ flexDirection: "row" }}>
					<View style={{ flex: 4 }}>
						<TextInput
							label="Valor do Orçamento"
							value={inputs.valor}
							mode="outlined"
							style={{ marginBottom: 10 }}
							onChangeText={texto => {
								setInputs({ valor: texto });
							}}
							render={props => (
								<TextInputMask
									{...props}
									type={"money"}
									options={{
										maskType: "BRL"
									}}
								/>
							)}
						/>
					</View>
					<View
						style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
						<TouchableOpacity
							onPress={() => {
								gerarSimulacao(MaskService.toRawValue("money", inputs.valor));
							}}
							style={{
								backgroundColor: "#04254e",
								width: 50,
								height: 50,
								borderRadius: 25,
								justifyContent: "center",
								alignItems: "center"
							}}>
							<Feather name="dollar-sign" size={20} color="#fff" />
						</TouchableOpacity>
					</View>
				</View>
				{parcelamento ? (
					<>
						<TextInput
							label="Parcelamento"
							mode="outlined"
							value={inputs.parcelamentoEscolhido}
							onChangeText={texto =>
								setInputs({ parcelamentoEscolhido: texto })
							}
							style={{ marginBottom: 10 }}
							render={props => (
								<Picker
									prompt="Selecione uma opção de parcelamento"
									selectedValue={inputs.parcelamentoEscolhido}
									onValueChange={(itemValue, itemIndex) => {
										setInputs({ parcelamentoEscolhido: itemValue });
									}}>
									{parcelamento.map((parcela, index) => (
										<Picker.Item
											key={`a${index}`}
											value={parcela}
											label={`${parcela.quantidade} x ${MaskService.toMask(
												"money",
												parcela.valorParcela
											)}`}></Picker.Item>
									))}
								</Picker>
							)}
						/>
						<TouchableOpacity
							style={{
								backgroundColor: "#12aa12",
								justifyContent: "center",
								alignItems: "center",
								padding: 10,
								borderRadius: 10
							}}
							onPress={() => {}}>
							<Text style={{ color: "#fff" }}>PRÓXIMO PASSO</Text>
						</TouchableOpacity>
					</>
				) : null}
			</ScrollView>
		</View>
	);
}
export default SolicitarAuxilio;
