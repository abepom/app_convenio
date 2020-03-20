import React, {useState, useEffect} from 'react';
import {
  Picker,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Menu from '../components/MenuTop';
import {TextInput} from 'react-native-paper';
import TextInputMask from 'react-native-text-input-mask';
import styles, {white, primary} from '../utils/Style';
import theme from '../utils/theme';
import Icone from 'react-native-vector-icons/AntDesign';
import MC from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import api from '../api';
import removerAcentos from '../utils/RemoverAcentos';
import AsyncStorage from '@react-native-community/async-storage';
const Enderecos = props => {
  const info = {
    logradouro: '',
    numero: '',
    complemento: '',
    cidade: '0001',
    bairro: '',
    uf: '',
    fone: '',
  };
  const [cep, setcep] = useState('88061385');
  const [edit, setEdit] = useState(false);
  const [endereco, setEndereco] = useState(info);
  const [mostrar, setMostrar] = useState(false);
  const [enderecosCadastrados, setEnderecosCadastrados] = useState([]);
  const [cidades, setCidades] = useState([]);
  console.log(props);
  const getEndereco = async () => {
    const dados = await axios.get(
      `http://www.viacep.com.br/ws/${cep
        .replace('.', '')
        .replace('-', '')}/json/`,
    );
    console.log(dados);
    let cdCidade;
    const {logradouro, bairro, localidade, uf} = dados.data;
    cidades.find(cidade => {
      if (
        removerAcentos(cidade.Nm_cidade).toUpperCase() ==
        removerAcentos(localidade).toUpperCase()
      ) {
        cdCidade = cidade.Cd_cidade;
      }
    });

    setEndereco({
      ...endereco,
      logradouro: logradouro.toUpperCase(),
      bairro: bairro.toUpperCase(),
      uf: uf.toUpperCase(),
      cidade: cdCidade,
    });
  };
  const getCidades = async () => {
    const dados = await api.get('/cidades');

    setCidades(dados.data);
  };
  const gerEnderecosCadastrados = async () => {
    const conv = await AsyncStorage.getItem('convenio');
    let id_parceiro = JSON.parse(conv).id_parceiro;

    const {data} = await api.get(`/enderecos?id_parceiro=${id_parceiro}`);
    setEnderecosCadastrados(data);
    console.log(data);
  };
  const CadastrarEndereco = async () => {
    setEdit(false);
    const conv = await AsyncStorage.getItem('convenio');
    let id_parceiro = JSON.parse(conv).id_parceiro;
    console.log(id_parceiro);
  };

  const RemoverEndereco = async id => {
    console.log(id);
  };
  useEffect(() => {
    getCidades();
    gerEnderecosCadastrados();
  }, []);

  const {logradouro, numero, cidade, fone, bairro, uf, complemento} = endereco;
  return (
    <Menu title="ENDEREÇOS" drawer {...props}>
      <Text style={{color: 'white', marginVertical: 20}}>
        Lista de endereços cadastrados
      </Text>
      {enderecosCadastrados ? (
        enderecosCadastrados.map(end => (
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: primary,
              width: '80%',
              borderRadius: 5,
              padding: 5,
              borderWidth: 1,
              borderColor: '#fff',
            }}>
            <View style={{width: '90%'}}>
              <Text
                style={{
                  backgroundColor: primary,
                  color: white,
                  fontSize: 11,
                }}>
                <Text style={{fontWeight: 'bold'}}>CEP:</Text> {end.cep}
              </Text>
              <Text
                style={{
                  backgroundColor: primary,
                  color: white,
                  fontSize: 11,
                }}>
                <Text style={{fontWeight: 'bold'}}>Endereço:</Text>{' '}
                {end.logradouro} {end.endereco} - {end.numero}
              </Text>

              <Text style={{color: '#fff', fontSize: 11}}>
                <Text style={{fontWeight: 'bold'}}>Bairro:</Text> {end.bairro}
              </Text>

              <Text
                style={{
                  backgroundColor: primary,
                  color: white,
                  fontSize: 11,
                }}>
                <Text style={{fontWeight: 'bold'}}>Telefone:</Text>{' '}
                {end.telefone}
              </Text>
            </View>
            <View>
              <TouchableOpacity
                style={{flex: 1}}
                onPress={() => {
                  setMostrar(true);
                  setEdit(true);
                  setcep(end.cep);
                  setEndereco({
                    ...endereco,

                    logradouro: `${end.logradouro.toUpperCase()} ${end.endereco.toUpperCase()}`,
                    numero: end.numero,
                    complemento: end.complemento.toUpperCase(),
                    cidade: end.cd_cidade,
                    bairro: end.bairro.toUpperCase(),
                    uf: end.uf,
                    fone: end.telefone,
                  });
                }}>
                <MC name="circle-edit-outline" size={25} color={white} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{flex: 1}}
                onPress={() => {
                  RemoverEndereco(end.id_cpc_endereco);
                }}>
                <MC name="delete-circle-outline" size={25} color={white} />
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <ActivityIndicator size={20} color={'white'} />
      )}
      <View
        style={{
          borderBottomColor: 1,
          borderBottomColor: '#fff',
          height: 45,
          width: '80%',
        }}
      />
      {mostrar ? (
        <>
          <View style={{flexDirection: 'row', width: '100%'}}>
            <TextInput
              mode="outlined"
              label="CEP"
              dense
              theme={theme}
              value={cep}
              onChangeText={text => {
                setcep(text);
              }}
              onBlur={getEndereco}
              keyboardType="numeric"
              style={[styles.imput, {width: 150}]}
              render={props => (
                <TextInputMask mask={'[00].[000]-[000]'} {...props} />
              )}
            />
            <TouchableOpacity
              onPress={() => {
                setMostrar(false);
                setcep('');
                setEndereco(info);
              }}
              style={{position: 'absolute', right: '12%', alignSelf: 'center'}}>
              <Icone name={'closecircleo'} size={20} color={white} />
            </TouchableOpacity>
          </View>
          <TextInput
            label="Enderecos"
            dense
            mode="outlined"
            theme={theme}
            value={logradouro}
            onChangeText={text =>
              setEndereco({...endereco, logradouro: text.toUpperCase()})
            }
            keyboardType="default"
            style={[styles.imput]}
          />
          <View style={{flexDirection: 'row', width: '100%'}}>
            <TextInput
              label="Numero"
              dense
              mode="outlined"
              theme={theme}
              value={numero}
              onChangeText={text => setEndereco({...endereco, numero: text})}
              keyboardType="numeric"
              style={[styles.imput, {width: '30%'}]}
            />
            <TextInput
              label="complemento"
              dense
              mode="outlined"
              theme={theme}
              value={complemento}
              onChangeText={text =>
                setEndereco({...endereco, complemento: text.toUpperCase()})
              }
              keyboardType="default"
              style={[styles.imput, {width: '40%'}]}
            />
          </View>

          <TextInput
            label="Cidade"
            dense
            mode="outlined"
            theme={theme}
            value={cidade}
            selectedValue={cidade}
            onValueChange={text => {
              setEndereco({...endereco, cidade: text});
              console.log(endereco);
            }}
            keyboardType="default"
            style={[styles.imput]}
            render={props => {
              return (
                <Picker {...props} mode="dropdown">
                  {cidades.map(localidade => (
                    <Picker.Item
                      key={localidade.Cd_cidade}
                      value={localidade.Cd_cidade}
                      label={localidade.Nm_cidade}
                    />
                  ))}
                </Picker>
              );
            }}
          />
          <TextInput
            label="Estado"
            dense
            mode="outlined"
            theme={theme}
            value={uf}
            maxLength={2}
            onChangeText={text =>
              setEndereco({...endereco, uf: text.toUpperCase()})
            }
            keyboardType="default"
            style={[styles.imput]}
          />
          <TextInput
            label="Bairro"
            dense
            mode="outlined"
            theme={theme}
            value={bairro}
            onChangeText={text =>
              setEndereco({...endereco, bairro: text.toUpperCase()})
            }
            keyboardType="default"
            style={[styles.imput]}
          />
          <TextInput
            label="Telefone"
            dense
            mode="outlined"
            theme={theme}
            value={fone}
            onChangeText={text => setEndereco({...endereco, fone: text})}
            keyboardType="numeric"
            style={[styles.imput]}
            render={props => (
              <TextInputMask
                mask={
                  fone.length < 14
                    ? '([00]) [0000]-[00000]'
                    : '([00]) [00000]-[0000]'
                }
                {...props}
              />
            )}
          />
          {edit ? (
            <TouchableOpacity
              style={[
                styles.btnDefault,
                {marginTop: 20, paddingHorizontal: 10},
              ]}
              onPress={CadastrarEndereco}>
              <Text style={styles.btnDefaultText}>ATUALIZAR ENDEREÇOS</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.btnDefault,
                {marginTop: 20, paddingHorizontal: 10},
              ]}
              onPress={CadastrarEndereco}>
              <Text style={styles.btnDefaultText}>CADASTRAR ENDEREÇOS</Text>
            </TouchableOpacity>
          )}
        </>
      ) : (
        <TouchableOpacity
          onPress={() => {
            setEdit(false);
            setMostrar(true);
          }}
          style={styles.btnDefault}>
          <Text style={styles.btnDefaultText}>Cadastrar novo endereço</Text>
        </TouchableOpacity>
      )}
    </Menu>
  );
};

export default Enderecos;