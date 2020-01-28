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
import RestartPass from './telas/RestartPass';
import Mapa from './telas/Mapa';
import teste from './telas/testes';
import DadosGerais from './telas/DadosGerais';
const drawer = createDrawerNavigator(
  {
    Home,
    DadosGerais: {
      screen: DadosGerais,
      navigationOptions: {title: 'Dados Gerais'},
    },
    Sair: Login,
  },
  {
    initialRouteName: 'Home',
  },
);

const Routes = createAppContainer(
  createSwitchNavigator(
    {
      Load,
      Login,
      RestartPass,
      drawer,
      teste,
    },
    {
      initialRouteName: 'Load',
    },
  ),
);

export default Routes;
