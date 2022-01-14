import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import styles, { danger, primary } from "../utils/Style";
import useConvenio from "../Data/Convenio";
import imagens from "../utils/imagens";
import SelecionarAreasModal from "./Modal/SelecionarAreas.modal";
import { useStore } from "../Data/store";

// import { Container } from './styles';

const Perfil = (props) => {
  const [convenio] = useConvenio();
  const [, setStore] = useStore();
  const [modalAreas, setModalAreas] = useState(false);

  return (
    <View style={style.drawer}>
      <SelecionarAreasModal
        visible={[modalAreas, setModalAreas]}
        areas={convenio.areas}
      />
      <View style={{ flexDirection: "row", margin: 20 }}>
        <View style={{ marginHorizontal: 10 }}>
          {convenio.caminho_logomarca ? (
            <>
              <View style={{ elevation: 4, zIndex: 10 }}>
                <Image
                  source={{ uri: convenio.caminho_logomarca }}
                  style={[
                    styles.logoPP,
                    { resizeMode: "contain", borderRadius: 200 },
                  ]}
                />
              </View>
            </>
          ) : (
            <View
              style={{
                borderWidth: 2,
                borderColor: primary,
                borderRadius: 50,
                padding: 10,
                elevation: 4,
                zIndex: 10,
              }}
            >
              <Image
                source={imagens.camera}
                style={[
                  styles.logoPP,
                  { tintColor: primary, resizeMode: "contain" },
                ]}
              />
            </View>
          )}
        </View>
        <View style={{ marginHorizontal: 10, maxWidth: "60%" }}>
          <Text
            style={{
              color: primary,
              fontWeight: "bold",
              elevation: 4,
              zIndex: 10,
            }}
          >
            {[convenio.nome_parceiro]}
          </Text>
          <Text
            style={{
              fontSize: 10,
              color: primary,
              fontWeight: "bold",
              elevation: 4,
              zIndex: 10,
            }}
          >
            {convenio.doc != ""
              ? convenio.doc.length > 15
                ? `CNPJ: ${convenio.doc}`
                : `CPF: ${convenio.doc}`
              : ""}
          </Text>
          {convenio.trocar_area ? (
            <TouchableOpacity
              onPress={() => {
                setModalAreas(true);
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  color: primary,
                  fontWeight: "bold",
                  elevation: 4,
                  zIndex: 10,
                }}
              >
                {convenio.nome_area}{" "}
                <Image
                  source={imagens.loop}
                  style={{ width: 10, height: 10 }}
                />
              </Text>
            </TouchableOpacity>
          ) : (
            <Text
              style={{
                fontSize: 10,
                color: primary,
                fontWeight: "bold",
                elevation: 4,
                zIndex: 10,
              }}
            >
              {convenio.nome_area}
            </Text>
          )}
        </View>
      </View>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <TouchableOpacity
        onPress={() => {
          props.navigation.reset({
            index: 0,
            routes: [{ name: "AcessoConvenio" }],
          });
          props.navigation.navigate("AcessoConvenio", { deslogar: true });
        }}
        style={{
          height: 50,
          backgroundColor: danger,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white" }}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Perfil;

const style = StyleSheet.create({
  drawer: {
    flex: 1,
    backgroundColor: "#f1f1f1",
  },
});
