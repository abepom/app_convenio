import React from "react";
import { Image, Text } from "react-native";
import { Appbar } from "react-native-paper";
import imagens from "../utils/imagens";

export default props => {
	return (
		<Appbar.Header statusBarHeight={null}>
			{props.voltar ? (
				<Appbar.BackAction
					onPress={() => {
						props.voltarPara
							? props.navigation.navigate(`${props.voltarPara}`)
							: props.navigation.goBack();
					}}
				/>
			) : props.fechar ? (
				<Appbar.Action
					icon={imagens.fechar}
					onPress={() => props.setModal(false)}
				/>
			) : (
						<Appbar.Action
							icon={require("../../assets/img/menu.png")}
							onPress={() => props.navigation.toggleDrawer()}
						/>
					)}
			<Appbar.Content
				title={
					<>
						<Image
							source={require("../../assets/img/logomarca_branco.png")}
							style={{ width: 25, height: 20 }}
						/>
						<Text>&nbsp;&nbsp;{props.titulo}</Text>
					</>
				}
				subtitle={props.subtitulo}
				style={{
					textAlign: "center",
					alignItems: "center",
					justifyContent: "center"
				}}
			/>
			<Appbar.Action
				icon={require("../../assets/img/notificacao.png")}
			/>
		</Appbar.Header>
	);
};
