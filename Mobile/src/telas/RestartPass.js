import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import mask from '../utils/maskUsuario';
import { TextInput } from 'react-native-paper';
import styles, {
  danger,
  danverBackground,
  primary,
  background,
} from '../utils/Style';

import api from '../api';
import theme from '../utils/theme';
import MenuTop from '../components/MenuTop';

const Login = props => {
  const [state, setState] = useState({
    erro: false,
    mensagem: '',
  });
  const [load, setLoad] = useState(false);

  //const [doc, setdoc] = useState('33.734.844/0001-15');
  //const [doc, setdoc] = useState('92.665.611/0001-77');
  //const [doc, setdoc] = useState('92.665.611/0001-77');
  const [doc, setdoc] = useState('');
  const [teclado, setTeclado] = useState('default');

  useEffect(() => {
    if (state.erro) {
      setTimeout(() => {
        setState({ ...state, erro: false });
      }, 3000);
    }
  }, [state.erro]);
  const resetSenha = async () => {
    setLoad(true);
    let docu = doc
      .replace('.', '')
      .replace('.', '')
      .replace('/', '')
      .replace('-', '');
    if (isNaN(docu)) {
      docu = doc;
    }

    const { data } = await api({
      url: '/user/resetPass',
      data: { usuario: docu },
      method: 'post',
    });
    data.erro
      ? setState({
        ...state,
        erro: data.erro,
        mensagem: 'Verifique o Usuário.',
      })
      : props.navigation.navigate('Login', { resetSenha: true });
    setLoad(false);
  };

  return (
    <>
      <View
        style={{
          height: 100000,
          backgroundColor: 'red',
        }}>
        <MenuTop
          title="Redefinir Senha"
          {...props}
          irpara="Login"
          backgroundColor={primary}>
          <View style={[estilos.conteiner]}>
            <Text style={estilos.cabecalho}>
              Informe o seu usuário e recebe um email com instruções para
              alterar sua senha.
            </Text>

            <View style={{ marginTop: 20, width: '100%' }}>
              <TextInput
                label="CNPJ / CPF / Usuário"
                dense
                mode="outlined"
                theme={theme}
                value={doc}
                onChangeText={text => mask(text, setdoc, setTeclado)}
                keyboardType={teclado}
                style={[styles.imput]}
              />
            </View>
            {state.erro && (
              <View style={estilos.retornoBackend}>
                <Text style={{ color: danger }}>{state.mensagem}</Text>
              </View>
            )}

            <View
              style={[estilos.buttonView,]}>
              {load ? (
                <ActivityIndicator size={30} color="white" />
              ) : (
                  <TouchableOpacity
                    style={[
                      styles.btnDefault,
                      { paddingHorizontal: 10, backgroundColor: background },
                    ]}
                    onPress={resetSenha}>
                    <Text style={[{ fontWeight: 'bold', color: primary }]}>
                      REDEFINIR SENHA
                  </Text>
                  </TouchableOpacity>
                )}
            </View>
          </View>
        </MenuTop>
      </View>
    </>
  );
};

const estilos = StyleSheet.create({
  buttonView: {
    position: 'relative',
    width: '100%',
    justifyContent: 'space-around',

    marginHorizontal: '10%',
    marginVertical: 10,
    flexDirection: 'row',
  },
  retornoBackend: {
    backgroundColor: danverBackground,
    width: '80%',
    borderRadius: 5,
    alignItems: 'center',
    margin: 5,
    padding: 10,
    borderColor: danger,
  },
  cabecalho: {
    color: 'white',
    width: '80%',
    marginTop: 20,
    textAlign: 'justify',
  },
  conteiner: {
    width: '100%',

    backgroundColor: primary,
    alignItems: 'center',
  },
});

export default Login;
