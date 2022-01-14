import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import MenuTop from "../Components/MenuTop";
import useConvenio from "./../Data/Convenio";
import api from "./../api";
import { primary } from "./../utils/Style";
import formatCurrency from "currency-formatter";
import Carregando from "../Components/Carregando";
import { FlatList } from "react-native-gesture-handler";
import Mensagem from "../Components/Mensagem";
import useLoad from "../Data/Load";
import { TextInput } from "react-native-paper";
import { themeLight } from "../utils/theme";
import PickerModal from "react-native-picker-modal-view";
import imagens from "../utils/imagens";
import LancamentoDetalhado from "../Components/Modal/LancamentoDetalhado.modal";
import ProntuarioDetalhado from "../Components/Modal/ProntuarioDetalhado.modal";
export default function RepassesFuturos(props) {
  const [refreshing, setRefreshing] = useState(false);
  const [load, setLoad] = useState(false);
  const [{ token, tipo_lancamento }] = useConvenio();
  const [repasses, setRepasses] = useState();
  const [modalProntuario, setModalProntuario] = useState(false);
  const [prontuario, setProntuario] = useState("");
  const [mesano, setMesano] = useState(
    `${new Date().getMonth() + 1}/${new Date().getFullYear()}`
  );
  const [mostra, setMostra] = useState(false);
  const [Nr_lancamento, setNrlancamento] = useState("");
  const [{ Percentual_repasse }] = useConvenio();
  const [mesanoConsulta, setMesanoConsulta] = useState(``);
  const [carregando, setCarregando] = useLoad();
  const mes = [
    { Name: "01", Value: "01" },
    { Name: "02", Value: "02" },
    { Name: "03", Value: "03" },
    { Name: "04", Value: "04" },
    { Name: "05", Value: "05" },
    { Name: "06", Value: "06" },
    { Name: "07", Value: "07" },
    { Name: "08", Value: "08" },
    { Name: "09", Value: "09" },
    { Name: "10", Value: "10" },
    { Name: "11", Value: "11" },
    { Name: "12", Value: "12" },
  ];
  let ano = [];
  let acrecimo = 0;
  if (new Date().getMonth() + 1 > 10) {
    acrecimo = 1;
  }
  for (
    let index = 2017;
    index <= new Date().getFullYear() + acrecimo;
    index++
  ) {
    ano.push({ Name: index.toString(), Value: index.toString() });
  }
  useEffect(() => {
    if (carregando !== "ConsultarVendas" && carregando !== "todos") {
      getRepasse();
    }
  }, []);

  useEffect(() => {
    if (carregando == "ConsultarVendas" || carregando == "todos") {
      getRepasse();

      setCarregando(null);
    }
  }, [carregando]);
  const getRepasse = async () => {
    setRepasses(null);
    setMesanoConsulta(mesano);
    const { data } = await api({
      method: "GET",
      url: "/repasses",
      params: { mesano },
      headers: { "x-access-token": token },
    });

    let ordenado;
    if (data.length > 0) {
      ordenado = data.sort((a, b) => {
        if (a.Nr_lancamento < b.Nr_lancamento) {
          return 1;
        }
        if (a.Nr_lancamento > b.Nr_lancamento) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });
      setRepasses(ordenado);
    } else {
      setRepasses([{ erro: true }]);
    }
  };
  useEffect(() => {
    getRepasse();
  }, []);
  return (
    <>
      <LancamentoDetalhado
        visualizar={[mostra, setMostra]}
        Nr_lancamento={Nr_lancamento}
        convenio={{ tipo_lancamento, token }}
      />
      <ProntuarioDetalhado
        visualizar={[modalProntuario, setModalProntuario]}
        Nr_lancamento={prontuario}
      />
      <MenuTop drawer {...props} title={"Repasses"}>
        <View style={{ flexDirection: "row", padding: 10 }}>
          <TextInput
            label="MÊS"
            style={{ flex: 1, margin: 5, minWidth: 25 }}
            dense
            value
            mode="outlined"
            theme={themeLight}
            render={() => (
              <PickerModal
                renderSelectView={(disabled, selected, showModal) => {
                  return (
                    <TouchableOpacity
                      disabled={disabled}
                      style={{
                        width: "100%",
                        height: 45,
                        paddingHorizontal: 10,
                        justifyContent: "center",
                      }}
                      title={"Show me!"}
                      onPress={showModal}
                    >
                      <Text style={{ fontSize: 18, color: primary }}>
                        {mesano.split("/")[0]}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
                onSelected={(item) =>
                  setMesano(`${item.Value}/${mesano.split("/")[1]}`)
                }
                items={mes}
                showToTopButton={true}
                showAlphabeticalIndex={true}
                autoGenerateAlphabeticalIndex={true}
                selectPlaceholderText={"Selecione um..."}
                searchPlaceholderText={"Buscar..."}
                requireSelection={true}
                autoSort={false}
                renderListItem={(a, item) => {
                  return (
                    <View
                      key={item.Value}
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        padding: 10,
                        marginVertical: 5,
                        marginHorizontal: 20,
                        borderBottomWidth: 1,
                      }}
                    >
                      <Text style={{ fontSize: 18, width: "70%" }}>
                        {item.Name}
                      </Text>
                    </View>
                  );
                }}
              />
            )}
          />
          <TextInput
            label="ANO"
            style={{ flex: 1, margin: 5, minWidth: 50 }}
            dense
            value
            mode="outlined"
            theme={themeLight}
            render={() => (
              <PickerModal
                renderSelectView={(disabled, selected, showModal) => {
                  return (
                    <TouchableOpacity
                      disabled={disabled}
                      style={{
                        width: "100%",
                        height: 45,
                        minWidth: 100,
                        paddingHorizontal: 10,
                        justifyContent: "center",
                      }}
                      title={"Show me!"}
                      onPress={showModal}
                    >
                      <Text style={{ fontSize: 18, color: primary }}>
                        {mesano.split("/")[1]}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
                onSelected={(item) =>
                  setMesano(`${mesano.split("/")[0]}/${item.Value}`)
                }
                items={ano}
                showToTopButton={true}
                showAlphabeticalIndex={true}
                autoGenerateAlphabeticalIndex={true}
                selectPlaceholderText={"Selecione um..."}
                searchPlaceholderText={"Buscar..."}
                requireSelection={true}
                autoSort={false}
                renderListItem={(a, item) => {
                  return (
                    <View
                      key={item.Value}
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        padding: 10,
                        marginVertical: 5,
                        marginHorizontal: 20,
                        borderBottomWidth: 1,
                      }}
                    >
                      <Text style={{ fontSize: 18, width: "70%" }}>
                        {item.Name}
                      </Text>
                    </View>
                  );
                }}
              />
            )}
          />
          {!load ? (
            <TouchableOpacity
              style={{
                backgroundColor: primary,
                height: 45,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
                borderColor: primary,
                borderWidth: 1,
                paddingHorizontal: 4,
                marginTop: 12,
                marginLeft: 15,
                marginRight: 5,
                elevation: 1,
              }}
              onPress={async () => {
                setLoad(true);
                await getRepasse();

                setLoad(false);
              }}
            >
              <Image
                source={imagens.search}
                style={{ width: 30, height: 30, margin: 5, tintColor: "white" }}
              />
            </TouchableOpacity>
          ) : (
            <Carregando style={{ margin: 0 }} size={20} />
          )}
        </View>
        <SafeAreaView style={{ flex: 1 }}>
          <FlatList
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={getRepasse} />
            }
            data={repasses}
            keyExtractor={(item) => item.Nr_lancamento}
            renderItem={({ item }) => {
              if (item.erro) {
                return (
                  <View style={{ height: Dimensions.get("screen").height }}>
                    <Mensagem tipo="S" mensagem="Nenhum repasse encontrado" />
                  </View>
                );
              }

              return (
                <TouchableOpacity
                  onPress={() => {
                    setNrlancamento(item.Nr_lancamento);
                    if (tipo_lancamento != 5 && item.cupom != "") {
                      setModalProntuario(true);
                      setProntuario(item.cupom);
                    } else {
                      setMostra(true);
                    }
                  }}
                  style={{
                    padding: 10,
                    backgroundColor: "white",
                    marginHorizontal: 6,
                    marginVertical: 4,
                    elevation: 3,
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <View style={{ width: "29%" }}>
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontSize: 10,
                          color: primary,
                        }}
                      >
                        Matrícula:{" "}
                      </Text>
                      <Text> {item.Matricula}</Text>
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontSize: 10,
                          color: primary,
                        }}
                      >
                        Lançamento:{" "}
                      </Text>
                      <Text> {item.Nr_lancamento}</Text>
                      <View>
                        <Text
                          style={{
                            fontWeight: "bold",
                            fontSize: 10,
                            color: primary,
                          }}
                        >
                          Data:{" "}
                        </Text>
                        <Text> {item.Data}</Text>
                      </View>
                    </View>
                    <View
                      style={{
                        marginLeft: 5,
                        width: "69%",
                      }}
                    >
                      {item["NomeTitular"] != item["Nome do dependente"] && (
                        <>
                          <Text
                            style={{
                              fontWeight: "bold",
                              fontSize: 10,
                              color: primary,
                            }}
                          >
                            Dependente:{" "}
                          </Text>
                          <Text> {item["Nome do dependente"]}</Text>
                        </>
                      )}
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontSize: 10,
                          color: primary,
                        }}
                      >
                        Associado:
                      </Text>
                      <Text> {item["NomeTitular"]}</Text>
                      <View style={{ flexDirection: "row" }}>
                        <View style={{}}>
                          <Text
                            style={{
                              fontWeight: "bold",
                              fontSize: 10,
                              color: primary,
                            }}
                          >
                            Valor:{" "}
                          </Text>
                          <Text style={{ fontSize: 18 }}>
                            {formatCurrency.format(item.subtotal, {
                              code: "BRL",
                            })}
                          </Text>
                        </View>
                        {item?.parcela && (
                          <View style={{ marginLeft: 30 }}>
                            <Text
                              style={{
                                fontWeight: "bold",
                                fontSize: 10,
                                color: primary,
                              }}
                            >
                              Percelamento:{" "}
                            </Text>
                            <Text style={{ fontSize: 18 }}>
                              {item?.parcela && item.parcela}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={(a) => {
              return <Carregando />;
            }}
          />
        </SafeAreaView>
      </MenuTop>
      {repasses && !repasses[0].erro && (
        <View
          style={{
            flexDirection: "row",
            alignContent: "space-between",
            width: "95%",
            alignSelf: "center",
            marginVertical: 5,
            marginTop: 10,
          }}
        >
          <View
            style={{
              flex: 1,
              marginRight: "2%",
              alignItems: "center",
              backgroundColor: primary,
              borderRadius: 50,
              marginBottom: 10,
            }}
          >
            <Text style={{ fontWeight: "bold", color: "#fff", fontSize: 10 }}>
              VENDAS
            </Text>
            <Text style={{ fontWeight: "bold", color: "#fff", fontSize: 14 }}>
              {repasses ? (repasses[0].Mesano ? repasses.length : "0") : "0"}
            </Text>
          </View>
          <View
            style={{
              marginHorizontal: "2%",
              alignItems: "center",
              flex: 2,
              backgroundColor: primary,
              borderRadius: 50,
              marginBottom: 10,
            }}
          >
            <Text style={{ fontWeight: "bold", color: "#fff", fontSize: 10 }}>
              MÊS DE REPASSE
            </Text>
            <Text style={{ fontWeight: "bold", color: "#fff", fontSize: 14 }}>
              {mesanoConsulta}
            </Text>
          </View>
          <View
            style={{
              marginLeft: "2%",
              alignItems: "center",
              flex: 2,
              backgroundColor: primary,
              borderRadius: 50,
              marginBottom: 10,
            }}
          >
            <Text style={{ fontWeight: "bold", color: "#fff", fontSize: 10 }}>
              TOTAL
            </Text>
            <Text style={{ fontWeight: "bold", color: "#fff", fontSize: 14 }}>
              {repasses
                ? formatCurrency.format(
                    repasses.reduce(
                      (total, subtotal) => total + Number(subtotal.subtotal),
                      0
                    ),
                    { code: "BRL" }
                  )
                : "R$ 0,00"}
            </Text>
          </View>
          <View
            style={{
              marginLeft: "2%",
              alignItems: "center",
              backgroundColor: primary,
              borderRadius: 50,
              flex: 2,
              marginBottom: 10,
            }}
          >
            <Text style={{ fontWeight: "bold", color: "#fff", fontSize: 10 }}>
              TOTAL REPASSE
            </Text>
            <Text style={{ fontWeight: "bold", color: "#fff", fontSize: 14 }}>
              {repasses
                ? formatCurrency.format(
                    repasses.reduce(
                      (total, subtotal) =>
                        total +
                        Number(
                          subtotal.subtotal -
                            (subtotal.subtotal * Percentual_repasse) / 100
                        ),
                      0
                    ),
                    { code: "BRL" }
                  )
                : "R$ 0,00"}
            </Text>
          </View>
        </View>
      )}
    </>
  );
}
