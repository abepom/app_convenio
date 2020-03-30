import React, { useState, useEffect } from 'react'
import { View, Text } from 'react-native'
import { TextInput } from 'react-native-paper';
import { themeLight } from '../utils/theme';
import styles from '../utils/Style';
import { TouchableOpacity } from 'react-native-gesture-handler';
import getUsuario from '../utils/getUsuario'
import api from '../api';
const AlterarSenha = () => {

    const [erro, setErro] = useState(false)
    const [senha, setSenha] = useState('')
    const [senhaNova, setSenhaNova] = useState('')
    const [senhaConfirmada, setSenhaConfirmada] = useState('')


    const alterarSenha = () => {

        if (senhaNova !== senhaConfirmada) {
            alert('diferentes')
        } else if (senhaNova.length > 5) {
            api.post('/user/alterarSenha')
        } else {
            alert('menor que 6')
        }
    }
    return (
        <View>
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
            />
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
            />
            <TextInput
                label="Confirme a sua senha"
                dense
                mode="outlined"
                theme={themeLight}
                value={senhaConfirmada}
                onChangeText={setSenhaConfirmada}
                keyboardType="default"
                style={[styles.imput]}
                secureTextEntry
            />
            <TouchableOpacity onPress={alterarSenha} style={[styles.btnDefault, { width: '80%', marginTop: 30, alignSelf: "center" }]}>
                <Text style={styles.btnDefaultText}>CONFIRMAR</Text>
            </TouchableOpacity>
        </View>
    )
}

export default AlterarSenha
