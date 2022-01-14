import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { TextInput } from "react-native-paper";
import { themeLight as theme } from "../../utils/theme";
import styles, { primary } from "../../utils/Style";
import { TextInputMask } from "react-native-masked-text";
import useConvenio from "../../Data/Convenio";
import Carregando from "../Carregando";
import api from "../../api";
import formatCurrency from "currency-formatter";
import useLoad from "../../Data/Load";
const GrupoDeLancamentos = ({ associado, props }) => {
  const { matricula, dep } = associado;
  const [descricao, setDescricao] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [valor, setValor] = useState("0,00");
  const [modal, setModal] = useState(false);
  const [msnModal, setMsnModal] = useState({
    erro: true,
    mensagem: "",
  });
  const [, setload] = useLoad();
  const [carregando, setCarregando] = useState(false);

  const [btnvisivel, setBtnvisivel] = useState(false);
  const [convenio] = useConvenio();
  const { tipo_lancamento, cd_da_area, token } = convenio;

  useEffect(() => {
    if (valor != "0,00" && descricao != "") {
      setBtnvisivel(true);
    } else {
      setBtnvisivel(false);
    }
  }, [valor, descricao]);
  const Lancar = async () => {
    setCarregando(true);

    let total = valor
      .replace(/[.]/g, "")
      .replace(/[,]/g, ".")
      .replace("R$ ", "");

    const { data } = await api({
      url: "/LancarVenda",
      method: "POST",

      data: {
        tipo_lancamento,
        cd_da_area,
        matricula,
        dep,
        procedimento: descricao,
        quantidade,
        valor: total,
      },
      headers: { "x-access-token": token },
    });

    if (data.retorno == 1) {
      setMsnModal(data);
    }
    setModal(true);
    setload("ConsultarVendas");
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
              height: msnModal.limite ? 270 : msnModal.data ? 250 : "30%",
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
                marginTop: 10,

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
          label="Descrição"
          dense
          mode="outlined"
          keyboardType="default"
          theme={theme}
          multiline
          style={[styles.imput]}
          value={descricao.toString()}
          onChangeText={setDescricao}
        />
        <TextInput
          label="Quantidade de Parcelas"
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
          label="Valor da Parcela"
          dense
          mode="outlined"
          keyboardType="numeric"
          theme={theme}
          style={[styles.imput]}
          value={valor}
          onChangeText={(a) => {
            setValor(a);
          }}
          render={(props) => (
            <TextInputMask
              type={"money"}
              options={{
                precision: 2,
                separator: ",",
                delimiter: ".",
                unit: "R$ ",
                suffixUnit: "",
              }}
              {...props}
            />
          )}
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
