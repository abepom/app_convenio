import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  ScrollView,
  Picker,
  TouchableOpacity,
  Image
} from "react-native";
import { TextInput, HelperText } from "react-native-paper";
import Header from "../components/Header";
import { TextInputMask } from "react-native-masked-text";
import api from "../services/api";

function SugerirConvenios(props) {
  const [cidades, setCidades] = useState([]);
  const [areas, setAreas] = useState([]);
  const [inputs, setInputs] = useState({
    nome: "",
    responsavel: "Bruno Fernandes",
    telefone: "48 984414934",
    celular: "48 21070515",
    cidade: "0001",
    area: "0004",
    outra: false,
    outraArea: "",
    descricao: ""
  });

  const [helpers, setHelpers] = useState({
    nome: { status: false, descricao: "" },
    outraArea: { status: false, descricao: "" },
    descricao: { status: false, descricao: "" }
  });

  useEffect(() => {
    async function listarCidades() {
      const response = await api.get("/listarCidades");

      setCidades([...response.data]);
    }

    async function listarAreas() {
      const response = await api.get("/listarAreas");

      setAreas([
        ...response.data,
        { cd_da_area: "0000", nome: "OUTROS", caminho_icone: null }
      ]);
    }

    listarCidades();
    listarAreas();
  }, []);

  function validarCampos() {
    let retorno = true;

    if (!inputs.nome || !inputs.cidade || !inputs.area || !inputs.descricao) {
      retorno = false;
    }

    return retorno;
  }

  async function cadastrarSugestao() {
    if (validarCampos()) {
      const response = await api.post("/cadastrarSugestao", {
        cartao: "00395900001",
        ...inputs
      });

      alert(response.data.mensagem);
      setInputs({
        ...inputs,
        nome: "",
        responsavel: "",
        telefone: "",
        celular: "",
        cidade: "0001",
        area: "0001",
        outra: false,
        descricao: ""
      });
    }
  }

  return (
    <>
      <Header {...props} voltar titulo="Sugerir Convênios" />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          paddingHorizontal: 20
        }}
      >
        <ScrollView style={{ paddingTop: 20, marginBottom: 20 }}>
          <Text
            style={{
              color: "#04254e",
              fontSize: 15,
              textAlign: "center",
              marginBottom: 10
            }}
          >
            Ajude-nos a expandir nossos serviços
          </Text>
          <TextInput
            error={helpers.nome.status}
            label="Nome da Empresa"
            value={inputs.nome}
            mode="outlined"
            onChangeText={texto => {
              setInputs({ ...inputs, nome: texto });
              !texto
                ? setHelpers({
                    ...helpers,
                    nome: {
                      status: true,
                      descricao: "O campo nome da empresa encontra-se vazio."
                    }
                  })
                : setHelpers({
                    ...helpers,
                    nome: { status: false, descricao: "" }
                  });
            }}
            onBlur={() => {
              !inputs.nome &&
                setHelpers({
                  ...helpers,
                  nome: {
                    status: true,
                    descricao: "O campo nome da empresa encontra-se vazio."
                  }
                });
            }}
            style={{ marginBottom: 10 }}
            theme={{ colors: { primary: "#04254e", accent: "#3510DE" } }}
            maxLength={100}
          />
          <HelperText
            type="error"
            visible={helpers.nome.status}
            style={{
              marginTop: -10,
              paddingLeft: 0,
              position: "relative",
              height: helpers.nome.status ? 30 : 0
            }}
          >
            {helpers.nome.descricao}
          </HelperText>
          <TextInput
            label="Responsável"
            value={inputs.responsavel}
            mode="outlined"
            onChangeText={texto => setInputs({ ...inputs, responsavel: texto })}
            style={{ marginBottom: 10 }}
            theme={{ colors: { primary: "#04254e", accent: "#3510DE" } }}
            maxLength={100}
          />
          <TextInput
            label="Telefone"
            value={inputs.telefone}
            mode="outlined"
            onChangeText={texto => setInputs({ ...inputs, telefone: texto })}
            style={{ marginBottom: 10 }}
            theme={{ colors: { primary: "#04254e", accent: "#3510DE" } }}
            maxLength={14}
            render={props => (
              <TextInputMask
                {...props}
                type={"cel-phone"}
                options={{
                  maskType: "BRL",
                  withDDD: true,
                  dddMask: "(99) "
                }}
              />
            )}
          />
          <TextInput
            label="Celular / Whatsapp"
            value={inputs.celular}
            mode="outlined"
            onChangeText={texto => setInputs({ ...inputs, celular: texto })}
            style={{ marginBottom: 10 }}
            theme={{ colors: { primary: "#04254e", accent: "#3510DE" } }}
            maxLength={15}
            render={props => (
              <TextInputMask
                {...props}
                type={"cel-phone"}
                options={{
                  maskType: "BRL",
                  withDDD: true,
                  dddMask: "(99) "
                }}
              />
            )}
          />
          <TextInput
            label="Cidade"
            value={inputs.cidade}
            mode="outlined"
            onChangeText={texto => setInputs({ ...inputs, cidade: texto })}
            style={{ marginBottom: 10 }}
            theme={{ colors: { primary: "#04254e", accent: "#3510DE" } }}
            render={props => (
              <Picker
                prompt="Selecione uma Cidade"
                selectedValue={inputs.cidade}
                onValueChange={(itemValue, itemIndex) => {
                  setInputs({ ...inputs, cidade: itemValue });
                }}
              >
                {cidades.map(cidade => (
                  <Picker.Item
                    key={cidade.codigo}
                    value={cidade.codigo}
                    label={cidade.nome.toUpperCase()}
                  />
                ))}
              </Picker>
            )}
          />
          <TextInput
            label="Área de Atuação"
            value={inputs.area}
            mode="outlined"
            onChangeText={texto => setInputs({ ...inputs, area: texto })}
            style={{ marginBottom: 10 }}
            theme={{ colors: { primary: "#04254e", accent: "#3510DE" } }}
            render={props => (
              <Picker
                prompt="Selecione uma Área de Atuação"
                selectedValue={inputs.area}
                onValueChange={(itemValue, itemIndex) => {
                  setInputs({
                    ...inputs,
                    area: itemValue,
                    outra: itemValue === "0000" ? true : false
                  });

                  console.log(inputs.outra, inputs.area);
                }}
              >
                {areas.map(area => (
                  <Picker.Item
                    key={area.cd_da_area}
                    value={area.cd_da_area}
                    label={area.nome}
                  >
                    <Image
                      source={{ uri: area.caminho_icone }}
                      style={{ width: 20, height: 20 }}
                    />
                    <Text>{area.nome}</Text>
                  </Picker.Item>
                ))}
              </Picker>
            )}
          />
          {inputs.outra && (
            <>
              <TextInput
                error={helpers.outraArea.status}
                label="Outra Área"
                value={inputs.outraArea}
                mode="outlined"
                onChangeText={texto => {
                  setInputs({ ...inputs, outraArea: texto });
                  !texto
                    ? setHelpers({
                        ...helpers,
                        outraArea: {
                          status: true,
                          descricao: "Informe o nome da área desejada."
                        }
                      })
                    : setHelpers({
                        ...helpers,
                        outraArea: { status: false, descricao: "" }
                      });
                }}
                style={{ marginBottom: 10 }}
                theme={{ colors: { primary: "#04254e", accent: "#3510DE" } }}
                maxLength={50}
                onBlur={() => {
                  !inputs.outraArea &&
                    setHelpers({
                      ...helpers,
                      outraArea: {
                        status: true,
                        descricao: "Informe o nome da área desejada."
                      }
                    });
                }}
              />
              <HelperText
                type="error"
                visible={helpers.outraArea.status}
                style={{
                  marginTop: -10,
                  paddingLeft: 0,
                  position: "relative",
                  height: helpers.outraArea.status ? 30 : 0
                }}
              >
                {helpers.outraArea.descricao}
              </HelperText>
            </>
          )}
          <TextInput
            error={helpers.descricao.status}
            label="Descrição"
            value={inputs.descricao}
            mode="outlined"
            multiline={true}
            numberOfLines={4}
            onChangeText={texto => {
              setInputs({ ...inputs, descricao: texto });
              !texto
                ? setHelpers({
                    ...helpers,
                    descricao: {
                      status: true,
                      descricao: "Informe uma descrição para o convênio."
                    }
                  })
                : setHelpers({
                    ...helpers,
                    descricao: { status: false, descricao: "" }
                  });
            }}
            onBlur={() => {
              !inputs.descricao &&
                setHelpers({
                  ...helpers,
                  descricao: {
                    status: true,
                    descricao: "Informe uma descrição para o convênio."
                  }
                });
            }}
            style={{ marginBottom: 10 }}
            theme={{ colors: { primary: "#04254e", accent: "#3510DE" } }}
            maxLength={350}
          />
          <HelperText
            type="error"
            visible={helpers.descricao.status}
            style={{
              marginTop: -10,
              paddingLeft: 0,
              position: "relative",
              height: helpers.descricao.status ? 30 : 0
            }}
          >
            {helpers.descricao.descricao}
          </HelperText>
          {!inputs.nome || !inputs.descricao ? (
            <>
              <View
                style={{
                  backgroundColor: "#d1d1d1",
                  borderRadius: 10,
                  flexDirection: "row",
                  padding: 15,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 10
                }}
              >
                <>
                  <Text style={{ color: "#fff", marginRight: 10 }}>
                    ENVIAR SUGESTÃO
                  </Text>
                  <Image
                    source={require("../../assets/img/seta_direita.png")}
                    style={{ width: 20, height: 20 }}
                    tintColor="#fff"
                  />
                </>
              </View>
              <Text
                style={{ fontSize: 12, color: "#666", textAlign: "center" }}
              >
                Preencha os campos para habilitar o envio
              </Text>
            </>
          ) : (
            <TouchableOpacity
              style={{
                backgroundColor: "#04254e",
                borderRadius: 10,
                flexDirection: "row",
                padding: 15,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 32
              }}
              onPress={() => {
                cadastrarSugestao();
              }}
            >
              <>
                <Text style={{ color: "#fff", marginRight: 10 }}>
                  ENVIAR SUGESTÃO
                </Text>
                <Image
                  source={require("../../assets/img/seta_direita.png")}
                  style={{ width: 20, height: 20 }}
                  tintColor="#fff"
                />
              </>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    </>
  );
}

export default SugerirConvenios;
