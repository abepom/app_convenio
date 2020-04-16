import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import { DrawerNavigatorItems } from 'react-navigation-drawer';
import styles, { primaryBack, primary } from '../utils/Style';
import getUsuario from '../utils/getUsuario';
import imagens from '../utils/imagens';

import messaging, { firebase } from '@react-native-firebase/messaging';

const Drawer = props => {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {

      Alert.alert(remoteMessage.notification.title, `${remoteMessage.notification.body}`, [
        { text: 'VER', onPress: () => { props.navigation.navigate(remoteMessage.data.tela, { reload: true }) } },
        { text: 'FECHAR', onPress: () => { } },
      ]);
    });

    return unsubscribe;
  }, []);
  const [menu, setMenu] = useState(useMemo(() => props, menu));
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
          });
        } else {
          menu.items.map(item => {
            switch (item.key) {
              case 'ListarAtendimento':
                break;
              default:
                itens.push({ ...item, params: props.navigation.state.params });
                break;
            }
          })
        }
      } catch (error) { console.log(error) }

      setMenu({ ...props, items: itens });
    });
  }, [menu]);

  return (
    <ScrollView style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <View style={[styles.row, styles.center, { marginVertical: 20 }]}>
          {convenio.caminho_logomarca ? (
            <>

              <View>

                <Image
                  source={{ uri: convenio.caminho_logomarca }}
                  style={[styles.logoPP]}
                >
                </Image>

              </View>
            </>
          ) : (<View style={{ borderWidth: 2, borderColor: primary, borderRadius: 50, padding: 10 }}>
            <Image
              source={imagens.camera}
              style={[styles.logoPP, { resizeMode: 'contain', height: 45, width: 45, }]}
              tintColor={primary}
            />
            {/* <Image
                        source={imagens.camera}
                        style={{
                            width: 20,
                            height: 20,
                            resizeMode: 'cover',
                            position: "absolute",
                            left: 2,
                            top: 5,



                        }}
                        tintColor={primary}
                    /> */}
          </View>
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

export default Drawer;
