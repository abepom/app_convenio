import React, { useState, useEffect } from "react";
import { StyleSheet, Image, View, Text, TouchableOpacity } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from "react-native-maps";
import {
	requestPermissionsAsync,
	getCurrentPositionAsync
} from "expo-location";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import api from "../services/api";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { corPrimaria } from "../../assets/stylesheet/Style";
import ModalFilterPicker from "react-native-modal-filter-picker";

function Mapa({ navigation }) {
	/* ÁREAS */
	const [areaSelecionada, setAreaSelecionada] = useState("0000");
	const [areas, setAreas] = useState([]);

	const [posicaoFixa, setPosicaoFixa] = useState({});
	const [convenios, setConvenios] = useState([]);
	const [currentRegion, setCurrentRegion] = useState(null);
	const [map, setMap] = useState(null);
	const [searchFocused, setSearchFocused] = useState(false);
	const [busca, setBusca] = useState("");
	const [modalVisivel, setModalVisivel] = useState(false);

	const abepom = {
		description: "ABEPOM",
		geometry: { location: { lat: -27.582639, lng: -48.542075 } }
	};
	const clinipom_fpolis = {
		description: "Clinipom Florianópolis",
		geometry: { location: { lat: -27.594204, lng: -48.551563 } }
	};
	const hotel_transito = {
		description: "Hotel de Trânsito",
		geometry: { location: { lat: -27.594425, lng: -48.518935 } }
	};

	onSelect = picked => {
		setAreaSelecionada(picked.key);
		setModalVisivel(false);
		carregarConvenios();
	};

	onCancel = () => {
		setModalVisivel(false);
	};

	async function carregarAreas() {
		const response = await api.get("/listarAreas");
		let area;
		let areas = [];

		area = {
			key: "0000",
			label: (
				<>
					<MaterialCommunityIcons name="plus" size={25} color="#333" />
					<Text style={{ fontSize: 17 }}>&nbsp;&nbsp;TODAS AS ÁREAS</Text>
				</>
			)
		};

		areas.push(area);

		response.data.map(item => {
			area = {
				key: item.cd_da_area,
				label: (
					<>
						<Image
							source={{ uri: item.caminho_icone }}
							style={{ width: 32, height: 32, top: 0 }}
						/>
						<Text style={{ fontSize: 17 }}>&nbsp;&nbsp;{item.nome}</Text>
					</>
				)
			};

			areas.push(area);
		});

		setAreas(areas);
	}

	onShow = () => {
		setModalVisivel(true);
	};

	async function loadInitialPosition() {
		const { granted } = await requestPermissionsAsync();

		if (granted) {
			const { coords } = await getCurrentPositionAsync({
				enableHighAccuracy: true
			});

			const { latitude, longitude } = coords;

			setPosicaoFixa({
				latitude,
				longitude,
				latitudeDelta: 0.001,
				longitudeDelta: 0.001
			});

			setCurrentRegion({
				latitude: -27.587601,
				longitude: -48.546078,
				latitudeDelta: 0.01,
				longitudeDelta: 0.01
			});

			carregarPosicao({
				geometry: {
					location: {
						lat: posicaoFixa.latitude,
						lng: posicaoFixa.longitude,
						latitudeDelta: posicaoFixa.latitudeDelta,
						longitudeDelta: posicaoFixa.longitudeDelta
					}
				}
			});
		}
	}

	useEffect(() => {
		loadInitialPosition();
		carregarConvenios();
		carregarAreas();
	}, []);

	async function carregarConvenios() {
		const { latitude, longitude } = currentRegion;

		const response = await api.get("/listarConvenios", {
			params: {
				latitude,
				longitude,
				area: areaSelecionada
			}
		});

		setConvenios([...response.data]);
	}

	function carregarPosicao(details) {
		const { geometry } = details;

		const region = {
			latitude: geometry.location.lat,
			longitude: geometry.location.lng,
			latitudeDelta: 0.005,
			longitudeDelta: 0.005
		};

		map.animateToRegion(
			{
				...region
			},
			220
		);

		handleRegionChange(region);
	}

	function handleRegionChange(region) {
		setCurrentRegion(region);
		carregarConvenios();
		setSearchFocused(false);
	}

	if (!currentRegion) {
		return null;
	}

	return (
		<>
			<MapView
				ref={map => setMap(map)}
				showsUserLocation
				followsUserLocation
				loadingEnabled
				onRegionChangeComplete={handleRegionChange}
				initialRegion={currentRegion}
				style={styles.map}
				provider={PROVIDER_GOOGLE}>
				{convenios.map((convenio, index) => (
					<Marker
						key={index}
						tooltip={false}
						coordinate={{
							latitude: parseFloat(convenio.latitude),
							longitude: parseFloat(convenio.longitude)
						}}>
						<Image style={styles.avatar} source={{ uri: convenio.icone }} />
						<Callout
							style={{ flex: 1 }}
							onPress={() => {
								navigation.navigate("Convenio", {
									headerTitle: convenio.nome,
									id_gds: convenio.codigo_convenio
								});
							}}>
							<View
								style={{
									flexDirection: "row",
									justifyContent: "center",
									alignItems: "center",
									backgroundColor: "#FFF",
									borderRadius: 5,
									height: 119,
									width: 260,
									paddingHorizontal: 7,
									paddingVertical: 4
								}}>
								<TouchableOpacity style={{ flex: 3 }}>
									<Text style={styles.nome}>{convenio.nome}</Text>
									<Text style={styles.area}>{convenio.area}</Text>
									<Text style={styles.telefone}>{convenio.telefone}</Text>
									<Text style={styles.endereco}>{convenio.endereco}</Text>
									<Text style={styles.cep}>
										{convenio.complemento} | CEP: {convenio.cep}
									</Text>
								</TouchableOpacity>
								<View
									style={{
										flex: 1,
										alignItems: "flex-end",
										justifyContent: "center"
									}}>
									<View
										style={{
											flex: 1,
											alignItems: "center",
											justifyContent: "center"
										}}>
										<TouchableOpacity onPress={() => {}}>
											<MaterialIcons name="warning" size={35} color="#333" />
											<Text style={{ fontSize: 7 }}>DENUNCIAR</Text>
										</TouchableOpacity>
									</View>
									<View
										style={{
											flex: 1,
											alignItems: "center",
											justifyContent: "center"
										}}>
										<MaterialCommunityIcons
											name="map-marker-path"
											size={35}
											color="#333"
										/>
										<Text style={{ fontSize: 7 }}>INICIAR ROTA</Text>
									</View>
								</View>
							</View>
						</Callout>
					</Marker>
				))}
			</MapView>
			<View style={styles.searchForm}>
				<GooglePlacesAutocomplete
					placeholder="Digite seu endereço...."
					minLength={2} // minimum length of text to search
					autoFocus={false}
					returnKeyType={"search"} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
					keyboardAppearance={"light"} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
					fetchDetails={true}
					enablePoweredByContainer={false}
					renderDescription={row => row.description}
					onPress={(data, details) => {
						carregarPosicao(details);
					}}
					getDefaultValue={() => busca}
					listViewDisplayed={searchFocused}
					query={{
						// available options: https://developers.google.com/places/web-service/autocomplete
						key: "AIzaSyAFJAN-VLK1beeMZ8HZKAHLmtxrfraaPeU",
						language: "pt",
						types: "geocode",
						radius: "100000"
					}}
					textInputProps={{
						onFocus: () => {
							setSearchFocused(true);
						},
						onBlur: () => {
							setSearchFocused(false);
						},
						onChangeText: text => {
							setBusca(text);
						},
						value: busca
					}}
					styles={{
						/* CAIXA DOS RESULTADOS */
						container: {
							backgroundColor: "#fff",
							borderRadius: 25,
							borderTopEndRadius: 25,
							marginBottom: 0
						},
						/* TEXTO DO RESULTADO */
						description: {
							color: corPrimaria
						},
						/* CAIXA EM VOLTA DO INPUT */
						textInputContainer: {
							backgroundColor: "#FFF",
							borderRadius: 25,
							height: 50,
							shadowColor: "#000",
							shadowOpacity: 0.2,
							shadowOffset: {
								width: 4,
								height: 4
							},
							elevation: 2
						},
						/* CAIXA DE BUSCA */
						textInput: {
							flex: 1,
							height: 51,
							backgroundColor: "#FFF",
							color: "#333",
							borderTopLeftRadius: 25,
							borderBottomLeftRadius: 25,
							paddingHorizontal: 20,
							fontSize: 16,
							marginTop: -1,
							marginLeft: 0,
							marginRight: 0,
							marginBottom: 0
						},
						listView: {
							paddingRight: 20
						},
						/* CONTAINER DA LOGO DO GOOGLE */
						poweredContainer: {
							opacity: 0,
							marginTop: -15
						}
					}}
					nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
					GooglePlacesSearchQuery={{
						// available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
						rankby: "prominence",
						type: "(regions)"
					}}
					GooglePlacesDetailsQuery={{
						// available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
						fields: "geometry"
					}}
					predefinedPlaces={[abepom, clinipom_fpolis, hotel_transito]}
					predefinedPlacesAlwaysVisible={false}
					renderRightButton={() => (
						<TouchableOpacity
							onPress={() => {
								setBusca("");
								setSearchFocused(false);
							}}
							style={{
								height: 51,
								backgroundColor: "#FFF",
								marginTop: -1,
								marginBottom: -2,
								marginLeft: -10,
								borderTopRightRadius: 25,
								borderBottomRightRadius: 25
							}}>
							<MaterialCommunityIcons
								name="close"
								size={25}
								color="#f3f3f3"
								style={{ marginTop: 11, marginRight: 10 }}
							/>
						</TouchableOpacity>
					)}
				/>
				<TouchableOpacity
					onPress={() => {
						onShow();
					}}
					style={styles.botaoBusca}>
					<MaterialCommunityIcons
						name="format-list-bulleted"
						size={25}
						color="#FFF"
					/>
				</TouchableOpacity>
			</View>
			<View style={styles.botaoPosicaoAtualView}>
				<TouchableOpacity
					onPress={loadInitialPosition}
					style={styles.botaoPosicaoAtual}>
					<MaterialCommunityIcons name="target" size={35} color="#FFF" />
				</TouchableOpacity>
			</View>
			<ModalFilterPicker
				visible={modalVisivel}
				onSelect={onSelect}
				onCancel={onCancel}
				options={areas}
				placeholderText="Digite a área de atuação desejada."
				cancelButtonText={
					<MaterialCommunityIcons name="close" size={20} color="#fff" />
				}
				noResultsText="Não há áreas de atuação para a sua busca."
				overlayStyle={{
					alignContent: "center",
					justifyContent: "center",
					flex: 1
				}}
				listContainerStyle={{
					backgroundColor: "#fff",
					height: "90%"
				}}
				cancelButtonStyle={{
					backgroundColor: corPrimaria,
					padding: 10,
					marginTop: 20,
					borderRadius: 30
				}}
			/>
		</>
	);
}

