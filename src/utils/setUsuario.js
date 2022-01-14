import AsyncStorage from "@react-native-async-storage/async-storage";

const setConvenio = async (local, dados) => {
	return await AsyncStorage.setItem(local, JSON.stringify(dados));
};
export default setConvenio;
