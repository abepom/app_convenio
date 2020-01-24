import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icone from 'react-native-vector-icons/MaterialCommunityIcons';
import icone from '../assets/img/icon.png';
const MenuTop = props => {
  console.log(props);
  //React.useEffect(() => {}, itensconfig);
  const [itensconfig, setitensconfig] = React.useState(false);
  const {children, iconeConfig, drawer, noIcons} = props;
  console.log(drawer);
  let iconemenu;
  let _press;
  const _handlerOpemConfig = () => {
    itensconfig ? setitensconfig(false) : setitensconfig(true);
    console.log(itensconfig);
  };
  if (!noIcons) {
    if (drawer) {
      iconemenu = 'menu';
      _press = () => props.navigation.toggleDrawer();
    } else {
      iconemenu = 'chevron-left';
      _press = {};
    }
  }

  return (
    <>
      <View style={styles.container}>
        {!noIcons ? (
          <TouchableOpacity style={styles.menu} onPress={_press}>
            <Icone style={styles.configItem} name={iconemenu} size={28} />
          </TouchableOpacity>
        ) : null}

        <Image
          source={icone}
          style={{width: 15, height: 15, marginHorizontal: 10}}
        />
        <Text style={styles.titulo}>{props.title}</Text>
        {/* {!noIcons ? (
          <TouchableOpacity
            style={styles.config}
            onPress={() => _handlerOpemConfig()}>
            <Icone style={styles.configItem} name={iconeConfig} size={28} />
          </TouchableOpacity>
        ) : null} */}
      </View>

      <ScrollView>
        <View style={{alignItems: 'center'}}>{children}</View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    backgroundColor: '#1f4ba4',
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
    color: 'white',
  },
});
export default MenuTop;
