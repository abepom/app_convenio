import React from 'react';
import Icone from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../utils/Style';

const ItemDrawer = props => {
  return (
    <Icone
      name={props.name}
      color={props.focused ? 'white' : props.tintColor}
      size={28}
      style={styles.itemDrawer}
    />
  );
};

export default ItemDrawer;
