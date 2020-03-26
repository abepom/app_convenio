import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-paper';
import formatCurrency from 'currency-formatter'
import Modal from 'react-native-modal';
import styles, { primary } from '../utils/Style';
import { TextInputMask } from 'react-native-masked-text';
import { themeLight as theme } from '../utils/theme';
import { ScrollView } from 'react-native-gesture-handler';
import api from '../api';
import DateTimePicker from '@react-native-community/datetimepicker';

const CadastrarVenda = props => {

  const { matricula, dep, nome, id_gds } = props.navigation.state.params;
  const [data, setData] = useState(new Date())
  const [show, setShow] = useState(false)
  const [valor, setValor] = useState('');
  const [cupom, setCupom] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [modal, setModal] = useState(false);
  const [msnModal, setMsnModal] = useState({
    erro: true,
    mensagem: '',
  });
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || data;
    setShow(Platform.OS === 'ios');
    setData(currentDate);

  };

  const InformarVenda = async () => {
    setCarregando(true);
    if (valor) {
      const dados = await api({
        url: '/efetuarVendas',
        method: 'POST',
        data: { matricula, dep, id_gds, valor, cupom, data },
      });
      console.log(matricula, dep, id_gds, valor, cupom, data)
      setModal(true);
      setMsnModal(dados.data);

    } else {
      alert('valor em branco');
      setCarregando(false);
    }
  };

  // useEffect(() => {
  //   console.log(msnModal);
  //   if (modal) {
  //     setTimeout(() => {
  //       setModal(false);
  //       if (!msnModal.erro) {
  //         props.navigation.goBack();
  //       }
  //     }, 2000);
  //   }
  // }, [modal]);

  return (
    <>
      <Modal isVisible={modal} {...props}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View
            style={{
              backgroundColor: '#fff',
              width: '80%',
              height: 200,
              alignItems: 'center',

              borderRadius: 5,
              elevation: 2,
            }}>
            <Text
              style={{
                fontSize: 20,
                color: primary,
                padding: 20,
                marginTop: 10,
                marginBottom: 25,
                textAlign: 'center',
              }}>
              {msnModal.mensagem}.{'\n'}
              {msnModal.limite && ` Limite atual é de ${formatCurrency.format(msnModal.limite, { code: 'BRL' })}`}

            </Text>
            <TouchableOpacity
              style={{
                position: 'absolute',
                bottom: 0,
                height: 45,
                width: '100%',
                backgroundColor: primary,
                elevation: 3,
                borderBottomLeftRadius: 5,
                borderBottomRightRadius: 5,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                setModal(false);
                console.log(msnModal);
                if (msnModal.retorno) {
                  props.navigation.goBack();
                } else {
                  setCarregando(false);
                }
              }}>
              <Text style={{ color: 'white' }}>FECHAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <ScrollView>
        <View style={{ flex: 1, alignItems: 'center' }}>
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
            <Text style={{ color: primary }}>Associado {nome}</Text>
            <Text style={{ color: primary }}>Matrícula: {matricula}</Text>
            <Text style={{ color: primary }}>Dependência: {dep}</Text>
          </View>
          <TextInput
            label="Data"
            dense
            value={data}
            mode="outlined"
            onChange={onChange}
            theme={theme}
            style={[styles.imput]}
            onFocus={() => alert(teste)}
            render={(props) => {
              if (show) {
                return (<DateTimePicker
                  {...props}
                  mode={'date'}
                />)
              } else {
                return (<Text onPress={() => setShow(true)} style={{ textAlignVertical: "center", flex: 1, marginLeft: 10 }}>
                  {`${data.getDate()}`}/{data.getMonth() < 9 ? `0${data.getMonth() + 1}` : `${data.getMonth() + 1}`}/{`${data.getFullYear()}`}
                </Text>)
              }
            }
            }
          />
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

          <View style={{ width: '80%' }}>
            {!carregando ? (
              <TouchableOpacity
                style={[styles.btnDefault, { marginTop: 30 }]}
                onPress={() => InformarVenda()}>
                <Text style={{ color: 'white' }}>INFORMAR VENDA</Text>
              </TouchableOpacity>
            ) : (
                <ActivityIndicator style={{ marginTop: 30 }} />
              )}
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default CadastrarVenda;
