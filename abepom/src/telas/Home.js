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
import FA from 'react-native-vector-icons/FontAwesome';
import FA5 from 'react-native-vector-icons/FontAwesome5';
import MenuTop from '../components/MenuTop';

export default props => {
  const [convenio, setConvenio] = useState(props.navigation.state.params);

  return (
    <MenuTop drawer title="ABEPOM" {...props}>
      <View style={{width: '100%', backgroundColor: primary}}>
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
          <TouchableOpacity
            style={styles.itemMenu}
            onPress={() => {
              alert('listar usuarios atendidos');
            }}>
            <FA
              name="list-ul"
              size={30}
              style={{alignSelf: 'center'}}
              color={primaryBack}
            />
            <Text style={styles.textMenu}>Listar Atendimentos</Text>
          </TouchableOpacity>
        </View>

        {convenio.efetuarVenda && (
          <View style={styles.linhaMenu}>
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
            <TouchableOpacity
              style={[styles.itemMenu, {backgroundColor: sucessBack}]}
              onPress={() => alert('consultar Vendas')}>
              <FA5
                name="cash-register"
                size={30}
                style={{alignSelf: 'center'}}
                color={sucess}
              />
              <Text style={[styles.textMenu, {color: sucess}]}>
                Consultar Vendas
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.linhaMenu}>
          <TouchableOpacity
            style={styles.itemMenu}
            onPress={() => {
              alert('Perfil');
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
            onPress={() => alert('endereço')}>
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
