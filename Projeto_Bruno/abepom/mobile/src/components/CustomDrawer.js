import React from "react";
import { ScrollView, View, Image, Text } from "react-native";
import { DrawerNavigatorItems } from "react-navigation-drawer";
import styles from "../../assets/stylesheet/Style";

export default props => {
  return (
    <>
      <View style={[styles.linha, styles.usuarioDrawer]}>
        <View style={[styles.centralizado, { flex: 2, paddingLeft: 10 }]}>
          <Image
            source={{
              uri: "https://avatars0.githubusercontent.com/u/59888303?s=460&v=4"
            }}
            style={styles.imagemPerfilDrawer}
          />
        </View>
        <View style={{ flex: 5 }}>
          <Text style={{ fontWeight: "bold" }}>
            Bruno Fernandes da Silva Pereira Neves
          </Text>
          <Text style={{ fontSize: 12 }}>CARTÃO: 00395900001</Text>
        </View>
      </View>
      <ScrollView>
        <DrawerNavigatorItems
          {...props}
          itemsContainerStyle={{ width: "100%", top: 0, marginTop: -5 }}
        />
      </ScrollView>
    </>
  );
};
