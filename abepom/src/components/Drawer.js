import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Image,
} from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {DrawerNavigatorItems} from 'react-navigation-drawer';
import styles, {primaryBack} from '../utils/Style';
import getUsuario from '../utils/getUsuario';

const Drawer = props => {
  const [convenio, setConvenio] = useState({
    caminho_logomarca: null,
    nome_parceiro: 'nome_parceiro',
    efetuarVenda: false,
  });
  // getUsuario('convenio').then(a => {
  //   console.log(a);
  //   setConvenio(a);
  // });

  return (
    <ScrollView style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <View style={[styles.row, styles.center, {marginVertical: 20}]}>
          {convenio.caminho_logomarca ? (
            <>
              <Image
                source={{uri: convenio.caminho_logomarca}}
                style={[styles.logoPP]}
              />
            </>
          ) : (
            <EvilIcons name="user" size={70} />
          )}

          <Text style={{width: 150, marginHorizontal: 20, color: primaryBack}}>
            {[convenio.nome_parceiro]}
          </Text>
        </View>
        <DrawerNavigatorItems
          {...props}
          itensConteinerStyles={{width: '100%', backgroundColor: 'blue'}}
        />
      </SafeAreaView>
    </ScrollView>
  );
};

export default Drawer;
