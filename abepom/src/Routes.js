import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createDrawerNavigator } from "react-navigation-drawer";

import Load from "./pages/Load";
import Login from "./pages/Login";
import Main from "./pages/Main";

const drawer = createDrawerNavigator(
  {
    Main: {
      screen: Main,
      params: { teste: "sim" }
    }
  },
  {
    initialRouteName: "Main"
  }
);

const Routes = createAppContainer(
  createSwitchNavigator(
    {
      Load,
      Login,
      drawer
    },
    {
      initialRouteName: "Load"
    }
  )
);

export default Routes;
