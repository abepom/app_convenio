import React, {useEffect, useState, useMemo} from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import MenuTop from './../components/MenuTop';
import imagens from '../utils/imagens';
import useConvenio from './../../Store/Convenio';
import api from './../api';
import styles, {primary, danger, sucess, sucessBack} from './../utils/Style';
import Icone from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import {themeLight} from './../utils/theme';
import {TextInput} from 'react-native-paper';
import Carregando from '../components/Carregando';
import {FlatList} from 'react-native-gesture-handler';

export default function AdministrarUsuarios(props) {
  const [refreshing, setRefreshing] = useState(false);
  const [{cd_convenio, doc}] = useConvenio();
  const [state, setstate] = useState([]);
  const [pesquisa, setPesquisa] = useState('');
  const [modal, setModal] = useState(false);
  const [usuarioSelecionado, SetUsuarioSelecionado] = useState(false);
  const [ConteudoModal, SetConteudoModal] = useState(() => {});
  const getPDV = () => {
    api.post('/user/pdv', {cd_convenio}).then(({data}) => setstate(data));
  };
  useEffect(() => {
    getPDV();
  }, []);
  useEffect(() => {
    usuarioSelecionado
      ? usuarioSelecionado.id != 0
        ? modalEditarUsuario(true)
        : modalEditarUsuario(false)
      : null;
  }, [usuarioSelecionado]);

  const bloquearUsuario = (id, status) => {
    api
      .post('/user/alterarStatusPDV', {id, status})
      .then(({data}) => {
        if (!data.error) {
          getPDV();
        }
      })
      .catch((e) => console.log(e));
    setModal(false);
  };
  const modalbloquearUsuario = (id, status) => {
    setModal(true);
    SetConteudoModal(() => (
      <View style={{backgroundColor: 'white', borderRadius: 5}}>
        <Text
          style={{
            alignSelf: 'center',
            margin: 5,
            fontSize: 20,
            fontWeight: 'bold',
          }}>
          {status ? 'Bloquear usuário?' : 'Desbloquear usuário?'}
        </Text>
        <Text style={{marginBottom: 50, marginHorizontal: 20, fontSize: 16}}>
          {status
            ? ' Essa ação ira BLOQUEAR o acesso do ponto de Venda ao sistema.'
            : ' Essa ação ira DESBLOQUEAR o acesso do ponto de Venda ao sistema.'}
        </Text>
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,

            flexDirection: 'row',
          }}>
          <TouchableOpacity
            style={{
              padding: 10,
              backgroundColor: danger,
              borderBottomLeftRadius: 5,
              flex: 1,
              alignItems: 'center',
            }}
            onPress={() => bloquearUsuario(id, status)}>
            <Text style={{color: 'white'}}>
              {status ? 'Bloquear' : 'Desbloquear'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              padding: 10,
              alignItems: 'center',
              backgroundColor: primary,
              flex: 1,
              borderBottomRightRadius: 5,
            }}
            onPress={() => setModal(false)}>
            <Text style={{color: 'white'}}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    ));
  };

  const criarUsuario = () => {
    const {usuario, email, senha} = usuarioSelecionado;
    if (!usuario && !email && !senha) {
      return Alert.alert(null, 'Preencha todos os campos');
    }
    api
      .post('/user/criarPDV', {cd_convenio, doc, usuario, email, senha})
      .then(({data}) => {
        if (!data.error) {
          Alert.alert(null, data.mensagem);
          getPDV();
          SetUsuarioSelecionado(false);
        } else {
          console.log(data.error);
          Alert.alert(null, JSON.stringify(data.error));
        }
      })
      .catch((e) => console.log(e));
    setModal(false);
  };
  const editarUsuario = () => {
    const {usuario, email, senha} = usuarioSelecionado;

    if (!usuario && !email && !senha) {
      return Alert.alert(null, 'Preencha todos os campos');
    }

    api
      .post('/user/editarPDV', {...usuarioSelecionado, doc})
      .then(({data}) => {
        console.log('editar');
        console.log(data);
        if (!data.error) {
          Alert.alert(null, 'Usuario Alterado com sucesso');
          getPDV();
          SetUsuarioSelecionado(false);
        }
      })
      .catch((e) => console.log(e, 'erro'));
    setModal(false);
  };
  const modalEditarUsuario = (edicao) => {
    setModal(true);
    console.log(edicao);
    SetConteudoModal(() => (
      <View style={{backgroundColor: 'white', borderRadius: 5}}>
        <Text
          style={{
            alignSelf: 'center',
            margin: 5,
            fontSize: 20,
            fontWeight: 'bold',
          }}>
          {edicao ? 'Editar PDV' : 'Criar PDV'}
        </Text>
        <TextInput
          label="Usuario"
          maxLength={14}
          dense
          mode="outlined"
          theme={themeLight}
          value={usuarioSelecionado.usuario}
          onChangeText={(texto) =>
            SetUsuarioSelecionado({...usuarioSelecionado, usuario: texto})
          }
          keyboardType="default"
          style={[styles.textoM, {marginHorizontal: 10}]}
        />
        <TextInput
          label="E-mail"
          dense
          mode="outlined"
          theme={themeLight}
          value={usuarioSelecionado.email}
          onChangeText={(texto) =>
            SetUsuarioSelecionado({...usuarioSelecionado, email: texto})
          }
          keyboardType="email-address"
          style={[styles.textoM, {marginHorizontal: 10}]}
        />
        <TextInput
          label="Senha"
          secureTextEntry
          dense
          mode="outlined"
          theme={themeLight}
          value={usuarioSelecionado.senha}
          onChangeText={(texto) =>
            SetUsuarioSelecionado({...usuarioSelecionado, senha: texto})
          }
          keyboardType="default"
          style={[styles.textoM, {marginHorizontal: 10}]}
        />
        <Text
          style={{
            marginBottom: 30,
            marginHorizontal: 20,
            color: primary,
          }}></Text>
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,

            flexDirection: 'row',
          }}>
          <TouchableOpacity
            style={{
              padding: 10,
              backgroundColor: sucess,
              borderBottomLeftRadius: 5,
              flex: 1,
              alignItems: 'center',
            }}
            onPress={edicao ? editarUsuario : criarUsuario}>
            <Text style={{color: 'white'}}>
              {edicao ? 'Salvar Alteração' : 'Criar PDV'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              padding: 10,
              alignItems: 'center',
              backgroundColor: primary,
              flex: 1,
              borderBottomRightRadius: 5,
            }}
            onPress={() => {
              SetUsuarioSelecionado(false);
              setModal(false);
            }}>
            <Text style={{color: 'white'}}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    ));
  };
  return (
    <>
      <Modal isVisible={modal} {...props}>
        {ConteudoModal}
      </Modal>
      <MenuTop
        drawer
        {...props}
        title={'Administrar Usuários'}
        header={
          <View style={{marginTop: 20}}>
            <Text style={{fontSize: 20, color: primary}}>
              Lista de ponto de venda
            </Text>
            <TouchableOpacity
              style={{
                padding: 5,
                backgroundColor: sucess,
                alignItems: 'center',
                borderRadius: 5,
              }}
              onPress={() =>
                SetUsuarioSelecionado({
                  id: 0,
                  usuario: '',
                  email: '',
                  senha: '',
                })
              }>
              <Text style={{color: 'white'}}>Criar PDV</Text>
            </TouchableOpacity>
          </View>
        }>
        {state.length == 0 ? (
          <View style={{flex: 1}}>
            <View style={{padding: 15, backgroundColor: sucessBack}}>
              <Text style={{color: sucess}}>
                Nenhum Ponto de Venda cadastrado.
              </Text>
            </View>
          </View>
        ) : (
          <FlatList
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={getPDV} />
            }
            data={state}
            keyExtractor={(item, index) => index}
            ListEmptyComponent={
              <View>
                <Carregando />
              </View>
            }
            renderItem={({item}) => {
              return (
                <View
                  style={{
                    width: Dimensions.get('screen').width - 10,
                    padding: 10,
                    backgroundColor: 'white',
                    margin: 5,
                    borderRadius: 5,
                    borderColor: primary,
                    borderWidth: 0.2,
                    elevation: 2,
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 9}}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <View>
                          <Text style={{fontSize: 10, color: primary}}>
                            Usuario:
                          </Text>
                          <Text style={{color: primary}}> {item.usuario}</Text>
                        </View>
                        <View style={{marginRight: '15%', width: 80}}>
                          <Text style={{fontSize: 10, color: primary}}>
                            Status:
                          </Text>
                          <Text style={{color: primary}}>
                            {' '}
                            {item.ativo ? 'Ativo' : 'Desativo'}
                          </Text>
                        </View>
                      </View>
                      <View>
                        <Text style={{fontSize: 10, color: primary}}>
                          Email:
                        </Text>
                        <Text style={{color: primary}}> {item.email}</Text>
                      </View>
                    </View>
                    <View
                      style={{
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        flex: 1,
                      }}>
                      <TouchableOpacity
                        onPress={() =>
                          modalbloquearUsuario(item.id, item.ativo)
                        }>
                        {!item.ativo ? (
                          <Icone
                            name={'lock-outline'}
                            size={30}
                            color={danger}
                          />
                        ) : (
                          <Icone
                            name={'lock-open-outline'}
                            size={30}
                            color={sucess}
                          />
                        )}
                      </TouchableOpacity>
                      <TouchableOpacity
                        disabled={!item.ativo}
                        onPress={async () => {
                          await SetUsuarioSelecionado(item);
                        }}>
                        <Icone
                          name={'pencil'}
                          size={30}
                          color={primary}
                          style={{opacity: item.ativo ? 1 : 0.3}}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            }}
          />
        )}
      </MenuTop>
    </>
  );
}
