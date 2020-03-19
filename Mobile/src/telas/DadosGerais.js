import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles, {sucess, sucessBack, white} from '../utils/Style';
import StatusBar from '../components/StatusBar';
import Menu from '../components/MenuTop';
import ImputText from '../components/imputText';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../api';
import MenuTop from '../components/MenuTop';
import Retorno from '../components/Retorno';
export default function componentName(props) {
  const [nome, setNome] = useState();
  useEffect(() => {}, []);

  const {navigation} = props;
  const [state, setState] = useState({
    ...navigation.state.params,
    retorno: false,
  });
  const [focar, setFocar] = useState({
    nome: {erro: false, mensagem: 'Informe o Nome da Fachada'},
    email: {erro: false, mensagem: 'Campo é obrigatório'},
  });
  const refNome = useRef();
  const refEmail = useRef();
  useEffect(() => {
    retorno(state.nome_de_exibicao, state.email);
  }, [state.nome_de_exibicao, state.email]);
  useEffect(() => {
    setTimeout(() => {
      setState({...state, retorno: false});
    }, 2000);
  }, [state.retorno]);

  const retorno = (nome_de_exibicao, email) => {
    let retornoNome;
    let retornoEmail;
    if (!!nome_de_exibicao) {
      retornoNome = {erro: false, mensagem: 'Informe o Nome da Fachada'};
    } else {
      refNome.current.focus();
      retornoNome = {erro: true, mensagem: 'Informe o Nome da Fachada'};
    }
    if (email.indexOf('@') > 0 && email.indexOf('.') > 0) {
      retornoEmail = {erro: false, mensagem: 'Campo é obrigatório'};
    } else {
      refEmail.current.focus();
      retornoEmail = {erro: true, mensagem: 'Informe um email valido'};
    }
    let estado = {
      nome: retornoNome,
      email: retornoEmail,
    };

    return setFocar(estado);
  };
  const salvar = async () => {
    const {nome_de_exibicao, email} = state;
    if (
      !!nome_de_exibicao &&
      email.indexOf('@') > 0 &&
      email.indexOf('.') > 0
    ) {
      const resp = await api.post('/user/edit', state);
      return setState({...resp.data.convenio, retorno: true});
    } else {
      return retorno(nome_de_exibicao, email);
    }
  };

  return (
    <>
      <MenuTop title="Dados Gerais" drawer={true} {...props}>
        <View style={{width: '100%'}}>
          <View>
            <Text
              style={{
                marginHorizontal: '7%',
                color: white,
                marginTop: 20,
                marginBottom: 5,
              }}>
              Nome da Fachada
            </Text>
            <TextInput
              ref={refNome}
              style={[
                {
                  backgroundColor: '#ddd',
                  borderRadius: 5,
                  marginHorizontal: '5%',
                },

                !state.nome_de_exibicao || focar.nome.erro
                  ? {borderColor: '#f00', borderWidth: 1}
                  : {borderWidth: 0},
              ]}
              value={state.nome_de_exibicao}
              onChangeText={text =>
                setState({...state, nome_de_exibicao: text})
              }
              placeholder={'Nome da Fachada'}
            />
            {!state.nome_de_exibicao ? (
              <Text
                style={{
                  marginHorizontal: '7%',
                  marginBottom: 5,
                  color: '#f00',
                  fontSize: 10,
                }}>
                {focar.nome.mensagem}
              </Text>
            ) : (
              focar.nome.erro && (
                <Text
                  style={{
                    marginHorizontal: '7%',
                    marginBottom: 5,
                    color: '#f00',
                    fontSize: 10,
                  }}>
                  {focar.nome.mensagem}
                </Text>
              )
            )}
          </View>
          <View>
            <Text
              style={{
                marginHorizontal: '7%',
                color: white,
                marginTop: 20,
                marginBottom: 5,
              }}>
              E-mail
            </Text>
            <TextInput
              ref={refEmail}
              style={[
                {
                  backgroundColor: '#ddd',
                  borderRadius: 5,
                  marginHorizontal: '5%',
                },

                !state.email && {borderColor: '#f00', borderWidth: 1},
                focar.email.erro && {borderColor: '#f00', borderWidth: 1},
              ]}
              value={state.email}
              onChangeText={text => setState({...state, email: text})}
              placeholder={'E-mail'}
            />
            {!state.email ||
              (focar.email.erro && (
                <Text
                  style={{
                    marginHorizontal: '7%',
                    marginBottom: 5,
                    color: '#f00',
                    fontSize: 10,
                  }}>
                  {focar.email.mensagem}
                </Text>
              ))}
          </View>

          <ImputText
            value={state.telefone_comercial}
            onChangeText={text =>
              setState({...state, telefone_comercial: text})
            }
            placeholder="Telefone Comercial"
          />
          <ImputText
            value={state.telefone_contato}
            onChangeText={text => setState({...state, telefone_contato: text})}
            placeholder="Telefone Contato"
          />

          <ImputText
            value={state.inscricao_estadual_municipal}
            // onChangeText={text =>
            //   setState({...state, inscricao_estadual_municipal: text})
            // }
            placeholder={state.doc < 14 ? 'Identidade' : 'Inscrição Estadual'}
          />
          <ImputText
            value={state.representante}
            onChangeText={text => setState({...state, representante: text})}
            placeholder="Representante"
          />
          <ImputText
            value={state.cargo_representante}
            onChangeText={text =>
              setState({...state, cargo_representante: text})
            }
            placeholder="Cargo do representante"
          />
          <ImputText
            value={state.site}
            onChangeText={text => setState({...state, site: text})}
            placeholder="Site"
          />
          <ImputText
            value={state.whatsapp}
            onChangeText={text => setState({...state, whatsapp: text})}
            placeholder="Whatsapp"
          />
        </View>
      </MenuTop>

      <View
        style={{
          width: '100%',
          position: 'absolute',
          bottom: 20,
          alignItems: 'flex-end',
        }}>
        {state.retorno ? (
          <View
            style={{
              position: 'absolute',
              left: 20,
              margin: 10,
              elevation: 5,
              padding: 15,
              backgroundColor: sucessBack,
              borderColor: sucess,
              borderWidth: 1,
              borderRadius: 5,
            }}>
            <Text style={{color: sucess}}>Salvo com sucesso</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={{
            padding: 5,
            backgroundColor: '#1f4ba4',
            position: 'relative',
            right: 20,
            width: 50,
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 25,
            margin: 20,
            elevation: 5,
          }}
          onPress={() => salvar()}>
          <Icon name="save" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    </>
  );
}
