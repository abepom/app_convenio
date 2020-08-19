import React, {useState} from 'react';
import {View, Easing, Animated, Image} from 'react-native';
import imagens from '../utils/imagens';

export default function Carregando(props) {
  let {cor, tamanho = 50, tipo = 'padrao', icone = true} = props;

  const [giroVerde, setGiroVerde] = useState(new Animated.Value(0));
  const [giroVermelho, setGiroVermelho] = useState(new Animated.Value(0));

  tipo == 'sequencial' &&
    Animated.sequence([
      Animated.timing(giroVerde, {
        toValue: 6000,
        duration: 1000000,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
      Animated.timing(giroVermelho, {
        toValue: 6000,
        duration: 1000000,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    ]).start();

  tipo == 'padrao' &&
    Animated.parallel([
      Animated.timing(giroVerde, {
        toValue: -6000,
        duration: 1000000,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
      Animated.timing(giroVermelho, {
        toValue: 6000,
        duration: 1000000,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    ]).start();

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
      {icone && (
        <>
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
        </>
      )}
    </View>
  );
}
