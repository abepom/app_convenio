import React, { useState } from "react";
import { View, Easing, Animated, Image, Text } from "react-native";
import imagens from "../utils/imagens";

const Carregando = (props) => {
	let { cor, tamanho = 50, icone = true, abepom = false } = props;

	const [giroVerde] = useState(new Animated.Value(0));
	const [giroVermelho] = useState(new Animated.Value(0));
	const [palavra] = useState(new Animated.Value(0));

	Animated.loop(
		Animated.sequence([
			Animated.parallel([
				Animated.timing(giroVerde, {
					toValue: 1,
					duration: 800,
					useNativeDriver: false,
					easing: Easing.linear,
				}),
				Animated.timing(giroVermelho, {
					toValue: 1,
					duration: 800,
					useNativeDriver: false,
					easing: Easing.linear,
				}),
			]),
			Animated.delay(650),
		])
	).start();
	const spinV = giroVerde.interpolate({
		inputRange: [0, 1],
		outputRange: ["0deg", "-360deg"],
	});

	const spinR = giroVermelho.interpolate({
		inputRange: [0, 1],
		outputRange: ["0deg", "360deg"],
	});
	return (
		<View
			style={{
				width: tamanho,
				height: tamanho,
				alignSelf: "center",
				alignItems: "center",
				justifyContent: "center",
				margin: 10,
			}}>
			<Animated.View
				style={{
					width: tamanho,
					height: tamanho,
					transform: [{ rotate: spinV }],
					position: "absolute",
				}}>
				<Image
					source={imagens.linha_verde}
					style={{
						width: tamanho,
						height: tamanho,
						tintColor: cor ?? "#00A758",
					}}
				/>
			</Animated.View>
			<Animated.View
				style={{
					width: tamanho,
					height: tamanho,
					transform: [{ rotate: spinR }],
					position: "absolute",
				}}>
				<Image
					source={imagens.linha_vermelha}
					style={{
						width: tamanho,
						height: tamanho,
						tintColor: cor ?? "#EE2E32",
					}}
				/>
			</Animated.View>
			{icone && (
				<>
					{!cor && (
						<Image
							source={imagens.circulo_branco}
							style={{ width: tamanho, height: tamanho }}
						/>
					)}
					<Image
						source={imagens.circulo_estrela_vazada}
						style={{
							width: tamanho,
							height: tamanho,

							position: "absolute",
							tintColor: cor ?? "#3D3F94",
						}}
					/>
				</>
			)}
			{abepom && (
				<Animated.View
					style={{
						width: tamanho,
						height: tamanho,
						opacity: palavra,

						position: "absolute",
					}}>
					<Image
						source={imagens.txtabepom}
						style={{
							width: tamanho,
							height: tamanho,
							tintColor: cor ?? "white",
						}}
					/>
				</Animated.View>
			)}
		</View>
	);
};
export default Carregando;
