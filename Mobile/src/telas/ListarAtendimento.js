import React, { useState, useEffect, memo } from 'react';
import {
  View,
  Text,
  Picker,
  FlatList,
  Image,
  ActivityIndicator,
  TextInput as Input,
  TouchableOpacity,
} from 'react-native';
import MenuTop from '../components/MenuTop';
import styles, {
  primary,
  danger,
  danverBackground,
  sucess,
  sucessBack,
} from '../utils/Style';
import { TextInput } from 'react-native-paper';
import Modal from 'react-native-modal';
import api from '../api';
import { themeLight, themeDark } from '../utils/theme';
import formatCurrency from 'currency-formatter';

import useConvenio from '../../Store/Convenio';
import useLoad from '../../Store/Load';
import imagens from '../utils/imagens';

const ConsultarVendas = memo(props => {
  let anos = [];
  const mesAtual = new Date().getMonth() + 1;
  for (let index = new Date().getFullYear(); index > 2010; index--) {
    anos.push(`${index}`);
  }

  let meses = [
    { mes: 'JAN', value: '01' },
    { mes: 'FEV', value: '02' },
    { mes: 'MAR', value: '03' },
    { mes: 'ABR', value: '04' },
    { mes: 'MAI', value: '05' },
    { mes: 'JUM', value: '06' },
    { mes: 'JUL', value: '07' },
    { mes: 'AGO', value: '08' },
    { mes: 'SET', value: '09' },
    { mes: 'OUT', value: '10' },
    { mes: 'NOV', value: '11' },
    { mes: 'DEZ', value: '12' },
  ];

  const [{ id_gds }] = useConvenio('');
  const [mes, setMes] = useState(
    mesAtual.toString().length < 2 ? `0${mesAtual}` : `${mesAtual}`,
  );
  const [ano, setAno] = useState(new Date().getFullYear());
  const [vendas, setvendas] = useState([]);
  const [load, setLoad] = useState(false);
  const [modal, setModal] = useState(false);
  const [conteudoModal, setConteudoModal] = useState(null);
  const [retornoExclusao, setRetornoExclusao] = useState('');
  const [carregando, setCarregando] = useLoad();
  useEffect(() => {
    if (carregando !== 'ListarAtendimento' && carregando !== 'todos') {
      getConsulta(mes, ano);
      console.log('primeira');
      setLoad(null);
    }
  }, []);
  useEffect(() => {
    if (carregando == 'ListarAtendimento' || carregando == 'todos') {
      getConsulta(mes, ano);
      console.log('segunda');

      setCarregando(null);
    }
  }, [carregando]);
  const getConsulta = async (mesSelecionado, anoSelecionado) => {
    try {
      setLoad(true);
      const dados = await api.get('/consultarAtendimentos', {
        params: { id_gds, mes: mesSelecionado, ano: anoSelecionado },
      });
      console.log(dados.data, 'aqui');
      setvendas(dados.data);
      setLoad(false);
    } catch (error) {
      console.log(error);
    }
  };
  // const onChange = (event, selectedDate) => {
  //   const currentDate = selectedDate || data;
  //   setShow(Platform.OS === 'ios');
  //   setData(currentDate);
  //   let dia = currentDate.getDate() < 10 ? `0${currentDate.getDate()}` : `${currentDate.getDate()}`
  //   let mes = currentDate.getMonth() < 9 ? `0${currentDate.getMonth() + 1}` : `${currentDate.getMonth() + 1}`
  //   let ano = `${currentDate.getFullYear()}`
  //   if (!id_gds) {
  //     getUsuario('convenio').then(async conv => {
  //       setId_gds(conv.id_gds)
  //       getConsulta(`${dia}/${mes}/${ano}`, conv.id_gds)
  //     }).catch((e) => console.log(e))
  //   } else {
  //     getConsulta(`${dia}/${mes}/${ano}`, id_gds)
  //   }
  // };
  const excluirVenda = async id => {
    console.log(id);
    const dados = await api.delete('/removerAtendimento', { data: { id } });
    setRetornoExclusao(dados.data.mensagem);
  };
  return (
    <>
      <Modal isVisible={modal} {...props}>
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          {conteudoModal ? (
            <>
              <View
                style={{
                  borderTopRightRadius: 4,
                  borderTopLeftRadius: 4,
                  backgroundColor: `white`,
                  paddingVertical: 10,
                  paddingHorizontal: 5,
                  width: '90%',
                }}>
                <Text style={{ fontWeight: 'bold' }}>
                  Matricula:
                  <Text style={{ fontWeight: '100' }}>
                    {' '}
                    {conteudoModal.Nr_Cartao_Abepom.substr(0, 6)}
                  </Text>
                </Text>
                <Text style={{ fontWeight: 'bold' }}>
                  Associado:{' '}
                  <Text style={{ fontWeight: '100' }}>
                    {conteudoModal['Nome do dependente']}
                  </Text>
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{ fontWeight: 'bold' }}>
                    Valor:
                    <Text style={{ fontWeight: '100' }}>
                      {' '}
                      {formatCurrency.format(conteudoModal.CIU_Valor, {
                        code: 'BRL',
                      })}
                    </Text>
                  </Text>
                  <Text style={{ fontWeight: 'bold' }}>
                    Data:
                    <Text style={{ fontWeight: '100' }}>
                      {' '}
                      {conteudoModal.CIU_data}
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
                    excluirVenda(conteudoModal.id_CIU).then(a =>
                      console.log(a, 'retorno'),
                    );
                    getConsulta(mes, ano);
                  }}
                  style={{
                    borderBottomLeftRadius: 4,
                    backgroundColor: danverBackground,
                    padding: 10,
                    width: '45%',
                    alignItems: 'center',
                  }}>
                  <Text style={{ color: danger }}>EXCLUIR</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setModal(false)}
                  style={{
                    borderBottomRightRadius: 4,
                    backgroundColor: sucessBack,
                    padding: 10,
                    width: '45%',
                    alignItems: 'center',
                  }}>
                  <Text style={{ color: sucess }}>FECHAR</Text>
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
                <ActivityIndicator />
              </View>
              <TouchableOpacity
                onPress={() => setModal(false)}
                style={{
                  borderBottomRightRadius: 4,
                  borderBottomLeftRadius: 4,
                  backgroundColor: sucessBack,
                  padding: 10,
                  width: '90%',
                  alignItems: 'center',
                }}>
                <Text style={{ color: sucess }}>FECHAR</Text>
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
                  width: '90%',
                }}>
                <Text style={{ fontSize: 20, textAlign: 'justify' }}>
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
                  width: '90%',
                  alignItems: 'center',
                }}>
                <Text style={{ color: sucess }}>FECHAR</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </Modal>
      <MenuTop
        drawer
        {...props}
        title={'Consultar Atendimentos'}
        header={
          <View style={{ width: '80%', alignItems: 'center' }}>
            <Text style={{ marginTop: 10 }}>
              Visualização dos atendimentos com base nas informações fornecidas
              na consulta do cartão.
            </Text>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              <TextInput
                label="Mês"
                dense
                value={mes}
                mode="outlined"
                theme={themeLight}
                style={{ width: '35%' }}
                render={props => (
                  <Picker
                    selectedValue={mes}
                    mode="dropdown"
                    onValueChange={(itemValue, itemIndex) => setMes(itemValue)}>
                    {meses.map(listMes => (
                      <Picker.Item
                        key={listMes.value}
                        value={listMes.value}
                        label={listMes.mes}
                      />
                    ))}
                  </Picker>
                )}
              />
              <TextInput
                label="Ano"
                dense
                value={ano}
                mode="outlined"
                theme={themeLight}
                style={{ width: '35%' }}
                onFocus={() => alert(teste)}
                render={props => (
                  <Picker
                    selectedValue={ano}
                    mode="dropdown"
                    onValueChange={(itemValue, itemIndex) => setAno(itemValue)}>
                    {anos.map(listAno => (
                      <Picker.Item
                        key={listAno}
                        value={listAno}
                        label={listAno}
                      />
                    ))}
                  </Picker>
                )}
              />
              <TouchableOpacity
                onPress={() => getConsulta(mes, ano)}
                style={[styles.btnDefault, { marginTop: 10 }]}>
                <Text style={{ color: 'white' }}>BUSCAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        }>
        <View style={{ width: '80%' }}>
          {load ? (
            <ActivityIndicator size={'large'} color={primary} />
          ) : vendas && vendas.length > 0 ? (
            <FlatList
              data={vendas}
              renderItem={({ item }) => {
                console.log(item);
                return (
                  <TouchableOpacity
                    onPress={() => {
                      if (item.Processado_desconto) {
                        setConteudoModal(null);
                        setRetornoExclusao(
                          'Essa cobrança ja foi efetuada pela abepom entre em contato com nosso setor de Convenior para saber mais informações',
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
                        paddingVertical: 10,
                        paddingHorizontal: 5,
                      }}>
                      <Text
                        style={[
                          styles.textoM,
                          { fontWeight: 'bold', marginVertical: 2 },
                        ]}>
                        Matricula:
                        <Text style={{ fontWeight: '100' }}>
                          {' '}
                          {item.Nr_Cartao_Abepom.substr(0, 6)}
                        </Text>
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                        }}>
                        <Text
                          style={[
                            styles.textoM,
                            { fontWeight: 'bold', marginVertical: 2 },
                          ]}>
                          Associado:{' '}
                          <Text style={{ fontWeight: '100' }}>
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
                            { fontWeight: 'bold', marginVertical: 2 },
                          ]}>
                          Valor:
                          <Text style={{ fontWeight: '100' }}>
                            {' '}
                            {formatCurrency.format(item.CIU_Valor, {
                              code: 'BRL',
                            })}
                          </Text>
                        </Text>
                        <Text
                          style={[
                            styles.textoM,
                            { fontWeight: 'bold', marginVertical: 2 },
                          ]}>
                          Data:
                          <Text style={{ fontWeight: '100' }}>
                            {' '}
                            {item.CIU_data}
                          </Text>
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          ) : (
            <Text style={{ alignSelf: 'center' }}>
              Nenhuma venda encontrada
            </Text>
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
          <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 10 }}>
            ATENDIMENTOS
          </Text>
          <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 20 }}>
            {vendas.length}
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
          <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 10 }}>
            TOTAL
          </Text>
          <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 20 }}>
            {formatCurrency.format(
              vendas.reduce(
                (total, valor) => total + Number(valor.CIU_Valor),
                0,
              ),
              { code: 'BRL' },
            )}
          </Text>
        </View>
      </View>
    </>
  );
});

export default ConsultarVendas;
