import React from 'react';
import {View, Text, TextInput} from 'react-native';

export default function ImputText(props) {
  return (
    <View>
      <Text style={{marginHorizontal: '7%', marginTop: 20, marginBottom: 5}}>
        {props.placeholder}
      </Text>
      <TextInput
        style={{
          backgroundColor: '#ddd',
          borderRadius: 5,
          marginHorizontal: '5%',
        }}
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder={props.placeholder}
      />
    </View>
  );
}
