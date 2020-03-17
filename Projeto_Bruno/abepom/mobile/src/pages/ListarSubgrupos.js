import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import styles, { tema } from "../../assets/stylesheet/Style";
import Header from "../components/Header";
import api from "../services/api";

function ListarSubgrupos(props) {
    const { navigation } = props;
    const [grupos, setGrupos] = useState([{}]);
    const [carregado, setCarregado] = useState(false);

    async function listarSubgrupos() {
        setCarregado(false);

        const response = await api.get("/listarSubgrupos", {
            params: {
                id_grupo: navigation.state.params.id_grupo,
                nivel: navigation.state.params.nivel
            }
        });

        setGrupos([...response.data]);
        setCarregado(true);
    }

    useEffect(() => {
        listarSubgrupos();
    }, []);

    return (
        <>
            <Header titulo={`${navigation.state.params.nome_grupo}`} {...props} voltar />
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
                                        style={[styles.centralizado, styles.blocoArea]}
                                        onPress={() => {
                                            navigation.navigate("ListarAreas",
                                                {
                                                    id_grupo: item.id,
                                                    nome_grupo: item.nome,
                                                    nivel: item.nivel,
                                                    subgrupo: true,
                                                    voltar_para_grupo: false
                                                }
                                            );
                                        }}
                                    >
                                        <Image
                                            source={{ uri: item.icone }}
                                            style={{ width: 35, height: 35 }}
                                        />
                                        <Text style={{ textAlign: "center" }}>{item.nome}</Text>
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    )}
            </View>
        </>
    );
}

export default ListarSubgrupos;
