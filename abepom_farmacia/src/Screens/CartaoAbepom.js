import React, { useEffect, useState } from "react";
import { View, Text, ImageBackground, Animated, Easing } from "react-native";
import imagens from "../utils/imagens";
import styles, { primary } from "../utils/Style";

export default function CartaoAbepom(props) {
	const [associado] = useState(props.associado);

	const [verso, setVerso] = useState(new Animated.Value(0));
	const [frente, setFrente] = useState(new Animated.Value(0));
	useEffect(() => {
		Animated.sequence([
			Animated.timing(frente, {
				toValue: 1,
				duration: 800,
				useNativeDriver: false,
				easing: Easing.linear,
			}),
			Animated.timing(verso, {
				toValue: 1,
				duration: 800,
				useNativeDriver: false,
				easing: Easing.linear,
			}),
		]).start();
	}, [associado]);

	const spinVerso = verso.interpolate({
		inputRange: [0, 1],
		outputRange: ["270deg", "360deg"],
	});
	const spinFrente = frente.interpolate({
		inputRange: [0, 1],
		outputRange: ["0deg", "90deg"],
	});

	return (
		<>
			<Animated.View>
				<Animated.View
					style={{
						height: 200,
						width: 300,
						transform: [{ rotateY: spinFrente }],
						position: "absolute",
					}}>
					<ImageBackground
						style={{ height: 200, width: 300 }}
						source={imagens.cartao_frente}
					/>
				</Animated.View>
				<Animated.View
					style={{
						height: 200,
						width: 300,
						transform: [{ rotateY: spinVerso }],
						position: "relative",
					}}>
					<ImageBackground
						style={{ height: 200, width: 300 }}
						source={imagens.cartao_verso}>
						<Text
							style={[
								styles.textoM,
								{
									color: primary,
									margin: 5,
									position: "absolute",
									top: 10,
									alignSelf: "center",
									fontWeight: "bold",
								},
							]}>
							{associado.Nr_Cartao_Abepom}
						</Text>
						<Text
							style={[
								styles.textoM,
								{
									color: primary,
									margin: 5,
									position: "absolute",
									top: 30,
									alignSelf: "center",
								},
							]}>
							{associado.dep}
						</Text>
						{associado.dep != associado.Nome && (
							<Text
								style={[
									styles.textoM,
									{
										color: primary,
										margin: 5,
										position: "absolute",
										top: 50,
										alignSelf: "center",
									},
								]}>
								Titular: {associado.Nome}
							</Text>
						)}
						<Text
							style={[
								styles.textoM,
								{
									color: primary,
									margin: 5,
									position: "absolute",
									top: 70,
									alignSelf: "center",
								},
							]}>
							Status: ATIVO
						</Text>
					</ImageBackground>
				</Animated.View>
			</Animated.View>
		</>
	);
}
