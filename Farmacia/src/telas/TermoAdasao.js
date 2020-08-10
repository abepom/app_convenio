import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StatusBar,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import {WebView} from 'react-native-webview';

import styless, {primary} from './../utils/Style';
import imagens from '../utils/imagens';

export default function TermoAdasao(props) {
  console.log(props);
  return (
    <>
      <StatusBar backgroundColor={primary} barStyle="light-content" />
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.menu}
          onPress={() => props.navigation.toggleDrawer()}>
          <Image
            source={imagens.menu}
            style={{width: 30, height: 30, tintColor: 'white'}}
          />
        </TouchableOpacity>
        <Image
          source={imagens.abepom}
          style={{width: 40, height: 40, marginHorizontal: 10}}
        />
        <Text style={[styless.textoG, styless.white]}>TERMO DE ADESÃO</Text>
      </View>
      <WebView
        source={{
          uri: 'http://192.168.1.238/guiaonline/politica_de_privacidade.asp',
        }}
        textZoom={250}
        style={{height: '100%', borderRadius: 5, margin: 10}}
      />

      <Text>Referencia do termo:</Text>
      <Text>Data da leitura:</Text>
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
  menu: {
    position: 'absolute',
    left: 20,
  },
  menuItem: {
    color: 'white',
  },
  config: {
    position: 'absolute',
    right: 20,
  },
  configItem: {
    color: 'white',
  },
});
