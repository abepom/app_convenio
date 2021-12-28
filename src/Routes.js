import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import Login from "./Screens/Login";
import Load from "./Screens/Load";
import Inicio from "./Screens/Inicio";
import CadastrarVenda from "./Screens/CadastrarVenda";
import RestartPass from "./Screens/RestartPass";
import { createDrawerNavigator } from "react-navigation-drawer";
import Sair from "./Screens/Sair";
import ConsultarCartao from "./Screens/ConsultarCartao";
import Endereco from "./Screens/Enderecos";
import Perfil from "./Screens/Perfil";
import Procedimentos from "./Screens/Procedimentos";
import Drawer from "./components/Drawer";
import { primary, white } from "./utils/Style";
import ItemDrawer from "./components/ItemDrawer";
import imagem from "./utils/imagens";
import EfetuarVenda from "./Screens/EfetuarVenda";
import { createStackNavigator } from "react-navigation-stack";
import ConsultarVendas from "./Screens/ConsultarVendas";
import Avaliacao from "./Screens/Avaliacoes";
import RepassesFuturos from "./Screens/RepassesFuturos";
import TermoAdasao from "./Screens/TermoAdasao";
import AdministrarUsuarios from "./Screens/AdministrarUsuarios";
import Update from "./Screens/Update";
import Notificacoes from "./Screens/Notificacoes";
import Icone from "@expo/vector-icons/MaterialCommunityIcons";
import Prontuarios from "./Screens/Prontuarios";

const venda = createStackNavigator(
	{
		EfetuarVenda,
		CadastrarVenda: {
			screen: CadastrarVenda,
			navigationOptions: {
				headerShown: false,
				title: "Lançar",
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
			headerTitleAlign: "center",
			headerTitleStyle: { color: "white" },
			headerStyle: { backgroundColor: primary },
			headerBackTitleVisible: false,
			headerTintColor: "white",
		},
	}
);

const App = createDrawerNavigator(
	{
		Start: {
			screen: Inicio,

			navigationOptions: {
				drawerIcon: (props) => <ItemDrawer {...props} icone={imagem.abepom} />,
				drawerLabel: "ABEPOM",
			},
		},
		ConsultarCartao: {
			screen: ConsultarCartao,
			params: { open: new Date().toJSON() },

			navigationOptions: {
				drawerIcon: (props) => <ItemDrawer {...props} icone={imagem.pay} />,
				drawerLabel: () => {
					return "Consultar Cartão";
				},
			},
		},

		Lancar: {
			screen: venda,
			params: { open: new Date().toJSON() },
			navigationOptions: {
				drawerIcon: (props) => {
					return <ItemDrawer {...props} icone={imagem.money} />;
				},
				drawerLabel: () => {
					return "Lançar";
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
					return "Consultar";
				},
			},
		},
		Prontuarios: {
			screen: Prontuarios,
			navigationOptions: {
				drawerLabel: () => "Consultar Prontuários",
				drawerIcon: (props) => <ItemDrawer {...props} icone={imagem.paper} />,
				drawerLabel: "Prontuários",
			},
		},
		Avaliacao: {
			screen: Avaliacao,
			navigationOptions: {
				drawerLabel: () => "Perfil",
				drawerIcon: (props) => <ItemDrawer {...props} icone={imagem.review} />,
				drawerLabel: "Avaliações",
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
				drawerLabel: () => "Perfil",
				drawerIcon: (props) => (
					<ItemDrawer {...props} icone={imagem.portfolio} />
				),
				drawerLabel: "Perfil",
			},
		},

		RepassesFuturos: {
			screen: RepassesFuturos,
			navigationOptions: {
				drawerIcon: (props) => (
					<ItemDrawer {...props} icone={imagem.statistics} />
				),
				drawerLabel: "Repasses",
			},
		},
		Notificacoes: {
			screen: Notificacoes,
			navigationOptions: {
				drawerIcon: (props) => (
					<Icone
						style={{ color: primary }}
						name={"message-text-outline"}
						size={27}
					/>
				),
				drawerLabel: "Notificacões",
			},
		},
		AdministrarUsuarios: {
			screen: AdministrarUsuarios,
			navigationOptions: {
				drawerIcon: (props) => <ItemDrawer {...props} icone={imagem.add} />,
				drawerLabel: "Administrar Usuários",
			},
		},
		Procedimentos: {
			screen: Procedimentos,
			params: { open: new Date().toJSON() },
			navigationOptions: {
				drawerIcon: (props) => {
					return <ItemDrawer {...props} icone={imagem.list} />;
				},
				drawerLabel: () => {
					return "Procedimentos";
				},
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
				drawerLabel: "Termo de utilização",
			},
		},
	},
	{
		initialRouteName: "Start",
		contentComponent: (props) => {
			return <Drawer {...props} />;
		},
		drawerType: "slide",
		drawerBackgroundColor: "#f1f1f1",
		edgeWidth: 200,
		contentOptions: {
			activeTintColor: white,
			activeBackgroundColor: primary,
			inactiveTintColor: primary,
		},
		defaultNavigationOption: {
			drawerLabel: () => null,
		},
	}
);

const Routes = createAppContainer(
	createSwitchNavigator(
		{
			Update,
			Load,
			Login,
			RestartPass,
			App,
		},
		{
			initialRouteName: "Load",
		}
	)
);

export default Routes;
