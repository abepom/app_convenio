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
  let itens = props.items;
  console.log()
  const [convenio, setConvenio] = useState({
    caminho_logomarca: null,
    nome_parceiro: '',
    efetuarVenda: false,
  });
  useEffect(() => {
    getUsuario('convenio').then(conv => {
      setConvenio(conv);
      console.log(conv)
      if (!conv.efetuarVenda) {
        menu.items.map(item => {
          switch (item.key) {
            case 'EfetuarVenda':
            case 'ConsultarVendas':
            case 'Endereco':
              break;
            default:
              itens.push({ ...item, params: conv });
              break;
          }
        });
      }
    });

    setMenu({ ...props, items: itens });
  }, []);

  console.log(menu, 'menu', convenio);

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
