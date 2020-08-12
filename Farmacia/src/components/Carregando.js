import React, {useState} from 'react';
import {View, Text, Animated, Image} from 'react-native';
import imagens from '../utils/imagens';
import {primary} from './../utils/Style';

export default function Carregando(props) {
  let {cor, tamanho = 50, tipo = 'padrao'} = props;

  const [giroVerde, setGiroVerde] = useState(new Animated.Value(0));
  const [giroVermelho, setGiroVermelho] = useState(new Animated.Value(0));

  tipo == 'sequencial' &&
    Animated.loop(
      Animated.sequence([
        Animated.timing(giroVerde, {
          toValue: 6.3,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(giroVermelho, {
          toValue: 6.3,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

  tipo == 'padrao' &&
    Animated.loop(
      Animated.parallel([
        Animated.timing(giroVerde, {
          toValue: -6.3,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(giroVermelho, {
          toValue: 6.3,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

  return (
    <View
      style={{
        width: tamanho,
        height: tamanho,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
      }}>
      <Animated.View
        style={{
          width: tamanho,
          height: tamanho,
          transform: [{rotate: giroVerde}],
          position: 'absolute',
        }}>
        <Image
          source={imagens.linha_verde}
          style={{width: tamanho, height: tamanho, tintColor: cor ?? null}}
        />
      </Animated.View>
      <Animated.View
        style={{
          width: tamanho,
          height: tamanho,
          transform: [{rotate: giroVermelho}],
          position: 'absolute',
        }}>
        <Image
          source={imagens.linha_vermelha}
          style={{width: tamanho, height: tamanho, tintColor: cor ?? null}}
        />
      </Animated.View>
      {!cor && (
        <Image
          source={imagens.circulo_branco}
          style={{width: tamanho, height: tamanho}}
        />
      )}
      <Image
        source={imagens.circulo_estrela_vazada}
        style={{
          width: tamanho,
          height: tamanho,
          position: 'absolute',
          tintColor: cor ?? null,
        }}
      />
    </View>
  );
}
