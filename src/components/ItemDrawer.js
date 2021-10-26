import React from "react";
import { Image } from "react-native";

const ItemDrawer = (props) => {
	return (
		<Image
			source={props.icone}
			style={{
				width: 30,
				height: 30,
				tintColor: props.focused ? "white" : props.tintColor,
			}}
		/>
	);
};

export default ItemDrawer;
