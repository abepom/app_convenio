import React, {useState, useEffect} from 'react';
import {View, Image, Text, TouchableOpacity} from 'react-native';

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
import MenuTop from '../components/MenuTop';

const Login = props => {
  const [state, setState] = useState({
    erro: false,
    mensagem: '',
  });
  const [mascara, setMascara] = useState('');
  //const [doc, setdoc] = useState('33.734.844/0001-15');
  //const [doc, setdoc] = useState('92.665.611/0001-77');
  const [doc, setdoc] = useState('92.665.611/0001-77');

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
    if (state.erro) {
      setTimeout(() => {
        setState({...state, erro: false});
      }, 3000);
    }
  }, [state.erro]);
  const resetSenha = async () => {
    let docu = doc
      .replace('.', '')
      .replace('.', '')
      .replace('/', '')
      .replace('-', '');
    if (isNaN(docu)) {
      docu = doc;
    }
    console.log(docu);

    const {data} = await api({
      url: '/user/resetPass',
      data: {usuario: docu},
      method: 'post',
    });
    data.erro
      ? setState({
          ...state,
          erro: data.erro,
          mensagem: 'Falha ao enviar o email',
        })
      : props.navigation.navigate('Login');
  };

  return (
    <>
      <MenuTop title="Redefinir Senha" {...props}>
        <View
          style={{
            width: '100%',
            backgroundColor: primary,
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: 'white',
              width: '80%',
              marginTop: 20,
              textAlign: 'justify',
            }}>
            Informe o seu usuário e recebe um email com instruções para alterar
            sua senha.
          </Text>

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
            }}>
            <TouchableOpacity
              style={[styles.btnDefault, {paddingHorizontal: 10}]}
              onPress={resetSenha}>
              <Text style={styles.btnDefaultText}>REDEFINIR SENHA</Text>
            </TouchableOpacity>
          </View>
        </View>
      </MenuTop>
    </>
  );
};

export default Login;
