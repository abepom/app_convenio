import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import MenuTop from '../components/MenuTop';
import getUsuario from '../utils/getUsuario';

const ListarAtendimento = props => {
  console.log(props);
  const [state, setstate] = useState({});
  useEffect(() => {
    getUsuario('convenio').then(convenio => console.log(setstate(convenio)));
  }, []);
  return (
    <MenuTop {...props} title="Lista de Atendimentos ">
      <Text>{state.id_gds}</Text>
    </MenuTop>
  );
};

export default ListarAtendimento;
