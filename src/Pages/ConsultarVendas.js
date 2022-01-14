import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  TextInput as Input,
  TouchableOpacity,
  Image,
  RefreshControl,
  ScrollView,
  Dimensions,
  Modal,
  Linking,
  SafeAreaView,
  Alert,
} from "react-native";
import MenuTop from "../Components/MenuTop";
import styles, {
  primary,
  danger,
  danverBackground,
  sucess,
  sucessBack,
} from "../utils/Style";
import { TextInput } from "react-native-paper";
import api from "../api";
import { themeLight } from "../utils/theme";
import formatCurrency from "currency-formatter";
import Retorno from "../Components/Retorno";
import useConvenio from "../Data/Convenio";
import useLoad from "../Data/Load";
import imagens from "../utils/imagens";
import Carregando from "./../Components/Carregando";
import { FlatList } from "react-native-gesture-handler";
import { TextInputMask } from "react-native-masked-text";
import LancamentoDetalhado from "./../Components/Modal/LancamentoDetalhado.modal";
import ProntuarioDetalhado from "../Components/Modal/ProntuarioDetalhado.modal";

const meses = [];

for (let i = 1; i <= 12; i++) {
  meses.push(i < 10 ? `0${i}` : `${i}`);
}
const anos = [];

for (let i = new Date().getFullYear(); i >= new Date().getFullYear() - 5; i--) {
  anos.push(`${i}`);
}

