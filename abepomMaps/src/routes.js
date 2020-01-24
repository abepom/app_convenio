import React from 'react';

import {
  createAppContainer,
  createSwitchNavigator,
  naviga,
} from 'react-navigation';

import {createDrawerNavigator} from 'react-navigation-drawer';
import Login from './telas/Login';
import Load from './telas/Load';
import Home from './telas/Home';
import ConveniosProximos from './telas/ConveniosProximos';
import RestartPass from './telas/RestartPass';
import Mapa from './telas/Mapa';

const drawer = createDrawerNavigator(
  {
    Home,
    RestartPass,
    Sair: Login,
  },
  {
    initialRouteName: 'Home',
  },
);

const Routes = createAppContainer(
  createSwitchNavigator(
    {
      Mapa,
      Load,
      Login,
      RestartPass,
      drawer,
      ConveniosProximos,
    },
    {
      initialRouteName: 'Mapa',
    },
  ),
);

export default Routes;
