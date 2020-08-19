import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Dimensions, Text} from 'react-native';
import styles, {danger, danverBackground, primary} from '../utils/Style';
import LoginAdm from '../components/LoginAdm';
import LoginPDV from '../components/LoginPDV';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';

import api from '../api';

import MenuTop from '../components/MenuTop';
import {ScrollView} from 'react-native-gesture-handler';
const initialLayout = {width: Dimensions.get('window').width};
const Login = (props) => {
  const [carregando, setCarregando] = useState(false);

  const [index, setIndex] = useState(props.navigation.state.params.index);
  const [state, setState] = useState({
    erro: false,
    mensagem: '',
  });

  useEffect(() => {
    if (state.erro) {
      setTimeout(() => {
        setState({...state, erro: false});
      }, 6000);
    }
  }, [state.erro]);

  const resetSenha = async (imput) => {
    setCarregando(true);

    console.log(imput);
    const {doc} = imput;
    //setLoad(true);
    if (doc) {
      const {data} = await api({
        url: '/user/resetPass',
        data: imput,
        method: 'post',
      });

      data.erro
        ? setState({
            ...state,
            erro: data.erro,
            mensagem: data.mensagem ?? 'Verifique o Usuário.',
          })
        : props.navigation.navigate('Login', {
            ...data,
            resetSenha: true,
            index: imput.user ? 1 : 0,
            imput,
          });
      setCarregando(false);
    } else {
      setState({
        ...state,
        erro: true,
        mensagem: 'Informe um usuário e senha.',
      });
    }
    setCarregando(false);
  };

  const [routes] = useState([
    {key: '1', title: 'Administrador'},
    {key: '2', title: 'Ponto de venda'},
  ]);

  const renderScene = SceneMap({
    '2': () => (
      <LoginPDV
        {...props}
        setState={setState}
        state={state}
        func={resetSenha}
        redefinirSenha
        carregando={carregando}
      />
    ),
    '1': () => (
      <LoginAdm
        {...props}
        carregando={carregando}
        setState={setState}
        state={state}
        func={resetSenha}
        redefinirSenha
      />
    ),
  });
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
          <ScrollView style={{width: '100%'}}>
            <View style={{width: '80%', alignSelf: 'center', marginTop: 20}}>
              <Text style={[styles.textoG, styles.white]}>
                Informe os dados necessário para efetuar a redefinição de senha.
              </Text>
              <Text style={[styles.textoG, styles.white]}>
                Você receberá um e-mail com a nova senha.
              </Text>
            </View>
            <TabView
              navigationState={{index, routes}}
              renderScene={renderScene}
              onIndexChange={setIndex}
              style={{
                marginTop: 20,
              }}
              initialLayout={initialLayout}
              lazy={true}
              renderTabBar={(props) => (
                <TabBar
                  {...props}
                  indicatorStyle={{backgroundColor: 'white'}}
                  style={{backgroundColor: primary, elevation: 1}}
                  labelStyle={styles.textoM}
                />
              )}
            />
          </ScrollView>
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
