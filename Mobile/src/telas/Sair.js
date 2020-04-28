import React, { useEffect } from 'react';

import { View, Image } from 'react-native';
import logo from '../assets/img/logo_guia_online.png';
import AsyncStorage, { useAsyncStorage } from '@react-native-community/async-storage';
import { primary } from '../utils/Style';
import { useStore } from '../../store';

const Load = ({ navigation }) => {
  const [, setStore] = useStore()
  useEffect(() => {
    _retrieveData();
  }, []);

  const _retrieveData = async () => {
    await AsyncStorage.clear().then(user => {
      setStore({ convenio: {}, load: {}, usuario: { usuario: '', senha: '' } })
      navigation.navigate('Login');
    });
  };
  return (
    <View
      style={{
        backgroundColor: primary,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Image source={logo} />
    </View>
  );
};

export default Load;
