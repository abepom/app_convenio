import React, { useEffect, useState } from 'react';
import { View, Image, Text } from 'react-native';
import logo from '../assets/img/logo_abepom_branca.png';

import AsyncStorage from '@react-native-community/async-storage';
import { primary } from '../utils/Style';
import api from '../api';

const Load = props => {
  const { navigation } = props;
  let doc;
  let senha;

  useEffect(() => {
    _retrieveData();
  }, []);
  const conectar = async () => {
    if (doc.length > 13 && senha) {
      const { data } = await api({
        url: '/Login',
        data: { usuario: doc, senha },
        method: 'post',
      });

      let convenio;
      console.log(data);

      if (!data.erro) {
        convenio = {
          id_gds: data.id_gds,
          nome_parceiro: data.nome_parceiro,
          caminho_logomarca: data.caminho_logomarca,
          efetuarVenda: data.efetuarVenda,
        };

        navigation.navigate('App', convenio);
      }
    } else {
      navigation.navigate('Login');
    }
  };

  const _retrieveData = async () => {
    let user = await AsyncStorage.getItem('usuario');

    if (!!user) {
      user = JSON.parse(user);
      doc = user.doc;
      senha = user.senha;

      await conectar();
    } else {
      navigation.navigate('Login');
    }
  };
  return (
    <View
      style={{
        backgroundColor: primary,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Image source={logo} style={{ width: 150, height: 150 }} />
    </View>
  );
};

export default Load;
