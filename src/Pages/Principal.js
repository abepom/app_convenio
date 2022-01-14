import React, { memo, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  Platform,
} from "react-native";
import styles, { primary, background, danger } from "../utils/Style";
import Icone from "@expo/vector-icons/MaterialCommunityIcons";
import icone from "../../assets/img/abepom.png";
import useConvenio from "../Data/Convenio";
import api from "../api";
import * as Updates from "expo-updates";
import Constants from "expo-constants";
import { WebView } from "react-native-webview";
import Carregando from "../Components/Carregando";
import useUsuario from "../Data/Usuario";
import SelecionarAreasModal from "../Components/Modal/SelecionarAreas.modal";
import app from "../../app.json";
export default (props) => {
  const [convenio, setConv] = useConvenio();
  const [user] = useUsuario();
  const [modal, setModal] = useState(false);
  const [termo, setTermo] = useState({});
  const [modalAreas, setModalAreas] = useState(false);
  const [areas, setAreas] = useState([]);
  useEffect(() => {
    conectar(user);
    if (Constants.isDevice && Platform.OS != "web") {
      Updates.checkForUpdateAsync().then(({ isAvailable }) => {
        if (isAvailable) {
          Updates.fetchUpdateAsync();
          Alert.alert(
            "ATUALIZAÇÃO",
            "O aplicativo ABEPOM Convênios foi atualizado com sucesso.\n\n Recomendamos que reiniciando o aplicativo.",
            [
              {
                text: "CONFIRMAR",
                onPress: () => Updates.reloadAsync(),
              },
              {
                text: "MANTER ABERTO",
              },
            ]
          );
        }
      });
    }
    if (!!convenio?.primeiro_acesso) {
      setModal(true);
      api.get("/termoAdesao", null).then(({ data }) => {
        setTermo(data);
      });
    } else {
      setModal(false);
    }
  }, []);
  const conectar = async (imput) => {
    const { doc, user, pass } = imput;
    if (doc.length >= 14 && pass) {
      try {
        const { data } = await api.post("/Login", {
          doc: doc,
          senha: pass,
          user,
          convenios: true,
        });
        let conv;
        if (!data.erro) {
          const areas = await api({
            method: "POST",
            url: "/areas",
            headers: { "x-access-token": convenio.token },
          });
          setAreas(areas.data);
          const procedimentos = await api({
            method: "POST",
            url: "/procedimentos",
            data: { cd_da_area: convenio.cd_da_area },
            headers: { "x-access-token": convenio.token },
          });
          conv = {
            id_gds: data.id_gds,
            nome_parceiro: data.nome_parceiro,
            caminho_logomarca: data.caminho_logomarca
              ? `${data.caminho_logomarca}?id=${Math.random()}`
              : null,
            efetuarVenda: data.efetuarVenda,
            doc: data.doc,
            usuario: data.usuario,
            nivel: data.nivel,
            token: data.token,
            areas: areas.data,
            Percentual_repasse: data.Percentual_repasse,
            trocar_area: data.Cd_da_area == "0045" ? true : false,
            cd_convenio: data.cd_convenio,
            primeiro_acesso: data.primeiro_acesso,
            tipo_lancamento: data.tipo_lancamento,
            efetuarVenda: data.efetuarVenda,
            cd_da_area: data.Cd_da_area,
            nome_area: areas.data.find(
              (item) => item.cd_da_area == data.Cd_da_area
            )["Descrição"],
            procedimentos: procedimentos.data,
          };

          if (!data.primeiro_acesso && data.Cd_da_area == "0045") {
            setModalAreas(true);
          }
          await setConv(conv);
        }
      } catch (error) {
        props.navigation.navigate("Sair");
        Alert.alert(
          "ATENÇÃO",
          "Usuário ou Senha incorretos.\n EFETUE NOVAMENTE O LOGIN!!"
        );
      }
    } else {
      props.navigation.navigate("Sair");
      Alert.alert(
        "ATENÇÃO",
        "Usuário ou Senha incorretos.\n EFETUE NOVAMENTE O LOGIN!!"
      );
    }
  };

  const aprovarTermo = async () => {
    await api({
      method: "POST",
      url: "/AceitarTermo",
      data: {
        termo: termo.T_id_termo,
      },
      headers: { "x-access-token": convenio.token },
    });
    setConv({ ...convenio, primeiro_acesso: false });
    setModal(false);
  };
  const BtnProcedimentos = () => (
    <TouchableOpacity
      style={[styles.itemMenu]}
      onPress={() =>
        props.navigation.navigate("Procedimentos", {
          load: new Date(),
        })
      }
    >
      <Image
        source={require("../../assets/img/list.png")}
        style={styless.imgMenu}
      />
      <Text style={[styles.textMenu]}>PROCEDIMENTOS</Text>
    </TouchableOpacity>
  );

  const reprovarTermo = async () => {
    await api({
      method: "POST",
      url: "/RecusarTermo",
      data: {
        termo: termo.T_id_termo,
      },
      headers: { "x-access-token": convenio.token },
    });

    props.navigation.navigate("Sair");
  };
  return (
    <View>
      {modal && (
        <Modal visible={modal} transparent>
          <View
            style={{
              height: "100%",
              width: "100%",
              backgroundColor: "white",
              borderRadius: 5,
              padding: 10,
            }}
          >
            {termo ? (
              <>
                <WebView
                  source={{
                    html: termo.T_descricao,
                  }}
                  textZoom={250}
                  style={{ flex: 19, borderRadius: 5 }}
                />
                <View
                  style={{
                    flex: 0.1,

                    alignItems: "center",
                    justifyContent: "space-around",
                    flexDirection: "row",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      backgroundColor: primary,
                      padding: 10,
                      borderRadius: 5,
                      paddingHorizontal: 20,
                    }}
                    onPress={aprovarTermo}
                  >
                    <Text style={{ fontSize: 24, color: "white" }}>
                      ACEITAR
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      backgroundColor: danger,
                      padding: 10,
                      borderRadius: 5,
                      paddingHorizontal: 20,
                    }}
                    onPress={() => reprovarTermo()}
                  >
                    <Text style={{ fontSize: 24, color: "white" }}>
                      RECUSAR
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <Carregando />
            )}
          </View>
        </Modal>
      )}

      <SelecionarAreasModal
        visible={[modalAreas, setModalAreas]}
        areas={areas}
      />

      <View
        style={{ width: "100%", height: "100%", backgroundColor: background }}
      >
        <View style={styless.container}>
          <TouchableOpacity
            style={styless.menu}
            onPress={() => props.navigation.toggleDrawer()}
          >
            <Icone style={{ color: "white" }} name={"menu"} size={28} />
          </TouchableOpacity>
          <Image
            source={icone}
            style={{ width: 40, height: 40, marginHorizontal: 10 }}
          />
          <Text style={styless.titulo}>ABEPOM </Text>
          <TouchableOpacity
            style={[styless.menu, { left: null, right: 20 }]}
            onPress={() => props.navigation.navigate("Notificacoes")}
          >
            <Icone
              style={{ color: "white" }}
              name={"message-text-outline"}
              size={28}
            />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View style={styles.linhaMenu}>
            <TouchableOpacity
              style={styles.itemMenu}
              onPress={() => props.navigation.navigate("ConsultarCartao")}
            >
              <Image
                source={require("../../assets/img/pay.png")}
                style={styless.imgMenu}
              />
              <Text style={styles.textMenu}>Consultar Cartão</Text>
            </TouchableOpacity>
          </View>

          {convenio.efetuarVenda && (
            <View style={styles.linhaMenu}>
              <TouchableOpacity
                style={[styles.itemMenu]}
                onPress={() => props.navigation.navigate("Lancar")}
              >
                <Image
                  source={require("../../assets/img/money.png")}
                  style={styless.imgMenu}
                />
                <Text style={[styles.textMenu]}>LANÇAR</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.itemMenu]}
                onPress={() =>
                  props.navigation.navigate("ConsultarVendas", {
                    load: new Date(),
                  })
                }
              >
                <Image
                  source={require("../../assets/img/bill.png")}
                  style={styless.imgMenu}
                />
                <Text style={[styles.textMenu]}>CONSULTAR</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.linhaMenu}>
            <TouchableOpacity
              style={styles.itemMenu}
              onPress={() => {
                props.navigation.navigate("Perfil", {
                  id_gds: convenio.id_gds,
                });
              }}
            >
              <Image
                source={require("../../assets/img/portfolio.png")}
                style={styless.imgMenu}
              />
              <Text style={styles.textMenu}>Perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.itemMenu}
              onPress={() => {
                props.navigation.navigate("Avaliacoes");
              }}
            >
              <Image
                source={require("../../assets/img/review.png")}
                style={styless.imgMenu}
              />
              <Text style={styles.textMenu}>AVALIAÇÕES</Text>
            </TouchableOpacity>
          </View>
          {convenio.nivel == 1 && (
            <View style={[styles.linhaMenu, { marginBottom: 100 }]}>
              <TouchableOpacity
                style={styles.itemMenu}
                onPress={() =>
                  props.navigation.navigate("RepassesFuturos", convenio)
                }
              >
                <Image
                  source={require("../../assets/img/statistics.png")}
                  style={styless.imgMenu}
                />
                <Text style={styles.textMenu}>Repasses</Text>
              </TouchableOpacity>
              {convenio.tipo_lancamento == 1 && <BtnProcedimentos />}
              {convenio.tipo_lancamento == 2 && <BtnProcedimentos />}
              {convenio.tipo_lancamento == 4 && <BtnProcedimentos />}
            </View>
          )}
        </ScrollView>
        <Text style={{ textAlign: "center" }}>Versão: {app.expo.version}</Text>
      </View>
    </View>
  );
};

const styless = StyleSheet.create({
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

  configItem: {
    color: "white",
  },
  titulo: {
    fontSize: 18,
    color: "white",
  },
  imgMenu: { width: 40, height: 40 },
});
