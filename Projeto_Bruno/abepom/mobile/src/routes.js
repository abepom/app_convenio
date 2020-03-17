import React from "react";
import { Dimensions } from "react-native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createDrawerNavigator } from "react-navigation-drawer";
import { createStackNavigator } from 'react-navigation-stack';
import CustomDrawer from "./components/CustomDrawer";
import Inicio from "./pages/Inicio";
import Mapa from "./pages/Mapa";
import DetalhesConvenio from "./pages/DetalhesConvenio";
import ListarGrupos from "./pages/ListarGrupos";
import ListarSubgrupos from './pages/ListarSubgrupos';
import ListarAreas from "./pages/ListarAreas";
import ListarConvenios from "./pages/ListarConvenios";
import BuscaLivre from "./pages/BuscaLivre";
import SugerirConvenios from "./pages/SugerirConvenios";
import ConveniosSugeridos from "./pages/ConveniosSugeridos";
import ConsultarDescontos from "./pages/ConsultarDescontos";
import DescontosEspecificos from "./pages/DescontosEspecificos";
import DescontosFuturos from "./pages/DescontosFuturos";
import Dependentes from "./pages/Dependentes";
import LiberarPermissao from "./pages/LiberarPermissao";
import Cartao from "./pages/Cartao";
import BeneficiosServicos from "./pages/BeneficiosServicos";
import SolicitarAuxilio from "./pages/SolicitarAuxilio";
import Notificacoes from "./pages/Notificacoes";
import Perfil from "./pages/Perfil";
import Sair from "./pages/Sair";
import Login from "./pages/Login";
import Esqueceu from "./pages/Esqueceu";
import ItemDrawer from "./components/ItemDrawer";
import imagens from "./utils/imagens";

const StackPesquisarConvenios = createStackNavigator({
	ListarGrupos,
	ListarSubgrupos,
	ListarAreas,
	ListarConvenios,
	BuscaLivre
}, {
	defaultNavigationOptions: {
		animationEnabled: false,
		headerShown: false
	}
});

const MenuDrawer = createDrawerNavigator(
	{

		Inicio: {
			screen: Inicio,
			navigationOptions: {
				drawerLabel: "ABEPOM Mobile",
				drawerIcon: props => <ItemDrawer imagem={imagens.abepom} {...props} />
			}
		},
		Mapa: {
			screen: Mapa,
			navigationOptions: {
				drawerLabel: "Convênios por Localização",
				drawerIcon: props => (
					<ItemDrawer imagem={imagens.mapa_convenios} {...props} />
				)
			}
		},
		PesquisarConvenios: {
			screen: StackPesquisarConvenios,
			navigationOptions: {
				drawerLabel: "Convênios por Área",
				drawerIcon: props => <ItemDrawer imagem={imagens.buscar} {...props} />
			}
		},
		SugerirConvenios: {
			screen: SugerirConvenios,
			navigationOptions: {
				drawerLabel: "Sugerir Convênios",
				drawerIcon: props => (
					<ItemDrawer imagem={imagens.sugerir_convenios} {...props} />
				)
			}
		},
		ConsultarDescontos: {
			screen: ConsultarDescontos,
			navigationOptions: {
				drawerLabel: "Consultar Descontos",
				drawerIcon: props => (
					<ItemDrawer imagem={imagens.descontos} {...props} />
				)
			}
		},
		Notificacoes: {
			screen: Notificacoes,
			navigationOptions: {
				drawerLabel: "Notificações",
				drawerIcon: props => (
					<ItemDrawer imagem={imagens.notificacao} {...props} />
				)
			}
		},
		Perfil: {
			screen: Perfil,
			navigationOptions: {
				drawerLabel: "Perfil",
				drawerIcon: props => <ItemDrawer imagem={imagens.perfil} {...props} />
			}
		},
		Sair: {
			screen: Sair,
			navigationOptions: {
				drawerLabel: "Sair",
				drawerIcon: props => <ItemDrawer imagem={imagens.sair} {...props} />
			}
		},
		BeneficiosServicos,
		DescontosEspecificos,
		DescontosFuturos,
		Dependentes,
		LiberarPermissao,
		Cartao,
		ConveniosSugeridos,
		DetalhesConvenio
	},
	{
		contentComponent: props => <CustomDrawer {...props} />,
		edgeWidth: Dimensions.get("screen").width,
		drawerType: "slide",
		drawerWidth: "80%",
		contentOptions: {
			activeTintColor: "#fff",
			activeBackgroundColor: "#04254e",
			inactiveTintColor: "#04254e"
		},
		defaultNavigationOptions: {
			drawerLabel: () => null
		}
	}
);

const Routes = createSwitchNavigator({
	Routes: {
		screen: MenuDrawer
	},
	Login: {
		screen: Login,
		navigationOptions: {
			headerShown: false
		}
	},
	Esqueceu: {
		screen: Esqueceu,
		navigationOptions: {
			headerShown: false,
			headerBackTitle: null
		}
	}
});

export default createAppContainer(Routes);
