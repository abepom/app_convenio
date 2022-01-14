import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  SafeAreaView,
} from "react-native";
import { TextInput } from "react-native-paper";
import { themeLight as theme } from "../../utils/theme";
import styles, { primary, sucess, danger } from "../../utils/Style";

import PickerModal from "react-native-picker-modal-view";
import useConvenio from "../../Data/Convenio";
import DateTimePicker from "@react-native-community/datetimepicker";
import Carregando from "../Carregando";
import api from "../../api";
import formatCurrency from "currency-formatter";
import useLoad from "../../Data/Load";
const LancamentoComProntuario = (prop) => {
  const { associado, props } = prop;
  const { matricula, dep } = associado;
  const [quantidade, setQuantidade] = useState(1);
  const [procedimento, setProcedimento] = useState({
    Name: "",
    Valor_convenio: 0,
    Value: "",
  });
  const [descricao, setDescricao] = useState("");
  const [modal, setModal] = useState(false);
  const [modalProntuario, setModalProntuario] = useState(false);
  const [, setload] = useLoad();
  const [msnModal, setMsnModal] = useState({
    erro: true,
    mensagem: "",
  });
  const [prontuarioAnterior, setProntuarioAnterior] = useState({});
  const [mostrarItens, setMostrarItens] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [dataSel, setData] = useState(new Date());
  const [show, setShow] = useState(false);
  const [btnvisivel, setBtnvisivel] = useState(false);
  const [convenio, setConvenio] = useConvenio();
  const { procedimentos, tipo_lancamento, cd_da_area, token } = convenio;
  const carregarProcedimentos = async () => {
    const { data } = await api({
      method: "POST",
      url: "/procedimentos",
      data: { cd_da_area: convenio.cd_da_area },
      headers: { "x-access-token": convenio.token },
    });
    const proced = data.filter((item) => {
      if (item.desabilitado) {
        return false;
      } else {
        return true;
      }
    });
    setConvenio({ ...convenio, procedimentos: proced });
  };
  const carregarProntuarios = async () => {
    const { data } = await api({
      method: "POST",
      url: "/prontuarios",
      data: { matricula, dep, procedimento: `${procedimento.Value}` },
      headers: { "x-access-token": convenio.token },
    });

    return data;
  };
  useLayoutEffect(() => {
    carregarProcedimentos();
  }, []);
  useLayoutEffect(() => {
    if (
      (quantidade * procedimento.Valor_convenio).toFixed(2).toString() != "0.00"
    ) {
      setBtnvisivel(true);
    } else {
      setBtnvisivel(false);
    }
  }, [procedimento, quantidade]);
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || data;
    setShow(Platform.OS === "ios");
    setData(currentDate);
  };

  const Lancar = async () => {
    if (!mostrarItens) {
      let prontuarios = await carregarProntuarios();

      if (prontuarios.status == 1) {
        setProntuarioAnterior(prontuarios);

        if (prontuarios) {
          setModalProntuario(true);
        } else {
          await ContinuarLancamento();
        }
      } else {
        await ContinuarLancamento();
        Alert.alert("SUCESSO", "O prontuario foi criado com sucesso.");

        props.navigation.goBack();
      }
    } else {
      await ContinuarLancamento();
    }
    console.log(props);
  };
  async function ContinuarLancamento() {
    const { data } = await api({
      url: "/LancarVenda",
      method: "POST",
      data: {
        tipo_lancamento,
        cd_da_area,
        matricula,
        dep,
        data: dataSel,
        procedimento: procedimento.Value,
        descricao,
      },
      headers: { "x-access-token": token },
    });
    setload("ConsultarVendas");
    setModal(true);
    if (data.retorno == 1) {
      setMsnModal(data);
    } else {
      setMsnModal({ ...data, mensagem: "Erro ao efetuar desconto" });
    }

    setTimeout(() => {
      setCarregando(false);
    }, 2000);
  }

  return (
    <>
      <Modal visible={modalProntuario} {...props} transparent collapsable>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              width: "90%",
              height: "40%",
              alignItems: "center",

              borderRadius: 5,
              elevation: 2,
            }}
          >
            <Text style={{ paddingTop: 10, fontSize: 20, color: primary }}>
              ATENÇÃO
            </Text>
            <Text style={{ margin: 10, fontSize: 16 }}>
              Já existe um prontuario para esse associado, para continuar
              confirme no botão abaixo.
            </Text>
            <Text style={{ margin: 10, fontSize: 16 }}>
              Para criar um novo e necessário finalizar o prontuario em aberto.
            </Text>
            <View
              style={{
                flexDirection: "row",
                position: "absolute",
                bottom: 65,
                paddingHorizontal: 5,
              }}
            >
              <TouchableOpacity
                style={{
                  margin: 5,
                  flex: 1,
                  paddingVertical: 15,
                  paddingHorizontal: 40,
                  backgroundColor: primary,
                  borderRadius: 5,
                  alignItems: "center",
                }}
                onPress={async () => {
                  setMostrarItens(true);
                  setModalProntuario(false);
                  Alert.alert(
                    "ATENÇÃO",
                    "Não foi lançado o procedimento no prontuario, para adicionar selecione o botão Adicionar ao prontuario."
                  );
                }}
              >
                <Text style={{ color: "white" }}>
                  VISUALIZAR PRONTUARIO EM ABERTO
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                position: "absolute",
                bottom: 5,
                paddingHorizontal: 5,
              }}
            >
              <TouchableOpacity
                style={{
                  margin: 5,
                  flex: 1,
                  paddingVertical: 15,
                  paddingHorizontal: 40,
                  backgroundColor: sucess,
                  borderRadius: 5,
                  alignItems: "center",
                }}
                onPress={async () => {
                  await ContinuarLancamento();
                }}
              >
                <Text style={{ color: "white" }}>LANÇAR </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setModalProntuario(false);
                  props.navigation.goBack();
                }}
                style={{
                  margin: 5,
                  flex: 1,
                  paddingVertical: 15,
                  paddingHorizontal: 40,
                  backgroundColor: danger,
                  borderRadius: 5,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "white" }}>CANCELAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal visible={modal} {...props} transparent collapsable>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              width: "90%",
              height: msnModal.limite ? 150 : msnModal.data ? 250 : "30%",
              alignItems: "center",

              borderRadius: 5,
              elevation: 2,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                color: primary,
                paddingHorizontal: 20,
                marginTop: msnModal.limite ? 30 : 10,

                textAlign: "center",
              }}
            >
              {msnModal.mensagem}
              {msnModal.limite
                ? ` \n\n Limite atual é de ${formatCurrency.format(
                    msnModal.limite,
                    {
                      code: "BRL",
                    }
                  )}`
                : null}
            </Text>
            {msnModal.data && (
              <View
                style={{
                  backgroundColor: "#f5f4b3",
                  width: "90%",

                  padding: 10,
                }}
              >
                <Text
                  style={[
                    styles.textoG,
                    styles.textPrimary,
                    {
                      alignSelf: "center",
                      marginBottom: 5,
                      fontWeight: "bold",
                    },
                  ]}
                >
                  Dados da transação
                </Text>

                <Text style={[styles.textoG, styles.textPrimary]}>
                  Nº Lançamento: {msnModal.lancamento}
                </Text>
                <Text style={[styles.textoG, styles.textPrimary]}>
                  Associado: {msnModal.nome}
                </Text>
                <Text style={[styles.textoG, styles.textPrimary]}>
                  Valor:{" "}
                  {formatCurrency.format(msnModal.valor, {
                    code: "BRL",
                  })}
                </Text>
                <Text style={[styles.textoG, styles.textPrimary]}>
                  Data: {msnModal.data.split("-")[2]}/
                  {msnModal.data.split("-")[1]}/{msnModal.data.split("-")[0]}
                </Text>
              </View>
            )}
            <TouchableOpacity
              style={{
                position: "absolute",
                bottom: 0,
                height: 45,
                width: "100%",
                backgroundColor: primary,
                elevation: 3,
                borderBottomLeftRadius: 5,
                borderBottomRightRadius: 5,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={async () => {
                setModal(false);

                if (msnModal.retorno == 1) {
                  console.log(true);

                  props.navigation.goBack();
                } else {
                  console.log(false);

                  setCarregando(false);
                }
              }}
            >
              <Text style={{ color: "white" }}>FECHAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {carregando ? (
        <Carregando />
      ) : (
        <View style={{ width: "100%" }}>
          <TextInput
            label="Procedimentos"
            dense
            mode="outlined"
            keyboardType="numeric"
            theme={theme}
            style={[styles.imput]}
            value={procedimento.Name}
            render={(props) => (
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
                        {procedimento.Name}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
                onSelected={(a) => setProcedimento({ ...a })}
                items={procedimentos}
                showToTopButton={true}
                selected={procedimento}
                showAlphabeticalIndex={true}
                autoGenerateAlphabeticalIndex={true}
                selectPlaceholderText={"Selecione um..."}
                searchPlaceholderText={"Buscar..."}
                requireSelection={true}
                autoSort={false}
                renderListItem={(a, item) => (
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      padding: 10,
                      marginVertical: 5,
                      marginHorizontal: 20,
                    }}
                  >
                    <Text style={{ fontSize: 18 }}>{item.Name}</Text>
                    <Text>R$ {item.Valor_convenio.toFixed(2)}</Text>
                  </View>
                )}
              />
            )}
          />
          <TextInput
            label="Descrição"
            dense
            mode="outlined"
            keyboardType="default"
            theme={theme}
            multiline
            numberOfLines={3}
            style={[styles.imput]}
            value={descricao}
            onChangeText={setDescricao}
          />
          <View style={{ flexDirection: "row", width: "89%", marginLeft: 5 }}>
            <TextInput
              label="Data"
              dense
              value={dataSel}
              mode="outlined"
              onChange={onChange}
              theme={theme}
              style={[styles.imput, { height: 60, color: primary, flex: 1 }]}
              onFocus={() => alert(teste)}
              render={(props) => {
                if (show) {
                  return (
                    <DateTimePicker
                      {...props}
                      textColor={primary}
                      mode={"date"}
                      maximumDate={new Date()}
                    />
                  );
                } else {
                  return (
                    <Text
                      onPress={() => setShow(true)}
                      style={{
                        textAlignVertical: "center",
                        flex: 1,
                        marginLeft: 10,
                      }}
                    >
                      {`${dataSel.getDate()}`}/
                      {dataSel.getMonth() < 9
                        ? `0${dataSel.getMonth() + 1}`
                        : `${dataSel.getMonth() + 1}`}
                      /{`${dataSel.getFullYear()}`}
                    </Text>
                  );
                }
              }}
            />

            <TextInput
              label="Valor"
              dense
              mode="outlined"
              keyboardType="numeric"
              disabled
              theme={theme}
              style={[styles.imput, { flex: 1, height: 55, width: "10%" }]}
              value={
                "R$ " +
                (quantidade * procedimento.Valor_convenio).toFixed(2).toString()
              }
            />
          </View>
          <View style={{ width: "100%", paddingHorizontal: "10%" }}>
            {!carregando ? (
              <TouchableOpacity
                disabled={!btnvisivel}
                style={[
                  styles.btnDefault,
                  { marginVertical: 15, opacity: !btnvisivel ? 0.5 : 1 },
                ]}
                onPress={Lancar}
              >
                <Text style={{ color: "white" }}>
                  {mostrarItens ? "ADICIONAR AO PRONTUARIO" : "PROSSEGUIR"}
                </Text>
              </TouchableOpacity>
            ) : (
              <Carregando style={{ marginTop: 30 }} />
            )}
          </View>
          {mostrarItens && (
            <View style={{ width: "100%", paddingHorizontal: "10%" }}>
              <View
                style={{
                  backgroundColor: "white",
                  padding: 10,
                  marginTop: 10,
                  borderRadius: 5,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text>
                    Data: {prontuarioAnterior.Data_Inicio_Atendimento}{" "}
                  </Text>
                  <Text>
                    Atendimentos: {prontuarioAnterior.Quantidade_Atendimento}/
                    {prontuarioAnterior.Previsao_Atendimento}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text>
                    Valor total do Prontuario:{" R$ "}
                    {(
                      procedimentos.find((proced) => {
                        return (
                          proced.Value == prontuarioAnterior.cod_procedimento
                        );
                      }).Valor_convenio *
                      prontuarioAnterior.Quantidade_Atendimento
                    ).toFixed(2)}
                  </Text>
                </View>
              </View>
              <SafeAreaView style={{ flex: 1 }}>
                {prontuarioAnterior.itens.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: "white",
                      padding: 10,
                      marginTop: 10,
                      borderRadius: 5,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text>Data: {item.data_atendimento}</Text>
                    </View>
                    <TextInput
                      label="Descrição"
                      dense
                      mode="outlined"
                      keyboardType="numeric"
                      theme={theme}
                      value={item.Descricao}
                      disabled
                      multiline
                      numberOfLines={3}
                    />
                  </View>
                ))}
              </SafeAreaView>
              <TouchableOpacity
                onPress={() => props.navigation.goBack()}
                style={{
                  marginTop: 20,
                  backgroundColor: sucess,
                  padding: 20,
                  alignItems: "center",
                  borderRadius: 5,
                }}
              >
                <Text style={{ color: "white" }}>SAIR DO PRONTUARIO</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    "ATENÇÃO",
                    "Você deseja realmente finalizar esse prontuario? Não será mais possivel adicionar atendimentos a esse prontuario.",
                    [
                      {
                        text: "CONFIRMAR",
                        onPress: async () => {
                          const { data } = await api({
                            url: "/finalizarProntuario",
                            method: "POST",
                            data: {
                              prontuario: prontuarioAnterior.ID_Prontuario,
                            },
                            headers: { "x-access-token": token },
                          });

                          if (data.status) {
                            Alert.alert(
                              "SUCESSO",
                              "Prontuario foi finalizado com sucesso."
                            );
                            props.navigation.goBack();
                          } else {
                            Alert.alert(
                              "ATENÇÃO",
                              "Ocorreu um erro ao finalizar o prontuario."
                            );
                          }
                        },
                        style: "succes",
                      },
                      {
                        text: "CANCELAR",
                        onPress: () => {},
                        style: "cancel",
                      },
                    ]
                  );
                }}
                style={{
                  marginTop: 20,
                  backgroundColor: danger,
                  padding: 20,
                  alignItems: "center",
                  borderRadius: 5,
                }}
              >
                <Text style={{ color: "white" }}>FINALIZAR PRONTUARIO</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </>
  );
};

export default LancamentoComProntuario;
