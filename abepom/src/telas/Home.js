import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, Image, TouchableOpacity} from 'react-native';
import styles, {
  primary,
  primaryBack,
  white,
  sucessBack,
  sucess,
} from '../utils/Style';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Icone from 'react-native-vector-icons/MaterialCommunityIcons';
import FA from 'react-native-vector-icons/FontAwesome';
import MenuTop from '../components/MenuTop';

export default props => {
  const [state, setstate] = useState({});
  const [convenio, seConvenio] = useState(props.navigation.state.params);

  return (
    <MenuTop drawer title="Home" {...props}>
      <View style={{width: '100%', backgroundColor: primary}}>
        <View style={[styles.row, styles.center, {marginVertical: 20}]}>
          {convenio.caminho_logomarca ? (
            <>
              <Image
                source={{uri: convenio.caminho_logomarca}}
                style={[styles.logoPP]}
              />
            </>
          ) : (
            <EvilIcons name="user" size={70} color="white" />
          )}

          <Text style={{width: 150, marginHorizontal: 20, color: white}}>
            {[convenio.nome_parceiro]}
          </Text>
        </View>
        <View style={styles.linhaMenu}>
          <TouchableOpacity
            style={styles.itemMenu}
            onPress={() => props.navigation.navigate('ConsultarCartao')}>
            <EvilIcons
              name="credit-card"
              size={30}
              style={{alignSelf: 'center'}}
              color={primaryBack}
            />
            <Text style={styles.textMenu}>Consultar Cartao</Text>
          </TouchableOpacity>
          {convenio.efetuarVenda && (
            <TouchableOpacity
              style={[styles.itemMenu, {backgroundColor: sucessBack}]}
              onPress={() => alert('foi para efetuar vendas')}>
              <FA
                name="dollar"
                size={30}
                style={{alignSelf: 'center'}}
                color={sucess}
              />
              <Text style={[styles.textMenu, {color: sucess}]}>
                Efetuar Venda
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={[styles.linhaMenu, {justifyContent: 'center'}]}></View>
        <View style={styles.linhaMenu}>
          <TouchableOpacity
            style={styles.itemMenu}
            onPress={() => {
              console.log(convenio);
              props.navigation.navigate('DadosGerais', convenio);
            }}>
            <FA
              name="id-card"
              size={30}
              style={{alignSelf: 'center'}}
              color={primaryBack}
            />
            <Text style={styles.textMenu}>Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.itemMenu}
            onPress={() => props.navigation.navigate('Endereco', convenio)}>
            <FA
              name="map-marker"
              size={30}
              style={{alignSelf: 'center'}}
              color={primaryBack}
            />
            <Text style={styles.textMenu}>Endereço</Text>
          </TouchableOpacity>
        </View>
      </View>
    </MenuTop>
  );
};
