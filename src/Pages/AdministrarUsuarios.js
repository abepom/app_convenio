import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	Dimensions,
	TouchableOpacity,
	Alert,
	RefreshControl,
	Modal,
} from "react-native";
import MenuTop from "./../Components/MenuTop";
import useConvenio from "./../Data/Convenio";
import api from "./../api";
import styles, { primary, danger, sucess, sucessBack } from "./../utils/Style";
import Icone from "@expo/vector-icons/MaterialCommunityIcons";

import { themeLight } from "./../utils/theme";
import { TextInput } from "react-native-paper";
import Carregando from "../Components/Carregando";
import { FlatList } from "react-native-gesture-handler";

export default function AdministrarUsuarios(props) {
	const [refreshing] = useState(false);
	const [{ token }] = useConvenio();
	const [state, setstate] = useState([]);
	const [modal, setModal] = useState(false);
	const [usuario, setUsuario] = useState("");
	const [email, setEmail] = useState("");
	const [senha, setSenha] = useState("");
	const [id, setId] = useState(false);
	const [idStatus, setIdStatus] = useState(0);
	const [ConteudoModal, SetConteudoModal] = useState(false);
	const [editarcriarPDV, setEditarcriarPDV] = useState(true);
	const [statusPDV, setStatusPDV] = useState(true);
	const getPDV = async () => {
		const { data } = await api({
			method: "POST",
			url: "/user/pdv",
			headers: { "x-access-token": token },
		});
		setstate(data);
	};
	useEffect(() => {
		getPDV();
	}, []);
	useEffect(() => {
		id
			? id != "0"
				? modalEditarUsuario("editar")
				: modalEditarUsuario("criar")
			: null;
	}, [id]);

	const bloquearUsuario = async (id, status) => {
		const { data } = await api({
			method: "POST",
			url: "/user/alterarStatusPDV",
			data: { id, status: !status },
			headers: { "x-access-token": token },
		});

		if (!data.error) {
			getPDV();
		}

		setModal(false);
	};
	const modalbloquearUsuario = (id, status) => {
		setModal(true);
		SetConteudoModal(true);
		setIdStatus(id);
		setStatusPDV(status);
	};

	const criarUsuario = async () => {
		if (!usuario && !email && !senha) {
			return Alert.alert(null, "Preencha todos os campos");
		}
		const { data } = await api({
			method: "POST",
			url: "/user/criarPDV",
			data: { usuario, email, senha },
			headers: { "x-access-token": token },
		});

		if (!data.error) {
			Alert.alert(null, data.mensagem);
			getPDV();
			setId(false);
		} else {
			Alert.alert(null, JSON.stringify(data.error));
		}

		setModal(false);
	};
	const editarUsuario = async () => {
		if (!usuario && !email && !senha) {
			return Alert.alert(null, "Preencha todos os campos");
		}
		const { data } = await api({
			method: "PUT",
			url: "/user/PDV",
			data: { usuario, senha, email, id },
			headers: { "x-access-token": token },
		});

		if (!data.error) {
			Alert.alert(null, "Usuario Alterado com sucesso");
			getPDV();
			setId(false);
		}

		setModal(false);
	};
	const modalEditarUsuario = (edicao) => {
		setModal(true);
		SetConteudoModal(false);
		edicao != "criar" ? setEditarcriarPDV(true) : setEditarcriarPDV(false);
	};
	return (
		<>
			<Modal transparent visible={modal} {...props}>
				<View
					style={{
						flex: 1,
						alignItems: "center",
						justifyContent: "center",
						backgroundColor: "rgba(0, 0, 0, 0.5)",
					}}>
					{!ConteudoModal ? (
						<View
							style={{
								backgroundColor: "white",
								borderRadius: 5,
								width: "90%",
							}}>
							<Text
								style={{
									alignSelf: "center",
									margin: 5,
									fontSize: 20,
									fontWeight: "bold",
								}}>
								{editarcriarPDV ? "Editar PDV" : "Criar PDV"}
							</Text>
							<TextInput
								label="Usuario"
								maxLength={14}
								dense
								mode="outlined"
								theme={themeLight}
								value={usuario}
								onChangeText={setUsuario}
								keyboardType="default"
								style={[styles.textoM, { marginHorizontal: 10 }]}
							/>
							<TextInput
								label="E-mail"
								dense
								mode="outlined"
								theme={themeLight}
								value={email}
								onChangeText={(texto) => setEmail(texto)}
								keyboardType="email-address"
								style={[styles.textoM, { marginHorizontal: 10 }]}
							/>
							<TextInput
								label="Senha"
								secureTextEntry
								dense
								mode="outlined"
								theme={themeLight}
								value={senha}
								onChangeText={(texto) => setSenha(texto)}
								keyboardType="default"
								style={[styles.textoM, { marginHorizontal: 10 }]}
							/>
							<Text
								style={{
									marginBottom: 30,
									marginHorizontal: 20,
									color: primary,
								}}></Text>
							<View
								style={{
									position: "absolute",
									bottom: 0,
									left: 0,
									right: 0,

									flexDirection: "row",
								}}>
								<TouchableOpacity
									style={{
										padding: 10,
										backgroundColor: sucess,
										borderBottomLeftRadius: 5,
										flex: 1,
										alignItems: "center",
									}}
									onPress={editarcriarPDV ? editarUsuario : criarUsuario}>
									<Text style={{ color: "white" }}>
										{editarcriarPDV ? "Salvar Alteração" : "Criar PDV"}
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={{
										padding: 10,
										alignItems: "center",
										backgroundColor: primary,
										flex: 1,
										borderBottomRightRadius: 5,
									}}
									onPress={() => {
										setId(false);
										setModal(false);
									}}>
									<Text style={{ color: "white" }}>Cancelar</Text>
								</TouchableOpacity>
							</View>
						</View>
					) : (
						<View
							style={{
								backgroundColor: "white",
								borderRadius: 5,
								width: "90%",
							}}>
							<Text
								style={{
									alignSelf: "center",
									margin: 5,
									fontSize: 20,
									fontWeight: "bold",
								}}>
								{statusPDV ? "Bloquear usuário?" : "Desbloquear usuário?"}
							</Text>
							<Text
								style={{
									marginBottom: 50,
									marginHorizontal: 20,
									fontSize: 16,
								}}>
								{statusPDV
									? " Essa ação ira BLOQUEAR o acesso do ponto de Venda ao sistema."
									: " Essa ação ira DESBLOQUEAR o acesso do ponto de Venda ao sistema."}
							</Text>
							<View
								style={{
									position: "absolute",
									bottom: 0,
									left: 0,
									right: 0,

									flexDirection: "row",
								}}>
								<TouchableOpacity
									style={{
										padding: 10,
										backgroundColor: danger,
										borderBottomLeftRadius: 5,
										flex: 1,
										alignItems: "center",
									}}
									onPress={() => bloquearUsuario(idStatus, statusPDV)}>
									<Text style={{ color: "white" }}>
										{statusPDV ? "Bloquear" : "Desbloquear"}
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={{
										padding: 10,
										alignItems: "center",
										backgroundColor: primary,
										flex: 1,
										borderBottomRightRadius: 5,
									}}
									onPress={() => setModal(false)}>
									<Text style={{ color: "white" }}>Fechar</Text>
								</TouchableOpacity>
							</View>
						</View>
					)}
				</View>
			</Modal>
			<MenuTop
				drawer
				{...props}
				title={"Administrar Usuários"}
				header={
					<View style={{ marginTop: 20 }}>
						<Text style={{ fontSize: 20, color: primary }}>
							Lista de ponto de venda
						</Text>
						<TouchableOpacity
							style={{
								padding: 5,
								backgroundColor: sucess,
								alignItems: "center",
								borderRadius: 5,
							}}
							onPress={() => {
								setId("0");
								setEmail("");
								setSenha("");
								setUsuario("");
							}}>
							<Text style={{ color: "white" }}>Criar PDV</Text>
						</TouchableOpacity>
					</View>
				}>
				{state.length == 0 ? (
					<View style={{ flex: 1 }}>
						<View style={{ padding: 15, backgroundColor: sucessBack }}>
							<Text style={{ color: sucess }}>
								Nenhum Ponto de Venda cadastrado.
							</Text>
						</View>
					</View>
				) : (
					<FlatList
						refreshControl={
							<RefreshControl refreshing={refreshing} onRefresh={getPDV} />
						}
						data={state}
						keyExtractor={(item, index) => index}
						ListEmptyComponent={
							<View>
								<Carregando />
							</View>
						}
						renderItem={({ item }) => {
							return (
								<View
									style={{
										width: Dimensions.get("screen").width - 10,
										padding: 10,
										backgroundColor: "white",
										margin: 5,
										borderRadius: 5,
										borderColor: primary,
										borderWidth: 0.2,
										elevation: 2,
									}}>
									<View style={{ flexDirection: "row" }}>
										<View style={{ flex: 9 }}>
											<View
												style={{
													flexDirection: "row",
													justifyContent: "space-between",
												}}>
												<View>
													<Text style={{ fontSize: 10, color: primary }}>
														Usuario:
													</Text>
													<Text style={{ color: primary }}>
														{" "}
														{item.usuario}
													</Text>
												</View>
												<View style={{ marginRight: "15%", width: 80 }}>
													<Text style={{ fontSize: 10, color: primary }}>
														Status:
													</Text>
													<Text style={{ color: primary }}>
														{" "}
														{item.ativo ? "Ativo" : "Desativo"}
													</Text>
												</View>
											</View>
											<View>
												<Text style={{ fontSize: 10, color: primary }}>
													Email:
												</Text>
												<Text style={{ color: primary }}> {item.email}</Text>
											</View>
										</View>
										<View
											style={{
												justifyContent: "space-around",
												alignItems: "center",
												flex: 1,
											}}>
											<TouchableOpacity
												onPress={() => {
													modalbloquearUsuario(item.id, item.ativo);
												}}>
												{!item.ativo ? (
													<Icone
														name={"lock-outline"}
														size={30}
														color={danger}
													/>
												) : (
													<Icone
														name={"lock-open-outline"}
														size={30}
														color={sucess}
													/>
												)}
											</TouchableOpacity>
											<TouchableOpacity
												disabled={!item.ativo}
												onPress={async () => {
													setId(item.id);
													setUsuario(item.usuario);
													setEmail(item.email);
													setSenha(item.senha);
												}}>
												<Icone
													name={"pencil"}
													size={30}
													color={primary}
													style={{ opacity: item.ativo ? 1 : 0.3 }}
												/>
											</TouchableOpacity>
										</View>
									</View>
								</View>
							);
						}}
					/>
				)}
			</MenuTop>
		</>
	);
}
