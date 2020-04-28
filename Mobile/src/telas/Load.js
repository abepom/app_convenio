import React, { useEffect, useState } from 'react';
import { View, Image, Text } from 'react-native';
import logo from '../assets/img/logo_abepom_branca.png';
import { primary } from '../utils/Style';
import api from '../api';
import messaging from '@react-native-firebase/messaging';
import { useStore } from '../../store';

const Load = props => {
  const { navigation } = props;
  const [store] = useStore()
  let notificacao

  useEffect(() => {

    conectar();

  }, []);

  const conectar = async () => {
    try {
      let token = await messaging().getToken()
      const { usuario, senha } = store.usuario
      console.log(store, 'storeeee')
      if (!!store.usuario) {
        console.log('store', !!usuario, !!senha)

        if (!!usuario && !!senha) {

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
            if (notificacao) {
              navigation.navigate(notificacao.tela, convenio);
            } else {
              navigation.navigate('App', convenio);
            }
          } else {
            navigation.navigate('Login', { ...data, doc, mensagem: 'Senha não confere, digite novamene a sua senha' })
          };
        } else {
          navigation.navigate('Login');
        }
      } else {
        navigation.navigate('Login');
      }
    } catch (error) {
      console.log(error)
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