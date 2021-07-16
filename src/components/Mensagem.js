import React from 'react';
import {View, Text, Dimensions} from 'react-native';

const Mensagem = ({mensagem, tipo}) => {
  let fundo;
  let texto;
  switch (tipo) {
    case 'E':
      fundo = '#d33131';
      texto = 'white';
      break;
    case 'A':
      fundo = '#dbcf15';
      texto = '#000';

      break;
    case 'S':
      fundo = '#008f46';
      texto = 'white';
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
      <Text style={{color: texto}}>{mensagem}</Text>
    </View>
  );
};

export default Mensagem;
