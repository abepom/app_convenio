import React from "react";
import { View, Modal } from "react-native";
import Carregando from "../Carregando";

// import { Container } from './styles';

const ProntuarioDetalhado = (props) => {
	const { visualizar, Nr_lancamento } = props;

	const [mostrar, setMostrar] = visualizar;
	return (
		<Modal visible={mostrar} transparent>
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: "rgba(0, 0, 0, 0.5)",
				}}>
				<View
					style={{
						borderTopRightRadius: 4,
						borderTopLeftRadius: 4,
						backgroundColor: `white`,
						paddingVertical: 10,
						paddingHorizontal: 5,
						width: "90%",
					}}>
					{mostrar ? <Carregando /> : <></>}
				</View>
			</View>
		</Modal>
	);
};

export default ProntuarioDetalhado;
