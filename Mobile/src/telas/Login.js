import React, { useState, useEffect } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import messaging from '@react-native-firebase/messaging';

import StatusBar from '../components/StatusBar';

import logo from '../assets/img/logo_abepom_branca.png';
import { TextInput } from 'react-native-paper';
import styles, {
  danger,
  danverBackground,
  primary,
  sucess,
  background,
} from '../utils/Style';
import mask from '../utils/maskUsuario';
import api from '../api';
import theme from '../utils/theme';
import { ScrollView } from 'react-native-gesture-handler';
import useUsuario from '../../Store/Usuario';
import useConvenio from '../../Store/Convenio';

const Login = props => {
  const [reset, setReset] = useState(
    props.navigation.state.params
      ? props.navigation.state.params.resetSenha
      : false,
  );
  const [state, setState] = useState({
    erro: false,
    mensagem: '',
  });
  const [doc, setdoc] = useState('');
  const [senha, setSenha] = useState('');
  const [teclado, setTeclado] = useState('default');
  const [nome, setNome] = useState('');
  const [, setUsuario] = useUsuario();
  const [, setConv] = useConvenio();

  useEffect(() => {
    if (state.erro) {
      setTimeout(() => {
        setState({ ...state, erro: false });
      }, 4000);
    }
  }, [state.erro]);

  useEffect(() => {
    if (props.navigation.state.params) {
      setdoc(props.navigation.state.params.doc);
      setState(props.navigation.state.params);
    }
  }, []);

  const getToken = async () => {
    const token = await messaging().getToken();
    return token;
  };

  const conectar = async () => {
    let token = await getToken();

    if (doc.length > 13 && senha) {
      try {
        const { data } = await api.post('/Login', {
          usuario: doc,
          senha,
          token,
        });

        let convenio;
        if (!data.erro) {
          setUsuario({ usuario: doc, senha });
          convenio = {
            id_gds: data.id_gds,
            nome_parceiro: data.nome_parceiro,
            caminho_logomarca: data.caminho_logomarca,
            efetuarVenda: data.efetuarVenda,
            doc: data.doc,
            usuario: data.usuario,
            nivel: data.nivel,
            token,
          };

          setConv(convenio);
          props.navigation.navigate('App');
        } else {
          setState({ erro: true, mensagem: 'Usuário ou Senha incorretos' });
        }
      } catch (error) {
        alert(`${error}  	`);
      }
    } else {
      setState({ erro: true, mensagem: 'Usuário ou Senha incorretos' });
    }
  };

  return (
    <>
      <StatusBar />
      <View style={estilos.conteiner}>
        <ScrollView style={{ width: '100%' }}>
          <Image
            style={[styles.logo, { marginTop: '10%', alignSelf: 'center' }]}
            source={logo}
          />
          <View style={{ alignItems: 'center' }}>
            <Text style={[styles.white, styles.textoGG]}>ABEPOM</Text>
            <Text style={[styles.white, styles.textoM]}>PARCEIROS</Text>
          </View>

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

            <TextInput
              label="senha"
              dense
              mode="outlined"
              theme={theme}
              value={senha}
              onChangeText={setSenha}
              keyboardType="default"
              style={[styles.imput]}
              secureTextEntry
            />
          </View>
          {state.erro && (
            <View style={[estilos.retornoBackend, estilos.mensagemErro]}>
              <Text style={{ color: danger }}>{state.mensagem}</Text>
            </View>
          )}
          {reset && (
            <View
              style={[estilos.retornoBackend, estilos.mensagemSucesso]}
              onLayout={() =>
                setTimeout(() => {
                  setReset(false);
                }, 3000)
              }>
              <Text style={styles.white}>
                Você recebera um email com sua senha
              </Text>
            </View>
          )}

          <View style={estilos.buttonView}>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('RestartPass', { noLogin: true });
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
              style={[
                styles.btnDefault,
                {
                  padding: 10,
                  paddingHorizontal: 20,
                  backgroundColor: background,
                },
              ]}
              onPress={() => conectar()}>
              <Text style={{ color: primary }}>ENTRAR</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={[
              styles.btnDefault,
              {
                padding: 10,
                paddingHorizontal: 20,
                backgroundColor: background,
                margin: 20,
              },
            ]}
            onPress={() => {
              api.post('/randomMultiUsuarios').then(({ data }) => {
                console.log(data);
                setdoc(data.doc);
                setSenha(data.senha);
                setNome(data.nome_fantasia);
              });
            }}>
            <Text>MultUsuarios</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.btnDefault,
              {
                padding: 10,
                paddingHorizontal: 20,
                backgroundColor: background,
                margin: 20,
              },
            ]}
            onPress={() => {
              api.post('/randomFarmacia').then(({ data }) => {
                setdoc(data.Cgc);
                setSenha(data.Senha);
                setNome(data.Nome_fantasia);
              });
            }}>
            <Text>Farmacia</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.btnDefault,
              {
                padding: 10,
                paddingHorizontal: 20,
                backgroundColor: background,
                margin: 20,
              },
            ]}
            onPress={() => {
              api.post('/randomparceiro').then(({ data }) => {
                setdoc(data.doc);
                setSenha(data.senha);
                setNome(data.nome_fantasia);
              });
            }}>
            <Text>Parceiro</Text>
          </TouchableOpacity>
        </View>
        {!!nome && <Text style={{ color: 'white' }}>{nome}</Text>}
      </View>
    </>
  );
};
const estilos = StyleSheet.create({
  buttonView: {
    position: 'relative',
    flex: 1,
    justifyContent: 'space-around',

    marginHorizontal: '10%',
    marginVertical: 10,
    flexDirection: 'row',
  },
  retornoBackend: {
    width: '80%',
    borderRadius: 5,
    alignItems: 'center',
    margin: 5,
    padding: 10,
    alignSelf: 'center',
  },
  mensagemErro: {
    backgroundColor: danverBackground,
    borderColor: danger,
  },
  mensagemSucesso: {
    backgroundColor: sucess,
    borderColor: sucess,
  },

  cabecalho: {
    color: 'white',
    width: '80%',
    marginTop: 20,
    textAlign: 'justify',
  },
  conteiner: {
    flex: 1,
    backgroundColor: primary,
    alignItems: 'center',
  },
});

export default Login;
