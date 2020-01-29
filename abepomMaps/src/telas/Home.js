import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import StatusBar from '../components/StatusBar';
import Menu from '../components/MenuTop';
import Icone from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';

import styles, {danger} from '../constants/Style';
import api from '../api';
import Mensagam from '../components/Mensagem';
import AsyncStorage from '@react-native-community/async-storage';

const Home = ({navigation}) => {
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
      <StatusBar />
      <Modal isVisible={modal}>
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

      <SafeAreaView>
        <Menu drawer title="ABEPOM Mobile" navigation={navigation}>
          <View
            style={{flexDirection: 'row', margin: 20, paddingHorizontal: 10}}>
            {convenio.caminho_logomarca ? (
              <Image
                source={{
                  uri: convenio.caminho_logomarca,
                  width: 50,
                  height: 50,
                  margin: 10,
                  resizeMode: 'cover',
                }}
              />
            ) : (
              <Icone name="account" size={32} style={{alignSelf: 'center'}} />
            )}
            <Text style={{marginHorizontal: 5, fontSize: 26}}>
              {convenio.razao_social}
            </Text>
          </View>
          <View style={{alignItems: 'center'}}>
            <Text style={{fontSize: 16, marginVertical: 20}}>
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
            <Mensagam tipo="E" mensagem={mensagens} />
          ) : associado ? (
            <>
              <View
                style={{
                  margin: 20,
                  padding: 20,
                  backgroundColor: '#008f46',
                  borderRadius: 5,
                  width: '75%',
                }}>
                <Text style={{color: 'white', margin: 5}}>
                  Nome: {associado.dep}
                </Text>
                <Text style={{color: 'white', margin: 5}}>
                  Tipo: {associado.descricao}
                </Text>
                <Text style={{color: 'white', margin: 5}}>
                  Cartão: {associado.Nr_Cartao_Abepom}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.btnDefault, {width: '50%'}]}
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
            </View>
          ) : null}
        </Menu>
      </SafeAreaView>
    </>
  );
};

export default Home;