const styles = StyleSheet.create({
	map: {
		flex: 1
	},
	avatar: {
		width: 54,
		height: 54
	},
	nome: {
		fontWeight: "bold",
		fontSize: 16
	},
	area: {
		color: "#260B9E",
		marginTop: 3,
		fontSize: 13
	},
	telefone: {
		marginTop: 3,
		fontSize: 11
	},
	endereco: {
		marginTop: 3,
		fontSize: 12
	},
	cep: {
		marginTop: 3,
		fontSize: 11
	},
	searchForm: {
		position: "absolute",
		top: 20,
		left: 20,
		right: 20,
		zIndex: 5,
		flexDirection: "row"
	},
	botaoPosicaoAtualView: {
		position: "absolute",
		bottom: 20,
		right: 20,
		zIndex: 5,
		alignItems: "flex-end"
	},
	searchInput: {
		flex: 1,
		height: 50,
		backgroundColor: "#FFF",
		color: "#333",
		borderTopLeftRadius: 25,
		borderBottomLeftRadius: 25,
		paddingHorizontal: 20,
		fontSize: 16
	},
	botaoBusca: {
		width: 50,
		height: 50,
		backgroundColor: "#04254e",
		borderRadius: 25,
		justifyContent: "center",
		alignItems: "center",
		marginLeft: 15
	},
	botaoPosicaoAtual: {
		width: 50,
		height: 50,
		backgroundColor: "#04254e",
		borderRadius: 25,
		justifyContent: "center",
		alignItems: "center",
		marginLeft: 15
	}
});

export default Mapa;
