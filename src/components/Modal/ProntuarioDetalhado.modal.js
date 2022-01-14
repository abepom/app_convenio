import React, { useEffect, useState } from "react";
import {
  View,
  Modal,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import api from "../../api";
import useConvenio from "../../Data/Convenio";
import styles, { primary, sucess, sucessBack } from "../../utils/Style";
import Carregando from "../Carregando";
import formatCurrency from "currency-formatter";

// import { Container } from './styles';

const ProntuarioDetalhado = (props) => {
  const { visualizar, Nr_lancamento } = props;
  const [{ token }] = useConvenio();
  const [state, setstate] = useState({ ID_Prontuario: null });
  useEffect(() => {
    api({
      method: "get",
      url: "/prontuarios",
      params: { prontuario: Nr_lancamento },
      headers: { "x-access-token": token },
    }).then(({ data }) => {
      console.log({ ...data[0], itens: JSON.parse(data[0].itens) });
      setstate({ ...data[0], itens: JSON.parse(data[0].itens) });
    });
  }, [Nr_lancamento]);
  const [mostrar, setMostrar] = visualizar;

  return (
    <Modal visible={mostrar} transparent>
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
            borderTopRightRadius: 4,
            borderTopLeftRadius: 4,
            backgroundColor: `white`,
            paddingVertical: 10,
            paddingHorizontal: 5,
            width: "90%",
          }}
        >
          {!state.ID_Prontuario ? (
            <Carregando />
          ) : (
            <>
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
                  Prontuario:{" "}
                  <Text style={{ fontWeight: "100" }}>
                    {state.ID_Prontuario}
                  </Text>
                </Text>
                <Text
                  style={[
                    styles.textoM,
                    { fontWeight: "bold", marginVertical: 2 },
                  ]}
                >
                  Matricula:
                  <Text style={{ fontWeight: "100" }}> {state.matricula}</Text>
                </Text>
              </View>
              <Text
                style={[
                  styles.textoM,
                  { fontWeight: "bold", marginVertical: 2 },
                ]}
              >
                Associado:{" "}
                <Text style={{ fontWeight: "100" }}>{state.nome}</Text>
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
                  Parcelamento:{" "}
                  <Text style={{ fontWeight: "100" }}>
                    {`${state.Quantidade_Atendimento} x ${formatCurrency.format(
                      state.Valor,
                      {
                        code: "BRL",
                      }
                    )}`}
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
                    {state.Data_Inicio_Atendimento}
                  </Text>
                </Text>
              </View>
              <View>
                <View style={{ flexDirection: "row", marginTop: 10 }}>
                  <Text style={{ width: "75%", fontWeight: "bold" }}>
                    Itens
                  </Text>
                  <Text style={{ fontWeight: "bold" }}>Valor</Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    marginVertical: 5,
                    borderBottomColor: primary,
                    borderBottomWidth: 2,
                  }}
                />
              </View>
              <SafeAreaView style={{ maxHeight: 500 }}>
                <FlatList
                  data={state.itens}
                  style={{ maxHeight: 400 }}
                  keyExtractor={({ index }) => index}
                  renderItem={({ item, index }) => {
                    return (
                      <View key={index}>
                        <View key={index} style={{ flexDirection: "row" }}>
                          <Text style={{ width: "75%" }}>
                            {state.desc_procedimento} {"\n"}
                            {item.Descricao}
                          </Text>
                          <Text>
                            {formatCurrency.format(item.Valor ?? state.Valor, {
                              code: "BRL",
                            })}
                          </Text>
                        </View>
                        <View
                          style={{
                            flex: 1,
                            marginVertical: 5,
                            borderBottomColor: primary,
                            borderBottomWidth: 2,
                          }}
                        />
                      </View>
                    );
                  }}
                />
              </SafeAreaView>
            </>
          )}
        </View>
        <TouchableOpacity
          onPress={() => {
            setMostrar(false);
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
      </View>
    </Modal>
  );
};

export default ProntuarioDetalhado;
