import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import MenuTop from '../components/MenuTop';

export default props => {
  const [state, setstate] = useState({});
  useEffect(() => {
    getUsuario('convenio').then(convenio => console.log(setstate(convenio)));
  }, []);
  return (
    <MenuTop {...props} drawer title="Efetuar Vendas">
      <View>
        <Text>{state.id_gds}</Text>
      </View>
    </MenuTop>
  );
};
