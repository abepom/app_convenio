import React, { useState, useEffect } from 'react'
import { View, Text, Image, TouchableOpacity, Picker, ScrollView, ActivityIndicator } from 'react-native'
import MenuTop from '../components/MenuTop'
import { TextInput, HelperText } from 'react-native-paper';
import { themeLight } from '../utils/theme';
import styles, { primary } from '../utils/Style';
import { TextInputMask } from 'react-native-masked-text'
import imagens from '../utils/imagens';
import getUsuario from '../utils/getUsuario'
import api from '../api';
import Retorno from '../components/Retorno';

const Perfil = (props) => {

  useEffect(() => {
    getUsuario('convenio').then(conv => {
      console.log(conv)
      setId_gds(conv.id_gds)

      getDados(conv.id_gds)
    })
  }, [])

  const input = { value: '', erro: false, }

  const [id_gds, setId_gds] = useState('')
  const initialState = {
    nome_fachada: input,
    email: input,
    tel_comercial: input,
    tel_contato: input,
    representante: input,
    cargo: {
      value: 'ceo-fundador',
      erro: false,

    },
    site: input,
    whatsapp: input

  }
  const [carregando, setCarregando] = useState(false)
  const [state, setState] = useState(initialState)
  const [retorno, setRetorno] = useState(false)
  useEffect(() => {

    if (!!retorno) {


      setTimeout(() => {
        setRetorno(false)
      }, 2000);
    }
  }, [retorno])
  const alterarStado = (valor, campo) => {
    let valorAlterado = { ...input, value: valor }
    setState({ ...state, [campo]: valorAlterado })
  }
  const getDados = (id) => {
    console.log(id, 'id')
    api.get('/user/dados_gerais', { params: { id_gds: id } }).then(({ data }) => {
      setState({
        ...state,
        nome_fachada: { value: data.nome_fachada, erro: false, },
        email: { value: data.email, erro: false, },
        tel_comercial: { value: data.tel_comercial, erro: false, },
        tel_contato: { value: data.tel_contato, erro: false, },
        representante: { value: data.representante, erro: false, },
        cargo: { value: data.cargo, erro: false, },
        site: { value: data.site, erro: false, },
        whatsapp: { value: data.whatsapp == 'undefined' ? '' : data.whatsapp, erro: false, }
      })
    })
  }
  const atualizarDados = async () => {
    setCarregando(true)
    if (state.nome_fachada.value == '') {
      setCarregando(false)

      setState({
        ...state, nome_fachada: {
          value: state.nome_fachada.value,
          erro: true,
        }
      })
    } else if (state.email.value.indexOf('@') <= 0) {
      setCarregando(false)

      setState({
        ...state, email: {
          value: state.email.value,
          erro: true,
        }
      })
    } else if (state.email.value.indexOf('.') <= 0) {
      setCarregando(false)

      setState({
        ...state, email: {
          value: state.email.value,
          erro: true,
        }
      })
    } else {

      const {
        nome_fachada,
        email,
        tel_comercial,
        tel_contato,
        representante,
        cargo,
        site,
        whatsapp,

      } = state

      api.put('/user/edit', {
        nome_fachada,
        email,
        tel_comercial,
        tel_contato,
        representante,
        cargo,
        site,
        whatsapp,
        id_gds
      }).then(({ data }) => {
        setRetorno({ erro: !data.retorno, mensagem: data.mensagem })
        setCarregando(false)

        if (data.retorno) {
          setState({
            ...state,
            nome_fachada: { value: data.nome_fachada, erro: false, },
            email: { value: data.email, erro: false, },
            tel_comercial: { value: data.tel_comercial, erro: false, },
            tel_contato: { value: data.tel_contato, erro: false, },
            representante: { value: data.representante, erro: false, },
            cargo: { value: data.cargo, erro: false, },
            site: { value: data.site, erro: false, },
            whatsapp: { value: data.whatsapp == 'undefined' ? '' : data.whatsapp, erro: false, }
          })
        }
      }
      ).catch((error) => setCarregando(false)
      )

    }
  }
  return (
    <>
      <ScrollView>
        <View style={{ width: '85%', alignSelf: "center" }}>

          {retorno ? retorno.erro ? (<Retorno type='danger' mensagem={retorno.mensagem} />) : (<Retorno type='sucess' mensagem={retorno.mensagem} />) : null}
        </View>
        <TextInput
          ref={(ref) => null}
          label="Nome de Fachada"
          dense
          mode="outlined"
          theme={themeLight}
          value={state.nome_fachada.value}
          onChangeText={texto => alterarStado(texto.toUpperCase(), 'nome_fachada')}
          keyboardType="default"
          error={state.nome_fachada.erro}
          style={[styles.imput]}
        />
        {state.nome_fachada.erro && (

          <HelperText
            type="error"
            visible={!state.nome_fachada.value != ''}
            padding='none'
            style={{ width: '80%', marginLeft: '10%' }}
          >
            Informe o nome da fachada
          </HelperText>
        )}

        <TextInput
          onFocus={null}
          onBlur={null}

          label="E-mail"
          dense
          mode="outlined"
          theme={themeLight}
          value={state.email.value}
          onChangeText={texto => alterarStado(texto, 'email')}
          keyboardType="email-address"
          style={[styles.imput]}
          error={state.email.erro}

        />
        {state.email.erro && (

          <HelperText
            type="error"
            visible={state.email.value.indexOf('@') ? state.email.value.indexOf('.') ? true : false : false}
            padding='none'
            style={{ width: '80%', marginLeft: '10%' }}
          >
            Informe um email valido
          </HelperText>
        )}
        <View style={{ width: '100%', flexDirection: "row" }}>
          <TextInput
            label="Tel. Comercial"
            dense
            mode="outlined"
            theme={themeLight}

            value={state.tel_comercial.value}
            onChangeText={texto => alterarStado(texto, 'tel_comercial')}
            keyboardType="numeric"
            style={[styles.imput, { width: '38%' }]}
            render={(props) => {
              return (<TextInputMask
                type={'cel-phone'}
                options={{
                  maskType: 'BRL',
                  withDDD: true,
                  dddMask: '(99) '
                }}
                {...props}
              />)
            }}
          />
          <TextInput
            label="Tel. Contato"
            dense
            mode="outlined"
            theme={themeLight}
            value={state.tel_contato.value}
            onChangeText={texto => alterarStado(texto, 'tel_contato')}
            keyboardType="numeric"
            style={[styles.imput, { width: '38%', marginLeft: '4%' }]}
            render={(props) => {
              return (<TextInputMask
                type={'cel-phone'}
                options={{
                  maskType: 'BRL',
                  withDDD: true,
                  dddMask: '(99) '
                }}
                {...props}
              />)
            }}
          />
        </View>
        <TextInput
          label="Representante"
          dense
          mode="outlined"
          theme={themeLight}
          value={state.representante.value}
          onChangeText={texto => alterarStado(texto.toUpperCase(), 'representante')}
          keyboardType="default"
          style={[styles.imput]}
        />
        {state.cargo.value != '' && (
          <>
            <TextInput
              label="Cargo"
              dense
              mode="outlined"
              theme={themeLight}
              value={state.cargo.value}

              keyboardType="default"
              style={[styles.imput]}
              render={(props) => {
                return (
                  <Picker
                    selectedValue={state.cargo.value}
                    mode='dropdown'
                    onValueChange={(itemValue, itemIndex) => alterarStado(itemValue, 'cargo')}
                  >
                    <Picker.Item value="ceo-fundador" label="CEO / Fundador" />
                    <Picker.Item value="diretor" label="Diretor" />
                    <Picker.Item value="gerente" label="Gerente" />
                    <Picker.Item value="representante-de-vendas" label="Representante de vendas" />
                    <Picker.Item value="outros" label="outros" />
                  </Picker>
                )
              }}
            />
          </>
        )}
        <TextInput
          label="Site"
          dense
          mode="outlined"
          theme={themeLight}
          value={state.site.value}
          onChangeText={texto => alterarStado(texto, 'site')}
          keyboardType="url"
          style={[styles.imput]}
        />
        <TextInput
          label="Whatsapp"
          dense
          mode="outlined"
          theme={themeLight}
          value={state.whatsapp.value}
          onChangeText={texto => alterarStado(texto, 'whatsapp')}
          keyboardType="numeric"
          style={[styles.imput]}
          render={(props) => {
            return (<TextInputMask
              type={'cel-phone'}
              options={{
                maskType: 'BRL',
                withDDD: true,
                dddMask: '(99) '
              }}
              {...props}
            />)
          }}
        />
        {carregando ? (<ActivityIndicator style={{ marginTop: 20, }} size={32} />) : (

          <TouchableOpacity
            onPress={() => atualizarDados()}
            style={[styles.btnDefault, { marginTop: 12, width: '40%', alignSelf: "center" }]} >
            <Text style={{ color: `white` }}>SALVAR</Text>
          </TouchableOpacity>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

    </>
  )
}

export default Perfil
