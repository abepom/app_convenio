import { StyleSheet, Dimensions } from "react-native";

//export const primary = '#f00';
export const primary = "#03254e";
export const background = "#f0eeef";
export const alert = "#7f6937";
export const alertBack = "#fff3cd";
export const sucess = "#284c26";
export const sucessBack = "#d4edda";
export const danger = "#572830";
export const danverBackground = "#f7d7da";
export const white = "#fff";
export const black = "#222";

let txtM;
let txtP;
let txtG;

if (Dimensions.get("screen").width < 380) {
	txtM = 10;
	txtP = 8;
	txtG = 12;
} else {
	txtM = 14;
	txtP = 12;
	txtG = 16;
}

const styles = StyleSheet.create({
	conteiner: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	center: {
		alignItems: "center",
		justifyContent: "center",
	},
	logo: {
		width: 150,
		height: 150,
		resizeMode: "cover",
	},
	logoP: {
		width: 75,
		height: 75,
		resizeMode: "cover",
		borderRadius: 37.5,
	},
	logoPP: {
		width: 50,
		height: 50,
		resizeMode: "contain",
		borderRadius: 25,
	},
	textoP: {
		fontSize: txtP,
	},
	textoM: {
		fontSize: txtM,
	},
	textoG: {
		fontSize: txtG,
	},
	textoGG: {
		fontSize: txtG * 2,
		fontWeight: "bold",
	},
	textPrimary: {
		color: primary,
	},
	white: {
		color: "#fff",
	},
	bgImage: {
		width: Dimensions.get("screen").width,
		height: Dimensions.get("screen").height,
	},
	imput: {
		width: "80%",
		alignSelf: "flex-start",
		marginLeft: "10%",
		marginTop: 10,
	},
	input: {
		backgroundColor: "white",
		height: 45,
		marginHorizontal: 10,
		marginTop: 5,
		borderRadius: 5,
		borderWidth: 1,
		borderColor: primary,
		width: Dimensions.get("screen").width * 0.8,
	},
	btnDefault: {
		backgroundColor: primary,
		height: 45,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 10,
		paddingHorizontal: 10,
	},
	btnDefaultText: {
		color: "#fff",
	},
	link: {
		height: 45,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 10,
	},
	row: {
		flexDirection: "row",
	},
	itemMenu: {
		padding: 10,
		borderWidth: 1,
		borderColor: primary,
		backgroundColor: white,
		flex: 1,
		marginHorizontal: 10,
		borderRadius: 5,
		alignItems: "center",
		paddingVertical: 30,
	},
	linhaMenu: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingTop: 10,
		paddingHorizontal: 10,
	},
	textMenu: {
		textAlign: "center",
		marginTop: 10,
		color: primary,
		fontSize: txtM,
		textTransform: "uppercase",
	},
	itemDrawer: { textAlign: "center", width: 50 },
});

export default styles;
