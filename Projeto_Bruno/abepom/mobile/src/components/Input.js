import React, { useState, useEffect } from "react";
import { TextInput, View, Text, Animated } from "react-native";

export default props => {
	const [focused, setFocused] = useState(false);
	const { label } = props;
	const [animatedFocused, setAnimatedFocused] = useState(
		new Animated.Value(props.value === "" ? 0 : 1)
	);

	function handleFocus() {
		setFocused(true);
	}

	function handleBlur() {
		setFocused(false);
	}

	useEffect(() => {
		Animated.timing(animatedFocused, {
			toValue: props.value !== "" ? 1 : 0,
			duration: 200
		}).start();
	});

	return (
		<View
			style={{
				height: 45,
				fontSize: 20,
				color: "#000",
				backgroundColor: "#fff",
				elevation: 1,
				borderRadius: 5,
				paddingHorizontal: 10,
				borderColor: "#f20",
				borderWidth: 2
			}}>
			<Animated.Text
				style={{
					position: "absolute",
					left: 10,
					backgroundColor: "#fff",
					top: animatedFocused.interpolate({
						inputRange: [0, 1],
						outputRange: [5, -14]
					}),
					fontSize: animatedFocused.interpolate({
						inputRange: [0, 1],
						outputRange: [20, 14]
					}),
					color: animatedFocused.interpolate({
						inputRange: [0, 1],
						outputRange: ["#aaa", "#000"]
					})
				}}>
				{label}
			</Animated.Text>
			<TextInput
				{...props}
				style={[
					{
						height: 40,
						fontSize: 20,
						color: "#000"
					},
					props.style
				]}
				onFocus={handleFocus}
				onBlur={handleBlur}
				blurOnSubmit
			/>
		</View>
	);
};
