import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles, { primary, sucessBack, sucess, background } from '../utils/Style';

import MenuTop from '../components/MenuTop';
import getUsuario from './../utils/getUsuario';

export default props => {
  const [convenio, setConvenio] = useState({ efetuarVenda: false });

  useEffect(() => {
    getUsuario('convenio').then(user => {
      setConvenio(user);
    });
  }, []);

  return (

    <View style={{ width: '100%', backgroundColor: background }}>
      <View style={styles.linhaMenu}>
        <TouchableOpacity
          style={styles.itemMenu}
          onPress={() =>
            props.navigation.navigate('ConsultarCartao', convenio)
          }>
          <Image
            source={require('../assets/img/pay.png')}
            style={{ width: 40, height: 40 }}
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
            style={{ width: 40, height: 40 }}
            tintColor={primary}
          />
          <Text style={styles.textMenu}>Listar Atendimentos</Text>
        </TouchableOpacity>
      </View>

      {convenio.efetuarVenda && (
        <View style={styles.linhaMenu}>
          <TouchableOpacity
            style={[styles.itemMenu, { backgroundColor: sucessBack }]}
            onPress={() =>
              props.navigation.navigate('EfetuarVenda', convenio)
            }>
            <Image
              source={require('../assets/img/money.png')}
              style={{ width: 40, height: 40 }}
              tintColor={primary}
            />
            <Text style={[styles.textMenu, { color: sucess }]}>
              Efetuar Venda
              </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.itemMenu, { backgroundColor: sucessBack }]}
            onPress={() => props.navigation.navigate('ConsultarVendas', { id_gds: convenio.id_gds })}>
            <Image
              source={require('../assets/img/bill.png')}
              style={{ width: 40, height: 40 }}
              tintColor={primary}
            />
            <Text style={[styles.textMenu, { color: sucess }]}>
              Consultar Vendas
              </Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.linhaMenu}>
        <TouchableOpacity
          style={styles.itemMenu}
          onPress={() => {
            props.navigation.navigate('Perfil', { id_gds: convenio.id_gds })
          }}>
          <Image
            source={require('../assets/img/portfolio.png')}
            style={{ width: 40, height: 40 }}
            tintColor={primary}
          />
          <Text style={styles.textMenu}>Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.itemMenu}
          onPress={() => alert('endereço')}>
          <Image
            source={require('../assets/img/gps.png')}
            style={{ width: 40, height: 40 }}
            tintColor={primary}
          />
          <Text style={styles.textMenu}>Endereço</Text>
        </TouchableOpacity>
      </View>
    </View>

  );
};
