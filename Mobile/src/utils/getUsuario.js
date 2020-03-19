import AsyncStorage from '@react-native-community/async-storage';

export default getUsuario = async id => {
  let user = await AsyncStorage.getItem(id);
  return JSON.parse(user);
};