const ConsultarVendas = (props) => {
  const [refreshing, setRefreshing] = useState(false);
  const [{ id_gds, tipo_lancamento, usuario, token }] = useConvenio();
  const [mes, setMes] = useState(false);
  const [dataOld, setDataOld] = useState("");
  const [data, setData] = useState(
    `${
      new Date().getDate() < 9
        ? `0${new Date().getDate()}`
        : `${new Date().getDate()}`
    }/${
      new Date().getMonth() < 9
        ? `0${new Date().getMonth() + 1}`
        : `${new Date().getMonth() + 1}`
    }/${new Date().getFullYear()}`
  );
  const [vendas, setvendas] = useState([]);
  const [load, setLoad] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalProntuario, setModalProntuario] = useState(false);
  const [mostra, setMostra] = useState(false);
  const [modalVisualizar, setModalVisualizar] = useState(false);
  const [msn, setMsn] = useState("");

  const [conteudoModal, setConteudoModal] = useState({ Nr_lancamento: null });
  const [retornoExclusao, setRetornoExclusao] = useState("");
  const [carregando, setCarregando] = useLoad();
  const [carregandoItemVenda, setCarregandoItemVenda] = useState(false);
  const [ItensVenda, setItensVenda] = useState([]);
  const [prontuario, setprontuario] = useState(false);

  useEffect(() => {
    getConsulta();
  }, [retornoExclusao]);
  useEffect(() => {
    if (carregando !== "ConsultarVendas" && carregando !== "todos") {
      getConsulta();
    }
  }, []);
  useLayoutEffect(() => {
    if (modalVisualizar) {
      setCarregandoItemVenda(true);

      api({
        method: "get",
        url: "/ConsultarItemVenda",
        params: { ...conteudoModal, prontuario },
        headers: { "x-access-token": token },
      }).then(({ data }) => {
        if (tipo_lancamento == "3" && data[0].Valor == 0) {
          data[0].Valor = conteudoModal.Valor;
        }
        setItensVenda(data);
        setCarregandoItemVenda(false);
      });
    }
  }, [modalVisualizar]);
  useEffect(() => {
    if (carregando == "ConsultarVendas" || carregando == "todos") {
      getConsulta();

      setCarregando(null);
    }
  }, [carregando]);

  const getConsulta = async () => {
    setMsn("");
    if (data.length == 10) {
      let dataajustada = `${data.substr(6, 4)}-${data.substr(
        3,
        2
      )}-${data.substr(0, 2)}`;

      if (!new Date(dataajustada).toJSON()) {
        setLoad(true);
        setTimeout(() => {
          setvendas("");
          setMsn("Informe uma data válida");

          setLoad(false);
        }, 500);
        return;
      }
    } else {
      setLoad(true);
      setTimeout(() => {
        setMsn("Informe uma data válida. (DD/MM/AAAA)");
        setvendas("");
        setLoad(false);
      }, 500);

      return;
    }

    setLoad(true);
    try {
      const dados = await api({
        method: "get",
        url: "/ConsultarVendas",
        params: { id_gds, data, usuario, nivel: 1, mes, tipo_lancamento },
        headers: { "x-access-token": token },
      });
      setvendas(dados.data);

      // const [contatoConvenio] = await api({
      // 	method: "get",
      // 	url: "/contato",
      // 	params: { setor: "15" },
      // 	headers: { "x-access-token": token },
      // });

      // setContato(contatoConvenio);
    } catch (error) {
      setvendas([]);
    } finally {
      setLoad(false);
    }
  };

  const excluirVenda = async (Nr_lancamento) => {
    try {
      const dados = await api({
        method: "DELETE",
        url: "/removerVendas",
        data: { Nr_lancamento },
        headers: { "x-access-token": token },
      });
      setCarregando("ConsultarVendas");
      setRetornoExclusao(dados.data.mensagem.replace("abepom", "ABEPOM"));
    } finally {
    }
  };

  return (
    <>
      {conteudoModal.Nr_lancamento != "" && (
        <LancamentoDetalhado
          visualizar={[mostra, setMostra]}
          Nr_lancamento={conteudoModal.Nr_lancamento}
          convenio={{ tipo_lancamento, token }}
        />
      )}
      <ProntuarioDetalhado
        visualizar={[modalProntuario, setModalProntuario]}
        Nr_lancamento={prontuario}
      />
      <Modal visible={modal} transparent {...props}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          {conteudoModal ? (
            <>
              <View
                style={{
                  borderTopRightRadius: 4,
                  borderTopLeftRadius: 4,
                  backgroundColor: `white`,
                  paddingVertical: 10,
                  paddingHorizontal: 5,
                  width: "90%",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={[
                      styles.textoM,
                      { fontWeight: "bold", marginVertical: 2 },
                    ]}
                  >
                    Lançamento:{" "}
                    <Text style={{ fontWeight: "100" }}>
                      {conteudoModal.Nr_lancamento}
                    </Text>
                  </Text>
                  <Text
                    style={[
                      styles.textoM,
                      { fontWeight: "bold", marginVertical: 2 },
                    ]}
                  >
                    Matricula:
                    <Text style={{ fontWeight: "100" }}>
                      {" "}
                      {conteudoModal.Matricula}
                    </Text>
                  </Text>
                </View>
                <Text
                  style={[
                    styles.textoM,
                    { fontWeight: "bold", marginVertical: 2 },
                  ]}
                >
                  Associado:{" "}
                  <Text style={{ fontWeight: "100" }}>
                    {conteudoModal["Nome do dependente"]}
                  </Text>
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={[
                      styles.textoM,
                      { fontWeight: "bold", marginVertical: 2 },
                    ]}
                  >
                    Valor:
                    <Text style={{ fontWeight: "100" }}>
                      {" "}
                      {formatCurrency.format(conteudoModal.Valor, {
                        code: "BRL",
                      })}
                    </Text>
                  </Text>

                  <Text
                    style={[
                      styles.textoM,
                      { fontWeight: "bold", marginVertical: 2 },
                    ]}
                  >
                    Data:
                    <Text style={{ fontWeight: "100" }}>
                      {" "}
                      {conteudoModal.Data}
                    </Text>
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "90%",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setModal(false);
                    excluirVenda(conteudoModal.Nr_lancamento);
                    getConsulta(conteudoModal.Data);
                    // setConteudoModal(null);
                  }}
                  style={{
                    borderBottomLeftRadius: 4,
                    backgroundColor: danverBackground,
                    padding: 10,
                    width: "50%",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: danger }}>CONFIRMAR EXCLUSÃO</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setModal(false)}
                  style={{
                    borderBottomRightRadius: 4,
                    backgroundColor: sucessBack,
                    padding: 10,
                    width: "50%",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: sucess }}>FECHAR</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : retornoExclusao == "" ? (
            <>
              <View
                style={{
                  borderRadius: 4,
                  backgroundColor: `white`,
                  paddingVertical: 10,
                  paddingHorizontal: 5,
                  width: "90%",
                }}
              >
                <Carregando />
              </View>
              <TouchableOpacity
                onPress={() => setModal(false)}
                style={{
                  borderBottomRightRadius: 4,
                  borderBottomLeftRadius: 4,
                  backgroundColor: sucessBack,
                  padding: 10,
                  width: "90%",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: sucess }}>FECHAR</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View
                style={{
                  borderTopRightRadius: 4,
                  borderTopLeftRadius: 4,
                  backgroundColor: `white`,
                  paddingVertical: 10,
                  paddingHorizontal: 5,
                  width: "90%",
                }}
              >
                <Text style={{ fontSize: 20, textAlign: "center" }}>
                  {retornoExclusao}
                </Text>
                {retornoExclusao.indexOf(
                  "Essa cobrança já foi efetuada pela ABEPOM,"
                ) >= 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      Linking.openURL(`https://wa.me/5548991440708`);
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: 10,
                      }}
                    >
                      <Image
                        source={imagens.whatsapp}
                        style={{ height: 30, width: 30 }}
                      />
                      <Text>(48) 99144-0708</Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity
                onPress={() => {
                  setModal(false);
                  setRetornoExclusao("");
                }}
                style={{
                  borderBottomRightRadius: 4,
                  borderBottomLeftRadius: 4,
                  backgroundColor: sucessBack,
                  padding: 10,
                  width: "90%",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: sucess }}>FECHAR</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </Modal>
      <MenuTop
        drawer
        {...props}
        title={"Consultar Lançamentos"}
        header={
          <View>
            <View
              style={{
                width: "60%",
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <TextInput
                label="Informe uma data"
                dense
                value={data}
                onFocus={() => {
                  setDataOld(data);
                  setData("");
                }}
                onBlur={() => {
                  if (data == "") {
                    setData(dataOld);
                  } else {
                    setDataOld(data);
                  }
                }}
                mode="outlined"
                onChangeText={setData}
                keyboardType={"phone-pad"}
                theme={themeLight}
                style={{ width: "80%" }}
                render={(prop) => {
                  return (
                    <TextInputMask
                      {...prop}
                      type={"custom"}
                      options={{
                        mask: "99/99/9999",
                      }}
                    />
                  );
                }}
              />
              <TouchableOpacity
                style={{
                  marginLeft: 5,
                  marginTop: 7,
                  paddingVertical: 6,
                  paddingHorizontal: 10,
                  backgroundColor: primary,
                  borderRadius: 5,
                }}
                onPress={getConsulta}
              >
                <Image
                  source={imagens.search}
                  style={{ width: 25, height: 25, tintColor: "white" }}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => setMes(!mes)}
              style={{ flexDirection: "row" }}
            >
              {mes ? (
                <Image
                  source={imagens.check}
                  style={{
                    width: 25,
                    height: 25,
                    margin: 7,
                    tintColor: primary,
                  }}
                />
              ) : (
                <Image
                  source={imagens.unchecked}
                  style={{
                    width: 25,
                    height: 25,
                    margin: 7,
                    tintColor: primary,
                  }}
                />
              )}

              <Text style={{ paddingTop: 10, color: primary }}>
                Consulta mês inteiro
              </Text>
            </TouchableOpacity>
          </View>
        }
      >
        <View style={{ width: "95%" }}>
          {load ? (
            <Carregando />
          ) : vendas.length > 0 ? (
            <SafeAreaView style={{ flex: 1 }}>
              <FlatList
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={getConsulta}
                  />
                }
                data={vendas}
                keyExtractor={({ index }) => index}
                renderItem={({ item, index }) => {
                  return (
                    <View key={index}>
                      <View
                        style={{
                          elevation: 2,
                          borderRadius: 4,
                          marginBottom: 10,
                          backgroundColor: `white`,
                          paddingVertical: 5,
                          paddingHorizontal: 5,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text
                            style={[
                              styles.textoM,
                              { fontWeight: "bold", marginVertical: 2 },
                            ]}
                          >
                            Lançamento:{" "}
                            <Text style={{ fontWeight: "100" }}>
                              {item.Nr_lancamento}
                            </Text>
                          </Text>
                          <Text
                            style={[
                              styles.textoM,
                              { fontWeight: "bold", marginVertical: 2 },
                            ]}
                          >
                            Matricula:
                            <Text style={{ fontWeight: "100" }}>
                              {" "}
                              {item.Matricula}
                            </Text>
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                          }}
                        >
                          <Text
                            style={[
                              styles.textoM,
                              { fontWeight: "bold", marginVertical: 2 },
                            ]}
                          >
                            Associado:{" "}
                            <Text style={{ fontWeight: "100" }}>
                              {item["Nome do dependente"]}
                            </Text>
                          </Text>
                        </View>

                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text
                            style={[
                              styles.textoM,
                              { fontWeight: "bold", marginVertical: 2 },
                            ]}
                          >
                            Valor:
                            <Text style={{ fontWeight: "100" }}>
                              {" "}
                              {formatCurrency.format(item.Valor, {
                                code: "BRL",
                              })}
                            </Text>
                          </Text>
                          <Text
                            style={[
                              styles.textoM,
                              { fontWeight: "bold", marginVertical: 2 },
                            ]}
                          >
                            Data:
                            <Text style={{ fontWeight: "100" }}>
                              {" "}
                              {item.Data}
                            </Text>
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-around",
                          }}
                        >
                          {tipo_lancamento == 4 ? (
                            <TouchableOpacity
                              onPress={() => {
                                setprontuario(item.Cupom);
                                setModalProntuario(true);
                              }}
                              style={{
                                backgroundColor: primary,
                                flex: 1,
                                alignItems: "center",
                                borderBottomLeftRadius: 5,
                                borderTopLeftRadius: 5,
                              }}
                            >
                              <Text style={{ color: "white" }}>
                                Consultar Prontuario
                              </Text>
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity
                              onPress={() => {
                                setMostra(true);
                                setModalVisualizar(true);
                                setprontuario(false);
                                setConteudoModal(item);
                              }}
                              style={{
                                backgroundColor: primary,
                                flex: 1,
                                alignItems: "center",
                                borderBottomLeftRadius: 5,
                                borderTopLeftRadius: 5,
                              }}
                            >
                              <Text style={{ color: "white" }}>Visualizar</Text>
                            </TouchableOpacity>
                          )}
                          <TouchableOpacity
                            onPress={() => {
                              if (item.Processado_desconto) {
                                setConteudoModal(null);
                                setRetornoExclusao(
                                  "Essa cobrança já foi efetuada pela ABEPOM, entre em contato com nosso setor de convênios para mais informações."
                                );
                              } else {
                                setConteudoModal(item);
                              }
                              setModal(true);
                            }}
                            style={{
                              backgroundColor: danger,
                              flex: 1,
                              alignItems: "center",
                              borderBottomRightRadius: 5,
                              borderTopRightRadius: 5,
                            }}
                          >
                            <Text style={{ color: "white" }}>Excluir</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  );
                }}
              />
            </SafeAreaView>
          ) : (
            <ScrollView
              style={{ height: Dimensions.get("screen").height / 2 }}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={getConsulta}
                />
              }
            >
              <Retorno
                type="sucess"
                mensagem={
                  msn ? msn : "Não há registro de lançamento para o seu usuário"
                }
              />
            </ScrollView>
          )}
        </View>
      </MenuTop>
      <View
        style={{
          flexDirection: "row",
          alignContent: "space-between",
          width: "95%",
          alignSelf: "center",
        }}
      >
        <View
          style={{
            width: "48%",
            marginRight: "2%",
            alignItems: "center",
            backgroundColor: primary,
            borderRadius: 50,
            marginBottom: 10,
          }}
        >
          <Text style={{ fontWeight: "bold", color: "#fff", fontSize: 10 }}>
            ATENDIMENTOS
          </Text>
          <Text style={{ fontWeight: "bold", color: "#fff", fontSize: 20 }}>
            {vendas.length ? vendas.length : "0"}
          </Text>
        </View>
        <View
          style={{
            width: "48%",
            marginLeft: "2%",
            alignItems: "center",
            backgroundColor: primary,
            borderRadius: 50,
            marginBottom: 10,
          }}
        >
          <Text style={{ fontWeight: "bold", color: "#fff", fontSize: 10 }}>
            TOTAL
          </Text>
          <Text style={{ fontWeight: "bold", color: "#fff", fontSize: 20 }}>
            {vendas
              ? formatCurrency.format(
                  vendas.reduce(
                    (total, Valor) => total + Number(Valor.Valor),
                    0
                  ),
                  { code: "BRL" }
                )
              : "R$ 0,00"}
          </Text>
        </View>
      </View>
    </>
  );
};

export default ConsultarVendas;
