require('react-native').unstable_enableLogBox();
import React from 'react';
import {AppRegistry} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './src/App';
import {name as appName} from './app.json';

import {StorePrivider} from './store';
//import Carregando from './src/components/Carregando';
import useNotificacao from './Store/Notificacoes';

function HeadlessCheck({isHeadless}) {
  messaging().setAutoInitEnabled(true);
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }

  //return <Carregando />;

  return (
    <StorePrivider>
      <App />
    </StorePrivider>
  );
}
AppRegistry.registerComponent(appName, () => HeadlessCheck);
