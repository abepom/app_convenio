import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  Animated,
  Keyboard,
  Alert,
} from "react-native";

import logo from "../../assets/img/logo_abepom_branca.png";
import backgroundAnimado from "../../assets/splash.png";
import styles, { primary } from "../utils/Style";
import api from "../api";
import { ScrollView } from "react-native-gesture-handler";
import useUsuario from "../Data/Usuario";
import useConvenio from "../Data/Convenio";
import LoginAdm from "../Components/AcessoAdm";
import Constants from "expo-constants";
import { useStore } from "../Data/store";
import * as Updates from "expo-updates";

const initialLayout = { width: Dimensions.get("window").width };

const Login = (props) => {
  const [carregando, setCarregando] = useState(false);
  const [reset, setReset] = useState(false);
  const [state, setState] = useState({
    erro: false,
    mensagem: "",
  });
  const [, setUsuario] = useUsuario();
  const [, setConv] = useConvenio();
  const [, setStore] = useStore();

  useEffect(() => {
    if (state.erro) {
      setTimeout(() => {
        setState({ ...state, erro: false });
      }, 6000);
    }
  }, [state.erro]);

  useEffect(() => {
    if (props.route.params?.deslogar) {
      setStore({ carregouDados: false });
      setCarregando(false);
    }
  }, [props.route]);
  useEffect(() => {
    // if (props.navigation.state.params) {
    // 	if (props.navigation.state.params.index) {
    // 		setIndex(props.navigation.state.params.index);
    // 	}

    // 	setState(props.navigation.state.params);
    // }
    if (Constants.isDevice && Platform.OS != "web") {
      Updates.checkForUpdateAsync().then(({ isAvailable }) => {
        if (isAvailable) {
          Updates.fetchUpdateAsync();
          Alert.alert(
            "ATUALIZAÇÃO",
            "O aplicativo ABEPOM Convênios foi atualizado com sucesso, estamos reiniciando o aplicativo.",
            [
              {
                text: "CONFIRMAR",
                onPress: () => Updates.reloadAsync(),
              },
              {
                text: "MANTER ABERTO",
              },
            ]
          );
        }
      });
    }
  }, []);
  const window = Dimensions.get("window");
  const IMAGE_HEIGHT = window.width / 3;
  const IMAGE_HEIGHT_SMALL = window.width / 7;
  const [alturaLogo] = useState(new Animated.Value(IMAGE_HEIGHT));

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

    // LIMPAR EVENTOS DO TECLADO
    return () => {
      Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
      Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
    };
  }, []);
  const _keyboardDidShow = () => {
    Animated.timing(alturaLogo, {
      duration: 200,
      toValue: IMAGE_HEIGHT_SMALL,
      useNativeDriver: false,
    }).start();
  };

  const _keyboardDidHide = () => {
    Animated.timing(alturaLogo, {
      duration: 200,
      toValue: IMAGE_HEIGHT,
      useNativeDriver: false,
    }).start();
  };

  const conectar = async (imput) => {
    setCarregando(true);
    const { doc, pass } = imput;
    if (doc.length > 12 && pass) {
      try {
        const { data } = await api.post("/Login", {
          doc: doc,
          senha: pass,
          convenios: true,
        });
        let convenio;
        if (!data.erro) {
          const procedimentos = await api({
            method: "POST",
            url: "/procedimentos",
            data: { cd_da_area: data["cd_convênio"] },
            headers: { "x-access-token": data.token },
          });
          setUsuario(imput);
          convenio = {
            id_gds: data.id_gds,
            nome_parceiro: data.nome_parceiro,
            caminho_logomarca: data.caminho_logomarca
              ? `${data.caminho_logomarca}?id=${Math.random()}`
              : null,
            efetuarVenda: data.efetuarVenda,
            doc: data.doc,
            usuario: data.usuario,
            nivel: data.nivel,
            token: data.token,
            cd_convenio: data["cd_convênio"],
            primeiro_acesso: data.primeiro_acesso,
            tipo_lancamento: data.tipo_lancamento,
            cd_da_area: data.Cd_da_area,
            efetuarVenda: data.efetuarVenda,

            procedimentos: procedimentos.data,
          };

          await setConv(convenio);
          props.navigation.navigate("Aplicacao");
        } else {
          setCarregando(false);
          console.log(error.message);

          setState({ erro: true, mensagem: "Usuário ou Senha incorretos" });
        }
      } catch (error) {
        console.log(error.message);
        setState({ erro: true, mensagem: "Usuário ou Senha incorretos" });
        setCarregando(false);
      }
    } else {
      setState({ erro: true, mensagem: "Usuário ou Senha incorretos" });
      console.log(error.message);
      setCarregando(false);
    }
  };

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : ""}
        style={{
          flex: 1,
        }}
      >
        <ScrollView
          style={{
            width: "100%",
            height: Dimensions.get("window").height,
            backgroundColor: primary,
          }}
        >
          <ImageBackground
            source={backgroundAnimado}
            resizeMode="cover"
            resizeMethod="scale"
            style={{
              flex: 1,
              resizeMode: "repeat",

              height: Dimensions.get("window").height,
              width: Dimensions.get("window").width,
            }}
          >
            <Animated.Image
              style={{
                marginTop: "10%",
                alignSelf: "center",

                height: alturaLogo,
                resizeMode: "contain",
              }}
              source={logo}
            />

            <View style={{ alignItems: "center" }}>
              <Text style={[styles.white, styles.textoGG]}>ABEPOM</Text>
            </View>
            <LoginAdm
              {...props}
              carregando={carregando}
              setState={setState}
              state={state}
              reset={reset}
              func={conectar}
              setReset={setReset}
            />
          </ImageBackground>
        </ScrollView>

        {/* </View> */}
      </KeyboardAvoidingView>
    </>
  );
};

export default Login;
