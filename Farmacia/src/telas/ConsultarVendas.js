import React, {useState, useEffect, memo, useCallback} from 'react';
import {
  View,
  Text,
  TextInput as Input,
  TouchableOpacity,
  Image,
  RefreshControl,
  ScrollView,
  Dimensions,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MenuTop from '../components/MenuTop';
import styles, {
  primary,
  danger,
  danverBackground,
  sucess,
  sucessBack,
} from '../utils/Style';
import {TextInput} from 'react-native-paper';
import Modal from 'react-native-modal';
import api from '../api';
import {themeLight} from '../utils/theme';
import formatCurrency from 'currency-formatter';
import Retorno from '../components/Retorno';
import {Checkbox} from 'react-native-paper';
import useConvenio from '../../Store/Convenio';
import useLoad from '../../Store/Load';
import imagens from '../utils/imagens';
import Carregando from './../components/Carregando';
import {FlatList} from 'react-native-gesture-handler';

const meses = [];

for (let i = 1; i <= 12; i++) {
  meses.push(i < 10 ? `0${i}` : `${i}`);
}
const anos = [];

for (let i = new Date().getFullYear(); i >= new Date().getFullYear() - 5; i--) {
  anos.push(`${i}`);
}

const ConsultarVendas = (props) => {
  const [refreshing, setRefreshing] = useState(false);
  const [{id_gds, nivel, usuario}] = useConvenio();
  const [mes, setMes] = useState(false);
  const [data, setData] = useState(new Date());
  const [show, setShow] = useState(false);
  const [vendas, setvendas] = useState([]);
  const [load, setLoad] = useState(false);
  const [modal, setModal] = useState(false);
  const [conteudoModal, setConteudoModal] = useState(null);
  const [retornoExclusao, setRetornoExclusao] = useState('');
  const [carregando, setCarregando] = useLoad();

  useEffect(() => {
    if (carregando !== 'ConsultarVendas' && carregando !== 'todos') {
      getConsulta();
    }
  }, []);
  useEffect(() => {
    if (carregando == 'ConsultarVendas' || carregando == 'todos') {
      getConsulta();

      setCarregando(null);
    }
  }, [carregando]);

  const getConsulta = () => {
    setLoad(true);
    api
      .get('/ConsultarVendas', {
        params: {id_gds, data, usuario, nivel, mes},
      })
      .then((dados) => {
        setvendas(dados.data);
        setLoad(false);
      });
  };
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || data;
    setShow(Platform.OS === 'ios');
    setData(currentDate);
  };
  const excluirVenda = async (Nr_lancamento) => {
    const dados = await api.delete('/removerVendas', {
      data: {Nr_lancamento},
    });
    setRetornoExclusao(dados.data.mensagem);
  };
  return (
    <>
      <Modal isVisible={modal} {...props}>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          {conteudoModal ? (
            <>
              <View
                style={{
                  borderTopRightRadius: 4,
                  borderTopLeftRadius: 4,
                  backgroundColor: `white`,
                  paddingVertical: 10,
                  paddingHorizontal: 5,
                  width: '100%',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={[
                      styles.textoM,
                      {fontWeight: 'bold', marginVertical: 2},
                    ]}>
                    Lançamento:{' '}
                    <Text style={{fontWeight: '100'}}>
                      {conteudoModal.Nr_lancamento}
                    </Text>
                  </Text>
                  <Text
                    style={[
                      styles.textoM,
                      {fontWeight: 'bold', marginVertical: 2},
                    ]}>
                    Matricula:
                    <Text style={{fontWeight: '100'}}>
                      {' '}
                      {conteudoModal.Matricula}
                    </Text>
                  </Text>
                </View>
                <Text
                  style={[
                    styles.textoM,
                    {fontWeight: 'bold', marginVertical: 2},
                  ]}>
                  Associado:{' '}
                  <Text style={{fontWeight: '100'}}>
                    {conteudoModal['Nome do dependente']}
                  </Text>
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={[
                      styles.textoM,
                      {fontWeight: 'bold', marginVertical: 2},
                    ]}>
                    Valor:
                    <Text style={{fontWeight: '100'}}>
                      {' '}
                      {formatCurrency.format(conteudoModal.Valor, {
                        code: 'BRL',
                      })}
                    </Text>
                  </Text>

                  <Text
                    style={[
                      styles.textoM,
                      {fontWeight: 'bold', marginVertical: 2},
                    ]}>
                    Data:
                    <Text style={{fontWeight: '100'}}>
                      {' '}
                      {conteudoModal.Data}
                    </Text>
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setConteudoModal(null);
                    excluirVenda(conteudoModal.Nr_lancamento);
                    getConsulta(conteudoModal.Data);
                  }}
                  style={{
                    borderBottomLeftRadius: 4,
                    backgroundColor: danverBackground,
                    padding: 10,
                    width: '50%',
                    alignItems: 'center',
                  }}>
                  <Text style={{color: danger}}>Excluir</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setModal(false)}
                  style={{
                    borderBottomRightRadius: 4,
                    backgroundColor: sucessBack,
                    padding: 10,
                    width: '50%',
                    alignItems: 'center',
                  }}>
                  <Text style={{color: sucess}}>FECHAR</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : retornoExclusao == '' ? (
            <>
              <View
                style={{
                  borderRadius: 4,
                  backgroundColor: `white`,
                  paddingVertical: 10,
                  paddingHorizontal: 5,
                  width: '90%',
                }}>
                <Carregando />
              </View>
              <TouchableOpacity
                onPress={() => setModal(false)}
                style={{
                  borderBottomRightRadius: 4,
                  borderBottomLeftRadius: 4,
                  backgroundColor: sucessBack,
                  padding: 10,
                  width: '100%',
                  alignItems: 'center',
                }}>
                <Text style={{color: sucess}}>FECHAR</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View
                style={{
                  borderTopRightRadius: 4,
                  borderTopLeftRadius: 4,
                  backgroundColor: `white`,
                  paddingVertical: 10,
                  paddingHorizontal: 5,
                  width: '100%',
                }}>
                <Text style={{fontSize: 20, textAlign: 'justify'}}>
                  {retornoExclusao}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setModal(false)}
                style={{
                  borderBottomRightRadius: 4,
                  borderBottomLeftRadius: 4,
                  backgroundColor: sucessBack,
                  padding: 10,
                  width: '100%',
                  alignItems: 'center',
                }}>
                <Text style={{color: sucess}}>FECHAR</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </Modal>
      <MenuTop
        drawer
        {...props}
        title={'Consultar Vendas'}
        header={
          <View>
            <View
              style={{
                width: '60%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              <TextInput
                label="Selecione uma Data"
                dense
                value={data}
                mode="outlined"
                onChange={onChange}
                theme={themeLight}
                style={{width: '80%'}}
                render={(props) => {
                  if (show) {
                    return (
                      <DateTimePicker
                        {...props}
                        mode={'date'}
                        display="default"
                      />
                    );
                  } else {
                    return (
                      <Text
                        onPress={() => setShow(true)}
                        style={{
                          textAlignVertical: 'center',
                          flex: 1,
                          marginLeft: 10,
                        }}>
                        {`${data.getDate()}`}/
                        {data.getMonth() < 9
                          ? `0${data.getMonth() + 1}`
                          : `${data.getMonth() + 1}`}
                        /{`${data.getFullYear()}`}
                      </Text>
                    );
                  }
                }}
              />
              <TouchableOpacity
                style={{
                  marginLeft: 5,
                  marginTop: 7,
                  paddingVertical: 6,
                  paddingHorizontal: 10,
                  backgroundColor: primary,
                  borderRadius: 5,
                }}
                onPress={getConsulta}>
                <Image
                  source={imagens.search}
                  style={{width: 25, height: 25, tintColor: 'white'}}
                />
              </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Checkbox
                status={mes ? 'checked' : 'unchecked'}
                onPress={() => {
                  setMes(!mes);
                }}
                color={primary}
              />
              <Text
                style={{paddingTop: 10, color: primary}}
                onPress={() => setMes(!mes)}>
                Consulta mês inteiro
              </Text>
            </View>
          </View>
        }>
        <View style={{width: '95%'}}>
          {load ? (
            <Carregando />
          ) : vendas.length > 0 ? (
            <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={getConsulta}
                />
              }
              data={vendas}
              keyExtractor={({index}) => index}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      if (item.Processado_desconto) {
                        setConteudoModal(null);
                        setRetornoExclusao(
                          'Essa cobrança já foi efetuada pela abepom entre em contato com nosso setor de Convenior para saber mais informações',
                        );
                      } else {
                        setConteudoModal(item);
                      }
                      setModal(true);
                    }}>
                    <View
                      style={{
                        elevation: 2,
                        borderRadius: 4,
                        marginBottom: 10,
                        backgroundColor: `white`,
                        paddingVertical: 5,
                        paddingHorizontal: 5,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          style={[
                            styles.textoM,
                            {fontWeight: 'bold', marginVertical: 2},
                          ]}>
                          Lançamento:{' '}
                          <Text style={{fontWeight: '100'}}>
                            {item.Nr_lancamento}
                          </Text>
                        </Text>
                        <Text
                          style={[
                            styles.textoM,
                            {fontWeight: 'bold', marginVertical: 2},
                          ]}>
                          Matricula:
                          <Text style={{fontWeight: '100'}}>
                            {' '}
                            {item.Matricula}
                          </Text>
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                        }}>
                        <Text
                          style={[
                            styles.textoM,
                            {fontWeight: 'bold', marginVertical: 2},
                          ]}>
                          Associado:{' '}
                          <Text style={{fontWeight: '100'}}>
                            {item['Nome do dependente']}
                          </Text>
                        </Text>
                        <Image
                          source={imagens.trash}
                          style={{
                            width: 20,
                            height: 20,
                            position: 'absolute',
                            right: 0,
                            tintColor: danger,
                          }}
                        />
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          style={[
                            styles.textoM,
                            {fontWeight: 'bold', marginVertical: 2},
                          ]}>
                          Valor:
                          <Text style={{fontWeight: '100'}}>
                            {' '}
                            {formatCurrency.format(item.Valor, {code: 'BRL'})}
                          </Text>
                        </Text>
                        <Text
                          style={[
                            styles.textoM,
                            {fontWeight: 'bold', marginVertical: 2},
                          ]}>
                          Data:
                          <Text style={{fontWeight: '100'}}> {item.Data}</Text>
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          ) : (
            <ScrollView
              style={{height: Dimensions.get('screen').height / 2}}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={getConsulta}
                />
              }>
              <Retorno type="sucess" mensagem="Nenhuma venda encontrada" />
            </ScrollView>
          )}
        </View>
      </MenuTop>
      <View
        style={{
          flexDirection: 'row',
          alignContent: 'space-between',
          width: '95%',
          alignSelf: 'center',
        }}>
        <View
          style={{
            width: '48%',
            marginRight: '2%',
            alignItems: 'center',
            backgroundColor: primary,
            borderRadius: 50,
            marginBottom: 10,
          }}>
          <Text style={{fontWeight: 'bold', color: '#fff', fontSize: 10}}>
            ATENDIMENTOS
          </Text>
          <Text style={{fontWeight: 'bold', color: '#fff', fontSize: 20}}>
            {vendas.length ? vendas.length : '0'}
          </Text>
        </View>
        <View
          style={{
            width: '48%',
            marginLeft: '2%',
            alignItems: 'center',
            backgroundColor: primary,
            borderRadius: 50,
            marginBottom: 10,
          }}>
          <Text style={{fontWeight: 'bold', color: '#fff', fontSize: 10}}>
            TOTAL
          </Text>
          <Text style={{fontWeight: 'bold', color: '#fff', fontSize: 20}}>
            {vendas
              ? formatCurrency.format(
                  vendas.reduce(
                    (total, Valor) => total + Number(Valor.Valor),
                    0,
                  ),
                  {code: 'BRL'},
                )
              : 'R$ 0,00'}
          </Text>
        </View>
      </View>
    </>
  );
};

export default ConsultarVendas;
