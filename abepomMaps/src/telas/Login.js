import React, {useState, useEffect} from 'react';
import {
  View,
  ImageBackground,
  Image,
  TextInput,
  Text,
  TouchableOpacity,
} from 'react-native';
import {PermissionsAndroid} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import StatusBar from '../components/StatusBar';
import bg from '../assets/img/background.png';
import logo from '../assets/img/logo.png';
import logo1 from '../assets/img/logo1.png';
import logo2 from '../assets/img/logo2.png';
import styles, {danger, danverBackground} from '../constants/Style';
import TextInputMask from 'react-native-text-input-mask';
import axios from 'axios';
import api from '../api';

const Login = props => {
  const [state, setState] = useState({
    erro: false,
    mensagem: '',
  });
  const [doc, setdoc] = useState('');
  const [senha, setSenha] = useState('');

  async function permissao() {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.INTERNET,
      {
        title: 'Cool Photo App Camera Permission',
        message:
          'Cool Photo App needs access to your camera ' +
          'so you can take awesome pictures.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the camera');
    } else {
      console.log('Camera permission denied');
    }
  }

  useEffect(() => {
    PermissionsAndroid.PERMISSIONS.INTERNET;
  }, []);
  useEffect(() => {
    if (state.erro) {
      setTimeout(() => {
        setState({...state, erro: false});
      }, 3000);
    }
  }, [state.erro]);

  const conectar = async () => {
    if (doc.length > 13 && senha) {
      const data = await api({
        url: '/Login',
        data: {usuario: doc, senha},
        method: 'post',
      });
      const {convenio, erro, mensagem} = data.data;

      if (!erro) {
        if (convenio.ativo) {
          setUsuario('Usuario', {doc, senha});
          setUsuario('convenio', convenio);

          props.navigation.navigate('drawer');
        }
      } else {
        setState({erro, mensagem});
      }
    } else {
      setState({erro: true, mensagem: 'Usuario ou Senha incorretos'});
    }
  };
  const setUsuario = async (local, dados) => {
    await AsyncStorage.setItem(local, JSON.stringify(dados));
  };

  return (
    <>
      <StatusBar />
      <View style={{flex: 1}}>
        <ImageBackground
          source={bg}
          style={[styles.bgImage, {alignItems: 'center'}]}>
          <TouchableOpacity
            onPress={async () => {
              const res = await axios.get('http://187.94.98.194:3333/');
              alert(res.data.mensagem);
            }}>
            <Image style={[styles.logo, {margin: '10%'}]} source={logo} />
          </TouchableOpacity>
          <View style={{marginTop: 20}}>
            <TextInputMask
              style={styles.input}
              placeholder="CPF / CNPJ"
              mask={
                doc.length < 14
                  ? '[000].[000].[000]-[00]'
                  : '[00].[000].[000]/[0000]-[00]'
              }
              onKeyPress={(key, a) => console.log(key, a)}
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
          {state.erro && (
            <View
              style={{
                backgroundColor: danverBackground,
                width: '80%',
                borderRadius: 5,
                alignItems: 'center',
                margin: 5,
                padding: 10,
                borderColor: danger,
              }}>
              <Text style={{color: danger}}>{state.mensagem}</Text>
            </View>
          )}
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
          <TouchableOpacity style={styles.btnDefault} onPress={conectar}>
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
              <TouchableOpacity
                onPress={async () => {
                  const resultado = await axios.get(
                    'https://api.github.com/users/diego3d',
                  );
                  alert(resultado.data.login);
                }}>
                <Image style={[styles.logoP]} source={logo1} />
              </TouchableOpacity>
              <Image style={[styles.logoP]} source={logo2} />
            </View>
          </View>
        </ImageBackground>
      </View>
    </>
  );
};

export default Login;
