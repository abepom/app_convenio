import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import styles from "../../assets/stylesheet/Style";
import Header from "../components/Header";
import api from "../services/api";

function Dependentes(props) {
	const { navigation } = props;
	const [dependentes, setDependentes] = useState([]);
	const [carregado, setCarregado] = useState(false);
	const data = new Date();
	const dia = data.getDate();
	const mes = data.getMonth() + 1;

	async function carregarDependentes() {
		const response = await api.get("/listarDependentes", {
			params: {
				cartao: "00395900001"
			}
		});

		setDependentes([...response.data]);
		setCarregado(true);
	}

	useEffect(() => {
		carregarDependentes();
	}, []);

	async function validarCartao(id) {
		dependentes.find(dep => dep.cont === id).cartao_recebido = true;

		setDependentes([...dependentes]);

		await api.post("/validarCartao", {
			cartao: "00000100001",
			dependente: id,
			bloquear: (dependente = "00" ? 0 : 1)
		});
	}

	async function solicitarCartao(id) {
		dependentes.find(dep => dep.cont === id).cartao_solicitado = true;

		setDependentes([...dependentes]);

		await api.post("/solicitarCartao", {
			cartao: "00000100001",
			dependente: id
		});
	}

	return (
		<>
			<Header titulo="Meus Dependentes" {...props} voltar />
			<View style={{ flex: 1, backgroundColor: "#f1f1f1" }}>
				<View style={{ flex: 4, alignItems: "center", marginTop: 10 }}>
					{!carregado ? (
						<View style={[styles.centralizado, { flex: 1 }]}>
							<ActivityIndicator animating={true} size={60} />
						</View>
					) : (
						<ScrollView style={styles.scrollDependentes}>
							{dependentes.map((dependente, index) => (
								<View
									key={index}
									style={[
										styles.blocoScroll,
										styles.linha,
										styles.centralizado
									]}>
									<View style={[styles.centralizado, { flex: 2 }]}>
										{dependente.caminho_imagem ? (
											<Image
												source={{ uri: dependente.caminho_imagem }}
												style={styles.imagemDependente}
											/>
										) : (
											<Image
												source={require("../../assets/img/dependente.png")}
												style={styles.imagemDependente}
											/>
										)}
									</View>
									<View style={{ flex: 6, justifyContent: "center" }}>
										<Text style={{ fontSize: 13, fontWeight: "bold" }}>
											{dependente.nome}
										</Text>
										<View style={styles.linha}>
											<Text style={{ fontSize: 11 }}>
												Data de Nascimento: {dependente.data_nascimento}
											</Text>
											{dia ===
												parseInt(dependente.data_nascimento.substring(0, 2)) &&
											mes ===
												parseInt(dependente.data_nascimento.substring(3, 5)) ? (
												<Image
													source={require("../../assets/img/presente.png")}
													style={{ width: 15, height: 15, marginLeft: 5 }}
												/>
											) : null}
										</View>
										<Text style={{ fontSize: 12 }}>
											{dependente.tipo.toUpperCase()}
										</Text>
									</View>
									<View
										style={[styles.centralizado, { flex: 1, height: "100%" }]}>
										{dependente.cartao_solicitado ? (
											// CARTÃO SOLICITADO
											<Image
												source={require("../../assets/img/em_producao.png")}
												style={styles.iconeDependente}
											/>
										) : dependente.cartao_enviado &&
										  !dependente.cartao_recebido ? (
											// CARTÃO ENVIADO E DISPONÍVEL PARA VALIDAÇÃO
											<>
												<Image
													source={require("../../assets/img/enviado.png")}
													style={styles.iconeDependente}
												/>
												<TouchableOpacity
													onPress={() => {
														validarCartao(dependente.cont);
													}}>
													<Image
														source={require("../../assets/img/validar.png")}
														style={styles.iconeDependente}
													/>
												</TouchableOpacity>
											</>
										) : dependente.cartao_enviado &&
										  dependente.cartao_recebido ? (
											// CARTÃO VALIDADO
											<>
												<TouchableOpacity
													onPress={() => {
														navigation.navigate("LiberarPermissao", {
															cont: dependente.cont,
															nome: dependente.nome,
															imagem: dependente.caminho_imagem,
															tipo: dependente.tipo.toUpperCase()
														});
													}}>
													<Image
														source={require("../../assets/img/permissoes.png")}
														style={styles.iconeDependente}
													/>
												</TouchableOpacity>
												<Image
													source={require("../../assets/img/em_uso.png")}
													style={styles.iconeDependente}
												/>
											</>
										) : (
											// CARTÃO NÃO SOLICITADO, ENVIADO OU RECEBIDO. OPÇÃO PARA SOLICITAR!
											<TouchableOpacity
												onPress={() => {
													solicitarCartao(dependente.cont);
												}}>
												<Image
													source={require("../../assets/img/solicitar_cartao.png")}
													style={styles.iconeDependente}
												/>
											</TouchableOpacity>
										)}
									</View>
								</View>
							))}
						</ScrollView>
					)}
				</View>
				<View style={{ flex: 1, marginTop: 10, alignItems: "center" }}>
					<Text style={{ fontSize: 10, marginBottom: 10 }}>
						Legendas das Situações do Cartão
					</Text>
					<View style={[styles.linha, { flex: 1, width: "90%" }]}>
						<View style={styles.containerLegenda}>
							<Image
								source={require("../../assets/img/solicitar_cartao.png")}
								style={styles.iconeDependente}
							/>
							<Text style={styles.textoLegenda}>SOLICITAR</Text>
						</View>
						<View style={styles.containerLegenda}>
							<Image
								source={require("../../assets/img/em_producao.png")}
								style={styles.iconeDependente}
							/>
							<Text style={styles.textoLegenda}>EM PRODUÇÃO</Text>
						</View>
						<View style={styles.containerLegenda}>
							<Image
								source={require("../../assets/img/enviado.png")}
								style={styles.iconeDependente}
							/>
							<Text style={styles.textoLegenda}>ENVIADO</Text>
						</View>
						<View style={styles.containerLegenda}>
							<Image
								source={require("../../assets/img/validar.png")}
								style={styles.iconeDependente}
							/>
							<Text style={styles.textoLegenda}>VALIDAR</Text>
						</View>
						<View style={styles.containerLegenda}>
							<Image
								source={require("../../assets/img/em_uso.png")}
								style={styles.iconeDependente}
							/>
							<Text style={styles.textoLegenda}>EM USO</Text>
						</View>
						<View style={styles.containerLegenda}>
							<Image
								source={require("../../assets/img/permissoes.png")}
								style={styles.iconeDependente}
							/>
							<Text style={styles.textoLegenda}>PERMISSÕES</Text>
						</View>
					</View>
				</View>
				<View style={{ flex: 3, marginTop: 10, alignItems: "center" }}>
					<View style={[styles.linha, { flex: 1, width: "90%" }]}>
						<View style={[styles.centralizado, { flex: 1 }]}>
							<Image
								source={require("../../assets/img/info.png")}
								style={styles.iconeDependente}
							/>
						</View>
						<View style={{ flex: 7, justifyContent: "center" }}>
							<Text style={{ fontSize: 15 }}>Como adicionar dependentes?</Text>
						</View>
					</View>
					<View style={{ flex: 2, width: "90%" }}>
						<Text style={{ fontSize: 12, textAlign: "justify" }}>
							Filho até 24 anos: Certidão de nascimento, CPF ou RG e comprovante
							de matrícula se for universitário. Acima de 24 anos é cobrado uma
							taxa suplementar conforme estabelecida na Diretriz 02/2017.
						</Text>
					</View>
					<View style={[styles.linha, { flex: 1, width: "90%" }]}>
						<View style={[styles.linha, { flex: 1 }]}>
							<Image
								source={require("../../assets/img/info.png")}
								style={styles.iconeDependente}
							/>
						</View>
						<View style={{ flex: 7, justifyContent: "center" }}>
							<Text style={{ fontSize: 15 }}>Como excluir dependentes?</Text>
						</View>
					</View>
					<View style={{ flex: 2, width: "90%" }}>
						<Text style={{ fontSize: 12, textAlign: "justify" }}>
							É necessário preencher o requerimento de exclusão. Se completar a
							maior idade, a qualidade de dependente perde a validade.
						</Text>
					</View>
				</View>
			</View>
		</>
	);
}

export default Dependentes;
