import React from 'react';
import { StatusBar, View, Text } from 'react-native';
import Routes from './Routes';
import { primary } from './utils/Style';

const App = () => {
  //console.disableYellowBox = true;
  return (
    <>
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor={primary} barStyle="light-content" />

        <Routes />
      </View>
    </>
  );
};

export default App;
