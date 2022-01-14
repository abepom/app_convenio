import React, { useState, useEffect, createContext, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
const StoreContext = createContext([{}, () => {}]);
export const useStore = () => {
	const [state, setState] = useContext(StoreContext);
	return [state, setState];
};
export const deleteStore = () => {
	const [state, setState] = useContext(StoreContext);
	return [state, setState];
};
export const StorePrivider = ({ children }) => {
	const [state, setState] = useState({ carregouDados: false });

	const carregarDados = async () => {
		try {
			const data = await AsyncStorage.getItem("store");

			if (!!data) {
				setState({ ...JSON.parse(data), load: "", carregouDados: true });
			} else {
				setState({ load: "", carregouDados: true });
			}
		} catch (error) {}
	};

	useEffect(() => {
		carregarDados();
	}, []);
	const salvarDados = async () => {
		try {
			const dadosAntigos = await AsyncStorage.getItem("store");
			if (state != dadosAntigos && state != null) {
				await AsyncStorage.setItem("store", JSON.stringify(state));
			}
		} catch (error) {}
	};

	useEffect(() => {
		salvarDados();
	}, [state]);

	return (
		<StoreContext.Provider value={[state, setState]}>
			{children}
		</StoreContext.Provider>
	);
};
