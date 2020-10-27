/* https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import {StatusBar, View} from 'react-native';

import messaging, {firebase} from '@react-native-firebase/messaging';
import Routes from './Routes';
import {primary} from './utils/Style';

const App = () => {
  async function registerAppWithFCM() {
    await messaging().registerDeviceForRemoteMessages();
  }
  async function requestUserPermission() {
    const settings = await messaging().requestPermission();
    if (settings) {
      console.log('Permission settings:', settings);
    }
  }
  useEffect(() => {
    firebase
      .messaging()
      .hasPermission()
      .then((enabled) => {
        if (!enabled) {
          requestUserPermission();
        }
      })
      .catch(console.log);
    registerAppWithFCM();
  }, []);

  return (
    <>
      <View style={{flex: 1}}>
        <StatusBar backgroundColor={primary} barStyle="light-content" />
        <Routes />
      </View>
    </>
  );
};

export default App;
