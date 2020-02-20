import React, {useState} from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import Login from './telas/Login';
import Load from './telas/Load';
import Home from './telas/Home';
import RestartPass from './telas/RestartPass';
//import {createStackNavigator} from 'react-navigation-stack';
import {createDrawerNavigator} from 'react-navigation-drawer';
import Sair from './telas/Sair';
import DadosGerais from './telas/DadosGerais';
import {primary} from './utils/Style';
import ConsultarCartao from './telas/ConsultarCartao';
import Endereco from './telas/Enderecos';
const App = createDrawerNavigator(
  {
    Home,
    ConsultarCartao,
    Endereco,
    DadosGerais,
    Sair,
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
      App,
    },
    {
      initialRouteName: 'Load',
    },
  ),
);

export default Routes;
