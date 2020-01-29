import React, {useEffect} from 'react';
import {StatusBar, ImageBackground} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import bg from '../assets/img/drawable-port-hdpi-screen.png';

const Load = ({navigation}) => {
  useEffect(() => {
    _retrieveData();
  }, []);

  const _retrieveData = async () => {
    await AsyncStorage.clear().then(user => {
      navigation.navigate('Login');
    });
  };
  return (
    <>
      <StatusBar backgroundColor="#1f4ba4" barStyle="light-content" />
      <ImageBackground source={bg} style={{width: '100%', height: '100%'}} />
    </>
  );
};

export default Load;
