import { DefaultTheme, configureFonts } from "react-native-paper";

const fontes = {
	default: {
		fontFamily: "sans-serif",
		fontWeight: "normal"
	},
	medium: {
		fontFamily: "sans-serif-medium",
		fontWeight: "normal"
	},
	light: {
		fontFamily: "sans-serif-light",
		fontWeight: "normal"
	},
	thin: {
		fontFamily: "sans-serif-thin",
		fontWeight: "normal"
	}
};

export const tema = {
	...DefaultTheme,
	roundness: 2,
	colors: {
		...DefaultTheme.colors,
		primary: "#03254E",
		accent: "#114267",
		background: "#ffffff",
		surface: "#5087B7",
		text: "#03254E",
		disabled: "#717171",
		placeholder: "#2A629A",
		backdrop: "#4D4D4D",
		verde: "#6CAC67"
	},
	fonts: configureFonts(fontes)
};
