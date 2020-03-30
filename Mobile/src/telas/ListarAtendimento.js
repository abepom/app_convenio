import React, { useState, useEffect } from 'react'
import { View, Text, Picker, FlatList, ActivityIndicator, TextInput as Input, TouchableOpacity } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker';
import MenuTop from '../components/MenuTop'
import styles, { primary, background, danger, danverBackground, sucess, sucessBack } from '../utils/Style'
import { TextInput } from 'react-native-paper'
import Modal from 'react-native-modal';

import api from '../api'
import { themeLight, themeDark } from '../utils/theme'
import formatCurrency from 'currency-formatter'


import Retorno from '../components/Retorno';
import getUsuario from '../utils/getUsuario';


const ConsultarVendas = (props) => {

  const [id_gds, setId_gds] = useState('')
  const [data, setData] = useState(new Date())
  const [show, setShow] = useState(false)
  const [vendas, setvendas] = useState([])
  const [load, setLoad] = useState(false)
  const [modal, setModal] = useState(false)
  const [conteudoModal, setConteudoModal] = useState(null)
  const [retornoExclusao, setRetornoExclusao] = useState('')

  useEffect(() => {
    onChange()
  }, [])
  const getConsulta = async (dataSelecionada, id_gdss) => {
    id_gdss = id_gdss ? id_gdss : id_gds
    try {
      let Data = dataSelecionada ? dataSelecionada : data
      setLoad(true)
      const dados = await api.get('/consultarAtendimentos', { params: { id_gds: id_gdss, data: Data } })
      setvendas(dados.data)
      setLoad(false)
    } catch (error) {
      console.log(error)
    }
  }
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || data;
    setShow(Platform.OS === 'ios');
    setData(currentDate);
    let dia = currentDate.getDate() < 10 ? `0${currentDate.getDate()}` : `${currentDate.getDate()}`
    let mes = currentDate.getMonth() < 9 ? `0${currentDate.getMonth() + 1}` : `${currentDate.getMonth() + 1}`
    let ano = `${currentDate.getFullYear()}`
    if (!id_gds) {
      getUsuario('convenio').then(async conv => {
        setId_gds(conv.id_gds)
        getConsulta(`${dia}/${mes}/${ano}`, conv.id_gds)
      }).catch((e) => console.log(e))
    } else {
      getConsulta(`${dia}/${mes}/${ano}`, id_gds)
    }
  };
  const excluirVenda = async (id) => {
    const dados = await api.delete('/removerAtendimento', { data: { id } })
    setRetornoExclusao(dados.data.mensagem)
  }
  return (
    <>
      <Modal isVisible={modal} {...props}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          {conteudoModal ? (<>
            <View style={{ borderTopRightRadius: 4, borderTopLeftRadius: 4, backgroundColor: `white`, paddingVertical: 10, paddingHorizontal: 5, width: '90%' }}>
              <Text style={{ fontWeight: "bold" }}>Matricula:
                <Text style={{ fontWeight: "100" }}> {conteudoModal.Nr_Cartao_Abepom.substr(0, 6)}</Text>
              </Text>
              <Text style={{ fontWeight: "bold" }}>Associado: <Text style={{ fontWeight: "100" }}>{conteudoModal["Nome do dependente"]}</Text></Text>
              <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
                <Text style={{ fontWeight: "bold" }}>Valor:
                  <Text style={{ fontWeight: "100" }}> {formatCurrency.format(conteudoModal.CUI_Valor, { code: 'BRL' })}</Text>
                </Text>
                <Text style={{ fontWeight: "bold" }}>Data:
                  <Text style={{ fontWeight: "100" }}> {conteudoModal.CIU_data}</Text>
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
              <TouchableOpacity
                onPress={() => {
                  setConteudoModal(null)
                  excluirVenda(conteudoModal.CIU_id_informe).then((a) => console.log(a))
                  getConsulta(conteudoModal.CIU_data, id_gds)
                }}
                style={{
                  borderBottomLeftRadius: 4,
                  backgroundColor: danverBackground,
                  padding: 10,
                  width: '45%',
                  alignItems: "center"
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
                  alignItems: "center"
                }}>
                <Text style={{ color: sucess }}>FECHAR</Text>
              </TouchableOpacity>
            </View></>
          ) : retornoExclusao == '' ? (<><View style={{ borderRadius: 4, backgroundColor: `white`, paddingVertical: 10, paddingHorizontal: 5, width: '90%' }}>
            <ActivityIndicator /></View><TouchableOpacity
              onPress={() => setModal(false)}
              style={{
                borderBottomRightRadius: 4,
                borderBottomLeftRadius: 4,
                backgroundColor: sucessBack,
                padding: 10,
                width: '90%',
                alignItems: "center"
              }}>
              <Text style={{ color: sucess }}>FECHAR</Text>
            </TouchableOpacity></>) : (<><View style={{ borderTopRightRadius: 4, borderTopLeftRadius: 4, backgroundColor: `white`, paddingVertical: 10, paddingHorizontal: 5, width: '90%' }}>
              <Text style={{ fontSize: 20, textAlign: "justify" }}>{retornoExclusao}</Text>
            </View><TouchableOpacity
              onPress={() => setModal(false)}
              style={{
                borderBottomRightRadius: 4,
                borderBottomLeftRadius: 4,
                backgroundColor: sucessBack,
                padding: 10,
                width: '90%',
                alignItems: "center"
              }}>
                <Text style={{ color: sucess }}>FECHAR</Text>
              </TouchableOpacity></>)}
        </View>
      </Modal>
      <MenuTop
        drawer {...props}
        title={'Consultar Atendimentos'}
        header={(
          <View style={{ width: '80%', alignItems: "center" }}>
            <Text style={{ marginTop: 10 }}>Visualização dos atendimentos com base nas informações fornecidas na consulta do cartão.</Text>
            <View style={{ width: '70%', flexDirection: "row", justifyContent: 'space-between', marginTop: 10 }}>
              <TextInput
                label="Selecione uma Data"
                dense
                value={data}
                mode="outlined"
                onChange={onChange}
                theme={themeLight}
                style={{ width: "100%", }}
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
            </View >
          </View>
        )}  >
        <View style={{ width: '80%' }}>
          {console.log(vendas.length)}
          {load ? <ActivityIndicator size={'large'} color={primary} /> :
            vendas && vendas.length > 0 ? (<FlatList data={vendas}
              renderItem={({ item }) => {
                console.log(item)
                return (
                  <TouchableOpacity onPress={() => {
                    if (item.Processado_desconto) {
                      setConteudoModal(null)
                      setRetornoExclusao('Essa cobrança ja foi efetuada pela abepom entre em contato com nosso setor de Convenior para saber mais informações')
                    } else {
                      setConteudoModal(item)
                    }
                    setModal(true)
                  }}>
                    <View style={{ elevation: 2, borderRadius: 4, marginBottom: 10, backgroundColor: `white`, paddingVertical: 10, paddingHorizontal: 5 }}>
                      <Text style={{ fontWeight: "bold" }}>Matricula:
                                <Text style={{ fontWeight: "100" }}> {item.Nr_Cartao_Abepom.substr(0, 6)}</Text>
                      </Text>

                      <Text style={{ fontWeight: "bold" }}>Associado: <Text style={{ fontWeight: "100" }}>{item["Nome do dependente"]}</Text></Text>
                      <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
                        <Text style={{ fontWeight: "bold" }}>Valor:
                                <Text style={{ fontWeight: "100" }}> {formatCurrency.format(item.CUI_Valor, { code: 'BRL' })}</Text>
                        </Text>
                        <Text style={{ fontWeight: "bold" }}>Data:
                                <Text style={{ fontWeight: "100" }}> {item.CIU_data}</Text>
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )
              }} />) : (<Text style={{ alignSelf: "center" }}>Nenhuma venda encontrada</Text>)
          }
        </View>
      </MenuTop ></>
  )
}

export default ConsultarVendas
