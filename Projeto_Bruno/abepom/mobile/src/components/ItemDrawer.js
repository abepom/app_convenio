import React from "react";
import { Image } from "react-native";
import { tema } from "../../assets/stylesheet/Style";

export default props => (
	<Image
		source={props.imagem}
		style={{ height: 30, width: 30 }}
		tintColor={props.focused ? "#fff" : tema.colors.primary}
	/>
);
