import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  SafeAreaView,
} from "react-native";
import styless, { primary, background } from "../utils/Style";
import Icone from "@expo/vector-icons/MaterialCommunityIcons";
import icone from "../../assets/img/abepom.png";

const MenuTop = (props) => {
  const { children, drawer, noIcons, title, funcConfig, btnEsquerdo } = props;
  let iconemenu;
  let _press;
  const _handlerOpemConfig = () => {
    funcConfig ? funcConfig() : null;
  };
  if (!noIcons) {
    if (drawer) {
      iconemenu = "menu";
      _press = () => props.navigation.toggleDrawer();
    } else {
      iconemenu = "chevron-left";

      if (props.irpara) {
        _press = () => {
          props.navigation.navigate(`${props.irpara}`);
        };
      } else {
        _press = () => {
          props.navigation.goBack();
        };
      }
    }
  }

  return (
    <>
      <StatusBar backgroundColor={primary} barStyle="light-content" />
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.menu}
          onPress={() => _press()}
          accessibilityLabel="Voltar"
        >
          <Icone style={styles.configItem} name={iconemenu} size={28} />
        </TouchableOpacity>
        <Image
          source={icone}
          style={{ width: 40, height: 40, marginHorizontal: 10 }}
        />
        <Text style={[styless.textoG, styless.white]}>{title}</Text>
        {btnEsquerdo && (
          <View style={{ position: "absolute", right: 10 }}>
            <Text style={[styless.textoG, styless.white]}>
              {btnEsquerdo && btnEsquerdo}
            </Text>
          </View>
        )}
      </View>
      {props.header && (
        <View
          style={{
            alignItems: "center",
            paddingBottom: 20,
            backgroundColor: background,
          }}
        >
          {props.header}
        </View>
      )}
      <SafeAreaView style={{ flex: 1 }}>
        <>
          <ScrollView
            style={{
              backgroundColor: props.backgroundColor
                ? props.backgroundColor
                : background,
            }}
          >
            <View style={{ alignItems: "center", paddingBottom: 20 }}>
              {children}
            </View>
          </ScrollView>

          {props.footer && (
            <View style={{ alignItems: "center", paddingBottom: 20 }}>
              {props.footer}
            </View>
          )}
        </>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    backgroundColor: primary,
    flexDirection: "row",
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  menu: {
    position: "absolute",
    left: 20,
  },
  menuItem: {
    color: "white",
  },
  config: {
    position: "absolute",
    right: 20,
  },
  configItem: {
    color: "white",
  },
});
export default MenuTop;
