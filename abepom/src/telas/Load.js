import React, {useEffect} from 'react';
import {View, Image} from 'react-native';
import logo from '../assets/img/logo_guia_online.png';
import AsyncStorage from '@react-native-community/async-storage';
import {primaryBack} from '../utils/Style';

const Load = ({navigation}) => {
  useEffect(() => {
    _retrieveData();
  }, []);

  const _retrieveData = async () => {
    const user = await AsyncStorage.getItem('Usuario');
    const conv = await AsyncStorage.getItem('convenio');
    console.log(conv);
    navigation.navigate(!user ? 'Login' : 'Home', JSON.parse(conv));
  };
  return (
    <View
      style={{
        backgroundColor: primaryBack,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Image source={logo} />
    </View>
  );
};

export default Load;
