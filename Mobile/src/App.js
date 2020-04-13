import React, { useEffect, useState } from 'react';
import { StatusBar, View, Text, ToastAndroid, Alert } from 'react-native';
import { tou } from 'react-native-paper'
import messaging, { firebase } from '@react-native-firebase/messaging';
import setUsuario from './utils/setUsuario';
import Routes from './Routes';
import { primary } from './utils/Style';


const App = () => {
  console.log('renderizou')

  const [state, setstate] = useState(null)
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

      }
    }).catch(console.log)
    registerAppWithFCM()
    firebase.messaging().onNotificationOpenedApp(not => {

      alert('notificacao')
    })

  }, [])
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      setUsuario('notificacao', remoteMessage.data)
      console.log(remoteMessage)
      setstate(remoteMessage.data.tela)
      Alert.alert(remoteMessage.notification.title, `${remoteMessage.notification.body} parametro:${remoteMessage.data.tela}`, [
        { text: 'visualizar', onPress: () => { } },
        { text: 'OK', onPress: () => { } },
      ]);
    });

    return unsubscribe;
  }, []);


  return (
    <>
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor={primary} barStyle="light-content" />





        <Routes notificacao={state} />
      </View>
    </>
  );
};

export default App;
