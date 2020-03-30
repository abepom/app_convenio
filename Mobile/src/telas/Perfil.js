import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text, Image, TouchableOpacity } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import DadosGerais from './DadosGerais'
import Enderecos from './Enderecos'
import AlterarSenha from './AlterarSenha'
import styles, { primary } from '../utils/Style'
import imagens from '../utils/imagens';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Icone from 'react-native-vector-icons/MaterialCommunityIcons';
import icone from '../assets/img/abepom.png';

const initialLayout = { width: Dimensions.get('window').width };

export default function TabViewExample(props) {

    const _press = () => props.navigation.toggleDrawer();
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: '1', title: 'Dados Gerais' },
        { key: '2', title: 'Endereços' },
        { key: '3', title: 'Alterar Senha' },
    ]);
    const [convenio, setConvenio] = useState({
        caminho_logomarca: null,
        nome_parceiro: '',
        efetuarVenda: false,
    });
    useEffect(() => {
        getUsuario('convenio').then(conv => {
            setConvenio(conv);
        })
    }, [])

    const renderScene = SceneMap({
        '1': DadosGerais,
        '2': Enderecos,
        '3': AlterarSenha,
    });

    return (
        <>
            <View style={styless.container}>
                <TouchableOpacity style={styless.menu} onPress={() => props.navigation.toggleDrawer()}>
                    <Icone style={styless.configItem} name={'menu'} size={28} />
                </TouchableOpacity>
                <Image
                    source={icone}
                    style={{ width: 40, height: 40, marginHorizontal: 10 }}
                />
                <Text style={styless.titulo}>PERFIL</Text>

            </View>
            <View style={[styles.row, styles.center, { marginVertical: 20 }]}>
                {convenio.caminho_logomarca ? (
                    <>
                        <Image
                            source={{ uri: convenio.caminho_logomarca }}
                            style={[styles.logoPP]}
                        />
                    </>
                ) : (
                        <EvilIcons name="user" size={70} />
                    )}
                {console.log(convenio, 'convenioconvenio')}
                <View>
                    <Text
                        style={{ width: 150, marginHorizontal: 20, color: primary }}>
                        {[convenio.nome_parceiro]}
                    </Text>
                    <Text style={{ fontSize: 10, paddingLeft: 20 }}>
                        {convenio.doc && convenio.doc.length > 15
                            ? `CNPF: ${convenio.doc}`
                            : `CPF: ${convenio.doc}`}
                    </Text>
                </View>
                <View >
                    <Text style={{ fontSize: 10 }}>HATING</Text>
                    <View style={{ flexDirection: "row" }}>
                        <Image source={imagens.heart_true} style={{ width: 10, height: 10 }} tintColor={'red'} />
                        <Image source={imagens.heart_true} style={{ width: 10, height: 10 }} tintColor={'red'} />
                        <Image source={imagens.heart_true} style={{ width: 10, height: 10 }} tintColor={'red'} />
                        <Image source={imagens.heart_true} style={{ width: 10, height: 10 }} tintColor={'red'} />
                        <Image source={imagens.heart_false} style={{ width: 10, height: 10 }} tintColor={'red'} />
                    </View>
                </View>
            </View>
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={initialLayout}
                lazy={true}
                renderTabBar={props => (
                    <TabBar
                        {...props}
                        indicatorStyle={{ backgroundColor: 'white' }}
                        style={{ backgroundColor: primary }}
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
        flexDirection: 'row',
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menu: {
        position: 'absolute',
        left: 20,
    },

    configItem: {
        color: 'white',
    },
    titulo: {
        fontSize: 18,
        color: 'white',
    },
});

