import React, { useState, useEffect } from 'react';
import {
  Picker,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
} from 'react-native';
import Modal from 'react-native-modal';

import { TextInput } from 'react-native-paper';
import TextInputMask from 'react-native-text-input-mask';
import styles, { white, primary, danger } from '../utils/Style';
import { themeLight } from '../utils/theme';
import Icone from 'react-native-vector-icons/AntDesign';
import MC from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import api from '../api';
import removerAcentos from '../utils/RemoverAcentos';
import AsyncStorage from '@react-native-community/async-storage';
import getUsuario from '../utils/getUsuario';
import Retorno from '../components/Retorno';
import imagens from '../utils/imagens';
const Enderecos = props => {
  const info = {
    logradouro: '',
    numero: '',
    complemento: '',
    cidade: '',
    bairro: '',
    uf: '',
    fone: '',
  };
  const [cep, setcep] = useState('');
  const [edit, setEdit] = useState(false);
  const [remove, setRemove] = useState(false);
  const [endereco, setEndereco] = useState(info);
  const [mostrar, setMostrar] = useState(false);
  const [enderecosCadastrados, setEnderecosCadastrados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [convenio, setConvenio] = useState({ efetuarVenda: false })
  const [retorno, setRetorno] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [carregandoCep, setCarregandoCep] = useState(false)
  const [erroCep, setErroCep] = useState({ erro: false, mensagem: '' })
  const getEndereco = async () => {
    setCarregandoCep(true)
    const dados = await axios.get(
      `http://www.viacep.com.br/ws/${cep
        .replace('.', '')
        .replace('-', '')}/json/`,
    );
    console.log(dados)
    let cdCidade;
    if (!dados.data.erro) {
      setErroCep({ erro: dados.data.erro, mensagem: '' })

      const { logradouro, bairro, localidade, uf } = dados.data;
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
      setCarregandoCep(false)

    } else {
      setErroCep({ erro: dados.data.erro, mensagem: 'Endereço não encontado' })
      setCarregandoCep(false)

    }
  };
  const getCidades = async () => {
    const dados = await api.get('/cidades');
    setCidades(dados.data);
  };
  const getEnderecosCadastrados = async () => {
    const conv = await AsyncStorage.getItem('convenio');
    let id_gds = JSON.parse(conv).id_gds
    const { data } = await api.get(`/user/enderecos`, { params: { id_gds } });
    console.log(data)

    setEnderecosCadastrados(data);

    ;
  };
  const CadastrarEndereco = async () => {
    setCarregando(true)
    setEdit(false);
    const conv = await AsyncStorage.getItem('convenio');
    let id_gds = JSON.parse(conv).id_gds;

    const req = await api.post(`/enderecos/${id_gds}`, {
      logradouro,
      numero,
      cidade,
      bairro,
      uf,
      fone,
      cep,
      complemento
    })
    console.log(req.data)
    setRetorno(req.data)
    setMostrar(false)
    getEnderecosCadastrados();
    setCarregando(false)
  };

  const RemoverEndereco = async id_end => {
    setCarregando(true)

    const conv = await AsyncStorage.getItem('convenio');
    let id_gds = JSON.parse(conv).id_gds;

    const req = await api.delete(`/enderecos/${id_gds}`, {
      data: {
        id_end
      }
    })
    console.log(req.data)
    setRetorno(req.data)
    getEnderecosCadastrados();

    setMostrar(false)
    setCarregando(false)
  };
  useEffect(() => {
    getCidades();
    getUsuario('convenio').then(conv => setConvenio(conv))
    getEnderecosCadastrados();
  }, []);
  useEffect(() => {
    if (retorno != '') {
      setTimeout(() => {
        setRetorno('')
      }, 3000);
    }
  }, [retorno])

  const editarEndereço = async (id_end) => {
    setCarregando(true)


    const conv = await AsyncStorage.getItem('convenio');
    let id_gds = JSON.parse(conv).id_gds;

    const req = await api.put(`/enderecos/${id_gds}`, {
      logradouro,
      numero,
      cidade,
      bairro,
      uf,
      fone,
      cep,
      complemento,
      id_end
    })

    setRetorno(req.data)
    getEnderecosCadastrados();

    setMostrar(false)
    setCarregando(false)

  }

  const { logradouro, numero, cidade, fone, bairro, uf, complemento } = endereco;

  return (
    <>


      {!mostrar && (

        <Text style={{ color: primary, marginVertical: 20, alignSelf: "center" }}>
          Lista de endereços cadastrados
        </Text>
      )}
      <ScrollView>
        <View style={{ alignItems: "center" }}>

          {retorno != '' ? (retorno.retorno ? <View style={{ width: '80%', marginRight: '5%' }}><Retorno type={retorno.tipo} mensagem={retorno.mensagem} /></View> : <Retorno type={retorno.tipo} mensagem={Retorno.mensagem} />) : null}
          {
            !mostrar ?

              enderecosCadastrados.map(end => {
                console.log(end, 'endereços')
                return (
                  <View
                    key={end.id_end}
                    style={{
                      flexDirection: 'row',
                      backgroundColor: primary,
                      width: '80%',
                      borderRadius: 5,
                      padding: 5,
                      borderWidth: 1,
                      borderColor: '#fff',
                    }}>
                    <View style={{ width: '90%' }}>
                      <Text
                        style={{
                          backgroundColor: primary,
                          color: white,
                          fontSize: 11,
                        }}>
                        <Text style={{ fontWeight: 'bold' }}>CEP:</Text> {end.cep}
                      </Text>
                      <Text
                        style={{
                          backgroundColor: primary,
                          color: white,
                          fontSize: 11,
                        }}>
                        <Text style={{ fontWeight: 'bold' }}>Endereço:</Text>{' '}
                        {end.logradouro} {end.endereco} - {end.numero}
                      </Text>

                      <Text style={{ color: '#fff', fontSize: 11 }}>

                        <Text style={{ fontWeight: 'bold', }}>Bairro:</Text> {end.bairro} - {end.cidade}
                      </Text>

                      <Text
                        style={{
                          backgroundColor: primary,
                          color: white,
                          fontSize: 11,
                        }}>
                        <Text style={{ fontWeight: 'bold' }}>Telefone:</Text>{' '}
                        {end.telefone}
                      </Text>
                    </View>
                    {!convenio.efetuarVenda && (

                      <View>
                        <TouchableOpacity
                          style={{ flex: 1 }}
                          onPress={() => {
                            setMostrar(true);
                            setEdit(true);
                            setRemove(false);
                            setcep(end.cep);
                            setEndereco({
                              ...endereco,

                              logradouro: `${end.endereco.toUpperCase()}`,
                              numero: end.numero,
                              complemento: end.complemento.toUpperCase(),
                              cidade: end.cd_cidade,
                              bairro: end.bairro.toUpperCase(),
                              uf: end.uf ? end.uf : 'SC',
                              fone: end.telefone,
                              id_end: end.id_end
                            });
                          }}>
                          <MC name="circle-edit-outline" size={25} color={white} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{ flex: 1 }}
                          onPress={() => {
                            setMostrar(true);
                            setRemove(true);
                            setEdit(false)
                            setcep(end.cep);
                            setEndereco({
                              ...endereco,
                              logradouro: `${end.endereco.toUpperCase()}`,
                              numero: end.numero,
                              complemento: end.complemento.toUpperCase(),
                              cidade: end.cd_cidade,
                              bairro: end.bairro.toUpperCase(),
                              uf: end.uf ? end.uf : 'SC',
                              fone: end.telefone,
                              id_end: end.id_end

                            });
                          }}>
                          <MC name="delete-circle-outline" size={25} color={white} />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )
              })
              : null}
          <View
            style={{
              borderBottomColor: 1,
              borderBottomColor: '#fff',
              height: 5,
              width: '80%',
            }}
          />


          {mostrar ? (
            <>
              {remove && <Text style={{ fontSize: 18, color: primary }}>Deseja remover esse endereço?</Text>}
              {edit && <Text style={{ fontSize: 18, color: primary }}>ALTERAR ENDEREÇO</Text>}
              {(!remove && !edit) && <Text style={{ fontSize: 18, color: primary }}>CADASTARAR ENDEREÇO</Text>}
              <View style={{ flexDirection: 'row', width: '100%' }}>
                <TextInput
                  mode="outlined"
                  label="CEP"
                  dense
                  theme={themeLight}
                  value={cep}
                  disabled={remove}
                  onChangeText={text => {
                    setcep(text);
                  }}

                  keyboardType="numeric"
                  style={[styles.imput, { width: 150 }]}
                  render={props => (
                    <TextInputMask mask={'[00].[000]-[000]'} {...props} />
                  )}
                />
                {!remove ? !carregandoCep ? (

                  <TouchableOpacity onPress={getEndereco} style={[styles.btnDefault, {
                    margin: 15, opacity: cep.length == 10 ? 1 : 0.5
                  }]} disabled={cep.length == 10 ? false : true}>
                    <Image source={imagens.search} style={{ width: 30, height: 30 }} tintColor={'white'} />
                  </TouchableOpacity>
                ) : (<ActivityIndicator style={{ marginTop: 20, marginLeft: 20 }} size={32} />) : null}


              </View>
              {erroCep.erro && (
                <Text>{erroCep.mensagem}</Text>
              )}
              <TextInput
                label="Enderecos"
                dense
                mode="outlined"
                disabled={remove ? remove : cep.length == 10 ? false : true}

                theme={themeLight}
                value={logradouro}
                onChangeText={text =>
                  setEndereco({ ...endereco, logradouro: text.toUpperCase() })
                }
                keyboardType="default"
                style={[styles.imput]}
              />
              <View style={{ flexDirection: 'row', width: '100%' }}>
                <TextInput
                  label="Numero"
                  dense
                  disabled={remove ? remove : cep.length == 10 ? false : true}

                  mode="outlined"
                  theme={themeLight}
                  value={numero}
                  onChangeText={text => setEndereco({ ...endereco, numero: text })}
                  keyboardType="numeric"
                  style={[styles.imput, { width: '30%' }]}
                />
                <TextInput
                  label="complemento"
                  dense
                  disabled={remove ? remove : cep.length == 10 ? false : true}

                  mode="outlined"
                  theme={themeLight}
                  value={complemento}
                  onChangeText={text =>
                    setEndereco({ ...endereco, complemento: text.toUpperCase() })
                  }
                  keyboardType="default"
                  style={[styles.imput, { width: '40%' }]}
                />
              </View>

              <TextInput
                label="Cidade"
                dense
                disabled={remove ? remove : cep.length == 10 ? false : true}

                mode="outlined"
                theme={themeLight}
                value={cidade}
                selectedValue={cidade}
                onValueChange={text => {
                  setEndereco({ ...endereco, cidade: text });

                }}
                keyboardType="default"
                style={[styles.imput]}
                render={props => {
                  return (
                    <Picker {...props} mode="dropdown">
                      <Picker.Item
                        key={' '}
                        value={''}
                        label=''
                      />
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
                disabled={remove ? remove : cep.length == 10 ? false : true}

                mode="outlined"
                theme={themeLight}
                value={uf}
                maxLength={2}
                onChangeText={text =>
                  setEndereco({ ...endereco, uf: text.toUpperCase() })
                }
                keyboardType="default"
                style={[styles.imput]}
              />
              <TextInput
                label="Bairro"
                dense
                disabled={remove ? remove : cep.length == 10 ? false : true}

                mode="outlined"
                theme={themeLight}
                value={bairro}
                onChangeText={text =>
                  setEndereco({ ...endereco, bairro: text.toUpperCase() })
                }
                keyboardType="default"
                style={[styles.imput]}
              />
              <TextInput
                label="Telefone"
                dense
                disabled={remove ? remove : cep.length == 10 ? false : true}

                mode="outlined"
                theme={themeLight}
                value={fone}
                onChangeText={text => setEndereco({ ...endereco, fone: text })}
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
              {carregando ? (<ActivityIndicator style={{ marginTop: 20, }} size={32} />) : (

                edit ? (
                  <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                      style={[
                        styles.btnDefault,
                        { margin: 20, paddingHorizontal: 10, backgroundColor: danger },
                      ]}
                      onPress={() => {
                        setMostrar(false)
                        setRemove(false);
                      }}>
                      <Text style={styles.btnDefaultText}>CENCELAR</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      disabled={logradouro != '' ? false : true}
                      style={[
                        styles.btnDefault,
                        { marginVertical: 20, paddingHorizontal: 10, opacity: logradouro.length > 2 ? 1 : 0.5 },
                      ]}
                      onPress={() => editarEndereço(endereco.id_end)}>
                      <Text style={styles.btnDefaultText}>ATUALIZAR ENDEREÇOS</Text>
                    </TouchableOpacity>
                  </View>
                ) : !remove ? (
                  <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                      style={[
                        styles.btnDefault,
                        { margin: 20, paddingHorizontal: 10, backgroundColor: danger },
                      ]}
                      onPress={() => setMostrar(false)}>
                      <Text style={styles.btnDefaultText}>CENCELAR</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      disabled={logradouro != '' ? false : true}

                      style={[
                        styles.btnDefault,
                        { margin: 20, paddingHorizontal: 10, opacity: logradouro.length > 2 ? 1 : 0.5 },
                      ]}
                      onPress={CadastrarEndereco}>
                      <Text style={styles.btnDefaultText}>CADASTRAR ENDEREÇOS</Text>
                    </TouchableOpacity>
                  </View>
                ) : (<View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    style={[
                      styles.btnDefault,
                      { margin: 20, paddingHorizontal: 10, backgroundColor: danger },
                    ]}
                    onPress={() => setMostrar(false)}>
                    <Text style={styles.btnDefaultText}>CENCELAR</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.btnDefault,
                      { margin: 20, paddingHorizontal: 10 },
                    ]}
                    onPress={() => RemoverEndereco(endereco.id_end)}>
                    <Text style={styles.btnDefaultText}>REMOVER</Text>
                  </TouchableOpacity>
                </View>))}
            </>
          ) : !convenio.efetuarVenda && (
            <TouchableOpacity
              onPress={() => {
                setRemove(false);
                setMostrar(true);
                setEndereco(info)
              }}
              style={styles.btnDefault}>
              <Text style={styles.btnDefaultText}>CADASTRAR NOVO ENDEREÇO</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </>
  );
};

export default Enderecos;
