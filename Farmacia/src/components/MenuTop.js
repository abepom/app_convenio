import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import styless, { primary, background } from '../utils/Style';
import Icone from 'react-native-vector-icons/MaterialCommunityIcons';
import icone from '../assets/img/abepom.png';
import getUsuario from '../utils/getUsuario';
const MenuTop = props => {
  const { children, drawer, noIcons, imagemConf, funcConfig } = props;
  let iconemenu;
  let _press;
  const _handlerOpemConfig = () => {
    funcConfig ? funcConfig() : alert('teste');
  };
  if (!noIcons) {
    if (drawer) {
      iconemenu = 'menu';
      _press = () => props.navigation.toggleDrawer();
    } else {
      iconemenu = 'chevron-left';

      if (props.irpara) {
        _press = () => {
          props.navigation.navigate(`${props.irpara}`);
        };
      } else {
        _press = () => {
          props.navigation.goBack();
        };
      }
    }
  }

  useEffect(() => {
    getUsuario('notificacao').then(dados => console.log(dados, 'itens '));
  }, []);

  return (
    <>
      <StatusBar backgroundColor={primary} barStyle="light-content" />
      <View style={styles.container}>
        <TouchableOpacity style={styles.menu} onPress={() => _press()}>
          <Icone style={styles.configItem} name={iconemenu} size={28} />
        </TouchableOpacity>
        <Image
          source={icone}
          style={{ width: 40, height: 40, marginHorizontal: 10 }}
        />
        <Text style={[styless.textoG, styless.white]}>{props.title}</Text>
        {!noIcons ? (
          <TouchableOpacity
            style={styles.config}
            onPress={() => _handlerOpemConfig()}>
            <Image
              source={imagemConf}
              tintColor={'white'}
              style={{ width: 25, height: 25 }}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      {props.header && (
        <View
          style={{
            alignItems: 'center',
            paddingBottom: 20,
            backgroundColor: background,
          }}>
          {props.header}
        </View>
      )}

      <ScrollView
        style={{
          backgroundColor: props.backgroundColor
            ? props.backgroundColor
            : background,
        }}>
        <View style={{ alignItems: 'center', paddingBottom: 20 }}>
          {children}
        </View>
      </ScrollView>
      {props.footer && (
        <View style={{ alignItems: 'center', paddingBottom: 20 }}>
          {props.footer}
        </View>
      )}
    </>
  );
};

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
export default MenuTop;
