import React from 'react';
import {View, Text, Dimensions} from 'react-native';

const Mensagem = ({mensagem, tipo}) => {
  let fundo;
  switch (tipo) {
    case 'E':
      fundo = '#d33131';
      break;
    case 'A':
      fundo = '#dbcf15';

      break;
    case 'S':
      fundo = '#008f46';

      break;

    default:
      break;
  }

  return (
    <View
      style={{
        backgroundColor: fundo,
        width: Dimensions.get('screen').width * 0.7,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
        borderRadius: 5,
      }}>
      <Text style={{color: '#fff'}}>{mensagem}</Text>
    </View>
  );
};

export default Mensagem;
