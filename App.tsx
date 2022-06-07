import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {withIAPContext} from 'react-native-iap';
import PushNotification, {Importance} from 'react-native-push-notification';

// custom
import {Persistor, Store} from './src/store';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Container from './Container';
import {Alert} from 'react-native';
import Constants from './src/config/Constants';

Icon.loadFont();

const App = () => {
  return (
    <Provider store={Store}>
      <PersistGate loading={null} persistor={Persistor}>
        <Container />
      </PersistGate>
    </Provider>
  );
};

export default withIAPContext(App);
