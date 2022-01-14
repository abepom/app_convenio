import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EfetuarVenda from "./Pages/EfetuarVenda";
import CadastrarVenda from "./Pages/CadastrarVenda";

const Stack = createNativeStackNavigator();

export default function (props) {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="Lancamento"
				component={EfetuarVenda}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="Cadastrar"
				component={CadastrarVenda}
				options={{ headerShown: false }}
			/>
		</Stack.Navigator>
	);
}
