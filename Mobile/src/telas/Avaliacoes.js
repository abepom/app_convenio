import React, { useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';
import MenuTop from '../components/MenuTop';
import getUsuario from '../utils/getUsuario';
import api from '../api';
import imagens from '../utils/imagens';
import { Rating } from 'react-native-ratings';
import formatData from '../utils/FormatData'
import { primary } from '../utils/Style';
import { ActivityIndicator } from 'react-native-paper';
// import { Container } from './styles';

export default function telas(props) {

    const [id_gds, setId_gds] = useState(null)
    const [carregando, setCarregando] = useState(true)
    const [votos, setVotos] = useState(0)
    const [media, setMedia] = useState(5)
    const [pendentes, setPendentes] = useState(0)
    const [avaliacoes, setAvaliacoes] = useState([])
    useEffect(() => {
        getUsuario('convenio').then(conv => {

            setId_gds(conv.id_gds)

            consultarAvaliacoes(conv.id_gds)
        })
    }, [])

    const consultarAvaliacoes = async (id_gds) => {
        try {
            setCarregando(true)
            const { data } = await api.get(`/user/avaliacoes`, { params: { id_gds } })
            console.log(data)
            let mediaTemp
            let votosTemp
            let avaliacoesTemp = []
            let pendentesTemp
            data.forEach((dados, i) => {
                if (dados.votos) {
                    votosTemp = dados.votos
                    mediaTemp = dados.media
                    pendentesTemp = dados.pendentes
                } else {

                    if (dados.media == 5) {
                        pendentesTemp = dados.pendentes
                    } else {
                        avaliacoesTemp.push(dados)
                    }
                }
                if (data.length == i + 1) {
                    setMedia(mediaTemp ? mediaTemp : 5.00)
                    setAvaliacoes(avaliacoesTemp)
                    setPendentes(pendentesTemp ? pendentesTemp : 0)
                    setVotos(votosTemp ? votosTemp : 0)
                }

            })
            setCarregando(false)


        } catch (error) {

        }
    }


    return (
        <MenuTop
            drawer {...props}
            title={'Avaliações'}
            imagemConf={imagens.loop}
            funcConfig={() => {
                getUsuario('convenio').then(conv => {

                    setId_gds(conv.id_gds)
                    console.log('tessete')
                    consultarAvaliacoes(conv.id_gds)
                })
            }}
            header={(
                <View style={{ width: '80%', alignItems: "center" }}>
                    <View style={{ marginTop: 20, width: '100%', flexDirection: "row", justifyContent: 'space-between', marginTop: 10 }}>
                        <View style={{ alignItems: "center", width: '100%', }}>


                            <Rating
                                type='custom'
                                ratingImage={imagens.heart}
                                ratingColor='#f00'
                                ratingCount={5}
                                imageSize={30}
                                readonly={true}
                                startingValue={media}

                            />
                            {votos > 1 ? (
                                <Text style={{ fontSize: 10 }}>{`${votos}`} AVALIAÇÕES</Text>
                            ) : (
                                    <Text style={{ fontSize: 10 }}>{`${votos}`} AVALIAÇÃO</Text>
                                )

                            }
                            <Text> Media: {media.toFixed(2)}</Text>
                            <Text style={{ fontSize: 10 }}> Pendentes: {pendentes}</Text>
                        </View>


                    </View >
                </View>
            )}  >
            {console.log(avaliacoes[0])}
            {carregando ? (<ActivityIndicator />) : avaliacoes[0] ? avaliacoes.map((ava, i) => (<View key={i} style={{ width: '95%', backgroundColor: 'white', marginVertical: 5, padding: 15, elevation: 4, borderRadius: 5 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", width: '100%', }}>
                    <Text style={{ fontWeight: "bold", color: primary }}>{ava.nome}  <Text style={{ fontSize: 10, color: '#999', top: -10, }}>{ava.data_utilizacao}</Text></Text>
                    <Text><Image source={imagens.heart_true} style={{ width: 20, height: 20, tintColor: 'red' }} /> {ava.avaliacao}</Text>

                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", width: '100%', }}>

                    <Text>{ava.comentario}</Text>
                </View>

            </View>
            )) : (<View key={i} style={{ width: '95%', backgroundColor: 'white', marginVertical: 5, padding: 15, elevation: 4, borderRadius: 5 }}>
                <Text style={{ fontWeight: "bold", color: primary }}>Nenhuma avaliação foi realizada</Text>


            </View>)}

        </MenuTop>
    );
}
