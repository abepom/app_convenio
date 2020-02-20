import React, {useRef, useEffect, useState} from 'react';
import {View, Text, TextInput} from 'react-native';
import {white} from '../utils/Style';

export default function ImputText(props) {
  return (
    <View>
      <Text
        style={{
          marginHorizontal: '7%',
          color: white,
          marginTop: 20,
          marginBottom: 5,
        }}>
        {props.placeholder}
      </Text>
      <TextInput
        style={[
          {
            backgroundColor: '#ddd',
            borderRadius: 5,
            marginHorizontal: '5%',
          },
          props.required &&
            !props.value && {borderColor: '#f00', borderWidth: 1},
        ]}
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder={props.placeholder}
      />
      {props.required && !props.value && (
        <Text
          style={{
            marginHorizontal: '7%',
            marginBottom: 5,
            color: '#f00',
            fontSize: 10,
          }}>
          Campo é obrigatório
        </Text>
      )}
    </View>
  );
}
