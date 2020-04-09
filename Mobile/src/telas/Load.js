import React, { useEffect, useState } from 'react';
import { View, Image, Text } from 'react-native';
import logo from '../assets/img/logo_abepom_branca.png';
import setUsuario from '../utils/setUsuario';
import AsyncStorage from '@react-native-community/async-storage';
import { primary } from '../utils/Style';
import api from '../api';
import messaging from '@react-native-firebase/messaging';

const Load = props => {
  const { navigation } = props;
  let usuario;
  let senha;

  useEffect(() => {
    _retrieveData();
  }, []);
  const getToken = async () => {
    let token = await messaging().getToken()

    return token
  }
  const conectar = async () => {
    try {
      let token = await getToken()
      console.log(token, `tessttee`)
      setUsuario('token', token.toString())

      if (!!usuario && senha) {
        const { data } = await api({
          url: '/Login',
          data: { usuario, senha, token },
          method: 'post',
        });

        let convenio;

        if (!data.erro) {
          convenio = {
            id_gds: data.id_gds,
            nome_parceiro: data.nome_parceiro,
            caminho_logomarca: data.caminho_logomarca,
            efetuarVenda: data.efetuarVenda,
            doc: data.usuario,
          };

          navigation.navigate('App', convenio);
        } else { navigation.navigate('Login', { ...data, doc, mensagem: 'Senha não confere, digite novamene a sua senha' }) };
      } else {
        navigation.navigate('Login');
      }
    } catch (error) {
      console.log(error)
    }
  };

  const _retrieveData = async () => {
    let user = await AsyncStorage.getItem('usuario');

    if (!!user) {
      user = JSON.parse(user);
      usuario = user.usuario;
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
