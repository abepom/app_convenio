import React from 'react';
import {View, Text} from 'react-native';
import {
  sucess,
  sucessBack,
  danger,
  danverBackground,
  alert,
  alertBack,
} from '../utils/Style';

export default props => {
  const {type} = props;
  let backgroundColor;
  let color;

  switch (type) {
    case 'sucess':
      console.log('sucess');
      backgroundColor = sucessBack;
      color = sucess;
      break;
    case 'danger':
      console.log('danger');
      backgroundColor = danverBackground;
      color = danger;
      break;
    case 'warning':
      console.log('warning');
      backgroundColor = alertBack;
      color = alert;
      break;
    case 'info':
      break;

    default:
      backgroundColor = '#fff';
      color = '#000';
      break;
  }

  return (
    <View
      style={{
        backgroundColor: backgroundColor,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
        borderWidth: 2,
        borderRadius: 5,
        borderColor: color,
        margin: 10,
        padding: 10,
      }}>
      <Text style={{color: color}}>{props.mensagem}</Text>
    </View>
  );
};
