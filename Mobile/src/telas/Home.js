import React, { memo, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Button,
  Dimensions,
} from 'react-native';
import styles, {
  primary,
  sucessBack,
  sucess,
  background,
} from '../utils/Style';
import Icone from 'react-native-vector-icons/MaterialCommunityIcons';
import icone from '../assets/img/abepom.png';
import useConvenio from '../../Store/Convenio';

export default memo(props => {
  const [convenio] = useConvenio();
  // alert(
  //   Dimensions.get('screen').width + '  //  ' + Dimensions.get('window').width,
  // );
  return (
    <View style={{ width: '100%', backgroundColor: background }}>
      <View style={styless.container}>
        <TouchableOpacity
          style={styless.menu}
          onPress={() => props.navigation.toggleDrawer()}>
          <Icone style={styless.configItem} name={'menu'} size={28} />
        </TouchableOpacity>
        <Image
          source={icone}
          style={{ width: 40, height: 40, marginHorizontal: 10 }}
        />
        <Text style={styless.titulo}>ABEPOM</Text>
      </View>
      <View style={styles.linhaMenu}>
        <TouchableOpacity
          style={styles.itemMenu}
          onPress={() =>
            props.navigation.navigate('ConsultarCartao', convenio)
          }>
          <Image
            source={require('../assets/img/pay.png')}
            style={styless.imgMenu}
            tintColor={primary}
          />
          <Text style={styles.textMenu}>Consultar Cartão</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.itemMenu}
          onPress={() => {
            props.navigation.navigate('ListarAtendimento', convenio);
          }}>
          <Image
            source={require('../assets/img/list.png')}
            style={styless.imgMenu}
            tintColor={primary}
          />
          <Text style={styles.textMenu}>Listar Atendimentos</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.linhaMenu}>
        <TouchableOpacity
          style={styles.itemMenu}
          onPress={() => {
            props.navigation.navigate('Perfil', { id_gds: convenio.id_gds });
          }}>
          <Image
            source={require('../assets/img/portfolio.png')}
            style={styless.imgMenu}
            tintColor={primary}
          />
          <Text style={styles.textMenu}>Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.itemMenu}
          onPress={() => {
            props.navigation.navigate('Avaliacao', { id_gds: convenio.id_gds });
          }}>
          <Image
            source={require('../assets/img/review.png')}
            style={styless.imgMenu}
            tintColor={primary}
          />
          <Text style={styles.textMenu}>AVALIAÇÕES</Text>
        </TouchableOpacity>
      </View>
      {/* <Button title='setLoad' onPress={() => setLoad('Avaliacoes')} />
        <Button title='setusurio' onPress={() => { setusurio({ ...conveniado, data: new Date }) }} /> */}
    </View>
  );
});

const styless = StyleSheet.create({
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

  configItem: {
    color: 'white',
  },
  titulo: {
    fontSize: 18,
    color: 'white',
  },
  imgMenu: { width: 40, height: 40 },
});
