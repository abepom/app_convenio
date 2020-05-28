import React from 'react';
import {TouchableOpacity, Modal, Text, StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const icone = props => {
  return (
    <>
      <TouchableOpacity onPress={() => props.func()}>
        <Icon {...props} />
      </TouchableOpacity>
    </>
  );
};

const Styles = StyleSheet.create({
  modal: {
    height: 100,
    width: 100,
    backgroundColor: 'blue',
  },
});

export default icone;
