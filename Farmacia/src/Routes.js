import React, {useEffect} from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import Login from './telas/Login';
import Load from './telas/Load';
import Home from './telas/Home';
import CadastrarVenda from './telas/CadastrarVenda';
import RestartPass from './telas/RestartPass';

import {createDrawerNavigator} from 'react-navigation-drawer';
import Sair from './telas/Sair';
import Trocar from './telas/Trocar';

import ConsultarCartao from './telas/ConsultarCartao';
import Endereco from './telas/Enderecos';
import Perfil from './telas/Perfil';
import Drawer from './components/Drawer';
import {primary, white} from './utils/Style';
import ItemDrawer from './components/ItemDrawer';
import imagem from './utils/imagens';
import EfetuarVenda from './telas/EfetuarVenda';
import {createStackNavigator} from 'react-navigation-stack';
import ConsultarVendas from './telas/ConsultarVendas';
import Avaliacao from './telas/Avaliacoes';
import Administrador from './telas/Administrador';

import RepassesFuturos from './telas/RepassesFuturos';
import Notificacoes from './telas/Notificacoes';
import TermoAdasao from './telas/TermoAdasao';
import AdministrarUsuarios from './telas/AdministrarUsuarios';

const venda = createStackNavigator(
  {
    EfetuarVenda,
    CadastrarVenda: {
      screen: CadastrarVenda,
      navigationOptions: {
        headerShown: false,
        title: 'Cadastrar Venda',
        headerTruncatedBackTitle: (props) => (
          <ItemDrawer {...props} icone={imagem.abepom} />
        ),
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
        drawerIcon: (props) => <ItemDrawer {...props} icone={imagem.abepom} />,
        drawerLabel: 'ABEPOM',
      },
    },
    Notificacoes: {
      screen: Notificacoes,
      navigationOptions: {
        drawerIcon: (props) => <ItemDrawer {...props} icone={imagem.bell} />,
        drawerLabel: 'Mensagens',
      },
    },
    ConsultarCartao: {
      screen: ConsultarCartao,
      navigationOptions: {
        drawerIcon: (props) => <ItemDrawer {...props} icone={imagem.pay} />,
        drawerLabel: () => {
          return 'Consultar Cartão';
        },
      },
    },

    EfetuarVenda: {
      screen: venda,
      navigationOptions: {
        drawerIcon: (props) => {
          return <ItemDrawer {...props} icone={imagem.money} />;
        },
        drawerLabel: () => {
          return 'Efetuar Vendas';
        },
      },
    },
    ConsultarVendas: {
      screen: ConsultarVendas,
      navigationOptions: {
        drawerIcon: (props) => {
          return <ItemDrawer {...props} icone={imagem.bill} />;
        },
        drawerLabel: () => {
          return 'Consultar Vendas';
        },
      },
    },
    Avaliacao: {
      screen: Avaliacao,
      navigationOptions: {
        drawerLabel: () => 'Perfil',
        drawerIcon: (props) => <ItemDrawer {...props} icone={imagem.review} />,
        drawerLabel: 'Avaliações',
      },
    },
    Endereco: {
      screen: Endereco,
      navigationOptions: {
        drawerLabel: () => null,
      },
    },
    Perfil: {
      screen: Perfil,

      navigationOptions: {
        drawerLabel: () => 'Perfil',
        drawerIcon: (props) => (
          <ItemDrawer {...props} icone={imagem.portfolio} />
        ),
        drawerLabel: 'Perfil',
      },
    },
    Trocar: {
      screen: Trocar,
      navigationOptions: {
        drawerIcon: (props) => <ItemDrawer {...props} icone={imagem.contact} />,
        drawerLabel: 'Trocar Farmácia',
      },
    },
    RepassesFuturos: {
      screen: RepassesFuturos,
      navigationOptions: {
        drawerIcon: (props) => (
          <ItemDrawer {...props} icone={imagem.statistics} />
        ),
        drawerLabel: 'Repasses Futuros',
      },
    },
    AdministrarUsuarios: {
      screen: AdministrarUsuarios,
      navigationOptions: {
        drawerIcon: (props) => <ItemDrawer {...props} icone={imagem.add} />,
        drawerLabel: 'Administrar Usuários',
      },
    },
    Sair: {
      screen: Sair,
      navigationOptions: {
        drawerIcon: (props) => <ItemDrawer {...props} icone={imagem.off} />,
      },
    },
    TermoAdasao: {
      screen: TermoAdasao,
      navigationOptions: {
        drawerIcon: (props) => <ItemDrawer {...props} icone={imagem.paper} />,
        drawerLabel: 'Termo de utilização',
      },
    },
  },
  {
    initialRouteName: 'Home',
    contentComponent: (props) => {
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
      Administrador,
    },
    {
      initialRouteName: 'Load',
    },
  ),
);

export default Routes;
