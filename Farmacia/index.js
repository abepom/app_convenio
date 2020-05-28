import React from 'react'
import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './src/App';
import { name as appName } from './app.json';
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
});
import { StorePrivider } from './store'

function HeadlessCheck({ isHeadless }) {
    if (isHeadless) {

        // App has been launched in the background by iOS, ignore
        return null;
    }

    return (<StorePrivider>
        <App />
    </StorePrivider>)
}
AppRegistry.registerComponent(appName, () => HeadlessCheck);
