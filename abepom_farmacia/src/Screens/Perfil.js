import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import DadosGerais from "./DadosGerais";
import Enderecos from "./Enderecos";
import AlterarSenha from "./AlterarSenha";
import styles, { primary, background } from "../utils/Style";
import imagens from "../utils/imagens";
import * as Permissions from "expo-permissions";
import Icone from "@expo/vector-icons/MaterialCommunityIcons";
import icone from "../../assets/img/abepom.png";
import { Rating } from "react-native-ratings";
import * as ImagePicker from "expo-image-picker";
import api from "../api";
import useConvenio from "../Data/Convenio";
import Carregando from "../components/Carregando";

const initialLayout = { width: Dimensions.get("window").width };

export default function TabViewExample(props) {
  // console.log(Image.queryCache().then(a => {
  //     //a["http://187.94.98.194:3916/logomarcas/logomarca-430.jpg?id=0.3257220523452733"] = null
  //     console.log(a)
  // }), 'imagem')
  const [index, setIndex] = useState(0);
  const [carregandoIMG, setCarregandoIMG] = useState(false);
  const [avaliacao, setAvaliacao] = useState({
    carregando: true,
    votos: 0,
    media: 5.0,
  });
  const [convenio, setConvenio] = useConvenio();
  useEffect(() => {
    consultarAvaliacoes(convenio.id_gds);
  }, []);

  const consultarAvaliacoes = async (id_gds) => {
    setAvaliacao({ ...avaliacao, carregando: true });
    await api
      .get(`/user/avaliacoes`, { params: { id_gds } })
      .then(({ data }) => {
        data.map(({ votos, media }) => {
          if (media) {
            setAvaliacao({
              ...avaliacao,
              votos: votos ? votos : 0,
              media: media ? media : 5.0,
              carregando: false,
            });
          }
        });
      });
  };
  const [routes] = useState([
    { key: "1", title: "Dados Gerais" },
    { key: "2", title: "Endereços" },
    { key: "3", title: "Alterar Senha" },
  ]);

  const renderScene = SceneMap({
    "1": DadosGerais,
    "2": Enderecos,
    "3": AlterarSenha,
  });

  const salvarImagem = async (imagem) => {
    let nome = {
      name: `logomarca-${convenio.id_gds}.${
        imagem.uri.split(".")[imagem.uri.split(".").length - 1]
      }`,
    };
    const { uri } = imagem;
    const type = `image/${
      imagem.uri.split(".")[imagem.uri.split(".").length - 1]
    }`;
    console.log({ uri, type, ...nome });
    const data = new FormData();
    data.append("id_gds", `${convenio.id_gds}`);
    data.append("file", { uri, type, ...nome });
    setCarregandoIMG(true);

    await api
      .post("/user/upload", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((a) => {
        setConvenio({
          ...convenio,
          caminho_logomarca: a.data.caminho_logomarca,
        });
        setCarregandoIMG(false);
      })
      .catch((e) => console.log(e));
  };

  const enviarImagem = async () => {
    const options = {
      title: "Selecione sua Logomarca",
      takePhotoButtonTitle: "Abrir a Camera",
      chooseFromLibraryButtonTitle: "Selecionar Imagem",
      cancelButtonTitle: "CANCELAR",
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };
    Alert.alert(
      "Logomarca",
      "Envie-nos sua logomarca para disponibilizarmos em nosso site! ",
      [
        {
          text: "FECHAR",
          style: "cancel",
        },
        {
          text: "GALERIA",
          onPress: async () => {
            try {
              let { status } = await Permissions.askAsync(
                Permissions.CAMERA_ROLL
              );

              if (status != "granted") {
                alert("Você não forneceu permissão para acessar a GALERIA.");
                return;
              }
              const imagemSel = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
              });

              await salvarImagem(imagemSel);
            } catch (error) {
              Alert.alert(
                "Alerta",
                "Foi encontrado um erro no processo de envio"
              );
            }
          },
        },
        {
          text: "CÂMERA",
          onPress: async () => {
            try {
              let { status } = await Permissions.askAsync(
                Permissions.CAMERA_ROLL
              );

              if (status != "granted") {
                alert("Você não forneceu permissão para acessar a GALERIA.");
                return;
              }
              const imagem = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
              });
              await salvarImagem(imagem);
            } catch (error) {
              Alert.alert(
                "Alerta",
                "Foi encontrado um erro no processo de envio"
              );
            }
          },
        },
      ]
    );
    // ImagePicker.showImagePicker(options, (resp) => {
    //   if (!resp.didCancel) {
    //     let nome = {
    //       name: `logomarca-${convenio.id_gds}.${
    //         resp.fileName.split(".")[resp.fileName.split(".").length - 1]
    //       }`,
    //     };
    //     const { uri, type } = resp;
    //     const data = new FormData();
    //     data.append("id_gds", `${convenio.id_gds}`);
    //     data.append("file", { uri, type, ...nome });
    //     setCarregandoIMG(true);

    // }
    // });
  };

  return (
    <>
      <View style={styless.container}>
        <TouchableOpacity
          style={styless.menu}
          onPress={() => props.navigation.toggleDrawer()}
        >
          <Icone style={styless.configItem} name={"menu"} size={28} />
        </TouchableOpacity>
        <Image
          source={icone}
          style={{ width: 40, height: 40, marginHorizontal: 10 }}
        />
        <Text style={styless.titulo}>PERFIL</Text>
      </View>
      <View style={[styles.row, styles.center, { marginVertical: 20 }]}>
        {!carregandoIMG ? (
          convenio.caminho_logomarca ? (
            convenio.nivel < 2 ? (
              <>
                <TouchableOpacity onPress={enviarImagem}>
                  {console.log(convenio.caminho_logomarca)}
                  <Image
                    source={{
                      uri: convenio.caminho_logomarca,
                      cache: "reload",
                    }}
                    ex
                    style={[styles.logoPP, { resizeMode: "contain" }]}
                  />

                  <Image
                    source={imagens.plus}
                    style={{
                      width: 20,
                      height: 20,
                      resizeMode: "cover",

                      bottom: 20,
                      right: -35,
                    }}
                  />
                </TouchableOpacity>
              </>
            ) : (
              <Image
                source={{
                  uri: convenio.caminho_logomarca,
                }}
                style={[styles.logoPP, { resizeMode: "contain" }]}
              />
            )
          ) : convenio.nivel < 2 ? (
            <TouchableOpacity
              onPress={enviarImagem}
              style={{
                borderWidth: 2,
                borderColor: primary,
                borderRadius: 50,
                padding: 10,
              }}
            >
              <Image
                source={imagens.camera}
                style={[
                  styles.logoPP,
                  {
                    resizeMode: "contain",
                    height: 45,
                    width: 45,
                    tintColor: primary,
                  },
                ]}
                tintColor={primary}
              />
            </TouchableOpacity>
          ) : (
            <Image
              source={imagens.camera}
              style={[
                styles.logoPP,
                {
                  resizeMode: "contain",
                  height: 45,
                  width: 45,
                  tintColor: primary,
                },
              ]}
              tintColor={primary}
            />
          )
        ) : (
          <Carregando cor={false} size={50} />
        )}

        <View>
          <Text style={{ width: 150, marginHorizontal: 20, color: primary }}>
            {[convenio.nome_parceiro]}
          </Text>
          <Text style={{ fontSize: 10, paddingLeft: 20 }}>
            {convenio.doc && convenio.doc.length > 15
              ? `CNPJ: ${convenio.doc}`
              : `CPF: ${convenio.doc}`}
          </Text>
        </View>
        {avaliacao.carregando ? (
          <Carregando cor={false} />
        ) : (
          <TouchableOpacity
            onPress={() => consultarAvaliacoes(convenio.id_gds)}
            style={{ color: primary }}
          >
            <View>
              <>
                <View style={{ flexDirection: "row", paddingVertical: 4 }}>
                  <Rating
                    type="custom"
                    ratingImage={imagens.star}
                    ratingColor="#ff0"
                    ratingCount={5}
                    imageSize={14}
                    readonly={true}
                    startingValue={avaliacao.media}
                  />
                </View>
                {avaliacao.votos > 1 ? (
                  <Text style={{ fontSize: 10 }}>
                    {`${avaliacao.votos}`} AVALIAÇÕES
                  </Text>
                ) : (
                  <Text style={{ fontSize: 10 }}>
                    {`${avaliacao.votos}`} AVALIAÇÃO
                  </Text>
                )}
              </>
            </View>
          </TouchableOpacity>
        )}
      </View>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        lazy={true}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: "white" }}
            style={{ backgroundColor: primary }}
            labelStyle={styles.textoM}
          />
        )}
      />
    </>
  );
}

const styless = StyleSheet.create({
  container: {
    height: 50,
    backgroundColor: primary,
    flexDirection: "row",
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  menu: {
    position: "absolute",
    left: 20,
  },

  configItem: {
    color: "white",
  },
  titulo: {
    fontSize: 18,
    color: "white",
  },
});
