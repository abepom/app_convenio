import React, { useState, useEffect } from "react";
import { View, ImageBackground, Image, Text, AsyncStorage } from "react-native";
import bg from "../assets/img/background.png";
import logo from "../assets/img/logo.png";
import logo1 from "../assets/img/logo1.png";
import logo2 from "../assets/img/logo2.png";
import styles, { danverBackground, danger } from "../constants/Style";
import StatusBar from "../components/StatusBar";
import TextInput from "../components/imputText";
import Button from "../components/Button";
import axios from "axios";
import api from "../constants/api";
import { TextInputMask } from "react-native-masked-text";

export default Login = props => {
  const [state, setState] = useState({
    erro: false,
    mensagem: ""
  });
  const [doc, setdoc] = useState("062.579.149-57");
  const [senha, setSenha] = useState("443163");

  const login = async () => {
    console.log(doc, senha);
    if (doc !== "" && senha !== "") {
      const { data } = await api.post("/Login", { usuario: doc, senha });
      console.log(data.convenio);
      if (!data.erro) {
        await AsyncStorage.setItem("usuario", JSON.stringify({ doc, senha }));
        await AsyncStorage.setItem("convenio", JSON.stringify(data.convenio));
        props.navigation.navigate("Main");
      }
    } else {
      setState({
        ...state,
        erro: true,
        mensagem: "Verifique usuário e senha"
      });
    }
  };

  return (
    <>
      <StatusBar />
      <ImageBackground
        source={bg}
        style={[styles.bgImage, { alignItems: "center" }]}
      >
        <Image style={[styles.logo, { marginTop: 100 }]} source={logo} />

        <View style={{ height: 45 }}>
          <View style={{ paddingVertical: 10 }}>
            <Text style={{ marginLeft: 10 }}>CPF / CNPJ</Text>

            <TextInputMask
              ref={() => {}}
              type={doc.length > 14 ? "cnpj" : "cpf"}
              style={[styles.input, { paddingLeft: 20 }]}
              value={doc}
              onChangeText={setdoc}
              placeholder="CPF / CNPJ"
            />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Senha"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />
          {state.erro && (
            <View
              style={{
                backgroundColor: danverBackground,
                margin: 10,
                borderRadius: 5,
                borderColor: danger,
                height: 45,
                justifyContent: "center"
              }}
            >
              <Text style={{ color: danger, textAlign: "center" }}>
                {state.mensagem}
              </Text>
            </View>
          )}
          <Button
            style={{ marginTop: 20, marginLeft: 10 }}
            placeholder="ACESSAR"
            onPress={login}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            position: "absolute",
            justifyContent: "space-around",
            bottom: 50,
            width: "100%"
          }}
        >
          <Image source={logo1} style={{ width: 100, height: 100 }} />
          <Image source={logo2} style={{ width: 100, height: 100 }} />
        </View>
      </ImageBackground>
    </>
  );
};
