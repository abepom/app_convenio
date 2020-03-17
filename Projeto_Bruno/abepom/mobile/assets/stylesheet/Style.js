import { StyleSheet } from "react-native";
import { DefaultTheme, configureFonts } from "react-native-paper";

const fontes = {
	default: {
		fontFamily: "sans-serif",
		fontWeight: "normal"
	},
	medium: {
		fontFamily: "sans-serif-medium",
		fontWeight: "normal"
	},
	light: {
		fontFamily: "sans-serif-light",
		fontWeight: "normal"
	},
	thin: {
		fontFamily: "sans-serif-thin",
		fontWeight: "normal"
	}
};

export const tema = {
	...DefaultTheme,
	roundness: 2,
	colors: {
		...DefaultTheme.colors,
		primary: "#03254E",
		accent: "#114267",
		background: "#ffffff",
		surface: "#fff",
		text: "#03254E",
		disabled: "#717171",
		placeholder: "#2A629A",
		backdrop: "rgba(52, 52, 52, 0.8)",
		verde: "#6CAC67",
		vermelho: "#A32224",
		cinza: "#F0EEEF",
		separador: "#8D8C8D"
	},
	fonts: configureFonts(fontes)
};

export const corPrimaria = tema.colors.primary;

const styles = StyleSheet.create({
	/* PADRÃO */
	centralizado: {
		justifyContent: "center",
		alignItems: "center"
	},
	linha: {
		flexDirection: "row"
	},
	background: {
		backgroundColor: "#f1f1f1"
	},
	blocoScroll: {
		flex: 1,
		height: 85,
		backgroundColor: tema.colors.background,
		marginVertical: 5,
		borderRadius: 4,
		elevation: 1
	},
	imagemFiltro: {
		width: 25,
		height: 25
	},
	fieldSet: {
		margin: 10,
		paddingHorizontal: 10,
		paddingVertical: 10,
		borderRadius: 5,
		borderWidth: 1,
		borderColor: tema.colors.disabled
	},
	tituloFieldSet: {
		position: "absolute",
		top: -10,
		left: 10,
		fontWeight: "bold",
		backgroundColor: "#f1f1f1",
		paddingHorizontal: 4
	},
	botaoFechar: {
		width: 50,
		height: 50,
		borderRadius: 30,
		backgroundColor: tema.colors.primary,
		bottom: 5
	},
	/* DRAWER */
	usuarioDrawer: {
		paddingVertical: 20,
		backgroundColor: tema.colors.cinza,
		borderBottomColor: tema.colors.primary,
		borderBottomWidth: 1
	},
	imagemPerfilDrawer: {
		width: 50,
		height: 50,
		marginRight: 20,
		borderRadius: 25,
		borderWidth: 1,
		borderColor: tema.colors.primary
	},
	/* INÍCIO */
	botaoMenu: {
		flex: 1,
		paddingVertical: 10,
		margin: 5,
		backgroundColor: tema.colors.background,
		borderWidth: 1,
		borderColor: tema.colors.primary,
		borderRadius: 5,
		alignItems: "center",
		justifyContent: "center"
	},
	iconeMenu: {
		width: 40,
		height: 40,
		marginBottom: 10
	},
	textoBotaoMenu: {
		fontSize: 10,
		color: tema.colors.primary
	},
	botaoConsultarLimites: {
		flex: 1,
		height: 60,
		margin: 5,
		padding: 15,
		borderWidth: 1,
		borderColor: tema.colors.primary,
		borderRadius: 5,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: tema.colors.background
	},
	descricaoLimites: {
		fontSize: 10,
		textAlign: "center",
		color: tema.colors.primary
	},
	valorLimite: {
		fontSize: 18,
		color: tema.colors.primary
	},
	botaoConsultarBeneficios: {
		flex: 1,
		margin: 5,
		padding: 15,
		borderWidth: 1,
		borderColor: tema.colors.accent,
		borderRadius: 5,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: tema.colors.primary
	},
	/* BENEFÍCIOS E SERVIÇOS */
	tituloBeneficio: {
		alignItems: "center",
		backgroundColor: tema.colors.primary,
		padding: 5,
		borderTopStartRadius: 10,
		borderTopEndRadius: 10
	},
	conteudoBeneficio: {
		backgroundColor: tema.colors.background,
		elevation: 1,
		borderBottomLeftRadius: 15,
		borderBottomRightRadius: 15,
		padding: 15
	},
	/* CARTÃO ABEPOM */
	imagemCartao: {
		width: 400,
		height: 250,
		marginBottom: 10
	},
	/* DEPENDENTES */
	scrollDependentes: {
		width: "90%",
		flex: 2,
		marginTop: 10
	},
	imagemDependente: {
		width: 55,
		height: 55,
		borderRadius: 40,
		borderColor: tema.colors.primary,
		borderWidth: 1
	},
	iconeDependente: {
		width: 25,
		height: 25,
		marginVertical: 5
	},
	containerLegenda: {
		flex: 1,
		alignItems: "center"
	},
	textoLegenda: {
		fontSize: 7,
		textAlign: "center"
	},
	containerPermissoes: {
		borderBottomColor: tema.colors.separador,
		borderBottomWidth: 1,
		marginHorizontal: 20,
		marginBottom: 10
	},
	areaPermissao: {
		borderBottomColor: tema.colors.cinza,
		borderBottomWidth: 1,
		justifyContent: "center"
	},
	/* DESCONTOS FUTUROS */
	containerScroll: {
		flex: 1,
		width: "90%",
		maxHeight: "90%",
		marginVertical: 10
	},
	containerTotal: {
		width: "100%",
		height: 50,
		bottom: 0,
		backgroundColor: tema.colors.primary
	},
	textoTotal: {
		color: tema.colors.background
	},
	/* PESQUISAR CONVENIOS */
	blocoGrupo: {
		backgroundColor: "#fff",
		elevation: 1,
		borderRadius: 6,
		flexGrow: 1,
		margin: 4,
		width: "47%",
		height: 150,
		padding: 10
	},
	blocoArea: {
		backgroundColor: tema.colors.background,
		padding: 10,
		margin: 4,
		borderRadius: 6,
		elevation: 1,
		flexGrow: 1,
		width: "47%",
		height: 90,
	},
	iconeOrdem: {
		width: 50,
		height: 50,
		borderRadius: 25
	},
	imagemOrdem: {
		width: 20,
		height: 20
	},
	containerConvenio: {
		flexGrow: 1,
		backgroundColor: tema.colors.background,
		justifyContent: "center",
		elevation: 1,
		borderRadius: 6,
		margin: 4,
		padding: 10
	},
	descontoConvenio: {
		flex: 1,
		justifyContent: "flex-start",
		alignItems: "flex-end",
		paddingLeft: 3,
	},
	titulosEnderecos: {
		borderBottomWidth: 1,
		borderBottomColor: "#e2e2e2",
		paddingVertical: 10,
	},
	tituloBairro: {
		flex: 1,
		fontSize: 10,
		width: '100%',
		color: tema.colors.primary,
		paddingRight: 10,
	},
	tituloCidade: {
		flex: 3,
		fontSize: 10,
		color: tema.colors.primary,
		paddingLeft: 10,
	},
	linhaDadosEndereco: {
		paddingVertical: 10,
		borderBottomColor: "#f6f6f6",
		borderBottomWidth: 1,
	},
	dadosEnderecoBairro: {
		fontSize: 11,
		color: tema.colors.primary,
		paddingRight: 10,
	},
	dadosEnderecoCidade: {
		fontSize: 11,
		color: tema.colors.primary,
		paddingLeft: 10,
	},
	linhaIconesEndereco: {
		flex: 1,
		justifyContent: "flex-end",
		alignItems: "center"
	},
	redesSociaisConvenio: {
		flex: 1,
		justifyContent: "flex-start",
		marginTop: 10
	},
	detalhesConvenio: {
		flex: 1,
		alignItems: "flex-end",
		justifyContent: "center",
		marginTop: 10
	},
	botaoBuscarConvenios: {
		backgroundColor: tema.colors.primary,
		padding: 20,
		borderRadius: 6
	},
	textoBotaoBuscar: {
		color: tema.colors.background
	},
	/* DETALHES DO CONVÊNIOS */
	imagemLogomarca: {
		width: "100%",
		height: 60,
		resizeMode: "contain"
	},
	etiquetasConvenio: {
		padding: 5,
		backgroundColor: tema.colors.primary,
		borderRadius: 4,
		marginRight: 10,
		color: tema.colors.background,
		fontSize: 13
	},
	botaoRedeSocial: {
		backgroundColor: tema.colors.background,
		width: 40,
		height: 40,
		borderRadius: 40,
		alignItems: "center",
		marginRight: 5,
		marginTop: 4
	},
	imagemRedeSocial: {
		width: 25,
		height: 25
	},
	blocoEndereco: {
		flex: 1,
		marginVertical: 5,
		paddingLeft: 10,
		paddingVertical: 10,
		backgroundColor: tema.colors.background,
		borderRadius: 4,
		elevation: 1
	},
	/** */
	container: {
		flex: 1
	},
	alinharAoCentro: {
		alignItems: "center",
		justifyContent: "center"
	},
	containerUsuarioInicio: {
		flexDirection: "row",
		marginVertical: 10,
		marginHorizontal: 3,
		alignItems: "center",
		justifyContent: "center"
	},
	nomeAssociado: {
		fontSize: 12
	},
	cartaoAssociado: {
		fontSize: 10
	}
});

export default styles;
