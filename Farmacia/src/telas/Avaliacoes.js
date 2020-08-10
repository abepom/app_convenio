import React, {useEffect, useState, useCallback} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import api from '../api';
import imagens from '../utils/imagens';
import {Rating} from 'react-native-ratings';
import styles, {primary, danger} from '../utils/Style';
import {ActivityIndicator} from 'react-native-paper';
import useConvenio from '../../Store/Convenio';
import useLoad from '../../Store/Load';
import MenuTop from '../components/MenuTop';
import Modal from 'react-native-modal';
import {danverBackground} from '../utils/Style';
import {FlatList} from 'react-native-gesture-handler';

export default function telas(props) {
  const [{id_gds}] = useConvenio();
  const [load, setLoad] = useLoad();
  const [carregando, setCarregando] = useState(true);
  const [votos, setVotos] = useState(0);
  const [media, setMedia] = useState(5);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [modal, setModal] = useState(true);
  const [modalRemover, setModalRemover] = useState(false);
  const [avaliacao, setAvaliacao] = useState({});
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

  const RemoverComentario = async (id) => {
    try {
      const {data} = await api.post(`/user/removerAvaliacao`, {id});
      if (data.retorno) {
        consultarAvaliacoes();
      } else console.log(data);
      setModalRemover(false);
    } catch (error) {
      console.log(error);
    }
  };

  const consultarAvaliacoes = async () => {
    console.log('aqui', id_gds);
    try {
      setCarregando(true);
      const {data} = await api.get(`/user/avaliacoes`, {
        params: {id_gds},
      });
      let mediaTemp;
      let votosTemp;
      let avaliacoesTemp = [];

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

          setVotos(votosTemp ? votosTemp : 0);
        }
      });
      setCarregando(false);
    } catch (error) {}
  };

  return (
    <>
      <Modal isVisible={modalRemover} {...props}>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              backgroundColor: '#fff',
              width: '95%',

              alignItems: 'center',

              borderRadius: 5,
              elevation: 2,
            }}>
            {!!avaliacao ? (
              <>
                <Text
                  style={[
                    styles.textoM,
                    {color: primary, paddingVertical: 10},
                  ]}>
                  {' '}
                  Solicitar Exclusão do comentário selecionado?
                </Text>
                <View
                  style={{
                    width: '100%',
                    backgroundColor: 'white',

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
                      style={[
                        styles.textoM,
                        {fontWeight: 'bold', color: primary},
                      ]}>
                      {avaliacao.nome}{' '}
                      <Text style={[styles.textoP, {color: '#999', top: -10}]}>
                        {avaliacao.data_utilizacao}
                      </Text>
                    </Text>
                    <Text>
                      <Image
                        source={imagens.star_cheia}
                        style={{width: 20, height: 20}}
                      />{' '}
                      {avaliacao.avaliacao}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      width: '100%',
                    }}>
                    <Text style={[styles.textoM]}>{avaliacao.comentario}</Text>
                  </View>
                </View>
                <View style={{width: '100%', flexDirection: 'row'}}>
                  <TouchableOpacity
                    onPress={() =>
                      RemoverComentario(avaliacao.id_avaliacao_convenio)
                    }
                    style={{
                      justifyContent: 'flex-end',
                      width: '50%',
                      backgroundColor: danger,
                      alignItems: 'center',
                      marginTop: 3,
                      borderBottomLeftRadius: 5,
                    }}>
                    <Text
                      style={[
                        styles.textoG,
                        {
                          color: 'white',
                          marginHorizontal: 20,
                          padding: 10,
                        },
                      ]}>
                      EXCLUIR
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setModalRemover(false)}
                    style={{
                      justifyContent: 'flex-end',
                      width: '50%',
                      backgroundColor: primary,
                      alignItems: 'center',
                      marginTop: 3,

                      borderBottomRightRadius: 5,
                    }}>
                    <Text
                      style={[
                        styles.textoG,
                        {
                          color: 'white',
                          marginHorizontal: 20,
                          padding: 10,
                        },
                      ]}>
                      FECHAR
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Text
                  style={[
                    styles.textoM,
                    {color: primary, paddingVertical: 10},
                  ]}>
                  Já foi Solicitado exclusão da avaliação
                </Text>
                <TouchableOpacity
                  onPress={() => setModalRemover(false)}
                  style={{
                    justifyContent: 'flex-end',
                    width: '100%',
                    backgroundColor: primary,
                    alignItems: 'center',
                    marginTop: 3,
                    borderBottomLeftRadius: 5,
                    borderBottomRightRadius: 5,
                  }}>
                  <Text
                    style={[
                      styles.textoG,
                      {
                        color: 'white',
                        marginHorizontal: 20,
                        padding: 10,
                      },
                    ]}>
                    FECHAR
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
      <Modal isVisible={modal} {...props}>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              backgroundColor: '#fff',
              width: '90%',

              alignItems: 'center',
              paddingTop: 10,

              borderRadius: 5,
              elevation: 2,
            }}>
            <Text
              style={[styles.textoG, {color: primary, marginHorizontal: 20}]}>
              Para remover algum comentário que possua algum conteúdo impróprio,
              selecione-o e marque a opção excluir.
            </Text>
            <Text
              style={[styles.textoG, {color: primary, marginHorizontal: 20}]}>
              Esse comentário será encaminhado para o setor de Convênios para
              análise.
            </Text>
            <TouchableOpacity
              onPress={() => setModal(false)}
              style={{
                justifyContent: 'flex-end',
                width: '100%',
                backgroundColor: primary,
                alignItems: 'center',
                marginTop: 15,
                borderBottomLeftRadius: 5,
                borderBottomRightRadius: 5,
              }}>
              <Text
                style={[
                  styles.textoG,
                  {
                    color: 'white',
                    marginHorizontal: 20,
                    padding: 10,
                  },
                ]}>
                FECHAR
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <MenuTop
        drawer
        {...props}
        title={'Avaliações'}
        imagemConf={imagens.loop}
        funcConfig={() => {
          consultarAvaliacoes();
        }}
        header={
          <View style={{width: '80%', alignItems: 'center'}}>
            <View
              style={{
                marginTop: 20,
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              <View style={{alignItems: 'center', width: '100%'}}>
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
          <FlatList
            data={avaliacoes}
            style={{width: '98%'}}
            keyExtractor={(item) => item.id_avaliacao_convenio}
            renderItem={({item}) => {
              console.log({item});
              return (
                <View style={{width: '100%'}}>
                  <TouchableOpacity
                    onPress={() => {
                      if (!item.Avaliacao_Bloqueada) {
                        setModalRemover(true);
                        setAvaliacao(item);
                      } else {
                        setModalRemover(true);
                        setAvaliacao(false);
                      }
                    }}
                    style={{
                      backgroundColor: item.avaliacao_bloqueada
                        ? danverBackground
                        : 'white',
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
                        style={[
                          styles.textoM,
                          {fontWeight: 'bold', color: primary},
                        ]}>
                        {item.nome}{' '}
                        <Text
                          style={[styles.textoP, {color: '#999', top: -10}]}>
                          {item.data_utilizacao}
                        </Text>
                      </Text>
                      <Text>
                        <Image
                          source={imagens.star_cheia}
                          style={{width: 20, height: 20}}
                        />{' '}
                        {item.avaliacao}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}>
                      <Text style={[styles.textoM, {maxWidth: '95%'}]}>
                        {item.comentario}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
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
            <Text style={{fontWeight: 'bold', color: primary}}>
              Nenhuma avaliação foi realizada
            </Text>
          </View>
        )}
      </MenuTop>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-around',
        }}>
        <Text
          style={[
            styles.textoM,
            {
              margin: 10,
              paddingVertical: 10,
              paddingHorizontal: 25,
              backgroundColor: danverBackground,
              borderRadius: 5,
              elevation: 2,
            },
          ]}>
          Removido
        </Text>
        <Text
          style={[
            styles.textoM,
            {
              margin: 10,
              paddingVertical: 10,
              paddingHorizontal: 25,
              backgroundColor: 'white',
              borderRadius: 5,
              elevation: 2,
            },
          ]}>
          Publicado
        </Text>
      </View>
    </>
  );
}
