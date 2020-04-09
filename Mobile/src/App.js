import React, { useEffect } from 'react';
import { StatusBar, View, Text, ToastAndroid, Alert } from 'react-native';
import { tou } from 'react-native-paper'
import messaging, { firebase } from '@react-native-firebase/messaging';
import setUsuario from './utils/setUsuario';
import Routes from './Routes';
import { primary } from './utils/Style';


const App = () => {

  async function registerAppWithFCM() {
    const data = await messaging().registerDeviceForRemoteMessages();
    console.log(data)
  }
  async function requestUserPermission() {
    const settings = await messaging().requestPermission();

    if (settings) {
      console.log('Permission settings:', settings);
    }
  }

  useEffect(() => {
    firebase.messaging().hasPermission().then(enabled => {
      if (!enabled) {
        requestUserPermission()
        console.log('teste')
      }
    }).catch(console.log)
    registerAppWithFCM()
    firebase.messaging().onNotificationOpenedApp(not => {
      console.log(not, 'notificaçao')
      alert('notificacao')
    })

  }, [])
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      setUsuario('notificacao', remoteMessage.data)
      console.log(remoteMessage)
      Alert.alert(remoteMessage.notification.title, `${remoteMessage.notification.body} parametro:${remoteMessage.data.tela}`, [

        { text: 'OK', onPress: () => { } },
      ]);
    });

    return unsubscribe;
  }, []);


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
