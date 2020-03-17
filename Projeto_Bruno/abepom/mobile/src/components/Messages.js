import React from "react";
import { View, Text, Image } from "react-native";
import styles, { tema } from "../../assets/stylesheet/Style";

export default props => {
	return (
		<>
			<View
				style={[
					styles.blocoScroll,
					styles.linha,
					props.style,
					{
						height: "100%",
						backgroundColor: tema.colors.verde,
						justifyContent: "center",
						padding: 20
					}
				]}>
				<View style={{ flex: 1, justifyContent: "center" }}>
					<Image
						source={require("../../assets/img/success.png")}
						style={{ width: 40, height: 40 }}
						tintColor={tema.colors.background}
					/>
				</View>
				<View style={{ flex: 5, justifyContent: "center" }}>
					<Text
						style={{
							color: tema.colors.background,
							fontWeight: "bold"
						}}>
						{props.titulo.toUpperCase()}
					</Text>
					{props.subtitulo ? (
						<Text
							style={{
								color: tema.colors.background,
								fontSize: 10
							}}>
							{props.subtitulo}
						</Text>
					) : null}
				</View>
			</View>
		</>
	);
};
