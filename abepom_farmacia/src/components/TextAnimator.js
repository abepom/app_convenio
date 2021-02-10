import React, { useEffect } from "react";
import { View, Animated } from "react-native";

export default (props) => {
	let animatedValues = [];

	let textArr = props.content.trim().split(" ");
	textArr.forEach((_, i) => {
		animatedValues[i] = new Animated.Value(0);
	});
	textArr = textArr;

	const animated = (toValue = 1) => {
		const animations = textArr.map((_, i) => {
			return Animated.timing(animatedValues[i], {
				toValue,
				duration: props.duration,
				useNativeDriver: true,
			});
		});

		Animated.stagger(
			props.duration / 5,
			toValue === 0 ? animations.reverse() : animations
		).start(() => {
			if (props.loop) {
				setTimeout(() => animated(toValue === 0 ? 1 : 0), 1000);
			}
			if (props.onFinish) {
				props.onFinish();
			}
		});
	};

	useEffect(() => {
		animated();
	}, []);

	return (
		<View
			style={[
				{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
				props.style,
			]}
		>
			{textArr.map((word, index) => {
				return (
					<Animated.Text
						key={`${word}-${index}`}
						style={[
							props.textStyle,
							{
								opacity: animatedValues[index],
								transform: [
									{
										translateY: Animated.multiply(
											animatedValues[index],
											new Animated.Value(-5)
										),
									},
								],
							},
						]}
					>
						{word}
						{`${index < textArr.length ? " " : ""}`}
					</Animated.Text>
				);
			})}
		</View>
	);
};
