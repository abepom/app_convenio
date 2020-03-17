import React, { useState } from "react";
import {
	View,
	Text,
	Modal,
	Image,
	TouchableOpacity,
	Linking
} from "react-native";
import styles from "../../assets/stylesheet/Style";
import DetalhesConvenio from "../pages/DetalhesConvenio";
import imagens from "../utils/imagens";

export default convenio => {
	const [convenioSelecionado, setConvenioSelecionado] = useState("");
	const [modal, setModal] = useState(false);

	let enderecos = convenio.enderecos
		? JSON.parse(
			`${convenio.enderecos
				.replace(/(\r\n|\n|\r)/gm, " ")
				.replace(/\s+/g, " ")}`
		)
		: [];

	return (
		<>
			<Modal visible={modal}>
				<View>
					<DetalhesConvenio
						id={convenioSelecionado}
						setModal={setModal}
						{...convenio}
					/>
				</View>
			</Modal>
			<View style={styles.containerConvenio}>
				<View style={[styles.linha]}>
					<View style={{ flex: 5 }}>
						<Text style={{ fontWeight: "bold", fontSize: 16 }}>
							{convenio.nome_parceiro.toUpperCase().trim()}
						</Text>
						<View style={styles.linha}>
							<Text style={{ fontSize: 12 }}>
								{convenio.area.toUpperCase()}
							</Text>
							{!!convenio.qtd_areas > 1 && (
								<Text style={{ fontSize: 12, paddingLeft: 5 }}>
									+ {convenio.qtd_areas} ÁREA(S)
								</Text>
							)}
						</View>
					</View>
					<View style={styles.descontoConvenio}>
						{!!convenio.folha ? (
							<Image source={imagens.def} style={{ width: 30, height: 30 }} />
						) : convenio.desconto > 0 ? (
							<Text style={{ fontSize: 26 }}>{convenio.desconto}%</Text>
						) : null}
					</View>
				</View>
				{!!enderecos && (
					<>
						<View style={[styles.linha, styles.titulosEnderecos]}>
							<View style={{ flex: 1 }}>
								<Text style={styles.tituloBairro}>BAIRRO</Text>
							</View>
							<View style={{ flex: 3 }}>
								<Text style={styles.tituloCidade}>CIDADE</Text>
							</View>
						</View>
						{enderecos.map((endereco, index) => (
							<View
								key={index}
								style={[
									styles.linha,
									styles.centralizado,
									styles.linhaDadosEndereco
								]}
							>
								<View style={{ flex: 1 }}>
									<Text style={styles.dadosEnderecoBairro}>
										{endereco.bairro.toUpperCase()}
									</Text>
								</View>
								<View style={{ flex: 2 }}>
									<Text style={styles.dadosEnderecoCidade}>
										{endereco.cidade.toUpperCase()}
									</Text>
								</View>
								<View style={[styles.linha, styles.linhaIconesEndereco]}>
									{!!endereco.telefone && (
										<TouchableOpacity
											style={{ paddingHorizontal: 5 }}
											onPress={() => {
												Linking.openURL(`tel:${endereco.telefone}`);
											}}
										>
											<Image
												source={imagens.telefone}
												style={{ width: 20, height: 20 }}
											/>
										</TouchableOpacity>
									)}
									{!!endereco.whatsapp && (
										<TouchableOpacity
											style={{ paddingHorizontal: 5 }}
											onPress={() => {
												Linking.openURL(`https://wa.me/55${endereco.whatsapp}`);
											}}
										>
											<Image
												source={imagens.whatsapp}
												style={{ width: 25, height: 25 }}
											/>
										</TouchableOpacity>
									)}
									<TouchableOpacity
										style={{ paddingHorizontal: 5 }}
										onPress={() => {
											Linking.openURL(`https://wa.me/`);
										}}
									>
										<Image
											source={imagens.mapa}
											style={{
												width: 25,
												height: 25
											}}
										/>
									</TouchableOpacity>
								</View>
							</View>
						))}
					</>
				)}
				<View style={styles.linha}>
					<View style={[styles.redesSociaisConvenio, styles.linha]}>
						{!!convenio.site && (
							<TouchableOpacity
								style={{ marginRight: 10 }}
								onPress={() => {
									Linking.openURL(convenio.site);
								}}
							>
								<Image
									source={imagens.site}
									style={{ width: 23, height: 23 }}
								/>
							</TouchableOpacity>
						)}
						{!!convenio.facebook && (
							<TouchableOpacity
								style={{ marginRight: 10 }}
								onPress={() => {
									Linking.openURL(`fb://page/445199545549044`);
								}}
							>
								<Image
									source={imagens.facebook}
									style={{ width: 23, height: 23 }}
								/>
							</TouchableOpacity>
						)}
						{!!convenio.instagram && (
							<TouchableOpacity
								style={{ marginRight: 10 }}
								onPress={() => {
									Linking.openURL(`http://instagram.com/${convenio.instagram}`);
								}}
							>
								<Image
									source={imagens.instagram}
									style={{ width: 23, height: 23 }}
								/>
							</TouchableOpacity>
						)}
						{!!convenio.twitter && (
							<TouchableOpacity
								style={{ marginRight: 10 }}
								onPress={() => {
									Linking.openURL(`http://twitter.com/${convenio.twitter}`);
								}}
							>
								<Image
									source={imagens.twitter}
									style={{ width: 23, height: 23 }}
								/>
							</TouchableOpacity>
						)}
						{!!convenio.linkedin && (
							<TouchableOpacity
								style={{ marginRight: 10 }}
								onPress={() => {
									Linking.openURL(`http://linkedin.com/${convenio.linkedin}`);
								}}
							>
								<Image
									source={imagens.linkedin}
									style={{ width: 23, height: 23 }}
								/>
							</TouchableOpacity>
						)}
					</View>
					<View style={styles.detalhesConvenio}>
						<TouchableOpacity
							style={[styles.centralizado, styles.linha]}
							onPress={() => {
								setConvenioSelecionado(convenio.codigo);
								setModal(true);
							}}
						>
							<Text style={{ fontSize: 12 }}>VER MAIS</Text>
							<Image
								source={imagens.seta_direita}
								style={{ width: 13, height: 13, marginLeft: 5 }}
							/>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</>
	);
};
