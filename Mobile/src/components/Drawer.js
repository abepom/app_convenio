import React, { useState, useEffect, memo } from 'react';
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

import messaging from '@react-native-firebase/messaging';
import useConvenio from '../../Store/Convenio';
import useLoad from '../../Store/Load';

const Drawer = memo(props => {
  const [, setLoad] = useLoad();

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      setLoad(remoteMessage.data.tela);
      Alert.alert(
        remoteMessage.notification.title,
        `${remoteMessage.notification.body}`,
        [
          {
            text: 'VER',
            onPress: () => {
              props.navigation.navigate(remoteMessage.data.tela, {
                reload: true,
              });
            },
          },
          { text: 'FECHAR', onPress: () => {} },
        ],
      );
    });

    return unsubscribe;
  }, []);
  const [menu, setMenu] = useState(props);
  let itens = [];

  const [convenio] = useConvenio();

  console.log(props);
  useEffect(() => {
    if (!convenio.efetuarVenda) {
      //montando o menu dos parceiros
      menu.items.map(item => {
        console.log(item);
        switch (item.key) {
          case 'EfetuarVenda':
          case 'ConsultarVendas':
            break;
          default:
            itens.push({ ...item });
            break;
        }
      });
    } else {
      //montando o menu das farmacias
      menu.items.map(item => {
        switch (item.key) {
          case 'ListarAtendimento':
            break;
          default:
            itens.push({ ...item });
            break;
        }
      });
    }
    setMenu({ ...props, items: itens });
    console.log(itens);
  }, [props]);

  return (
    <ScrollView style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <View style={[styles.row, styles.center, { marginVertical: 20 }]}>
          {convenio.caminho_logomarca ? (
            <>
              <View>
                <Image
                  source={{ uri: convenio.caminho_logomarca }}
                  style={[styles.logoP]}
                />
              </View>
            </>
          ) : (
            <View
              style={{
                borderWidth: 2,
                borderColor: primary,
                borderRadius: 50,
                padding: 10,
              }}>
              <Image
                source={imagens.camera}
                style={[styles.logoPP]}
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
          <View style={{ marginHorizontal: 10, maxWidth: '60%' }}>
            <Text style={{}}>{[convenio.nome_parceiro]}</Text>
            <Text style={{ fontSize: 10 }}>
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
});

export default Drawer;
