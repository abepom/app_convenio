import React, {useState} from 'react';
import {
  View,
  ImageBackground,
  Image,
  TextInput,
  Text,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import StatusBar from '../components/StatusBar';
import bg from '../assets/img/background.png';
import logo from '../assets/img/logo.png';
import logo1 from '../assets/img/logo1.png';
import logo2 from '../assets/img/logo2.png';
import styles from '../constants/Style';
import TextInputMask from 'react-native-text-input-mask';

import api from '../api';
const Login = props => {
  const [doc, setdoc] = useState('');
  const [senha, setSenha] = useState('');

  const login = async () => {
    const data = await api({
      url: 'VaidarLoginParceiro.asp',
      data: {usuario: doc, senha},
      method: 'post',
    });
    const {parceiro, valido} = data.data;

    if (valido) {
      setUsuario(parceiro);
      props.navigation.navigate('drawer', parceiro);
    }
  };
  const setUsuario = async dados => {
    await AsyncStorage.setItem('User', JSON.stringify(dados));
  };

  return (
    <>
      <StatusBar />
      <View style={{flex: 1}}>
        <ImageBackground
          source={bg}
          style={[styles.bgImage, {alignItems: 'center'}]}>
          <Image style={[styles.logo, {margin: '10%'}]} source={logo} />
          <View style={{marginTop: 20}}>
            <TextInputMask
              style={styles.input}
              placeholder="CPF / CNPJ"
              mask={
                doc.length < 14
                  ? '[000].[000].[000]-[00]'
                  : '[00].[000].[000]/[0000]-[00]'
              }
              keyboardType="numeric"
              value={doc}
              onChangeText={setdoc}
            />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('RestartPass');
            }}
            style={[
              styles.link,
              {position: 'relative', right: -100, marginBottom: 10},
            ]}>
            <Text style={styles.btnDefaultText}>Esqueceu sua senha?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnDefault} onPress={login}>
            <Text style={styles.btnDefaultText}>Entrar</Text>
          </TouchableOpacity>
          <View
            style={{
              position: 'absolute',
              bottom: '10%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                width: '100%',
              }}>
              <Image style={[styles.logoP]} source={logo1} />
              <Image style={[styles.logoP]} source={logo2} />
            </View>
          </View>
        </ImageBackground>
      </View>
    </>
  );
};

export default Login;
