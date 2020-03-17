import React from "react";
import { View, Image } from "react-native";
import styles from "../../assets/stylesheet/Style";
import Header from "../components/Header";

function Cartao(props) {
	return (
		<>
			<Header titulo="Cartão ABEPOM" {...props} voltar />
			<View style={[styles.centralizado, styles.background, { flex: 1 }]}>
				<Image
					source={require("../../assets/img/cartao_frente.png")}
					style={styles.imagemCartao}
				/>
				<Image
					source={require("../../assets/img/cartao_costas.png")}
					style={styles.imagemCartao}
				/>
			</View>
		</>
	);
}

export default Cartao;
