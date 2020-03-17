import React from "react";
import {
	StatusBar,
	ImageBackground,
	View,
	Text,
	TextInput,
	StyleSheet,
	TouchableOpacity,
	Image
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

function Esqueceu({ navigation }) {
	return (
		<>
			<StatusBar barStyle="light-content" backgroundColor="#04254e" />
			<ImageBackground
				source={require("../../assets/img/bg_padrao.jpg")}
				resizeMode="repeat"
				style={styles.container}>
				<Text style={styles.titulo}>ESQUECEU SUA SENHA?</Text>
				<View style={styles.inputContainer}>
					<MaterialIcons
						name="credit-card"
						color="#04254e"
						size={20}
						style={styles.inputImagem}
					/>
					<TextInput
						style={{ flex: 1 }}
						placeholder="Número do Cartão"
						keyboardType="numeric"
						maxLength={11}
					/>
				</View>
				<View style={styles.inputContainer}>
					<MaterialIcons
						name="account-circle"
						color="#04254e"
						size={20}
						style={styles.inputImagem}
					/>
					<TextInput
						style={{ flex: 1 }}
						placeholder="CPF"
						keyboardType="numeric"
						maxLength={11}
					/>
				</View>
				<View style={styles.inputContainer}>
					<MaterialIcons
						name="email"
						color="#04254e"
						size={20}
						style={styles.inputImagem}
					/>
					<TextInput
						style={{ flex: 1 }}
						placeholder="E-mail"
						keyboardType="numeric"
					/>
				</View>
				<TouchableOpacity style={styles.botao}>
					<MaterialIcons name="check" size={20} color="#FFF" />
					<Text style={styles.textoBotao}>SOLICITAR SENHA</Text>
				</TouchableOpacity>
				<View style={styles.logosMilitaresContainer}>
					<Image
						source={require("../../assets/img/logo_bombeiro.png")}
						style={styles.logosMilitares}
					/>
					<Image
						source={require("../../assets/img/logo_policia.png")}
						style={styles.logosMilitares}
					/>
				</View>
			</ImageBackground>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center"
	},
	titulo: {
		fontSize: 20,
		color: "#04254e",
		marginBottom: 20
	},
	logomarca: {
		width: 100,
		height: 100,
		marginBottom: 20
	},
	inputContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		borderColor: "#333",
		backgroundColor: "#fff",
		borderWidth: 0.5,
		height: 40,
		width: "80%",
		borderRadius: 5,
		margin: 5
	},

	inputImagem: {
		padding: 10,
		margin: 5,
		alignItems: "center"
	},
	botao: {
		width: "80%",
		height: 40,
		backgroundColor: "#04254e",
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "row",
		borderRadius: 5,
		marginTop: 5
	},
	textoBotao: {
		color: "#fff",
		alignItems: "center",
		justifyContent: "center",
		marginHorizontal: 2
	},
	logosMilitaresContainer: {
		flexDirection: "row",
		bottom: 20,
		position: "absolute"
	},
	logosMilitares: {
		marginTop: 40,
		width: 60,
		height: 60,
		marginHorizontal: 60
	}
});

export default Esqueceu;
