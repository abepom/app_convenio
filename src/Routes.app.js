import * as React from "react";
import { Button, Image, Platform, StyleSheet, View } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Principal from "./Pages/Principal";
import ConsultarCartao from "./Pages/ConsultarCartao";
import icone from "./../assets/img/abepom.png";

import { primary } from "./utils/Style";
import PerfilDrawer from "./Components/Perfil";
import Perfil from "./Pages/Perfil";

import useConvenio from "./Data/Convenio";
import imagens from "./utils/imagens";
import RoutesLancamento from "./Routes.lancamento";
import ConsultarVendas from "./Pages/ConsultarVendas";
import Prontuarios from "./Pages/Prontuarios";
import Avaliacoes from "./Pages/Avaliacoes";

import RepassesFuturos from "./Pages/RepassesFuturos";
import Notificacoes from "./Pages/Notificacoes";
import AdministrarUsuarios from "./Pages/AdministrarUsuarios";
import Procedimentos from "./Pages/Procedimentos";
import TermoAdasao from "./Pages/TermoAdasao";

const Drawer = createDrawerNavigator();

export default function () {
  const [convenio] = useConvenio();
  return (
    <Drawer.Navigator
      initialRouteName="Principal"
      drawerContent={(props) => <PerfilDrawer {...props} />}
      screenOptions={{
        lazy: true,
        headerShown: false,
        drawerActiveBackgroundColor: primary,
        drawerActiveTintColor: "white",
        drawerType: Platform.OS == "web" ? "permanent" : "front",
        drawerLabelStyle: {
          marginLeft: -30,
        },
        swipeEnabled: true,
        drawerInactiveTintColor: primary,
        drawerItemStyle: { marginHorizontal: -10, marginVertical: 1 },
      }}
    >
      <Drawer.Screen
        name="Principal"
        component={Principal}
        options={Item(icone, "ABEPOM")}
      />
      <Drawer.Screen
        name="ConsultarCartao"
        component={ConsultarCartao}
        options={Item(imagens.pay, "Consultar Cartão")}
      />
      <Drawer.Screen
        name="Lancar"
        component={RoutesLancamento}
        options={Item(imagens.money, "Lançar")}
      />
      <Drawer.Screen
        name="ConsultarVendas"
        component={ConsultarVendas}
        options={Item(imagens.bill, "Consultar Lançamento")}
      />
      {convenio.tipo_lancamento == 4 && (
        <Drawer.Screen
          name="Prontuarios"
          component={Prontuarios}
          options={Item(imagens.bill, "Prontuarios")}
        />
      )}
      <Drawer.Screen
        name="Avaliacoes"
        component={Avaliacoes}
        options={Item(imagens.review, "Avaliações")}
      />
      <Drawer.Screen
        name="Perfil"
        component={Perfil}
        options={Item(imagens.portfolio, "Perfil")}
      />
      <Drawer.Screen
        name="RepassesFuturos"
        component={RepassesFuturos}
        options={Item(imagens.statistics, "Repasses")}
      />
      <Drawer.Screen
        name="Notificacoes"
        component={Notificacoes}
        options={Item(imagens.comment, "Notificações")}
      />
      {convenio.tipo_lancamento == "5" && (
        <Drawer.Screen
          name="AdministrarUsuarios"
          component={AdministrarUsuarios}
          options={Item(imagens.add, "Administrar Usuários")}
        />
      )}

      {(convenio.tipo_lancamento == "1" ||
        convenio.tipo_lancamento == "2" ||
        convenio.tipo_lancamento == "4") && (
        <Drawer.Screen
          name="Procedimentos"
          component={Procedimentos}
          options={Item(imagens.list, "Procedimentos")}
        />
      )}
      <Drawer.Screen
        name="TermoAdasao"
        component={TermoAdasao}
        options={Item(imagens.paper, "Termo de utilização")}
      />
    </Drawer.Navigator>
  );
}

const Item = (icone, nome) => ({
  drawerLabel: nome,
  drawerIcon: ({ focused }) => (
    <Image
      source={icone}
      style={[styles.icone, { tintColor: !focused ? primary : "white" }]}
    />
  ),
});

const screenOptions = {
  headerShown: false,
  drawerActiveBackgroundColor: primary,
  drawerActiveTintColor: "white",
  drawerType: "front",
  drawerLabelStyle: {
    marginLeft: -30,
  },
  drawerInactiveTintColor: primary,
  drawerItemStyle: { marginHorizontal: -10, marginVertical: 1 },
};

const styles = StyleSheet.create({
  icone: {
    width: 40,
    height: 40,

    marginHorizontal: 10,
  },
});
