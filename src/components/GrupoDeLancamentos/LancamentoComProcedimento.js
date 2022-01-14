import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { TextInput } from "react-native-paper";
import { themeLight as theme } from "../../utils/theme";
import styles, { primary } from "../../utils/Style";
import { TextInputMask } from "react-native-masked-text";
import PickerModal from "react-native-picker-modal-view";
import useConvenio from "../../Data/Convenio";
import DateTimePicker from "@react-native-community/datetimepicker";
import Carregando from "../Carregando";
import api from "../../api";
import formatCurrency from "currency-formatter";
import useLoad from "../../Data/Load";

const GrupoDeLancamentos = ({ associado, props }) => {
  const { matricula, dep } = associado;
  const [quantidade, setQuantidade] = useState(1);
  const [procedimento, setProcedimento] = useState({
    Name: "",
    Valor_convenio: 0,
  });
  const [modal, setModal] = useState(false);
  const [msnModal, setMsnModal] = useState({
    erro: true,
    mensagem: "",
  });
  const [, setload] = useLoad();
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
  useEffect(() => {
    carregarProcedimentos();
  }, []);
  useEffect(() => {
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
    setCarregando(true);

    let valor = quantidade * procedimento.Valor_convenio;

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
        quantidade,
        valor,
      },
      headers: { "x-access-token": token },
    });

    setload("ConsultarVendas");

    setMsnModal(data);

    setModal(true);

    setTimeout(() => {
      setCarregando(false);
    }, 2000);
  };

  return (
    <>
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
              height: msnModal.limite ? 130 : msnModal.data ? 250 : "30%",
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
                ? ` \n Limite atual é de ${formatCurrency.format(
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
              onPress={() => {
                setModal(false);

                if (msnModal.retorno) {
                  props.navigation.goBack();
                } else {
                  setCarregando(false);
                }
              }}
            >
              <Text style={{ color: "white" }}>FECHAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={{ width: "100%" }}>
        <TextInput
          label="Data"
          dense
          value={dataSel}
          mode="outlined"
          onChange={onChange}
          theme={theme}
          style={[styles.imput, { height: 55, color: primary }]}
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
              onClosed={console.log}
              onBackButtonPressed={console.log}
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
          label="Quantidade"
          dense
          mode="outlined"
          keyboardType="numeric"
          theme={theme}
          style={[styles.imput]}
          value={quantidade.toString()}
          onChangeText={setQuantidade}
          render={(props) => (
            <TextInputMask
              type={"custom"}
              options={{
                mask: "99",
              }}
              {...props}
            />
          )}
        />
        <TextInput
          label="Valor"
          dense
          mode="outlined"
          keyboardType="numeric"
          disabled
          theme={theme}
          style={[styles.imput]}
          value={
            "R$ " +
            (quantidade * procedimento.Valor_convenio).toFixed(2).toString()
          }
        />
        <View style={{ width: "100%", paddingHorizontal: "10%" }}>
          {!carregando ? (
            <TouchableOpacity
              disabled={!btnvisivel}
              style={[
                styles.btnDefault,
                { marginTop: 30, opacity: !btnvisivel ? 0.5 : 1 },
              ]}
              onPress={Lancar}
            >
              <Text style={{ color: "white" }}>CADASTRAR LANÇAMENTO</Text>
            </TouchableOpacity>
          ) : (
            <Carregando style={{ marginTop: 30 }} />
          )}
        </View>
      </View>
    </>
  );
};

export default GrupoDeLancamentos;
