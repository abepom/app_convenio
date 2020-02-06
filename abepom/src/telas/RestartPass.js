import React, {useState} from 'react';
import {
  View,
  Text,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  Modal,
  Button,
  Alert,
} from 'react-native';
import TextInputMask from 'react-native-text-input-mask';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import bg from '../assets/img/background.png';
import styles from '../constants/Style';

const RestartPass = ({navigation}) => {
  const [cartao, setCartao] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setemail] = useState('');

  const _changePass = () => {
    Alert.alert('teste');
  };

  const _retorn = () => {
    navigation.navigate('Login');
  };

  return (
    <>
      <StatusBar backgroundColor="#1f4ba4" barStyle="light-content" />
      <View style={{flex: 1}}>
        <ImageBackground
          source={bg}
          style={[styles.bgImage, {alignItems: 'center'}]}>
          <View style={{position: 'absolute', left: 0}}>
            <TouchableOpacity
              onPress={() => {
                _retorn();
              }}>
              <Icon
                name="chevron-left"
                style={{margin: 10, color: 'white'}}
                size={30}
              />
            </TouchableOpacity>
          </View>
          <View style={{marginTop: 100, marginBottom: 20}}>
            <Text
              style={[
                styles.btnDefaultText,
                {fontSize: 24, fontWeight: 'bold'},
              ]}>
              Esqueceu sua senha?
            </Text>
          </View>
          <View style={{margin: 10, paddingVertical: 20}}>
            <TextInputMask
              mask={'[00000000000]'}
              value={cartao}
              onChangeText={setCartao}
              style={styles.input}
              placeholder="Número do cartão"
              keyboardType="numeric"
            />
            <TextInputMask
              value={cpf}
              onChangeText={setCpf}
              mask={'[000].[000].[000]-[00]'}
              style={styles.input}
              placeholder="CPF"
              keyboardType="numeric"
            />
            <TextInput
              value={email}
              onChangeText={setemail}
              style={styles.input}
              placeholder="E-mail"
              keyboardType="email-address"
            />
          </View>
          <View style={{margin: 10, paddingVertical: 20}}>
            <TouchableOpacity
              onPress={() => _changePass()}
              style={styles.btnDefault}>
              <Text style={styles.btnDefaultText}>Enviar</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </>
  );
};

export default RestartPass;
