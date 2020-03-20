import React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import Login from './telas/Login';
import Load from './telas/Load';
import Home from './telas/Home';
import CadastrarVenda from './telas/CadastrarVenda';
import RestartPass from './telas/RestartPass';

import {createDrawerNavigator} from 'react-navigation-drawer';
import Sair from './telas/Sair';

import ConsultarCartao from './telas/ConsultarCartao';
import Endereco from './telas/Enderecos';
import Drawer from './components/Drawer';
import {primary, primaryBack, white} from './utils/Style';
import ItemDrawer from './components/ItemDrawer';
import ListarAtendimento from './telas/ListarAtendimento';
import imagem from './utils/imagens';
import EfetuarVenda from './telas/EfetuarVenda';
import {createStackNavigator} from 'react-navigation-stack';

const venda = createStackNavigator(
  {
    EfetuarVenda,
    CadastrarVenda: {
      screen: CadastrarVenda,
      navigationOptions: {
        headerShown: true,
        title: 'Cadastrar Venda',
      },
    },
  },
  {
    defaultNavigationOptions: {
      animationEnabled: false,
      headerShown: false,

      headerTitleAlign: 'center',
      headerTitleStyle: {color: 'white'},
      headerStyle: {backgroundColor: primary},
      headerBackTitleVisible: false,
      headerTintColor: 'white',
    },
  },
);

const App = createDrawerNavigator(
  {
    Home: {
      screen: Home,

      navigationOptions: {
        drawerIcon: props => <ItemDrawer {...props} icone={imagem.abepom} />,
        drawerLabel: 'ABEPOM',
      },
    },
    ConsultarCartao: {
      screen: ConsultarCartao,
      navigationOptions: {
        drawerIcon: props => <ItemDrawer {...props} icone={imagem.pay} />,
      },
    },
    ListarAtendimento: {
      screen: ListarAtendimento,

      navigationOptions: {
        drawerIcon: props => <ItemDrawer {...props} icone={imagem.list} />,
      },
    },
    EfetuarVenda: {
      screen: venda,

      navigationOptions: {
        drawerIcon: props => {
          return <ItemDrawer {...props} icone={imagem.money} />;
        },
        drawerLabel: () => {
          return 'Efetuar Vendas';
        },
      },
    },
    Endereco: {
      screen: Endereco,
      navigationOptions: {
        drawerLabel: () => null,
      },
    },
    DadosGerais: {
      screen: Endereco,

      navigationOptions: {
        drawerLabel: () => null,
        // drawerIcon: props => (
        //   <ItemDrawer {...props} name="account-card-details-outline" />
        // ),
        // drawerLabel: 'Perfil',
      },
    },
    Sair: {
      screen: Sair,
      navigationOptions: {
        drawerIcon: props => <ItemDrawer {...props} icone={imagem.off} />,
      },
    },
  },
  {
    initialRouteName: 'Home',
    contentComponent: props => {
      return <Drawer {...props} />;
    },
    drawerType: 'slide',
    drawerBackgroundColor: '#f1f1f1',
    edgeWidth: 200,
    contentOptions: {
      activeTintColor: white,
      activeBackgroundColor: primary,
      inactiveTintColor: primary,
    },
    defaultNavigationOption: {
      drawerLabel: () => null,
    },
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