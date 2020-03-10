import React from 'react';
import {StatusBar} from 'react-native';
import Routes from './Routes';
import {primary} from './utils/Style';

const App = () => {
  console.disableYellowBox = true;
  return (
    <>
      <StatusBar backgroundColor={primary} barStyle="light-content" />
      <Routes teste={'teste'} />
    </>
  );
};

export default App;
