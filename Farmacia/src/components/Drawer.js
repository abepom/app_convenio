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
import api from './../api';

const Drawer = memo((props) => {
  const [load, setLoad] = useLoad();
  const [user] = useUsuario();
  const [convenio] = useConvenio();

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      api
        .get('/user/notificacoes', {
          params: {cd_convenio: convenio.cd_convenio},
        })
        .then(({data}) => {
          console.log(data);
          Alert.alert(
            data[0].ACM_titulo,
            data[0].ACM_mensagem.replace(/<[^>]*>?/gm, '').replace(
              /&[^;]*;?/gm,
              '',
            ),
            [
              {
                text: 'Ok',
                onPress: () => {
                  api
                    .post('/user/LerNotificacoes', {id: data[0].ACMI_id_itens})
                    .then((a) => setLoad('notificacao'))
                    .catch((e) => console.log(e));
                },
              },
              {text: 'FECHAR', onPress: () => {}},
            ],
          );
        });
    });

    return unsubscribe;
  }, []);
  const [menu, setMenu] = useState(props);
  let itens = [];

  //verifica o tipo do usuario
  useEffect(() => {
    //se nao for usuario adm remove o menu do drawer trocar
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
      //se nao for usuario principal da farmacia nao mostra os intens no case
      if (convenio.nivel != 1) {
        let items = [];
        itens.map((item) => {
          switch (item.key) {
            case 'RepassesFuturos':
            case 'AdministrarUsuarios':
              break;

            default:
              items.push({...item});
              break;
          }
        });
        itens = items;
      }
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
    }
  }, [props]);

  return (
    <>
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
    </>
  );
});

export default Drawer;
