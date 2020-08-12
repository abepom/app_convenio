import React from 'react';
import {View, Text} from 'react-native';
import MenuTop from './../components/MenuTop';

export default function RepassesRealizados(props) {
  return (
    <>
      <MenuTop
        drawer
        {...props}
        title={'Repasses Realizados'}
        header={
          <View style={{width: '80%', alignItems: 'center'}}>
            <Text>Header</Text>
          </View>
        }>
        <Text>Corpo</Text>
      </MenuTop>
    </>
  );
}
