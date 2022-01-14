import AsyncStorage from "@react-native-async-storage/async-storage";

const getUsuario = async (id) => {
	let user = await AsyncStorage.getItem(id);
	return JSON.parse(user);
};
export default getUsuario;
