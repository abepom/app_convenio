import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { primary, background } from '../utils/Style';
import Icone from 'react-native-vector-icons/MaterialCommunityIcons';
import icone from '../assets/img/abepom.png';
const MenuTop = props => {
  const [itensconfig, setitensconfig] = React.useState(false);
  const { children, iconeConfig, drawer, noIcons } = props;

  let iconemenu;
  let _press;
  const _handlerOpemConfig = () => {
    itensconfig ? setitensconfig(false) : setitensconfig(true);
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

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity style={styles.menu} onPress={() => _press()}>
          <Icone style={styles.configItem} name={iconemenu} size={28} />
        </TouchableOpacity>
        <Image
          source={icone}
          style={{ width: 40, height: 40, marginHorizontal: 10 }}
        />
        <Text style={styles.titulo}>{props.title}</Text>
        {!noIcons ? (
          <TouchableOpacity
            style={styles.config}
            onPress={() => _handlerOpemConfig()}>
            <Icone style={styles.configItem} name={iconeConfig} size={28} />
          </TouchableOpacity>
        ) : null}
      </View>
      {props.header && (
        <View style={{ alignItems: 'center', paddingBottom: 20, backgroundColor: background }}>
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
  titulo: {
    fontSize: 20,
    color: 'white',
  },
});
export default MenuTop;
