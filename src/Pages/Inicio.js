import React, { useEffect, useState } from "react";
import {
  Text,
  Animated,
  Platform,
  View,
  ImageBackground,
  Image,
  Dimensions,
} from "react-native";
import styles, { primary } from "./../utils/Style";
import backgroundAnimado from "../../assets/splash.png";
import useUsuario from "../Data/Usuario";
import useConvenio from "../Data/Convenio";
import Carregando from "../Components/Carregando";
import app from "../../app.json";
import Constants from "expo-constants";
import TextAnimator from "../Components/TextAnimator";
import imagens from "../utils/imagens";
import {
  useFonts,
  DancingScript_400Regular,
} from "@expo-google-fonts/dancing-script";
const Load = (props) => {
  const [usuario] = useUsuario();

  const { navigation } = props;
  const [mostrarSlogan1, setMostrarSlogan1] = useState(false);
  const [mostrarSlogan2, setMostrarSlogan2] = useState(false);
  const [sloganFade] = useState(new Animated.Value(1));
  const [opacity] = useState(new Animated.Value(0));
  const [opacityLoad] = useState(new Animated.Value(0));
  const [opacidadeA] = useState(new Animated.Value(0));
  const [opacidadeB] = useState(new Animated.Value(0));
  const [opacidadeE] = useState(new Animated.Value(0));
  const [opacidadeP] = useState(new Animated.Value(0));
  const [opacidadeO] = useState(new Animated.Value(0));
  const [opacidadeM] = useState(new Animated.Value(0));
  const [carregando, setCarregando] = useState(false);
  const [load] = useState(new Animated.Value(0));
  let [fontsLoaded] = useFonts({
    DancingScript_400Regular,
  });
  let fonteSlogan = "DancingScript_400Regular";

  const habilitarSloganFinal = () => {
    setMostrarSlogan2(true);
  };

  const apagarSlogan = () => {
    Animated.timing(sloganFade, {
      toValue: 0,
      duration: 850,
      useNativeDriver: true,
    }).start();
    Animated.timing(opacityLoad, {
      toValue: 0,
      duration: 850,
      useNativeDriver: true,
    }).start();
  };

  const onLoad = async () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 550,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(opacityLoad, {
        toValue: 1,
        duration: 1250,
        useNativeDriver: true,
      }).start();
      Animated.timing(opacidadeA, {
        toValue: 1,
        duration: 650,
        useNativeDriver: true,
      }).start();
    }, 180);

    setTimeout(() => {
      Animated.timing(opacidadeB, {
        toValue: 1,
        duration: 650,
        useNativeDriver: true,
      }).start();
    }, 360);

    setTimeout(() => {
      Animated.timing(opacidadeE, {
        toValue: 1,
        duration: 650,
        useNativeDriver: true,
      }).start();
    }, 540);

    setTimeout(() => {
      Animated.timing(opacidadeP, {
        toValue: 1,
        duration: 650,
        useNativeDriver: true,
      }).start();
    }, 720);

    setTimeout(() => {
      Animated.timing(opacidadeO, {
        toValue: 1,
        duration: 650,
        useNativeDriver: true,
      }).start();
    }, 900);

    setTimeout(() => {
      Animated.timing(opacidadeM, {
        toValue: 1,
        duration: 650,
        useNativeDriver: true,
      }).start();

      setMostrarSlogan1(true);
    }, 1100);

    setTimeout(() => {
      apagarSlogan();
    }, 3800);

    if (usuario) {
      return navigation.navigate("Aplicacao");
    } else {
      setTimeout(() => {
        navigation.reset({ index: 0, routes: [{ name: "AcessoConvenio" }] });

        return navigation.navigate("AcessoConvenio");
      }, 4250);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: primary }}>
      <ImageBackground
        source={backgroundAnimado}
        resizeMode="cover"
        resizeMethod="scale"
        style={{
          flex: 1,
          resizeMode: "repeat",

          marginTop: Platform.OS === "ios" ? Constants.statusBarHeight : 0,
          height: Dimensions.get("window").height,
          width: Dimensions.get("window").width,
        }}
      >
        {carregando ? (
          <View style={[{ flex: 1 }, styles.center]}>
            <Carregando tamanho={150} cor={"#fff"} />
          </View>
        ) : (
          <View style={[styles.center, { flex: 1 }]}>
            <View
              style={{
                height: 150,
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Animated.Image
                onLoad={onLoad}
                source={imagens.logo_abepom_branca}
                style={{
                  opacity: opacity,
                  width: 150,
                  height: 150,
                  transform: [
                    {
                      scale: opacity.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.85, 1],
                      }),
                    },
                  ],
                }}
              />
            </View>
            <Animated.View
              style={{
                width: "100%",
                opacity: sloganFade,
              }}
            >
              <View
                style={[
                  {
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 60,
                  },
                ]}
              >
                <Animated.Text
                  style={{
                    opacity: opacidadeA,
                    fontSize: 35,
                    color: "#fff",
                    paddingHorizontal: 5,
                    transform: [
                      {
                        scale: opacidadeA.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.85, 1],
                        }),
                      },
                    ],
                  }}
                >
                  A
                </Animated.Text>
                <Animated.Text
                  style={{
                    opacity: opacidadeB,
                    fontSize: 35,
                    color: "#fff",
                    paddingHorizontal: 5,
                    transform: [
                      {
                        scale: opacidadeB.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.85, 1],
                        }),
                      },
                    ],
                  }}
                >
                  B
                </Animated.Text>
                <Animated.Text
                  style={{
                    opacity: opacidadeE,
                    fontSize: 35,
                    color: "#fff",
                    paddingHorizontal: 5,
                    transform: [
                      {
                        scale: opacidadeE.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.85, 1],
                        }),
                      },
                    ],
                  }}
                >
                  E
                </Animated.Text>
                <Animated.Text
                  style={{
                    opacity: opacidadeP,
                    fontSize: 35,
                    color: "#fff",
                    paddingHorizontal: 5,
                    transform: [
                      {
                        scale: opacidadeP.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.85, 1],
                        }),
                      },
                    ],
                  }}
                >
                  P
                </Animated.Text>
                <Animated.Text
                  style={{
                    opacity: opacidadeO,
                    fontSize: 35,
                    color: "#fff",
                    paddingHorizontal: 5,
                    transform: [
                      {
                        scale: opacidadeO.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.85, 1],
                        }),
                      },
                    ],
                  }}
                >
                  O
                </Animated.Text>
                <Animated.Text
                  style={{
                    opacity: opacidadeM,
                    fontSize: 35,
                    color: "#fff",
                    paddingHorizontal: 5,
                    transform: [
                      {
                        scale: opacidadeM.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.85, 1],
                        }),
                      },
                    ],
                  }}
                >
                  M
                </Animated.Text>
              </View>
              <View
                style={{
                  height: 50,
                  marginLeft: 30,
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                }}
              >
                {mostrarSlogan1 && (
                  <TextAnimator
                    content="Feito por nós..."
                    textStyle={{
                      fontSize: 28,
                      color: "#fff",
                      marginBottom: 5,
                      fontFamily: fonteSlogan,
                      textAlign: "left",
                    }}
                    style={{
                      justifyContent: "flex-start",
                      alignItems: "center",
                      textAlign: "left",
                      width: "70%",
                    }}
                    duration={300}
                    onFinish={habilitarSloganFinal}
                  />
                )}
              </View>
              <View
                style={{
                  height: 50,
                  marginRight: 30,
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                }}
              >
                {mostrarSlogan2 && (
                  <TextAnimator
                    content="...pensando em você!"
                    textStyle={{
                      fontSize: 28,
                      color: "#fff",
                      marginBottom: 5,
                      fontFamily: fonteSlogan,
                    }}
                    style={{
                      justifyContent: "flex-end",
                      alignItems: "center",
                      width: "70%",
                    }}
                    duration={300}
                  />
                )}
              </View>
            </Animated.View>
          </View>
        )}
        <Animated.View style={{ opacity: opacityLoad }}>
          <View style={[styles.center, { bottom: 10 }]}>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ color: "#fff", fontSize: 12, marginRight: 10 }}>
                FAMÍLIA ABEPOM
              </Text>
              <Image
                source={imagens.coracao}
                style={{ width: 15, height: 15 }}
              />
            </View>
            <Text style={{ color: "#fff" }}>Versão: {app.expo.version}</Text>
          </View>
        </Animated.View>
      </ImageBackground>
    </View>
  );
};

export default Load;
