import React from 'react';
import {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StatusBar,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import icone from '../assets/img/abepom.png';
import api from '../api';
import styless, {primary, background} from '../utils/Style';
import {TextInput} from 'react-native-paper';
import {themeLight} from '../utils/theme';

import messaging from '@react-native-firebase/messaging';
import useConvenio from '../../Store/Convenio';

export default function Administrador(props) {
  const [farmacias, setFarmacias] = useState([]);
  const [todasFarmacias, setTodasFarmacias] = useState([]);
  const [busca, setBusca] = useState('');
  const [modal, setModal] = useState(props.modal);
  const [, setConv] = useConvenio();

  const GetFarmacias = async () => {
    const {data} = await api({
      url: '/farmacias',
      method: 'get',
    });
    setFarmacias(data);
    setTodasFarmacias(data);
  };

  useEffect(() => {
    setModal(true);
  }, [props.load]);
  useEffect(() => {
    GetFarmacias();
  }, []);
  useEffect(() => {
    let filtro;

    if (isNaN(busca)) {
      //texto

      filtro = todasFarmacias.filter((i) => {
        return (
          i.Nome_fantasia.toUpperCase().indexOf(busca.toUpperCase()) >= 0 ||
          i.usuario.toUpperCase().indexOf(busca.toUpperCase()) >= 0
        );
      });
    } else {
      //numero

      filtro = todasFarmacias.filter((i) => {
        var documento = i.doc.replace(/[./-]/g, '');
        return (
          i.usuario
            .replace(/[./-]/g, '')
            .indexOf(busca.replace(/[./-]/g, '')) >= 0 ||
          documento.indexOf(busca.replace(/[./-]/g, '')) >= 0
        );
      });
    }
    setFarmacias(filtro);
  }, [busca]);

  const getToken = async () => {
    const token = await messaging().getToken();
    return token;
  };
  const conectar = async (doc, senha) => {
    let token = await getToken();
    try {
      const {data} = await api.post('/Login', {
        usuario: doc,
        senha,
        token,
      });
      let convenio;
      if (!data.erro) {
        convenio = {
          id_gds: data.id_gds,
          nome_parceiro: data.nome_parceiro,
          caminho_logomarca: data.caminho_logomarca,
          efetuarVenda: data.efetuarVenda,
          doc: data.doc,
          usuario: data.usuario,
          nivel: data.nivel,
          token,
        };
        setModal(false);
        setConv(convenio);
        props.navigation.navigate('Home');
      } else {
        console.log(data.erro);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <StatusBar backgroundColor={primary} barStyle="light-content" />
      <View style={styles.container}>
        <Image
          source={icone}
          style={{width: 40, height: 40, marginHorizontal: 10}}
        />
        <Text style={[styless.textoG, styless.white]}>ADMINISTRAÇÂO</Text>
      </View>
      <View style={{flex: 1}}>
        <View style={{padding: 10}}>
          <TextInput
            label="Buscar"
            dense
            autoCapitalize="characters"
            mode="outlined"
            theme={themeLight}
            value={busca.toLocaleUpperCase()}
            onChangeText={setBusca}
          />
        </View>
        {farmacias ? (
          <ScrollView>
            <FlatList
              data={farmacias}
              keyExtractor={(item, index) => index}
              renderItem={({item}) => {
                let farmacia = item;

                return (
                  <View style={styles.item}>
                    <View style={{width: '75%'}}>
                      <Text style={styles.texto}>
                        <Text style={styles.textoNegrito}>NOME:</Text>{' '}
                        {farmacia.Nome_fantasia}
                      </Text>
                      <Text style={styles.texto}>
                        <Text style={styles.textoNegrito}>DOCUMENTO:</Text>{' '}
                        {farmacia.doc}
                      </Text>
                      <Text style={styles.texto}>
                        <Text style={styles.textoNegrito}>USUARIO:</Text>{' '}
                        {farmacia.usuario}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.acessar}
                      onPress={() =>
                        conectar(
                          farmacia.nivel == '1'
                            ? farmacia.doc
                            : farmacia.usuario,
                          farmacia.Senha,
                        )
                      }>
                      <Text style={{color: 'white'}}>ACESSAR</Text>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
            {/* {farmacias.map((farmacia, i) => {
              return (
                <View key={`${i}`} style={styles.item}>
                  <View style={{width: '75%'}}>
                    <Text style={styles.texto}>
                      <Text style={styles.textoNegrito}>NOME:</Text>{' '}
                      {farmacia.Nome_fantasia}
                    </Text>
                    <Text style={styles.texto}>
                      <Text style={styles.textoNegrito}>DOCUMENTO:</Text>{' '}
                      {farmacia.doc}
                    </Text>
                    <Text style={styles.texto}>
                      <Text style={styles.textoNegrito}>USUARIO:</Text>{' '}
                      {farmacia.usuario}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.acessar}
                    onPress={() =>
                      conectar(
                        farmacia.nivel == '1' ? farmacia.doc : farmacia.usuario,
                        farmacia.Senha,
                      )
                    }>
                    <Text style={{color: 'white'}}>ACESSAR</Text>
                  </TouchableOpacity>
                </View>
              );
            })} */}
          </ScrollView>
        ) : (
          <View>
            <ActivityIndicator />
          </View>
        )}
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    height: 50,
    backgroundColor: primary,
    flexDirection: 'row',
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoNegrito: {
    fontWeight: 'bold',
  },
  texto: {
    color: primary,
  },
  item: {
    margin: 3,
    padding: 10,
    backgroundColor: '#FFF',
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  acessar: {
    backgroundColor: primary,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
