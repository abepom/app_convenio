import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  ImageBackground,
  Alert,
  SafeAreaView,
} from "react-native";
import formatCurrency from "currency-formatter";
import { TextInput } from "react-native-paper";
import api from "../api";
import MenuTop from "../Components/MenuTop";
import useConvenio from "../Data/Convenio";
import styles, { danger, primary, sucessBack } from "../utils/Style";
import { themeLight } from "../utils/theme";
import Carregando from "../Components/Carregando";
import imagens from "../utils/imagens";
import ProntuarioDetalhado from "../Components/Modal/ProntuarioDetalhado.modal";

export default (props) => {
  const [matricula, setMatricula] = useState("");
  const [carregarBotao, setCarregarBotao] = useState(false);
  const [consulta, setConsulta] = useState(false);
  const [modal, setModal] = useState(false);
  const [listaProntuarios, setListaProntuarios] = useState([]);
  const [prontuario, setProntuario] = useState({});
  const [{ token }] = useConvenio();
  const [NrLancamento, setNrLancamento] = useState("");

  const _ConsultarProntuario = async () => {
    setConsulta(true);
    setCarregarBotao(true);
    const { data } = await api({
      method: "get",
      url: "/prontuarios",
      params: { matricula },
      headers: { "x-access-token": token },
    });

    setListaProntuarios(data);

    setCarregarBotao(false);
  };

  const _ConsultarItensProntuario = async (item) => {
    setModal(true);
    console.log(item);
    setProntuario(item.ID_Prontuario);
  };
  return (
    <>
      <ProntuarioDetalhado
        visualizar={[modal, setModal]}
        Nr_lancamento={prontuario}
      />
      <Modal visible={false} transparent {...props}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View style={[style.modalConteiner, style.flexContainer]}>
            <View>
              <View style={style.row}>
                <Text style={style.textoEsquerdo}>
                  <Text style={style.titulo}>Paciente{"\n"}</Text>{" "}
                  {prontuario.nome}
                </Text>
                <Text style={style.textoEsquerdo}>
                  <Text style={style.titulo}>Prontuario{"\n"}</Text>{" "}
                  {prontuario.ID_Prontuario}
                </Text>
              </View>
              <View style={style.row}>
                <Text style={style.textoEsquerdo}>
                  <Text style={style.titulo}>Primeiro Atendimento{"\n"}</Text>{" "}
                  {prontuario.Data_Inicio_Atendimento}
                </Text>
                <Text style={style.textoEsquerdo}>
                  <Text style={style.titulo}>Valor{"\n"}</Text>{" "}
                  {formatCurrency.format(
                    prontuario.Valor * prontuario.Quantidade_Atendimento,
                    {
                      code: "BRL",
                    }
                  )}
                </Text>
              </View>
              <View style={style.row}>
                <Text style={style.textoEsquerdo}>
                  <Text style={style.titulo}>Procedimento{"\n"}</Text>{" "}
                  {prontuario.desc_procedimento}
                </Text>
                <Text style={style.textoEsquerdo}>
                  <Text style={style.titulo}>Subsidio{"\n"}</Text>{" "}
                  {formatCurrency.format(prontuario.Valor_Subsidio, {
                    code: "BRL",
                  })}
                </Text>
              </View>
              <View style={[style.row, { justifyContent: null }]}>
                <Text style={[style.titulo, { width: "70%" }]}>
                  Atendimentos
                </Text>
                <Text style={style.titulo}>
                  {prontuario.Quantidade_Atendimento}/
                  {prontuario.Previsao_Atendimento}
                </Text>
              </View>
              <SafeAreaView style={{ flex: 1 }}>
                <FlatList
                  data={prontuario.itens}
                  style={{ maxHeight: 400 }}
                  keyExtractor={({ index }) => index}
                  renderItem={({ item, index }) => {
                    console.log(item);
                    return (
                      <View
                        key={index}
                        style={{
                          flexDirection: "row",
                          borderWidth: 1,
                          padding: 3,
                          margin: 3,
                          borderRadius: 5,
                        }}
                      >
                        <Text>
                          <Text style={style.titulo}>
                            {item.data_atendimento}
                            {"\n"}
                          </Text>

                          {item.Descricao}
                        </Text>
                      </View>
                    );
                  }}
                />
              </SafeAreaView>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              setModal(false);
            }}
            style={[
              style.botao,
              { backgroundColor: danger, width: "80%", padding: 10 },
            ]}
          >
            <Text style={style.textoBotao}>FECHAR</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <MenuTop title={"prontuario"} drawer {...props}>
        <Text style={{ marginTop: 10, fontSize: 18, color: primary }}>
          Informe a matrícula do associado.
        </Text>
        <View
          style={{
            width: "80%",
            justifyContent: "center",
            flexDirection: "row",
            marginVertical: 10,
          }}
        >
          <TextInput
            accessibilityLabel="Matrícula"
            key="Matrícula"
            label="Matrícula"
            dense
            onChangeText={setMatricula}
            maxLength={6}
            mode="outlined"
            style={{ width: "60%" }}
            theme={themeLight}
            keyboardType={"numeric"}
            value={matricula}
          />
          {carregarBotao ? (
            <Carregando tamanho={40} />
          ) : (
            <TouchableOpacity
              style={[styles.btnDefault, { margin: 5 }]}
              onPress={_ConsultarProntuario}
            >
              <Text style={styles.btnDefaultText}> BUSCAR</Text>
            </TouchableOpacity>
          )}
        </View>
        <View
          style={{
            width: "80%",
            justifyContent: "center",
            flexDirection: "row",
            marginVertical: 10,
          }}
        >
          {carregarBotao ? (
            <Carregando />
          ) : (
            <>
              {consulta && (
                <SafeAreaView style={{ flex: 1 }}>
                  <FlatList
                    data={listaProntuarios}
                    style={{ maxHeight: 600 }}
                    keyExtractor={({ index }) => index}
                    ListEmptyComponent={() => {
                      return (
                        <View
                          style={[
                            style.flexContainer,
                            style.botao,
                            { backgroundColor: danger },
                          ]}
                        >
                          <View style={style.row}>
                            <Text style={style.textoBotao}>
                              Nenhum prontuário encontrado.
                            </Text>
                          </View>
                        </View>
                      );
                    }}
                    renderItem={({ item, index }) => {
                      return (
                        <View key={index}>
                          <ImageBackground
                            source={
                              item.Finalizou_Atendimento
                                ? imagens.folder
                                : imagens.openFolder
                            }
                            resizeMode="center"
                            key={index}
                            style={[
                              style.flexContainer,
                              {
                                backgroundColor: item.Finalizou_Atendimento
                                  ? sucessBack
                                  : "white",
                                zIndex: 1,
                                tintColor: item.Finalizou_Atendimento
                                  ? "#284c2622"
                                  : "#7f693722",
                              },
                            ]}
                            tintColor={
                              item.Finalizou_Atendimento
                                ? "#284c2622"
                                : "#7f693722"
                            }
                          >
                            <View style={style.row}>
                              <Text style={style.textoEsquerdo}>
                                <Text style={style.titulo}>Paciente{"\n"}</Text>
                                {item.nome}
                              </Text>
                              <Text style={style.textoEsquerdo}>
                                <Text style={style.titulo}>
                                  Prontuario{"\n"}
                                </Text>
                                {item.ID_Prontuario}
                              </Text>
                            </View>
                            <View style={style.row}>
                              <Text style={style.textoEsquerdo}>
                                <Text style={style.titulo}>
                                  Primeiro Atendimento{"\n"}
                                </Text>
                                {item.Data_Inicio_Atendimento}
                              </Text>
                              <Text style={style.textoEsquerdo}>
                                <Text style={style.titulo}>Valor{"\n"}</Text>
                                {formatCurrency.format(
                                  item.Valor * item.Quantidade_Atendimento,
                                  {
                                    code: "BRL",
                                  }
                                )}
                              </Text>
                            </View>
                          </ImageBackground>
                          <View
                            style={{
                              flexDirection: "row",
                              borderRadius: 5,
                              elevation: 3,
                              flex: 1,
                            }}
                          >
                            <TouchableOpacity
                              style={[
                                style.botao,
                                {
                                  flex: 1,
                                  borderBottomEndRadius:
                                    !item.Finalizou_Atendimento ? 0 : 5,
                                },
                              ]}
                              onPress={() => _ConsultarItensProntuario(item)}
                            >
                              <Text style={style.textoBotao}>Visualizar</Text>
                            </TouchableOpacity>

                            {!item.Finalizou_Atendimento && (
                              <TouchableOpacity
                                style={[
                                  style.botao,
                                  {
                                    backgroundColor: danger,
                                    flex: 1,
                                    borderBottomStartRadius: 0,
                                  },
                                ]}
                                onPress={async () => {
                                  const { data } = await api({
                                    url: "/finalizarProntuario",
                                    method: "POST",
                                    data: {
                                      prontuario: item.ID_Prontuario,
                                    },
                                    headers: { "x-access-token": token },
                                  });

                                  if (data.status) {
                                    Alert.alert(
                                      "SUCESSO",
                                      "Prontuario foi finalizado com sucesso.",
                                      [
                                        {
                                          text: "FECHAR",
                                          onPress: _ConsultarProntuario,
                                        },
                                      ]
                                    );
                                  } else {
                                    Alert.alert(
                                      "ATENÇÃO",
                                      "Ocorreu um erro ao finalizar o prontuario."
                                    );
                                  }
                                }}
                              >
                                <Text style={style.textoBotao}>
                                  Finalizar Prontuario
                                </Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                      );
                    }}
                  />
                </SafeAreaView>
              )}
            </>
          )}
        </View>
      </MenuTop>
    </>
  );
};

const style = StyleSheet.create({
  titulo: {
    fontWeight: "bold",
    fontSize: 10,
  },
  flexContainer: {
    backgroundColor: "white",
    marginTop: 10,
    padding: 10,
    elevation: 3,
    borderTopStartRadius: 5,
    borderTopEndRadius: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 2,
  },
  textoEsquerdo: {
    width: "70%",
  },
  botao: {
    backgroundColor: primary,
    alignItems: "center",
    justifyContent: "center",
    borderBottomStartRadius: 5,
    borderBottomEndRadius: 5,
    elevation: 3,
  },
  botaoInferior: {
    alignItems: "center",
    justifyContent: "center",
  },
  textoBotao: {
    color: "white",
  },
  modalConteiner: {
    backgroundColor: "white",
    width: "80%",
  },
});
