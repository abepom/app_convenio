import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import api from "./../api";
import MenuTop from "./../components/MenuTop";
import { FlatList } from "react-native-gesture-handler";
import useConvenio from "../Data/Convenio";
import { primary } from "./../utils/Style";
import useLoad from "./../Data/Load";
import Carregando from "../components/Carregando";

export default function Notificacoes(props) {
  const [refreshing, setRefreshing] = useState(false);

  const [convenio, setConvenio] = useConvenio();
  const [load, setLoad] = useLoad();

  const [notificacoes, setNotificacoes] = useState(
    props.navigation.state.params
  );
  function getNotificacoes() {
    setNotificacoes(null);
    api
      .get("/user/notificacoes", {
        params: { cd_convenio: convenio.cd_convenio },
      })
      .then(({ data }) => {
        setNotificacoes(data);
        let msns = data.filter((item) => {
          if (!item.ACMI_lido) {
            return item;
          }
        }).length;
        setLoad("notificacao");
      })
      .catch((a) => console.log(a));
  }

  useEffect(() => {
    getNotificacoes();
  }, []);

  function lerNotificacao(id) {
    setNotificacoes([]);
    api
      .post("/user/LerNotificacoes", { id })
      .then((a) => getNotificacoes())
      .catch((e) => console.log(e));
  }
  return (
    <View>
      <MenuTop drawer {...props} title={"Mensagens"}>
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={getNotificacoes}
            />
          }
          ListEmptyComponent={() => (
            <View
              style={{
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Carregando cor={false} size={48} />
            </View>
          )}
          data={notificacoes}
          style={styles.flatlist}
          keyExtractor={(item) => item.Nr_lancamento}
          renderItem={({ item }) => {
            console.log(item);
            return (
              <View style={styles.item}>
                <View
                  style={{
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5,
                    backgroundColor: primary,
                    opacity: item.ACMI_lido ? 0.7 : 1,
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                  }}
                >
                  <Text style={styles.titulo}>{item.ACM_titulo}</Text>
                </View>
                <View style={{ padding: 10 }}>
                  <Text style={styles.mensagem}>
                    {item.ACM_mensagem.replace(/<[^>]*>?/gm, "").replace(
                      /&[^;]*;?/gm,
                      ""
                    )}
                  </Text>
                </View>
                {item.ACMI_lido ? (
                  <View
                    style={{
                      width: "100%",
                      alignItems: "center",
                      padding: 10,
                      opacity: item.ACMI_lido ? 0.7 : 1,
                      backgroundColor: primary,
                      borderRadius: 5,
                    }}
                  >
                    <Text style={{ color: "white", opacity: 1 }}>
                      Lido em {item.ACMI_data_lido}
                    </Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={{
                      width: "100%",
                      alignItems: "center",
                      padding: 10,

                      backgroundColor: primary,
                      borderRadius: 5,
                    }}
                    onPress={() => lerNotificacao(item.ACMI_id_itens)}
                  >
                    <Text style={{ color: "white" }}>Marcar como lido</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          }}
        />
      </MenuTop>
    </View>
  );
}
const styles = StyleSheet.create({
  flatlist: { width: "100%", height: "100%", marginBottom: 50 },
  item: {
    marginHorizontal: "3%",
    marginVertical: 10,
    width: "94%",
    backgroundColor: "white",

    borderRadius: 5,
  },
  titulo: {
    fontWeight: "bold",
    marginVertical: 10,
    fontSize: 16,
    color: "white",
  },
  mensagem: {
    color: primary,
  },
});
