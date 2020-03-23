import React, { useState, useEffect } from 'react'
import { View, Text, Picker, FlatList, ActivityIndicator } from 'react-native'
import MenuTop from '../components/MenuTop'
import styles, { primary, background } from '../utils/Style'
import { TextInput } from 'react-native-paper'

import api from '../api'
import { themeLight, themeDark } from '../utils/theme'
import formatCurrency from 'currency-formatter'

const meses = []

for (let i = 1; i <= 12; i++) {
    meses.push(i < 10 ? `0${i}` : `${i}`)


}
const anos = []
styles
for (let i = new Date().getFullYear(); i >= new Date().getFullYear() - 5; i--) {
    anos.push(`${i}`)
}

const ConsultarVendas = (props) => {

    const data = new Date().getMonth() + 1
    const [mes, setMes] = useState(data < 10 ? `02` : `${data}`)
    const [ano, setAno] = useState(`${new Date().getFullYear()} `)
    const [vendas, setvendas] = useState([])
    const [load, setLoad] = useState(false)
    useEffect(() => {
        getConsulta(mes, ano)
    }, [])


    const getConsulta = async (mes, ano) => {
        setLoad(true)
        const dados = await api.get('/ConsultarVendas', { params: { id_gds: props.navigation.state.params.id_gds, mes, ano } })

        setvendas(dados.data)
        setLoad(false)

    }
    return (
        <MenuTop
            drawer {...props}
            title={'Consultar Vendas'}
            header={(
                <View style={{ width: '70%', flexDirection: "row", justifyContent: 'space-between', marginTop: 10 }}>
                    <TextInput
                        label="Mes"
                        value={mes}
                        selectedValue={mes}
                        onValueChange={(itemValue, itemIndex) => {
                            setMes(itemValue)
                            getConsulta(itemValue, ano)
                        }
                        }
                        dense
                        mode="outlined"
                        theme={themeLight}
                        style={{ width: "45%" }}
                        render={(props) =>
                            (
                                <Picker
                                    {...props}
                                    mode='dropdown'
                                >
                                    {meses.map(mes => <Picker.Item label={mes} value={mes} />)}
                                </Picker>)
                        }
                    />
                    <TextInput
                        label="Ano"
                        value={ano}
                        selectedValue={ano}
                        onValueChange={(itemValue, itemIndex) => {
                            setAno(itemValue)
                            getConsulta(mes, itemValue)
                        }
                        }
                        dense
                        mode="outlined"
                        theme={themeLight}
                        style={{ width: "45%" }}
                        render={(props) => (
                            <Picker
                                {...props}
                                mode='dropdown'>
                                {anos.map(ano => <Picker.Item label={ano} value={ano} />)}
                            </Picker>
                        )}
                    />
                </View >
            )}  >
            <View style={{ width: '80%' }}>
                {load ? <ActivityIndicator size={'large'} color={primary} /> :
                    <FlatList data={vendas}

                        renderItem={({ item }) => {
                            console.log(item)
                            return (<View style={{ elevation: 2, borderRadius: 4, marginBottom: 10, backgroundColor: `white`, paddingVertical: 10, paddingHorizontal: 5 }}>
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

                            </View>)
                        }} />
                }
            </View>

        </MenuTop >
    )
}

export default ConsultarVendas
