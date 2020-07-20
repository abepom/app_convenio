import React, {useState, useEffect, memo} from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {DrawerNavigatorItems} from 'react-navigation-drawer';
import styles, {primaryBack, primary, danger} from '../utils/Style';

import imagens from '../utils/imagens';
import ItemDrawer from './ItemDrawer';

import messaging from '@react-native-firebase/messaging';
import useConvenio from '../../Store/Convenio';
import useLoad from '../../Store/Load';
import useUsuario from '../../Store/Usuario';

const Drawer = memo((props) => {
  const [, setLoad] = useLoad();
  const [user] = useUsuario();
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
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
          {text: 'FECHAR', onPress: () => {}},
        ],
      );
    });

    return unsubscribe;
  }, []);
  const [menu, setMenu] = useState(props);
  let itens = [];

  const [convenio] = useConvenio();
  useEffect(() => {
    console.log(user.usuario != 'abepom');
    if (user.usuario != 'abepom') {
      menu.items.map((item) => {
        switch (item.key) {
          case 'Trocar':
            break;

          default:
            itens.push({...item});
            break;
        }
      });
      return setMenu({...props, items: itens});
    }
    if (convenio.nivel != 1) {
      menu.items.map((item) => {
        switch (item.key) {
          case 'RepassesFuturos':
            break;
          default:
            itens.push({...item});
            break;
        }
      });
      return setMenu({...props, items: itens});

      setMenu(props);
    }
  }, [props]);

  return (
    <ScrollView style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <View style={[styles.row, styles.center, {marginVertical: 20}]}>
          {convenio.caminho_logomarca ? (
            <>
              <View>
                <Image
                  source={{uri: convenio.caminho_logomarca}}
                  style={[styles.logoP, {resizeMode: 'contain'}]}
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
          <View style={{marginHorizontal: 10, maxWidth: '60%'}}>
            <Text style={{}}>{[convenio.nome_parceiro]}</Text>
            <Text style={{fontSize: 10}}>
              {convenio.doc && convenio.doc.length > 15
                ? `CNPF: ${convenio.doc}`
                : `CPF: ${convenio.doc}`}
            </Text>
          </View>
        </View>
        <DrawerNavigatorItems
          {...menu}
          itensConteinerStyles={{width: '100%', backgroundColor: 'blue'}}
        />
      </SafeAreaView>
    </ScrollView>
  );
});

export default Drawer;
