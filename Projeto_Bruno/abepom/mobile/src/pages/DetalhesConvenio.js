import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	Image,
	Linking
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import styles, { tema } from "../../assets/stylesheet/Style";
import Header from "../components/Header";
import imagens from "../utils/imagens";
import api from "../services/api";

function DetalhesConvenio(props) {
	const [enderecos, setEnderecos] = useState([]);
	const [dados, setDados] = useState({});
	const [areas, setAreas] = useState([]);
	const [palavras, setPalavras] = useState([]);
	const [carregado, setCarregado] = useState(false);

	async function carregarEnderecos() {
		setCarregado(false);
		const response = await api.get("/enderecosConvenio", {
			params: {
				id_gds: props.codigo
			}
		});

		setEnderecos([...response.data]);
	}

	async function carregarDados() {
		setCarregado(false);
		const response = await api.get("/dadosConvenio", {
			params: {
				id_gds: props.codigo
			}
		});

		setDados(response.data);
		setAreas(response.data.areas ? JSON.parse(`${response.data.areas}`) : null);
		setPalavras(
			response.data.palavras ? JSON.parse(`${response.data.palavras}`) : null
		);
	}

	useEffect(() => {
		carregarEnderecos();
		carregarDados();
		setCarregado(true);
	}, []);

	return (
		<>
			<View style={[styles.background, { height: "100%" }]}>
				<Header
					{...props}
					titulo="Detalhes do Convênio"
					fechar={props.setModal}
				/>
				{!carregado ? (
					<View style={[styles.centralizado, { flex: 1 }]}>
						<ActivityIndicator animating={true} size={60} />
					</View>
				) : (
						<>
							<ScrollView style={[{ marginHorizontal: 20 }]}>
								{!!dados.caminho_logomarca ? (
									<View style={{ padding: 10, alignItems: "center" }}>
										<Image
											source={{ uri: dados.caminho_logomarca }}
											style={styles.logomarcaConvenio}
										/>
									</View>
								) : null}
								<View style={[styles.centralizado, { padding: 10 }]}>
									<Text style={{ fontSize: 16, fontWeight: "bold" }}>
										{dados.nome}
									</Text>
								</View>
								{!!areas && (
									<View style={styles.fieldSet}>
										<Text style={styles.tituloFieldSet}>ÁREAS DE ATUAÇÃO</Text>
										<ScrollView horizontal showsHorizontalScrollIndicator={false}>
											<View style={[styles.linha, { marginTop: 10 }]}>
												{areas.map(({ area }, index) => (
													<View key={index}>
														<Text
															style={[
																styles.etiquetasConvenio,
																{
																	backgroundColor: tema.colors.background,
																	color: tema.colors.primary
																}
															]}
														>
															{area.trim().toUpperCase()}
														</Text>
													</View>
												))}
											</View>
										</ScrollView>
									</View>
								)}
								{!!palavras && (
									<View style={styles.fieldSet}>
										<Text style={styles.tituloFieldSet}>DIFERENCIAIS</Text>
										<ScrollView horizontal showsHorizontalScrollIndicator={false}>
											<View style={[styles.linha, { marginTop: 10 }]}>
												{palavras.map(({ palavra }, index) => (
													<View key={index}>
														<Text style={styles.etiquetasConvenio}>
															{palavra.trim().toUpperCase()}
														</Text>
													</View>
												))}
											</View>
										</ScrollView>
									</View>
								)}
								<View style={styles.fieldSet}>
									<Text style={styles.tituloFieldSet}>BENEFÍCIO</Text>
									<Text>
										{!!dados.desconto_em_folha ? (
											<Text>DESCONTO EM FOLHA</Text>
										) : dados.desconto > 0 ? (
											<Text>ATÉ {dados.desconto}% DE DESCONTO</Text>
										) : (
													""
												)}
									</Text>
								</View>
								{!!dados.site || !!dados.facebook || !!dados.instagram || !!dados.twitter || !!dados.linkedin ? (
									<View style={styles.fieldSet}>
										<Text style={styles.tituloFieldSet}>ENCONTRE O CONVÊNIO</Text>
										<View style={styles.linha}>
											{!!dados.site && (
												<TouchableOpacity
													onPress={() => {
														Linking.openURL(dados.site);
													}}
													style={[styles.botaoRedeSocial, styles.centralizado]}
												>
													<Image
														source={imagens.site}
														style={styles.imagemRedeSocial}
													/>
												</TouchableOpacity>
											)}
											{!!dados.facebook && (
												<TouchableOpacity
													onPress={() => {
														Linking.openURL(`fb://facewebmodal/f?href=abepom`);
													}}
													style={[styles.botaoRedeSocial, styles.centralizado]}
												>
													<Image
														source={imagens.facebook}
														style={styles.imagemRedeSocial}
													/>
												</TouchableOpacity>
											)}
											{!!dados.instagram && (
												<TouchableOpacity
													onPress={() => {
														Linking.openURL(
															`http://instagram.com/${dados.instagram}`
														);
													}}
													style={[styles.botaoRedeSocial, styles.centralizado]}
												>
													<Image
														source={imagens.instagram}
														style={styles.imagemRedeSocial}
													/>
												</TouchableOpacity>
											)}
											{!!dados.linkedin && (
												<TouchableOpacity
													onPress={() => {
														Linking.openURL(
															`http://linkedin.com/${dados.linkedin}`
														);
													}}
													style={[styles.botaoRedeSocial, styles.centralizado]}
												>
													<Image
														source={imagens.linkedin}
														style={styles.imagemRedeSocial}
													/>
												</TouchableOpacity>
											)}
											{!!dados.twitter && (
												<TouchableOpacity
													onPress={() => {
														Linking.openURL(`http://twitter.com/${dados.twitter}`);
													}}
													style={[styles.botaoRedeSocial, styles.centralizado]}
												>
													<Image
														source={imagens.twitter}
														style={styles.imagemRedeSocial}
													/>
												</TouchableOpacity>
											)}
										</View>
									</View>
								) : null}
								<View style={styles.fieldSet}>
									<Text style={styles.tituloFieldSet}>ENDEREÇOS E TELEFONES</Text>
									<ScrollView>
										{enderecos.map((endereco, index) => (
											<View
												key={index}
												style={[
													styles.centralizado,
													styles.blocoEndereco,
													styles.linha
												]}
											>
												<View
													style={{
														flex: 6,
														height: "100%",
														justifyContent: "center"
													}}
												>
													<Text style={{ fontSize: 13, fontWeight: "bold" }}>
														{endereco.endereco && endereco.numero
															? endereco.endereco.toUpperCase() +
															", " +
															endereco.numero
															: endereco.endereco.toUpperCase()}
													</Text>
													{!!endereco.complemento ? (
														<Text style={{ fontSize: 13 }}>
															{endereco.complemento}
														</Text>
													) : null}
													{!!endereco.bairro && (
														<Text style={{ fontSize: 13 }}>
															BAIRRO: {endereco.bairro}
														</Text>
													)}
													{!!endereco.cep && (
														<Text style={{ fontSize: 13 }}>
															CEP: {endereco.cep}
														</Text>
													)}
													{!!endereco.nome_cidade && (
														<Text style={{ fontSize: 13 }}>
															CIDADE: {endereco.nome_cidade}
														</Text>
													)}
												</View>
												<View
													style={[
														styles.centralizado,
														{ flex: 1, height: "100%" }
													]}
												>
													<TouchableOpacity onPress={() => { }}>
														<Image
															source={imagens.mapa}
															style={{ width: 25, height: 25 }}
														/>
													</TouchableOpacity>
													{!!endereco.telefone && (
														<TouchableOpacity
															onPress={() => {
																Linking.openURL(`tel:${endereco.telefone}`);
															}}
															style={{ marginTop: 7 }}
														>
															<Image
																source={imagens.telefone}
																style={{
																	width: 25,
																	height: 25
																}}
															/>
														</TouchableOpacity>
													)}
													{!!endereco.whatsapp && (
														<TouchableOpacity
															onPress={() => {
																Linking.openURL(
																	`https://wa.me/55${endereco.whatsapp}`
																);
															}}
															style={{ marginTop: 7 }}
														>
															<Image
																source={imagens.whatsapp}
																style={{ width: 25, height: 25 }}
															/>
														</TouchableOpacity>
													)}
												</View>
											</View>
										))}
									</ScrollView>
								</View>
								<View style={{ height: 60 }}></View>
							</ScrollView>
							<View
								style={[
									styles.linha,
									styles.centralizado,
									{ position: "absolute", bottom: 0, width: "100%" }
								]}
							>
								<TouchableOpacity
									style={[styles.centralizado, styles.botaoFechar]}
									onPress={() => {
										props.setModal(false);
									}}
								>
									<Image
										source={imagens.fechar}
										style={{ width: 20, height: 20 }}
										tintColor={tema.colors.background}
									/>
								</TouchableOpacity>
							</View>
						</>
					)}
			</View>
		</>
	);
}

export default DetalhesConvenio;
