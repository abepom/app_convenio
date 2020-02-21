import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import Menu from '../components/MenuTop';
import Icone from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';

import styles, {danger, primary, primaryBack, white} from '../utils/Style';
import api from '../api';

import AsyncStorage from '@react-native-community/async-storage';
import Retorno from '../components/Retorno';

const Home = props => {
  const [modal, setModal] = useState(false);
  const [cartao, setCartao] = React.useState('');
  const [erro, setErro] = React.useState(false);
  const [convenio, setConvenio] = React.useState(false);

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
  const [associado, setAssociado] = React.useState(null);
  const [valorUsado, setValorUsado] = useState(null);
  const [mensagens, setMensagens] = React.useState('');
  const [camera, setCamera] = useState(false);
  const _handlerConsultaCartao = async () => {
    let req = await api({
      url: '/VerificarCartao',
      params: {cartao: cartao},
      headers: {idConvenio: convenio.id_parceiro},
      method: 'GET',
    });

    const {erro, socio, mensagem} = req.data;

    if (cartao.length === 11) {
      if (erro) {
        setErro(true);
        setMensagens(mensagem);
        setAssociado('');
      } else {
        setAssociado(socio);
      }
      console.log(socio);
    } else {
      setErro(true);
      setMensagens('Cartão invalido. Digite novamente.');
      setAssociado('');
      //setCartao('');
    }
  };
  const _abrirCamera = () => {
    setAssociado('');
    setCartao('');
    setCamera(true);
  };
  function handlerStoreValue() {
    setModal(false);
  }

  return (
    <>
      <Modal isVisible={modal} {...props}>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View style={{backgroundColor: '#fff', padding: 30, paddingTop: 50}}>
            <TouchableOpacity
              style={{position: 'absolute', right: 0}}
              onPress={() => setModal(false)}>
              <Icone name="close-circle" size={30} color={danger} />
            </TouchableOpacity>
            <Text>Informe a media consumida pelo associado</Text>
            <Text style={{fontSize: 10, right: 0, position: 'relative'}}>
              * essa informação sera usada para estatistica
            </Text>
            <View style={{flexDirection: 'row', marginTop: 30}}>
              <TextInput
                style={[styles.input, {width: 200}]}
                keyboardType="numeric"
                value={valorUsado}
                onChangeText={setValorUsado}
              />
              <TouchableOpacity
                onPress={() => {
                  handlerStoreValue();
                }}>
                <Icone name="check-circle" size={50} color="#006600" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Menu {...props} title="Consulta de Cartões">
        <View style={{alignItems: 'center'}}>
          <Text style={{fontSize: 16, marginVertical: 20, color: '#fff'}}>
            Informe o numero do cartão do associado
          </Text>
          <View style={[styles.input, {flexDirection: 'row'}]}>
            <TextInput
              placeholder="Cartão"
              keyboardType="numeric"
              maxLength={11}
              value={cartao}
              style={{width: '85%'}}
              onChangeText={setCartao}
              onSubmitEditing={() => _handlerConsultaCartao()}
            />
            <TouchableOpacity
              style={{width: '15%'}}
              onPress={() => {
                _abrirCamera();
              }}>
              <Icone
                name="camera"
                style={{width: '100%', color: '#1f4ba4'}}
                size={40}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[styles.btnDefault, {marginTop: 10}]}
            onPress={() => _handlerConsultaCartao(cartao)}>
            <Text style={styles.btnDefaultText}> BUSCAR</Text>
          </TouchableOpacity>
        </View>
        {erro ? (
          <View style={{width: '80%'}}>
            <Retorno type="danger" mensagem={mensagens} />
          </View>
        ) : associado ? (
          <>
            <View
              style={{
                margin: 20,
                padding: 20,
                backgroundColor: primaryBack,

                elevation: 5,
                borderRadius: 5,
                width: '75%',
                alignSelf: 'center',
                bordercolor: '#fff',
              }}>
              <Text style={{color: 'white', margin: 5}}>
                <Text style={{fontWeight: 'bold'}}>Nome: </Text> {associado.dep}
              </Text>
              <Text style={{color: 'white', margin: 5}}>
                <Text style={{fontWeight: 'bold'}}>Status: </Text>
                {associado.Inativo ? 'Inativo' : 'Ativo'}
              </Text>
              <Text style={{color: 'white', margin: 5}}>
                <Text style={{fontWeight: 'bold'}}>Cartão: </Text>{' '}
                {associado.Nr_Cartao_Abepom}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.btnDefault, {width: '50%', alignSelf: 'center'}]}
              onPress={() => setModal(true)}>
              <Text style={styles.btnDefaultText}>INFORMAR UTILIZAÇÃO</Text>
            </TouchableOpacity>
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
                onGoogleVisionBarcodesDetected={async ({barcodes}) => {
                  setCamera(false);

                  setCartao(barcodes[0].data);
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
