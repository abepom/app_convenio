import React, { useState, useEffect, memo } from 'react'
import { View, Text, Picker, FlatList, ActivityIndicator, TextInput as Input, TouchableOpacity } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker';
import MenuTop from '../components/MenuTop'
import styles, { primary, background, danger, danverBackground, sucess, sucessBack } from '../utils/Style'
import { TextInput } from 'react-native-paper'
import Modal from 'react-native-modal';
import api from '../api'
import { themeLight } from '../utils/theme'
import formatCurrency from 'currency-formatter'
import Retorno from '../components/Retorno';
import getUsuario from '../utils/getUsuario';
import useConvenio from '../../Store/Convenio';
import useLoad from '../../Store/Load';

const meses = []

for (let i = 1; i <= 12; i++) {
    meses.push(i < 10 ? `0${i}` : `${i}`)
}
const anos = []

for (let i = new Date().getFullYear(); i >= new Date().getFullYear() - 5; i--) {
    anos.push(`${i}`)
}

const ConsultarVendas = memo((props) => {

    const [{ id_gds }] = useConvenio()
    const [data, setData] = useState(new Date())
    const [show, setShow] = useState(false)
    const [vendas, setvendas] = useState([])
    const [load, setLoad] = useState(false)
    const [modal, setModal] = useState(false)
    const [conteudoModal, setConteudoModal] = useState(null)
    const [retornoExclusao, setRetornoExclusao] = useState('')
    const [carregando, setCarregando] = useLoad()

    useEffect(() => {
        if (carregando !== "ConsultarVendas" && carregando !== "todos") {
            onChange()

        }
    }, [])
    useEffect(() => {
        if (carregando == "ConsultarVendas" || carregando == "todos") {
            onChange()


            setCarregando(null)
        }
    }, [carregando])

    const getConsulta = async (dataSelecionada) => {
        let Data = dataSelecionada ? dataSelecionada : data
        setLoad(true)
        const { data } = await api.get('/ConsultarVendas', { params: { id_gds, data: Data } })

        setvendas(data)
        setLoad(false)

    }
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || data;
        setShow(Platform.OS === 'ios');
        setData(currentDate);
        let dia = currentDate.getDate() < 10 ? `0${currentDate.getDate()}` : `${currentDate.getDate()}`
        let mes = currentDate.getMonth() < 9 ? `0${currentDate.getMonth() + 1}` : `${currentDate.getMonth() + 1}`
        let ano = `${currentDate.getFullYear()}`
        getConsulta(`${dia}/${mes}/${ano}`)
    };
    const excluirVenda = async (Nr_lancamento) => {

        const dados = await api.delete('/removerVendas', { data: { Nr_lancamento } })
        setRetornoExclusao(dados.data.mensagem)

    }
    return (
        <>
            <Modal isVisible={modal} {...props}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    {conteudoModal ? (<>
                        <View style={{ borderTopRightRadius: 4, borderTopLeftRadius: 4, backgroundColor: `white`, paddingVertical: 10, paddingHorizontal: 5, width: '100%' }}>
                            <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
                                <Text style={{ fontWeight: "bold" }}>Lançamento: <Text style={{ fontWeight: "100" }}>{conteudoModal.Nr_lancamento}</Text></Text>
                                <Text style={{ fontWeight: "bold" }}>Matricula:
                                        <Text style={{ fontWeight: "100" }}> {conteudoModal.Matricula}</Text>
                                </Text>
                            </View>
                            <Text style={{ fontWeight: "bold" }}>Associado: <Text style={{ fontWeight: "100" }}>{conteudoModal["Nome do dependente"]}</Text></Text>
                            <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
                                <Text style={{ fontWeight: "bold" }}>Valor:
                                        <Text style={{ fontWeight: "100" }}> {formatCurrency.format(conteudoModal.Valor, { code: 'BRL' })}</Text>
                                </Text>
                                <Text style={{ fontWeight: "bold" }}>Data:
                                        <Text style={{ fontWeight: "100" }}> {conteudoModal.Data}</Text>
                                </Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
                            <TouchableOpacity
                                onPress={() => {
                                    setConteudoModal(null)
                                    excluirVenda(conteudoModal.Nr_lancamento).then((a) => console.log(a))
                                    getConsulta(conteudoModal.Data)
                                }}
                                style={{
                                    borderBottomLeftRadius: 4,
                                    backgroundColor: danverBackground,
                                    padding: 10,
                                    width: '50%',
                                    alignItems: "center"
                                }}>
                                <Text style={{ color: danger }}>Excluir</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setModal(false)}
                                style={{
                                    borderBottomRightRadius: 4,
                                    backgroundColor: sucessBack,
                                    padding: 10,
                                    width: '50%',
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
                                width: '100%',
                                alignItems: "center"
                            }}>
                            <Text style={{ color: sucess }}>FECHAR</Text>
                        </TouchableOpacity></>) : (<><View style={{ borderTopRightRadius: 4, borderTopLeftRadius: 4, backgroundColor: `white`, paddingVertical: 10, paddingHorizontal: 5, width: '100%' }}>
                            <Text style={{ fontSize: 20, textAlign: "justify" }}>{retornoExclusao}</Text>
                        </View>
                            <TouchableOpacity
                                onPress={() => setModal(false)}
                                style={{
                                    borderBottomRightRadius: 4,
                                    borderBottomLeftRadius: 4,
                                    backgroundColor: sucessBack,
                                    padding: 10,
                                    width: '100%',
                                    alignItems: "center"
                                }}>
                                <Text style={{ color: sucess }}>FECHAR</Text>
                            </TouchableOpacity></>)}
                </View>
            </Modal>
            <MenuTop
                drawer {...props}
                title={'Consultar Vendas'}
                header={(
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
                )}  >
                <View style={{ width: '95%' }}>

                    {load ? <ActivityIndicator size={'large'} color={primary} /> :
                        vendas.length > 0 ? (<FlatList data={vendas}
                            renderItem={({ item }) => {

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
                                        <View style={{ elevation: 2, borderRadius: 4, marginBottom: 10, backgroundColor: `white`, paddingVertical: 5, paddingHorizontal: 5 }}>
                                            <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>

                                                <Text style={{ fontWeight: "bold" }}>Lançamento: <Text style={{ fontWeight: "100" }}>{item.Nr_lancamento}</Text></Text>
                                                <Text style={{ fontWeight: "bold" }}>Matricula:
                                                <Text style={{ fontWeight: "100" }}> {item.Matricula}</Text>
                                                </Text>
                                            </View>
                                            <Text style={{ fontWeight: "bold" }}>Associado: <Text style={{ fontWeight: "100" }}>{item["Nome do dependente"]}</Text></Text>
                                            <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
                                                <Text style={{ fontWeight: "bold" }}>Valor:
                                                <Text style={{ fontWeight: "100" }}> {formatCurrency.format(item.Valor, { code: 'BRL' })}</Text>
                                                </Text>
                                                <Text style={{ fontWeight: "bold" }}>Data:
                                                <Text style={{ fontWeight: "100" }}> {item.Data}</Text>
                                                </Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )
                            }} />) : (<Retorno type='sucess' mensagem='Nenhuma venda encontrada' />)
                    }
                </View>
            </MenuTop >
            <View style={{ flexDirection: "row", alignContent: "space-between", width: '95%', alignSelf: "center" }} >
                <View style={{ width: '48%', marginRight: '2%', alignItems: "center", backgroundColor: primary, borderRadius: 50, marginBottom: 10 }}>
                    <Text style={{ fontWeight: "bold", color: '#fff', fontSize: 10 }}>ATENDIMENTOS</Text>
                    <Text style={{ fontWeight: "bold", color: '#fff', fontSize: 20 }}>{vendas.length}</Text>
                </View>
                <View style={{ width: '48%', marginLeft: '2%', alignItems: "center", backgroundColor: primary, borderRadius: 50, marginBottom: 10 }}>

                    <Text style={{ fontWeight: "bold", color: '#fff', fontSize: 10 }}>TOTAL</Text>
                    <Text style={{ fontWeight: "bold", color: '#fff', fontSize: 20 }}>{formatCurrency.format((vendas.reduce((total, valor) => total + Number(valor.Valor), 0)), { code: 'BRL' })}</Text>
                </View>
            </View></>
    )
})

export default ConsultarVendas
