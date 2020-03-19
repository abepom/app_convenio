import AsyncStorage from '@react-native-community/async-storage';

const setConvenio = async (local, dados) => {
  return await AsyncStorage.setItem(local, JSON.stringify(dados));
};
export default setConvenio;
