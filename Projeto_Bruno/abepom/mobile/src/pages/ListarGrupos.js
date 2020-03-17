import React, { useState, useEffect } from "react";
import { View, FlatList, Image, TouchableOpacity } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import styles from "../../assets/stylesheet/Style";
import Header from "../components/Header";
import api from "../services/api";

function ListarGrupos(props) {
  const { navigation } = props;
  const [grupos, setGrupos] = useState([{}]);
  const [carregado, setCarregado] = useState(false);

  async function listarGrupos() {
    setCarregado(false);

    const response = await api.get("/listarGrupos");

    setGrupos([
      ...response.data,
      {
        id: 0,
        nome: "BUSCA LIVRE",
        nivel: 0,
        icone:
          "http://www.abepom.com.br/guiaonline/assets/img/icone_busca_livre.png",
        possui_categoria: 0
      }
    ]);
  }

  useEffect(() => {
    listarGrupos();
    setCarregado(true);
  }, []);

  return (
    <>
      <Header titulo="Pesquisar Convênios" {...props} voltar voltarPara="Inicio" />
      <View style={[styles.background, { flex: 1, alignItems: "center", paddingTop: 10 }]}>
        {!carregado ? (
          <View style={[styles.centralizado, { flex: 1 }]}>
            <ActivityIndicator animating={true} size={60} />
          </View>
        ) : (
            <FlatList
              style={{ marginHorizontal: 10 }}
              data={grupos}
              keyExtractor={item => item.id}
              numColumns={2}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    style={[styles.blocoGrupo, styles.centralizado]}
                    onPress={() => {
                      navigation.navigate(
                        item.possui_categoria ?
                          "ListarSubgrupos"
                          :
                          item.id == 0 ? "BuscaLivre" : "ListarAreas",
                        {
                          id_grupo: item.id,
                          nome_grupo: item.nome,
                          nivel: item.nivel,
                          subgrupo: true,
                          voltar_para_grupo: true,
                        }
                      );
                    }}
                  >
                    <Image
                      source={{ uri: item.icone }}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </TouchableOpacity>
                );
              }}
            />
          )}
      </View>
    </>
  );
}

export default ListarGrupos;
