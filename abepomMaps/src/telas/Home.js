import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import StatusBar from '../components/StatusBar';
import Menu from '../components/MenuTop';
import Icone from 'react-native-vector-icons/MaterialCommunityIcons';
import {TextInput, Directions} from 'react-native-gesture-handler';
import styles from '../constants/Style';
import api from '../api';
import Mensagam from '../components/Mensagem';
import AsyncStorage from '@react-native-community/async-storage';

const Home = ({navigation, user = navigation.state.params}) => {
  const [cartao, setCartao] = React.useState('');
  const [erro, setErro] = React.useState(false);
  const [convenio, setConvenio] = React.useState(false);

  useEffect(() => {
    AsyncStorage.getItem('User').then(usuario => {
      setConvenio(JSON.parse(usuario));
    });
  }, []);

  React.useEffect(() => {
    if (erro) {
      setTimeout(() => {
        setErro(false);
      }, 4000);
    }
  }, [erro]);
  const [associado, setAssociado] = React.useState(null);
  const [mensagens, setMensagens] = React.useState('');
  const [camera, setCamera] = useState(false);
  const _handlerConsultaCartao = async () => {
    let req = await api({
      url: 'consultarcartao.asp',
      data: {cartao: cartao},
      method: 'post',
    });
    const {erro = erro, associado, mensagem} = req.data;
    if (cartao.length === 11) {
      if (erro) {
        setErro(true);
        setMensagens(mensagem);
        setAssociado('');
      } else {
        setAssociado(associado);
      }
    } else {
      setErro(true);
      setMensagens('Cartão invalido. Digite novamente.');
      setAssociado('');
      //setCartao('');
    }
  };
  const _abrirCamera = () => {
    setCamera(true);
  };

  return (
    <>
      <StatusBar />

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
            <View
              style={{
                margin: 20,
                padding: 20,
                backgroundColor: '#008f46',
                borderRadius: 5,
                width: '75%',
              }}>
              <Text style={{color: 'white', margin: 5}}>
                Nome: {associado.nome}
              </Text>
              <Text style={{color: 'white', margin: 5}}>
                Tipo: {associado.tipo}
              </Text>
              <Text style={{color: 'white', margin: 5}}>
                Cartão: {associado.cartao}
              </Text>
            </View>
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
                onGoogleVisionBarcodesDetected={({barcodes}) => {
                  setCamera(false);
                  setCartao(barcodes[0].data);
                  _handlerConsultaCartao();
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
