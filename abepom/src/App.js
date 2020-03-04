import React, {useState} from 'react';
import {StatusBar, SafeAreaView} from 'react-native';
import Routes from './routes';
import {primaryBack} from './utils/Style';

const App = () => {
  const [state, setState] = useState({selecao: ''});
  console.disableYellowBox = true;
  return (
    <>
      <StatusBar backgroundColor={primaryBack} barStyle="light-content" />
      <Routes state={state} setState={setState} />
    </>
  );
};

export default App;
