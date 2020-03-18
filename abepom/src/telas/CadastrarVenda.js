import React, {useEffect, useState} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import {TextInput} from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import Modal from 'react-native-modal';
import styles, {primary} from '../utils/Style';
import {TextInputMask} from 'react-native-masked-text';
import {themeLight as theme} from '../utils/theme';
import {TouchableOpacity, ScrollView} from 'react-native-gesture-handler';
import api from '../api';

const CadastrarVenda = props => {
  const {matricula, dep, nome, id_gds} = props.navigation.state.params;
  const [valor, setValor] = useState('');
  const [cupom, setCupom] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [modal, setModal] = useState(false);
  const [msnModal, setMsnModal] = useState({mensagem: ''});

  const InformarVenda = async () => {
    setCarregando(true);
    if (valor) {
      const dados = await api({
        url: '/efetuarVendas',
        method: 'POST',
        data: {matricula, dep, id_gds, valor, cupom},
      });

      setModal(true);
      setMsnModal(dados.data);
    } else {
      alert('valor em branco');
      setCarregando(false);
    }
  };
  useEffect(() => {
    console.log(msnModal);
    if (modal) {
      setTimeout(() => {
        setModal(false);
        if (!msnModal.erro) {
          props.navigation.goBack();
        }
      }, 2000);
    }
  }, [modal]);

  return (
    <>
      <Modal isVisible={modal} {...props}>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              backgroundColor: '#fff',
            }}>
            <Text>{msnModal.mensagem}</Text>
          </View>
        </View>
      </Modal>
      <ScrollView>
        <View style={{flex: 1, alignItems: 'center'}}>
          <View
            style={{
              marginTop: 20,
              padding: 20,
              backgroundColor: 'white',
              borderRadius: 3,
              elevation: 2,
              width: '80%',
              borderColor: primary,
              borderWidth: 1,
            }}>
            <Text style={{color: primary}}>Associado {nome}</Text>
            <Text style={{color: primary}}>Matricula: {matricula}</Text>
            <Text style={{color: primary}}>Dependencia: {dep}</Text>
          </View>
          <TextInput
            label="Valor"
            dense
            mode="outlined"
            keyboardType="numeric"
            theme={theme}
            style={[styles.imput]}
            value={valor}
            onChangeText={setValor}
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
          <TextInput
            label="Cupom Fiscal"
            dense
            mode="outlined"
            keyboardType="numeric"
            theme={theme}
            style={[styles.imput]}
            value={cupom}
            onChangeText={setCupom}
          />

          <View style={{width: '80%'}}>
            {!carregando ? (
              <TouchableOpacity
                style={[styles.btnDefault, {marginTop: 30}]}
                onPress={() => InformarVenda()}>
                <Text style={{color: 'white'}}>INFORMAR VENDA</Text>
              </TouchableOpacity>
            ) : (
              <ActivityIndicator style={{marginTop: 30}} />
            )}
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default CadastrarVenda;
