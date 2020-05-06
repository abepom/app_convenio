import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image } from 'react-native';
import api from '../api';
import imagens from '../utils/imagens';
import { Rating } from 'react-native-ratings';
import styles, { primary } from '../utils/Style';
import { ActivityIndicator } from 'react-native-paper';
import useConvenio from '../../Store/Convenio';
import useLoad from '../../Store/Load';
import MenuTop from '../components/MenuTop';
// import { Container } from './styles';

export default function telas(props) {
  const [{ id_gds }] = useConvenio();
  const [load, setLoad] = useLoad();
  const [carregando, setCarregando] = useState(true);
  const [votos, setVotos] = useState(0);
  const [media, setMedia] = useState(5);
  const [pendentes, setPendentes] = useState(0);
  const [avaliacoes, setAvaliacoes] = useState([]);

  useEffect(() => {
    if (load !== 'Avaliacoes' && load !== 'todos') {
      consultarAvaliacoes();
      console.log('primeira');
      setLoad(null);
    }
  }, []);
  useEffect(() => {
    if (load == 'Avaliacoes' || load == 'todos') {
      console.log('segunda');
      consultarAvaliacoes();

      setLoad(null);
    }
  }, [load]);

  const consultarAvaliacoes = async () => {
    console.log('aqui', id_gds);
    try {
      setCarregando(true);
      const { data } = await api.get(`/user/avaliacoes`, {
        params: { id_gds },
      });
      let mediaTemp;
      let votosTemp;
      let avaliacoesTemp = [];
      let pendentesTemp;
      data.forEach((dados, i) => {
        console.log(dados);
        if (dados.votos) {
          votosTemp = dados.votos;
          mediaTemp = dados.media;
          pendentesTemp = dados.pendentes;
        } else {
          if (dados.media == 5) {
            pendentesTemp = dados.pendentes;
          } else {
            avaliacoesTemp.push(dados);
          }
        }
        if (data.length == i + 1) {
          setMedia(mediaTemp ? mediaTemp : 5.0);
          setAvaliacoes(avaliacoesTemp);
          setPendentes(pendentesTemp ? pendentesTemp : 0);
          setVotos(votosTemp ? votosTemp : 0);
        }
      });
      setCarregando(false);
    } catch (error) {}
  };

  return (
    <MenuTop
      drawer
      {...props}
      title={'Avaliações'}
      imagemConf={imagens.loop}
      funcConfig={() => {
        consultarAvaliacoes();
      }}
      header={
        <View style={{ width: '80%', alignItems: 'center' }}>
          <View
            style={{
              marginTop: 20,
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 10,
            }}>
            <View style={{ alignItems: 'center', width: '100%' }}>
              <Rating
                type="custom"
                ratingImage={imagens.star}
                ratingColor="#ff0"
                ratingCount={5}
                imageSize={30}
                readonly={true}
                startingValue={media}
              />
              {votos > 1 ? (
                <Text style={styles.textoP}>{`${votos}`} AVALIAÇÕES</Text>
              ) : (
                <Text style={styles.textoP}>{`${votos}`} AVALIAÇÃO</Text>
              )}
              <Text style={styles.textoM}> Media: {media.toFixed(2)}</Text>
              {/* <Text style={styles.textoP}> Pendentes: {pendentes}</Text> */}
            </View>
          </View>
        </View>
      }>
      {carregando ? (
        <ActivityIndicator />
      ) : avaliacoes[0] ? (
        avaliacoes.map((ava, i) => (
          <View
            key={i}
            style={{
              width: '95%',
              backgroundColor: 'white',
              marginVertical: 5,
              padding: 15,
              elevation: 4,
              borderRadius: 5,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}>
              <Text
                style={[styles.textoM, { fontWeight: 'bold', color: primary }]}>
                {ava.nome}{' '}
                <Text style={[styles.textoP, { color: '#999', top: -10 }]}>
                  {ava.data_utilizacao}
                </Text>
              </Text>
              <Text>
                <Image
                  source={imagens.star_cheia}
                  style={{ width: 20, height: 20 }}
                />{' '}
                {ava.avaliacao}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}>
              <Text style={[styles.textoM]}>{ava.comentario}</Text>
            </View>
          </View>
        ))
      ) : (
        <View
          style={{
            width: '95%',
            backgroundColor: 'white',
            marginVertical: 5,
            padding: 15,
            elevation: 4,
            borderRadius: 5,
          }}>
          <Text style={{ fontWeight: 'bold', color: primary }}>
            Nenhuma avaliação foi realizada
          </Text>
        </View>
      )}
    </MenuTop>
  );
}
