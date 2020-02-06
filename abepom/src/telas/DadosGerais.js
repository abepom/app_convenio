import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from '../constants/Style';
import StatusBar from '../components/StatusBar';
import Menu from '../components/MenuTop';
import ImputText from '../components/imputText';
export default function componentName({navigation}) {
  const [state, setState] = useState({
    razaoSocial: '',
    nomeFantasia: '',
    email: '',
    telComercial: '',
    telContato: '',
    doc: '',
    identidade: '',
    representante: '',
    cargo: '',
    site: '',
    whatsapp: '',
  });
  useEffect(() => {
    console.log(state);
  }, [state]);
  return (
    <>
      <StatusBar />
      <Menu drawer title="ABEPOM Mobile" navigation={navigation}>
        <ScrollView style={{width: '100%'}}>
          <ImputText
            value={state.razaoSocial}
            onChangeText={texto => setState({...state, razaoSocial: texto})}
            placeholder="Razão Social"
          />
          <ImputText
            value={state.nomeFantasia}
            onChangeText={text => setState({...state, nomeFantasia: text})}
            placeholder="Nome Fantasia"
          />
          <ImputText
            value={state.email}
            onChangeText={text => setState({...state, email: text})}
            placeholder="E-mail"
          />
          <ImputText
            value={state.telComercial}
            onChangeText={text => setState({...state, telComercial: text})}
            placeholder="Telefone Comercial"
          />
          <ImputText
            value={state.telContato}
            onChangeText={text => setState({...state, telContato: text})}
            placeholder="Telefone Contato"
          />
          <ImputText
            value={state.doc}
            onChangeText={text => setState({...state, doc: text})}
            placeholder={state.doc < 14 ? 'CPF' : 'CNPJ'}
          />
          <ImputText
            value={state.identidade}
            onChangeText={text => setState({...state, identidade: text})}
            placeholder={state.doc < 14 ? 'Identidade' : 'Inscrição Estadual'}
          />
          <ImputText
            value={state.representante}
            onChangeText={text => setState({...state, representante: text})}
            placeholder="Representante"
          />
          <ImputText
            value={state.cargo}
            onChangeText={text => setState({...state, cargo: text})}
            placeholder="Cargo do representante"
          />
          <ImputText
            value={state.site}
            onChangeText={text => setState({...state, site: text})}
            placeholder="Site"
          />
          <ImputText
            value={state.whatsapp}
            onChangeText={text => setState({...state, whatsapp: text})}
            placeholder="Whatsapp"
          />
        </ScrollView>
      </Menu>
      <View
        style={{
          width: '100%',
          position: 'relative',

          alignItems: 'flex-end',
        }}>
        <TouchableOpacity
          style={{
            padding: 5,
            backgroundColor: '#1f4ba4',
            position: 'relative',
            right: 20,
            width: 50,
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 25,
            margin: 20,
            elevation: 5,
          }}>
          <Icon name="save" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    </>
  );
}
