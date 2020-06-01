import React, { useEffect, useState } from 'react';
import { View, Image, Text } from 'react-native';
import logo from '../assets/img/logo_abepom_branca.png';
import styles, { primary } from '../utils/Style';
import api from '../api';
import messaging from '@react-native-firebase/messaging';
import { useStore } from '../../store';
import useUsuario from '../../Store/Usuario';
import useConvenio from './../../Store/Convenio';

const Load = props => {
  const { navigation } = props;
  let notificacao;
  const [user] = useUsuario();
  const [store] = useStore();
  const [, setConv] = useConvenio();
  useEffect(() => {
    if (store.carregouDados) {
      conectar();
    }
  }, [store.carregouDados]);

  const conectar = async () => {
    try {
      let token = await messaging().getToken();

      if (user === undefined) {
        return navigation.navigate('Login');
      }

      const { usuario, senha } = user;

      if (!!usuario && !!senha) {
        const { data } = await api({
          url: '/LoginParceiro',
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
            doc: data.doc,
            usuario: data.usuario,
            nivel: data.nivel,
          };
          setConv(convenio);
          if (notificacao) {
            navigation.navigate(notificacao.tela, convenio);
          } else {
            navigation.navigate('App', convenio);
          }
        } else {
          navigation.navigate('Login', {
            ...data,
            doc,
            mensagem: 'Senha não confere, digite novamene a sua senha',
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View
      style={[
        styles.conteiner,
        {
          backgroundColor: primary,
        },
      ]}>
      <Image source={logo} style={{ width: 150, height: 150 }} />
    </View>
  );
};

export default Load;
