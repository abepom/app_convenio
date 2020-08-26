import React, {useEffect, useState} from 'react';
import {View, Image, Text} from 'react-native';
import logo from '../assets/img/logo_abepom_branca.png';
import styles, {primary} from '../utils/Style';
import api from '../api';
import messaging from '@react-native-firebase/messaging';
import {useStore} from '../../store';
import useUsuario from '../../Store/Usuario';
import useConvenio from './../../Store/Convenio';
import Carregando from './../components/Carregando';

const Load = (props) => {
  const {navigation} = props;

  const [usuario] = useUsuario();
  const [store] = useStore();
  const [, setConv] = useConvenio();
  useEffect(() => {
    console.log(store);
    if (store.carregouDados) {
      conectar();
    }
  }, [store.carregouDados]);

  const conectar = async () => {
    try {
      let token = await messaging().getToken();
      if (usuario === undefined) {
        setTimeout(() => {
          return navigation.navigate('Login');
        }, 2000);
      }
      const {doc, user, pass} = usuario;

      if (usuario === 'abepom' && senha === 'ab3p0ms3d3' && !pass) {
        navigation.navigate('Administrador', {doc: ''});
      }

      if (!!doc && !!pass) {
        const {data} = await api.post('/Login', {
          doc: doc,
          senha: pass,
          user,
          token,
        });

        let convenio;
        console.log(data);
        if (!data.erro) {
          convenio = {
            id_gds: data.id_gds,
            nome_parceiro: data.nome_parceiro,
            caminho_logomarca: data.caminho_logomarca,
            efetuarVenda: data.efetuarVenda,
            doc: data.doc,
            usuario: data.usuario,
            nivel: data.nivel,
            token,
            cd_convenio: data['cd_convênio'],
            primeiro_acesso: data.primeiro_acesso,
          };
          setTimeout(() => {
            navigation.navigate('App', convenio);
            setConv(convenio);
          }, 2000);
        } else {
          setTimeout(() => {
            navigation.navigate(
              'Login',
              {
                ...data,
                doc,
                mensagem: 'Senha não confere, digite novamene a sua senha',
              },
              3000,
            );
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
      <Carregando tamanho={150} abepom={true} />
    </View>
  );
};

export default Load;
