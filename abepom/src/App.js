import React, {useState} from 'react';
import {StatusBar, SafeAreaView} from 'react-native';
import Routes from './Routes';
import {primaryBack} from './utils/Style';

const App = () => {
  console.disableYellowBox = true;
  return (
    <>
      <StatusBar backgroundColor={primaryBack} barStyle="light-content" />
      <Routes />
    </>
  );
};

export default App;
