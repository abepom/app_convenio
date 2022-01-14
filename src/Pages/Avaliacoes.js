import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	Image,
	TouchableOpacity,
	RefreshControl,
	Dimensions,
	Modal,
} from "react-native";
import api from "../api";
import imagens from "../utils/imagens";
import { Rating } from "react-native-ratings";
import styles, { primary, danger } from "../utils/Style";
import useConvenio from "../Data/Convenio";
import useLoad from "../Data/Load";
import MenuTop from "../Components/MenuTop";

import { danverBackground } from "../utils/Style";
import { FlatList } from "react-native-gesture-handler";
import Carregando from "../Components/Carregando";

export default function telas(props) {
	const [refreshing, setRefreshing] = useState(false);
	const [{ id_gds }] = useConvenio();
	const [load, setLoad] = useLoad();
	const [carregando, setCarregando] = useState(true);
	const [votos, setVotos] = useState(0);
	const [media, setMedia] = useState(5);
	const [avaliacoes, setAvaliacoes] = useState([]);
	const [modal, setModal] = useState(true);
	const [modalRemover, setModalRemover] = useState(false);
	const [avaliacao, setAvaliacao] = useState({});
	useEffect(() => {
		if (load !== "Avaliacoes" && load !== "todos") {
			consultarAvaliacoes();

			setLoad(null);
		}
	}, []);
	useEffect(() => {
		if (load == "Avaliacoes" || load == "todos") {
			consultarAvaliacoes();
			setLoad(null);
		}
	}, [load]);

	const RemoverComentario = async (id) => {
		try {
			const { data } = await api.post(`/user/removerAvaliacao`, { id });
			if (data.retorno) {
				consultarAvaliacoes();
			}

			setModalRemover(false);
		} catch (error) {}
	};

	const consultarAvaliacoes = async () => {
		try {
			setCarregando(true);
			const { data } = await api.get(`/user/avaliacoes`, {
				params: { id_gds },
			});
			let mediaTemp;
			let votosTemp;
			let avaliacoesTemp = [];

			data.forEach((dados, i) => {
				if (dados.votos) {
					votosTemp = dados.votos;
					mediaTemp = dados.media;
				} else {
					if (dados.media != 5) {
						avaliacoesTemp.push(dados);
					}
				}
				if (data.length == i + 1) {
					setMedia(mediaTemp ? mediaTemp : 5.0);
					if (avaliacoesTemp.length == 0) {
						setAvaliacoes([{ erro: true }]);
					} else {
						setAvaliacoes(avaliacoesTemp);
					}

					setVotos(votosTemp ? votosTemp : 0);
				}
			});

			setCarregando(false);
		} catch (error) {}
	};

	return (
		<>
			<Modal transparent visible={modalRemover} {...props}>
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
							width: "95%",

							alignItems: "center",

							borderRadius: 5,
							elevation: 2,
						}}>
						{!!avaliacao ? (
							<>
								<Text style={[styles.textoM, { color: primary, padding: 10 }]}>
									{avaliacao.data_avaliacao_convenio
										? "Comentario já foi avaliado pelo setor de convênio não poderá ser removido"
										: "Solicitar análise do comentário selecionado?"}
								</Text>
								<View
									style={{
										width: "100%",
										backgroundColor: "white",

										padding: 15,
										elevation: 4,
										borderRadius: 5,
									}}>
									<View
										style={{
											flexDirection: "row",
											justifyContent: "space-between",
											width: "100%",
										}}>
										<Text
											style={[
												styles.textoM,
												{ fontWeight: "bold", color: primary },
											]}>
											{avaliacao["Nome do dependente"]
												? avaliacao["Nome do dependente"].split(" ")[0]
												: ""}{" "}
											<Text
												style={[styles.textoP, { color: "#999", top: -10 }]}>
												{avaliacao.data_utilizacao}
											</Text>
										</Text>
										<Text>
											<Image
												source={imagens.star_cheia}
												style={{ width: 20, height: 20 }}
											/>{" "}
											{avaliacao.avaliacao}
										</Text>
									</View>
									<View
										style={{
											flexDirection: "row",
											justifyContent: "space-between",
											width: "100%",
										}}>
										<Text style={[styles.textoM]}>{avaliacao.comentario}</Text>
									</View>
								</View>
								<View style={{ width: "100%", flexDirection: "row" }}>
									{avaliacao.data_avaliacao_convenio ? null : (
										<TouchableOpacity
											onPress={() =>
												RemoverComentario(avaliacao.id_avaliacao_convenio)
											}
											style={{
												justifyContent: "flex-end",
												flex: 1,
												backgroundColor: danger,
												alignItems: "center",
												marginTop: 3,
												borderBottomLeftRadius: 5,
											}}>
											<Text
												style={[
													styles.textoG,
													{
														color: "white",
														padding: 10,
													},
												]}>
												SOLICITAR ANÁLISE
											</Text>
										</TouchableOpacity>
									)}
									<TouchableOpacity
										onPress={() => setModalRemover(false)}
										style={{
											justifyContent: "flex-end",
											flex: 1,
											backgroundColor: primary,
											alignItems: "center",
											marginTop: 3,

											borderBottomRightRadius: 5,
										}}>
										<Text
											style={[
												styles.textoG,
												{
													color: "white",
													marginHorizontal: 20,
													padding: 10,
												},
											]}>
											FECHAR
										</Text>
									</TouchableOpacity>
								</View>
							</>
						) : (
							<>
								<Text
									style={[
										styles.textoM,
										{ color: primary, paddingVertical: 10 },
									]}>
									Já foi Solicitado Análise da avaliação
								</Text>
								<TouchableOpacity
									onPress={() => setModalRemover(false)}
									style={{
										justifyContent: "flex-end",
										width: "100%",
										backgroundColor: primary,
										alignItems: "center",
										marginTop: 3,
										borderBottomLeftRadius: 5,
										borderBottomRightRadius: 5,
									}}>
									<Text
										style={[
											styles.textoG,
											{
												color: "white",
												marginHorizontal: 20,
												padding: 10,
											},
										]}>
										FECHAR
									</Text>
								</TouchableOpacity>
							</>
						)}
					</View>
				</View>
			</Modal>
			<Modal visible={modal} transparent animationType="fade">
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

							alignItems: "center",
							paddingTop: 10,

							borderRadius: 5,
							elevation: 2,
						}}>
						<Text
							style={[styles.textoG, { color: primary, marginHorizontal: 20 }]}>
							Para remover algum comentário que possua algum conteúdo impróprio,
							selecione-o e marque a opção excluir.
						</Text>
						<Text
							style={[styles.textoG, { color: primary, marginHorizontal: 20 }]}>
							Esse comentário será encaminhado para o setor de Convênios para
							análise.
						</Text>
						<TouchableOpacity
							onPress={() => setModal(false)}
							style={{
								justifyContent: "flex-end",
								width: "100%",
								backgroundColor: primary,
								alignItems: "center",
								marginTop: 15,
								borderBottomLeftRadius: 5,
								borderBottomRightRadius: 5,
							}}>
							<Text
								style={[
									styles.textoG,
									{
										color: "white",
										marginHorizontal: 20,
										padding: 10,
									},
								]}>
								FECHAR
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
			<MenuTop
				drawer
				{...props}
				title={"Avaliações"}
				imagemConf={imagens.loop}
				funcConfig={() => {
					consultarAvaliacoes();
				}}
				header={
					votos > 0 ? (
						<View style={{ width: "80%", alignItems: "center" }}>
							<View
								style={{
									marginTop: 20,
									width: "100%",
									flexDirection: "row",
									justifyContent: "space-between",
									marginTop: 10,
								}}>
								<View style={{ alignItems: "center", width: "100%" }}>
									<Rating
										type="custom"
										ratingImage={imagens.star}
										ratingColor="#ff0"
										ratingCount={5}
										imageSize={30}
										readonly={true}
										startingValue={media}
									/>
									{votos > 1 ? (
										<Text style={styles.textoP}>{`${votos}`} AVALIAÇÕES</Text>
									) : (
										<Text style={styles.textoP}>{`${votos}`} AVALIAÇÃO</Text>
									)}
									<Text style={styles.textoM}> Media: {media.toFixed(2)}</Text>
									{/* <Text style={styles.textoP}> Pendentes: {pendentes}</Text> */}
								</View>
							</View>
						</View>
					) : null
				}>
				<FlatList
					ListEmptyComponent={() => <Carregando />}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={consultarAvaliacoes}
						/>
					}
					data={avaliacoes}
					style={{ width: "90%" }}
					keyExtractor={(item, index) => index}
					renderItem={({ item }) => {
						if (item.erro) {
							return (
								<View style={{ height: Dimensions.get("screen").height }}>
									<View
										style={{
											backgroundColor: "white",
											marginVertical: 5,
											padding: 15,
											elevation: 4,
											borderRadius: 5,
										}}>
										<Text style={{ fontWeight: "bold", color: primary }}>
											Nenhuma avaliação foi realizada
										</Text>
									</View>
								</View>
							);
						}
						return (
							<View style={{ width: "100%" }}>
								<TouchableOpacity
									onPress={() => {
										if (!item.avaliacao_solicitada_convenio) {
											setModalRemover(true);
											setAvaliacao(item);
										} else {
											setModalRemover(true);
											setAvaliacao(false);
										}
									}}
									style={{
										backgroundColor: item.avaliacao_solicitada_convenio
											? danverBackground
											: "white",
										marginVertical: 5,
										padding: 15,
										elevation: 4,
										borderRadius: 5,
									}}>
									<View
										style={{
											flexDirection: "row",
											justifyContent: "space-between",
											width: "100%",
										}}>
										<Text
											style={[
												styles.textoM,
												{ fontWeight: "bold", color: primary },
											]}>
											{item["Nome do dependente"].split(" ")[0]}{" "}
											<Text
												style={[styles.textoP, { color: "#999", top: -10 }]}>
												{item.data_utilizacao}
											</Text>
										</Text>
										<Text>
											<Image
												source={imagens.star_cheia}
												style={{ width: 20, height: 20 }}
											/>{" "}
											{item.avaliacao}
										</Text>
									</View>
									<View
										style={{
											flexDirection: "row",
											justifyContent: "space-between",
											width: "100%",
										}}>
										<Text style={[styles.textoM, { maxWidth: "95%" }]}>
											{!item.data_avaliacao_convenio && item.comentario}
										</Text>
									</View>
								</TouchableOpacity>
							</View>
						);
					}}
				/>
			</MenuTop>
			<View
				style={{
					flexDirection: "row",
					width: "100%",
					justifyContent: "space-around",
				}}>
				<Text
					style={[
						styles.textoM,
						{
							margin: 10,
							paddingVertical: 10,
							paddingHorizontal: 25,
							backgroundColor: danverBackground,
							borderRadius: 5,
							elevation: 2,
						},
					]}>
					Análise
				</Text>
				<Text
					style={[
						styles.textoM,
						{
							margin: 10,
							paddingVertical: 10,
							paddingHorizontal: 25,
							backgroundColor: "white",
							borderRadius: 5,
							elevation: 2,
						},
					]}>
					Publicado
				</Text>
			</View>
		</>
	);
}
