import React, {useState, useEffect} from 'react';
import {View, Image, Text, TouchableOpacity} from 'react-native';
import {PermissionsAndroid} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import StatusBar from '../components/StatusBar';
import bg from '../assets/img/background.png';
import logo from '../assets/img/logo_abepom_branca.png';
import {TextInput} from 'react-native-paper';
import styles, {
  danger,
  danverBackground,
  primaryBack,
  primary,
} from '../utils/Style';
import TextInputMask from 'react-native-text-input-mask';

import api from '../api';
import theme from '../utils/theme';
import {ScrollView} from 'react-native-gesture-handler';

const Login = props => {
  const [state, setState] = useState({
    erro: false,
    mensagem: '',
  });
  //const [doc, setdoc] = useState('33.734.844/0001-15');
  const [doc, setdoc] = useState('03.383.807/0002-20');
  //const [doc, setdoc] = useState('');
  //const [senha, setSenha] = useState('casaludica2019');
  const [senha, setSenha] = useState('normal123');
  const [mascara, setMascara] = useState('');

  useEffect(() => {
    if (isNaN(doc.substr(0, 3)) || doc == '') {
      setMascara('');
    } else {
      console.log('teste');
      doc.length > 13
        ? setMascara('[00].[000].[000]/[0000]-[00]')
        : setMascara('[000].[000].[000]-[009]');
    }
  }, [doc]);
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
    console.log(doc.length > 13, senha);
    if (doc.length > 13 && senha) {
      const {data} = await api({
        url: '/Login',
        data: {usuario: doc, senha},
        method: 'post',
      });
      console.log(data);
      let convenio;
      if (!data.erro) {
        setUsuario('Usuario', {doc, senha});
        convenio = {
          id_gds: data.id_gds,
          nome_parceiro: data.nome_parceiro,
          caminho_logomarca: data.caminho_logomarca,
          efetuarVenda: data.efetuarVenda,
        };
        setUsuario('convenio', convenio);

        props.navigation.navigate('Home', convenio);
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
      <View
        style={{
          flex: 1,
          backgroundColor: primary,
          alignItems: 'center',
        }}>
        <ScrollView style={{width: '100%'}}>
          <Image
            style={[styles.logo, {margin: '10%', alignSelf: 'center'}]}
            source={logo}
          />

          <View style={{marginTop: 20, width: '100%'}}>
            {!mascara ? (
              <TextInput
                autoFocus="true"
                label="CNPJ / CPF / Usuário"
                dense
                mode="outlined"
                theme={theme}
                value={doc}
                onChangeText={setdoc}
                keyboardType="default"
                style={[styles.imput]}
              />
            ) : (
              <TextInput
                autoFocus="false"
                label="CNPJ / CPF / Usuário"
                dense
                mode="outlined"
                theme={theme}
                value={doc}
                onChangeText={setdoc}
                keyboardType="numeric"
                style={[styles.imput]}
                mask={mascara}
                render={props => {
                  return <TextInputMask {...props} />;
                }}
              />
            )}
            <TextInput
              label="senha"
              dense
              mode="outlined"
              theme={theme}
              value={senha}
              selectedValue={setSenha}
              keyboardType="numeric"
              style={[styles.imput]}
              secureTextEntry
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

          <View
            style={{
              position: 'relative',
              width: '100%',
              justifyContent: 'space-around',
              // alignSelf: 'flex-end',
              marginHorizontal: '10%',
              marginVertical: 10,
              flexDirection: 'row',
              alignSelf: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('RestartPass', {noLogin: true});
              }}
              style={[
                styles.link,
                {
                  marginBottom: 10,
                },
              ]}>
              <Text style={styles.btnDefaultText}>Esqueceu sua senha?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btnDefault, {paddingHorizontal: 10}]}
              onPress={conectar}>
              <Text style={styles.btnDefaultText}>ENTRAR</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default Login;
