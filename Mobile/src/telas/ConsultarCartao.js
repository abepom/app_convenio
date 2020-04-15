import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { TextInput as Imput } from 'react-native-paper';
import { RNCamera } from 'react-native-camera';
import Menu from '../components/MenuTop';
import Icone from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import { TextInputMask } from 'react-native-masked-text';

import styles, { danger, primary, white } from '../utils/Style';
import api from '../api';
import { TextInput as TextInputformat } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import Retorno from '../components/Retorno';
import { themeLight } from '../utils/theme';

const Home = props => {
  const [modal, setModal] = useState(false);
  const [cartao, setCartao] = React.useState('');
  const [erro, setErro] = React.useState(false);
  const [convenio, setConvenio] = React.useState(false);
  const [associado, setAssociado] = React.useState(null);
  const [valorUsado, setValorUsado] = useState(null);
  const [mensagens, setMensagens] = React.useState('');
  const [camera, setCamera] = useState(false);

  const [carregando, setCarregando] = useState(false)

  useEffect(() => {
    getItens();
  }, []);
  async function getItens() {
    await AsyncStorage.getItem('convenio').then(usuario => {
      setConvenio(JSON.parse(usuario));
    });
  }

  React.useEffect(() => {
    if (erro) {
      setTimeout(() => {
        setErro(false);
      }, 4000);
    }
  }, [erro]);
  const _handlerConsultaCartao = async card => {
    setCarregando(true)
    if (!card) {
      card = cartao;
    }
    let req = await api({
      url: '/VerificarCartao',
      params: { cartao: card, id_gds: convenio.id_gds },
      method: 'GET',
    });

    const { erro, socio, mensagem } = req.data;

    if (card.length === 11) {
      if (erro) {
        setCarregando(false)

        setErro(true);
        setMensagens({ descricao: mensagem, tipo: 'danger' });
        setAssociado('');
      } else {
        setAssociado(socio);
        setCarregando(false)
      }
      console.log(socio);
    } else {
      setErro(true);
      setCarregando(false)
      setMensagens({
        descricao: 'Cartão invalido. Digite novamente.',
        tipo: 'danger',
      });
      setAssociado('');
    }
  };
  const _abrirCamera = () => {
    setAssociado('');
    setCartao('');
    setCamera(true);
  };
  async function handlerStoreValue() {
    setCarregando(true)
    if (valorUsado && valorUsado != 'R$0,00') {
      let req = await api({
        url: '/Informe',
        data: { cartao, id_gds: convenio.id_gds, valor: valorUsado },
        method: 'POST',
      });

      if (!req.data.erro) {
        setModal(false);

        setValorUsado('');
      } else {
        alert('Erro ao informar Consumo');
      }
    } else {
      alert('Informe o valor consumido');
    }
    setCartao('');
    setAssociado(null);
    setErro(true);
    setMensagens({ descricao: `Consumo informado com sucesso`, tipo: 'sucess' });
    setCarregando(false)
  }

  return (
    <>
      <Modal isVisible={modal} {...props}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ backgroundColor: '#fff', padding: 30, paddingTop: 50 }}>
            <TouchableOpacity
              style={{ position: 'absolute', right: 0 }}
              onPress={() => setModal(false)}>
              <Icone name="close-circle" size={30} color={danger} />
            </TouchableOpacity>
            <Text style={{ color: primary }}>
              Por favor, informe o valor consumido.
            </Text>
            <Text style={{ fontSize: 10, right: 0, position: 'relative' }}>
              * essa informação será usada para estatística
            </Text>
            <View style={{ flexDirection: 'row', marginTop: 30 }}>
              <Imput
                label="Valor consumido"
                dense
                mode="outlined"
                direction="rtl"
                theme={{
                  colors: {
                    primary: primary,

                    background: 'white',

                    text: primary,
                    placeholder: primary,
                  },
                }}
                keyboardType={'numeric'}
                style={[
                  styles.imput,
                  { width: '75%', marginLeft: 0, textAlign: 'right' },
                ]}
                value={valorUsado}
                onChangeText={setValorUsado}
                render={props => (
                  <TextInputMask
                    type={'money'}
                    options={{
                      precision: 2,
                      separator: ',',
                      delimiter: '.',
                      unit: 'R$',
                      suffixUnit: '',
                    }}
                    {...props}
                  />
                )}
              />
              {!carregando ? (

                <TouchableOpacity
                  onPress={() => {
                    handlerStoreValue();
                  }}>
                  <Icone
                    name="check-circle"
                    size={40}
                    color="#006600"
                    style={{ margin: 15 }}
                  />
                </TouchableOpacity>
              ) : (<ActivityIndicator />)}
            </View>
          </View>
        </View>
      </Modal>

      <Menu {...props} title="Consulta de Cartões">
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 16, marginVertical: 20, color: primary }}>
            Informe o número do cartão do associado
          </Text>

          <View style={[styles.input, { borderWidth: 0, backgroundColor: null }]}>

            <TextInputformat
              label="Cartão"
              dense
              mode="outlined"
              theme={themeLight}
              onChangeText={setCartao}
              value={cartao}
              keyboardType="numeric"
              style={[{ width: '100%', flex: 1 }]}
              onSubmitEditing={() => _handlerConsultaCartao()}
            />
          </View>

          {/* <View style={[styles.input, { flexDirection: 'row' }]}>
            <TextInput
              placeholder="Cartão"
              keyboardType="numeric"
              maxLength={11}
              value={cartao}
              style={{ width: '85%' }}
              onChangeText={setCartao}
              onSubmitEditing={() => _handlerConsultaCartao()}
            />

            <TouchableOpacity
              style={{ width: '15%' }}
              onPress={() => {
                _abrirCamera();
              }}>
              <Icone
                name="camera"
                style={{ width: '100%', color: '#1f4ba4' }}
                size={40}
              />
            </TouchableOpacity>
          </View> */}
          {carregando ? (<ActivityIndicator style={{ marginTop: 20, }} size={32} />) : (

            <TouchableOpacity
              style={[styles.btnDefault, { marginTop: 10 }]}
              onPress={() => _handlerConsultaCartao(cartao)}>
              <Text style={styles.btnDefaultText}> BUSCAR</Text>
            </TouchableOpacity>
          )}
        </View>
        {erro ? (
          <View style={{ width: '80%' }}>
            <Retorno type={mensagens.tipo} mensagem={mensagens.descricao} />
          </View>
        ) : associado ? (
          <>
            <View
              style={{
                margin: 20,
                padding: 20,
                backgroundColor: primary,

                elevation: 5,
                borderRadius: 5,
                width: '90%',
                alignSelf: 'center',
                bordercolor: '#fff',
              }}>
              <Text style={{ color: 'white', margin: 5, fontSize: 12 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 12 }}>Nome: </Text> {associado.dep}
              </Text>
              <Text style={{ color: 'white', margin: 5, fontSize: 12 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 12 }}>Status: </Text>
                {associado.Inativo ? 'Inativo' : 'Ativo'}
              </Text>
              <Text style={{ color: 'white', margin: 5, fontSize: 12 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 12 }}>Cartão: </Text>{' '}
                {associado.Nr_Cartao_Abepom}
              </Text>
            </View>
            {!convenio.efetuarVenda && (

              <TouchableOpacity
                style={[styles.btnDefault, { alignSelf: 'center' }]}
                onPress={() => setModal(true)}>
                <Text style={styles.btnDefaultText}>INFORMAR UTILIZAÇÃO</Text>
              </TouchableOpacity>
            )}
          </>
        ) : null}
        {camera ? (
          <View
            style={{
              height: Dimensions.get('screen').height * 0.4,
              width: Dimensions.get('screen').height * 0.4,
            }}>
            <Modal isVisible={camera}>
              <RNCamera
                ref={null}
                style={{
                  flex: 1,
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}
                androidCameraPermissionOptions={{
                  title: 'Permission to use camera',
                  message: 'We need your permission to use your camera',
                  buttonPositive: 'Ok',
                  buttonNegative: 'Cancel',
                }}
                androidRecordAudioPermissionOptions={{
                  title: 'Permission to use audio recording',
                  message: 'We need your permission to use your audio',
                  buttonPositive: 'Ok',
                  buttonNegative: 'Cancel',
                }}
                onGoogleVisionBarcodesDetected={({ barcodes }) => {
                  let [codigo] = barcodes;
                  console.log(codigo.data);
                  setCamera(false);
                  setCartao(codigo.data);

                  _handlerConsultaCartao(codigo.data);
                }}
              />
              <View
                style={{
                  position: 'absolute',
                  bottom: 10,
                  flex: 1,
                  alignItems: 'center',

                  width: '100%',
                }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: primary,
                    padding: 20,
                    borderRadius: 30,
                  }}
                  onPress={() => setCamera(false)}>
                  <Icone name="close" style={30} color="#FFF" />
                </TouchableOpacity>
              </View>
            </Modal>
          </View>
        ) : null}
      </Menu>
    </>
  );
};

export default Home;
