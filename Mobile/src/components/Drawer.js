import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Image,
} from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { DrawerNavigatorItems } from 'react-navigation-drawer';
import styles, { primaryBack } from '../utils/Style';
import getUsuario from '../utils/getUsuario';

const Drawer = props => {
  const [menu, setMenu] = useState({ ...props });
  let itens = []


  const [convenio, setConvenio] = useState({
    caminho_logomarca: null,
    nome_parceiro: '',
    efetuarVenda: false,
  });
  useEffect(() => {
    getUsuario('convenio').then(async conv => {

      try {
        await setConvenio(conv);

        if (!conv.efetuarVenda) {

          menu.items.map(item => {
            switch (item.key) {
              case 'EfetuarVenda':
              case 'ConsultarVendas':
              case 'Endereco':
                break;
              default:
                itens.push({ ...item, params: props.navigation.state.params });
                break;
            }
            console.log(itens)
          });
        } else {

          menu.items.map(item => {

            itens.push({ ...item, params: props.navigation.state.params });

          })
          console.log(itens)
        }
      } catch (error) {
        console.log(error)
      }

      console.log(itens, "itens")

      setMenu({ ...props, items: itens });

    });
  }, []);



  return (
    <ScrollView style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <View style={[styles.row, styles.center, { marginVertical: 20 }]}>
          {convenio.caminho_logomarca ? (
            <>
              <Image
                source={{ uri: convenio.caminho_logomarca }}
                style={[styles.logoPP]}
              />
            </>
          ) : (
              <EvilIcons name="user" size={70} />
            )}
          <View>
            <Text
              style={{ width: 150, marginHorizontal: 20, color: primaryBack }}>
              {[convenio.nome_parceiro]}
            </Text>
            <Text style={{ fontSize: 10, paddingLeft: 20 }}>
              {convenio.doc && convenio.doc.length > 15
                ? `CNPF: ${convenio.doc}`
                : `CPF: ${convenio.doc}`}
            </Text>
          </View>
        </View>
        <DrawerNavigatorItems
          {...menu}
          itensConteinerStyles={{ width: '100%', backgroundColor: 'blue' }}
        />
      </SafeAreaView>
    </ScrollView>
  );
};
// thiago.denir.ramos@hotmail.com
// S1F4617027tdr.@
//ab3p0ms3d3
export default Drawer;
