import React, { useState, useEffect } from 'react'
import { View, Text } from 'react-native'
import { TextInput, HelperText } from 'react-native-paper';
import { themeLight } from '../utils/theme';
import styles from '../utils/Style';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import getUsuario from '../utils/getUsuario'
import setDados from '../utils/setUsuario'
import api from '../api';
import Retorno from '../components/Retorno';
const AlterarSenha = () => {
    const [state, setstate] = useState({ senha: false, novasenha: false, senhaConfirmada: false })
    const [retorno, setRetorno] = useState({ retorno: 0, mensagem: '', tipo: '' })
    const [senha1, setSenha1] = useState('')
    const [senha, setSenha] = useState('')
    const [senhaNova, setSenhaNova] = useState('')
    const [senhaConfirmada, setSenhaConfirmada] = useState('')
    const [usuario, setUsuario] = useState('')
    useEffect(() => {
        getUsuario('usuario').then(conv => {
            setUsuario(conv.usuario)
            setSenha1(conv.senha)
            console.log(conv, 'conve')
        })
    }, [])
    useEffect(() => {
        if (retorno.retorno) {
            setTimeout(() => {
                setRetorno({ retorno: 0, mensagem: '', tipo: '' })
            }, 3000);
        }
    }, [retorno])

    const alterarSenha = () => {
        if (senhaNova !== senhaConfirmada) {
            setstate({ ...state, senhaConfirmada: true })

        } else if (senhaNova.length > 5) {
            console.log({ usuario, senha, senhaNova })
            api.put('/user/alterarSenha', { usuario, senha, senhaNova }).then(({ data }) => {
                if (data.retorno) {
                    if (data.tipo == 'danger') {
                        setSenha('')

                        setstate({ ...state, senha: true })
                    } else {
                        setRetorno(data)
                        setSenha1(senhaNova)
                        setDados('usuario', { usuario, senha: senhaNova })
                    }
                }
            })
        } else {

            setstate({ ...state, novasenha: true })

        }
    }
    return (
        <View>
            {
                retorno.retorno ? (<View style={{ width: '80%', alignSelf: "center", marginRight: '5%' }}><Retorno type={retorno.tipo} mensagem={retorno.mensagem} /></View>) : null
            }
            <ScrollView>

                <TextInput
                    label="Informe a sua senha"
                    dense
                    mode="outlined"
                    theme={themeLight}
                    value={senha}
                    onChangeText={setSenha}
                    keyboardType="default"
                    style={[styles.imput]}
                    secureTextEntry
                    error={state.senha ? senha.length <= 5 ? true : false : false}
                />

                {state.senha ? senha.length <= 5 ? (

                    <HelperText
                        type="error"
                        visible={true}
                        padding='none'
                        style={{ width: '80%', marginLeft: '10%' }}
                    >
                        Senha incorreta
                    </HelperText>
                ) : null : null}

                <TextInput
                    label="Digite sua nova senha"
                    dense
                    mode="outlined"
                    theme={themeLight}
                    value={senhaNova}
                    onChangeText={setSenhaNova}
                    keyboardType="default"
                    style={[styles.imput]}
                    secureTextEntry
                    error={state.novasenha ? senhaNova.length >= 6 ? false : true : false}
                />
                {
                    state.novasenha ? senhaNova.length >= 6 ? null : (

                        <HelperText
                            type="error"
                            visible={true}
                            padding='none'
                            style={{ width: '80%', marginLeft: '10%' }}
                        >
                            senha pecisa ser maior ou igual a 6 caracter
                        </HelperText>
                    ) : null
                }
                < TextInput
                    label="Confirme a sua senha"
                    dense
                    mode="outlined"
                    theme={themeLight}
                    value={senhaConfirmada}
                    onChangeText={setSenhaConfirmada}
                    keyboardType="default"
                    style={[styles.imput]}
                    secureTextEntry
                    error={state.senhaConfirmada ? senhaConfirmada.length == senhaNova.length ? false : true : false}
                />
                {state.senhaConfirmada ? senhaConfirmada.length == senhaNova.length ? null : (

                    <HelperText
                        type="error"
                        visible={senhaConfirmada.length == senhaNova.length ? false : true}
                        padding='none'
                        style={{ width: '80%', marginLeft: '10%' }}
                    >
                        Senhas estão diferente.
                    </HelperText>
                ) : null}
                <TouchableOpacity onPress={alterarSenha} style={[styles.btnDefault, { width: '80%', marginTop: 30, alignSelf: "center" }]}>
                    <Text style={styles.btnDefaultText}>CONFIRMAR</Text>
                </TouchableOpacity>
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center", marginTop: 50 }}>
                    <Text> senha salva no ato do login é ({senha1})</Text>
                    <Text> provavelmente sera a senha atual tambem </Text>
                </View>
            </ScrollView>
        </View >
    )
}

export default AlterarSenha
