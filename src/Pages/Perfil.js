import React, { useState, useEffect } from "react";
import {
	View,
	StyleSheet,
	Dimensions,
	Text,
	Image,
	TouchableOpacity,
	Alert,
	Modal,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import DadosGerais from "./DadosGerais";
import Enderecos from "./Enderecos";
import AlterarSenha from "./AlterarSenha";
import styles, { primary } from "../utils/Style";
import imagens from "../utils/imagens";
import * as Permissions from "expo-permissions";
import Icone from "@expo/vector-icons/MaterialCommunityIcons";
import icone from "../../assets/img/abepom.png";
import { Rating } from "react-native-ratings";
import * as ImagePicker from "expo-image-picker";
import api from "../api";
import useConvenio from "../Data/Convenio";
import Carregando from "../Components/Carregando";

const initialLayout = { width: Dimensions.get("window").width };

export default function TabViewExample(props) {
	const [modal, setModal] = useState(false);
	const [index, setIndex] = useState(0);
	const [carregandoIMG, setCarregandoIMG] = useState(false);
	const [avaliacao, setAvaliacao] = useState({
		carregando: true,
		votos: 0,
		media: 5.0,
	});
	const [convenio, setConvenio] = useConvenio();
	useEffect(() => {
		consultarAvaliacoes(convenio.id_gds);
	}, []);

	const consultarAvaliacoes = async (id_gds) => {
		setAvaliacao({ ...avaliacao, carregando: true });
		await api
			.get(`/user/avaliacoes`, { params: { id_gds } })
			.then(({ data }) => {
				data.map(({ votos, media }) => {
					if (media) {
						setAvaliacao({
							...avaliacao,
							votos: votos ? votos : 0,
							media: media ? media : 5.0,
							carregando: false,
						});
					}
				});
			});
	};
	const [routes] = useState([
		{ key: "1", title: "Dados Gerais" },
		{ key: "2", title: "Endereços" },
		{ key: "3", title: "Senha" },
	]);

	const renderScene = SceneMap({
		1: DadosGerais,
		2: Enderecos,
		3: AlterarSenha,
	});

	const salvarImagem = async (imagem) => {
		setModal(true);
		let nome = {
			name: `logomarca-${convenio.id_gds}.${
				imagem.uri.split(".")[imagem.uri.split(".").length - 1]
			}`,
		};
		const { uri } = imagem;
		const type = `image/${
			imagem.uri.split(".")[imagem.uri.split(".").length - 1]
		}`;
		const data = new FormData();
		data.append("id_gds", `${convenio.id_gds}`);
		data.append("file", { uri, type, ...nome });
		setCarregandoIMG(true);

		await api
			.post("/user/upload", data, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})
			.then((a) => {
				setConvenio({
					...convenio,
					caminho_logomarca: a.data.caminho_logomarca,
				});
				setCarregandoIMG(false);
				setModal(false);
			});
	};

	const enviarImagem = async () => {
		const options = {
			title: "Selecione sua Logomarca",
			takePhotoButtonTitle: "Abrir a Camera",
			chooseFromLibraryButtonTitle: "Selecionar Imagem",
			cancelButtonTitle: "CANCELAR",
			storageOptions: {
				skipBackup: true,
				path: "images",
			},
		};
		Alert.alert(
			"Logomarca",
			"Envie-nos sua logomarca para disponibilizarmos em nosso site! ",
			[
				{
					text: "FECHAR",
					style: "cancel",
				},
				{
					text: "GALERIA",
					onPress: async () => {
						try {
							let { status } = await Permissions.askAsync(
								Permissions.CAMERA_ROLL
							);

							if (status != "granted") {
								alert("Você não forneceu permissão para acessar a GALERIA.");
								return;
							}
							const imagemSel = await ImagePicker.launchImageLibraryAsync({
								mediaTypes: ImagePicker.MediaTypeOptions.Images,
								allowsEditing: true,
								aspect: [4, 4],
								quality: 0.8,
							});

							await salvarImagem(imagemSel);
						} catch (error) {
							Alert.alert(
								"Alerta",
								"Foi encontrado um erro no processo de envio"
							);
						}
					},
				},
				{
					text: "CÂMERA",
					onPress: async () => {
						try {
							let { status } = await Permissions.askAsync(
								Permissions.CAMERA_ROLL
							);

							if (status != "granted") {
								alert("Você não forneceu permissão para acessar a GALERIA.");
								return;
							}
							const imagem = await ImagePicker.launchCameraAsync({
								mediaTypes: ImagePicker.MediaTypeOptions.Images,
								allowsEditing: true,
								aspect: [4, 4],
								quality: 0.8,
							});
							await salvarImagem(imagem);
						} catch (error) {
							Alert.alert(
								"Alerta",
								"Foi encontrado um erro no processo de envio"
							);
						}
					},
				},
			]
		);
	};

	return (
		<>
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
							width: 150,
							height: 150,
							alignItems: "center",
							justifyContent: "center",

							borderRadius: 5,
							elevation: 2,
						}}>
						<Carregando size={100} />
						<Text>Enviando Imagem</Text>
					</View>
				</View>
			</Modal>
			<View style={{ flex: 1, backgroundColor: "#f1f1f1" }}>
				<View style={[styless.container]}>
					<TouchableOpacity
						style={styless.menu}
						onPress={() => props.navigation.toggleDrawer()}>
						<Icone style={styless.configItem} name={"menu"} size={28} />
					</TouchableOpacity>
					<Image
						source={icone}
						style={{ width: 40, height: 40, marginHorizontal: 10 }}
					/>
					<Text style={styless.titulo}>Perfil</Text>
				</View>
				<View
					style={[
						styles.row,
						styles.center,
						{ marginVertical: 20, backgroundColor: "#f1f1f1" },
					]}>
					{!carregandoIMG ? (
						convenio.caminho_logomarca ? (
							convenio.nivel < 2 ? (
								<>
									<TouchableOpacity onPress={enviarImagem}>
										<Image
											source={{
												uri: convenio.caminho_logomarca,
												cache: "reload",
											}}
											style={[styles.logoPP, { width: 60, height: 60 }]}
										/>

										<Image
											source={imagens.plus}
											style={{
												width: 20,
												height: 20,
												resizeMode: "cover",

												bottom: 20,
												right: -35,
											}}
										/>
									</TouchableOpacity>
								</>
							) : (
								<Image
									source={{
										uri: convenio.caminho_logomarca,
									}}
									style={[styles.logoPP]}
								/>
							)
						) : convenio.nivel < 2 ? (
							<TouchableOpacity
								onPress={enviarImagem}
								style={{
									borderWidth: 2,
									borderColor: primary,
									borderRadius: 50,
									padding: 10,
								}}>
								<Image
									source={imagens.camera}
									style={[
										styles.logoPP,
										{
											resizeMode: "contain",
											height: 50,
											width: 50,
											tintColor: primary,
										},
									]}
								/>
							</TouchableOpacity>
						) : (
							<Image
								source={imagens.camera}
								style={[
									{
										resizeMode: "stretch",
										height: 50,
										width: 50,
										tintColor: primary,
									},
								]}
							/>
						)
					) : (
						<Carregando size={50} />
					)}

					<View>
						<Text style={{ width: 150, marginHorizontal: 20, color: primary }}>
							{[convenio.nome_parceiro]}
						</Text>
						<Text style={{ fontSize: 10, paddingLeft: 20 }}>
							{convenio.doc.trim()
								? convenio.doc.length > 15
									? `CNPJ: ${convenio.doc}`
									: `CPF: ${convenio.doc}`
								: null}
						</Text>
					</View>
					{avaliacao.carregando ? (
						<Carregando />
					) : avaliacao.votos > 1 ? (
						<TouchableOpacity
							onPress={() => consultarAvaliacoes(convenio.id_gds)}
							style={{ color: primary }}>
							<View>
								<>
									<View style={{ flexDirection: "row", paddingVertical: 4 }}>
										<Rating
											type="custom"
											ratingImage={imagens.star}
											ratingColor="#ff0"
											ratingCount={5}
											imageSize={14}
											readonly={true}
											startingValue={avaliacao.media}
										/>
									</View>
									{avaliacao.votos > 1 ? (
										<Text style={{ fontSize: 10 }}>
											{`${avaliacao.votos}`} AVALIAÇÕES
										</Text>
									) : (
										<Text style={{ fontSize: 10 }}>
											{`${avaliacao.votos}`} AVALIAÇÃO
										</Text>
									)}
								</>
							</View>
						</TouchableOpacity>
					) : null}
				</View>
				<TabView
					navigationState={{ index, routes }}
					renderScene={renderScene}
					onIndexChange={setIndex}
					initialLayout={initialLayout}
					lazy={true}
					renderTabBar={(props) => (
						<TabBar
							{...props}
							indicatorStyle={{ backgroundColor: "white" }}
							style={{ backgroundColor: primary }}
							labelStyle={styles.textoM}
						/>
					)}
				/>
			</View>
		</>
	);
}

const styless = StyleSheet.create({
	container: {
		height: 50,
		backgroundColor: primary,
		flexDirection: "row",
		paddingHorizontal: 10,
		justifyContent: "center",
		alignItems: "center",
	},
	menu: {
		position: "absolute",
		left: 20,
	},

	configItem: {
		color: "white",
	},
	titulo: {
		fontSize: 18,
		color: "white",
	},
});
