import React, { useState } from 'react'
import { View, Text, Image } from 'react-native'
import MenuTop from '../components/MenuTop'
import { TextInput } from 'react-native-paper';
import { themeLight } from '../utils/theme';
import styles, { primary } from '../utils/Style';
import { TouchableOpacity } from 'react-native-gesture-handler';
import imagens from '../utils/imagens';
const Perfil = (props) => {
  const initialState = {
    nome_fachada: '',
    email: '',
    tel_comercial: '',
    tel_contato: '',
    representante: '',
    cargo: '',
    site: '',
    whatsapp: ''

  }
  const [state, setState] = useState(initialState)
  return (
    <>
      <MenuTop {...props} title='Perfil'>
        <TextInput
          label="Nome de Fachada"
          dense
          mode="outlined"
          theme={themeLight}
          value={state.nome_fachada}
          onChangeText={texto => setState({ ...state, nome_fachada: texto })}
          keyboardType="default"
          style={[styles.imput]}
        />
        <TextInput
          label="E-mail"
          dense
          mode="outlined"
          theme={themeLight}
          value={state.email}
          onChangeText={texto => setState({ ...state, email: texto })}
          keyboardType="default"
          style={[styles.imput]}
        />
        <View style={{ width: '100%', flexDirection: "row" }}>
          <TextInput
            label="Tel. Comercial"
            dense
            mode="outlined"
            theme={themeLight}
            value={state.tel_comercial}
            onChangeText={texto => setState({ ...state, tel_comercial: texto })}
            keyboardType="default"
            style={[styles.imput, { width: '38%' }]}
          />
          <TextInput
            label="Tel. Contato"
            dense
            mode="outlined"
            theme={themeLight}
            value={state.tel_contato}
            onChangeText={texto => setState({ ...state, tel_contato: texto })}
            keyboardType="default"
            style={[styles.imput, { width: '38%', marginLeft: '4%' }]}
          />
        </View>
        <TextInput
          label="Representante"
          dense
          mode="outlined"
          theme={themeLight}
          value={state.representante}
          onChangeText={texto => setState({ ...state, representante: texto })}
          keyboardType="default"
          style={[styles.imput]}
        />
        <TextInput
          label="Cargo"
          dense
          mode="outlined"
          theme={themeLight}
          value={state.cargo}
          onChangeText={texto => setState({ ...state, cargo: texto })}
          keyboardType="default"
          style={[styles.imput]}
        />
        <TextInput
          label="Site"
          dense
          mode="outlined"
          theme={themeLight}
          value={state.site}
          onChangeText={texto => setState({ ...state, site: texto })}
          keyboardType="default"
          style={[styles.imput]}
        />
        <TextInput
          label="Whatsapp"
          dense
          mode="outlined"
          theme={themeLight}
          value={state.whatsapp}
          onChangeText={texto => setState({ ...state, whatsapp: texto })}
          keyboardType="default"
          style={[styles.imput]}
        />
      </MenuTop>
      <View style={{ position: "absolute", right: '10%', bottom: '5%' }}>
        {}
        <TouchableOpacity style={{ backgroundColor: primary, padding: 15, borderRadius: 50 }} ><Image source={imagens.save} style={{ width: 30, height: 30, tintColor: 'white' }} /></TouchableOpacity>
      </View>
    </>
  )
}

export default Perfil
